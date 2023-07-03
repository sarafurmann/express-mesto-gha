import { Router } from 'express';

import {
  getUserss, getUserById, editUser, editUserAvatar, getUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUserss);
router.get('/:userId', getUserById);
router.get('/me', getUserInfo);
router.patch('/me', editUser);
router.patch('/me/avatar', editUserAvatar);

export default router;
