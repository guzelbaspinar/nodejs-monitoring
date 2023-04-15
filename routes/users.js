import { Router } from 'express';
const router = Router();
import { Users } from '../db/models';


router.get('/', async (req, res, next) => {
  try {
    const users = await Users.findAll({
      where: {
        name: "John"
      },
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: ['name'],
      limit: 10,
      offset: 0
    });

    res.send({ message: 'List of Users!!!!!', users });
  } catch (error) {
    next(error)
  }
});

export default router;
