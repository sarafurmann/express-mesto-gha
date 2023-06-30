import { Router } from 'express';

import {
  getUserss, getUserById, createUser, editUser, editUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUserss);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editUserAvatar);

export default router;
