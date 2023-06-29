import { Router } from 'express';

import {
  getUserss, getUserById, createUser, deleteUser, editUser, editUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUserss);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.delete('/:userId', deleteUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editUserAvatar);

export default router;
