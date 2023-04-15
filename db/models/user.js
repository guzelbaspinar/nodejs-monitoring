const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'user',
        timestamps: true,
      }
    );
  }
  static listenHooks() {
    super.beforeValidate((user, options) => {
      console.log('beforeValidate hook triggered');
    });

    super.beforeCreate(async (user, options) => {
      console.log('beforeCreate hook triggered');
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(user.password, salt);
    });

    super.beforeUpdate(async (user, options) => {
      console.log('beforeUpdate hook triggered');
      // if (user.changed('password')) {
      //   const salt = await bcrypt.genSalt(10);
      //   user.password = await bcrypt.hash(user.password, salt);
      // }
    });

    super.beforeDestroy((user, options) => {
      console.log('beforeDestroy hook triggered');
    });

    super.afterCreate((user, options) => {
      console.log('afterCreate hook triggered');
    });

    super.afterUpdate((user, options) => {
      console.log('afterUpdate hook triggered');
    });

    super.afterDestroy((user, options) => {
      console.log('afterDestroy hook triggered');
    });

    super.beforeFind((options) => {
      console.log('beforeFind hook triggered');
    });

    super.afterFind((user, options) => {
      console.log('afterFind hook triggered');
    });
  }
  static associate(models) {
    // User model associations
  }
}

export default User;
