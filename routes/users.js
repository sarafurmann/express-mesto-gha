import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUserss, getUserById, editUser, editUserAvatar, getUserInfo,
} from '../controllers/users';
import { URL_REGEX } from '../constants';

const router = Router();

router.get('/', getUserss);
router.get('/me', getUserInfo);
router.get(
  '/:userId',
  celebrate({
    params: {
      userId: Joi.string().length(24).hex().required(),
    },
  }),
  getUserById,
);
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
      avatar: Joi.string().pattern(URL_REGEX).required(),
    }),
  }),
  editUserAvatar,
);

export default router;
