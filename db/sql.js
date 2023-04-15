import promClient from 'prom-client';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

import { Users } from './models';

let instance = null;

const operatorsAliases = {
  $and: Op.and,
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $in: Op.in,
  $nin: Op.notIn,
  $like: Op.like,
  $nLike: Op.notLike,
  $substring: Op.substring,
};

class SQLDB {
  constructor(prom_client) {
    if (!instance) {
      this.sequelizeConnection = null;
      instance = this;
      this.queryCounter = new promClient.Counter({
        name: 'database_query_counter',
        help: 'Number of database queries',
        labelNames: ['database', 'queryType'],
      });
      this.queryDurationHistogram = new promClient.Histogram({
        name: 'database_query_duration_histogram',
        help: 'Duration of database queries in seconds',
        labelNames: ['database', 'queryType'],
        buckets: [0.001, 0.01, 0.1, 1, 10, 30],
      });
      prom_client.registerMetric(this.queryCounter);
      prom_client.registerMetric(this.queryDurationHistogram);
    }
    return instance;
  }

  async connect(options) {
    try {
      const sequelize_config = {
        host: options.SQL_HOST,
        port: options.SQL_PORT,
        dialect: "mysql",
        operatorsAliases: operatorsAliases,
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }

      let sequelize = new Sequelize(options.SQL_DATABASE, options.SQL_USERNAME, options.SQL_PASSWORD, sequelize_config);

      console.log("SQL Connecting!");
      await sequelize.authenticate()
      console.log("SQL Connected");
      await this.createTables(sequelize);
    } catch (error) {
      console.error('connect', error);
      throw error;
    }
  }

  async createTables(sequelize) {
    try {
      await Users.init(sequelize).sync();
      let models = [{ model: Users, modelName: Users.getTableName() }];
      for (let i = 0; i < models.length; i++) {
        const { model, modelName } = models[i];
        model.listenHooks();
        model.addHook('beforeFind', (options) => {
          options.startTime = Date.now(); // Sorgunun başlangıç zamanını kaydedin
        });

        model.addHook('afterFind', (result, options) => {
          const queryDuration = Date.now() - options.startTime; // Sorgu süresini bulundu
          const durationInSeconds = queryDuration / 1000; // Saniye cinsinden sorgu süresi hesaplandı
          const { database } = sequelize.config; // veritabanı adını al
          const { limit, offset, attributes, order, where } = options; // sorgu detaylarını al
          const query = {
            sql: `SELECT ${attributes} FROM ${modelName} WHERE ${JSON.stringify(where)} ORDER BY ${JSON.stringify(order)} LIMIT ${limit} OFFSET ${offset}`,
          };
          this.queryCounter.inc({ database: database, queryType: `${modelName}-find` }); // Sorgu sayısını arttır
          this.queryDurationHistogram.observe({ database: database, queryType: `${modelName}-find` }, durationInSeconds); // Sorgu süresini histograma kaydet
          console.log(`"${query.sql}" took ${durationInSeconds} seconds.`);
        });
      }
    } catch (error) {
      console.log('createTables error => ', error);
      throw error
    }
  }
}


export default SQLDB;