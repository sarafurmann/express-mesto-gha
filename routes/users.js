import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUserss, getUserById, editUser, editUserAvatar, getUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUserss);
router.get('/:userId', getUserById);
router.get('/me', getUserInfo);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  editUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required(),
    }),
  }),
  editUserAvatar,
);

export default router;
