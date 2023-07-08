import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import NotAuthorizedError from '../errors/not-authorized-error';
import ConflictError from '../errors/conflict-error';

export const getUserss = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    next(new InternalServerError('Server error'));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      next(new NotFoundError('User is not found'));
      return;
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      next(new NotFoundError('User is not found'));
      return;
    }

    res.send({ data: user });
  } catch (err) {
    next(new InternalServerError('Server error'));
  }
};

export const createUser = async (req, res, next) => {
  try {
    const {
      body: {
        name, about, avatar, email, password,
      },
    } = req;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, password: hash, email,
    });

    res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    if (err.code === 11000) {
      next(new ConflictError('Conflict error'));
      return;
    }

    next(new InternalServerError(err));
  }
};

export const editUser = async (req, res, next) => {
  try {
    const { user: { _id } } = req;
    const { body: { name, about } } = req;
    const user = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const editUserAvatar = async (req, res, next) => {
  try {
    const { user: { _id } } = req;
    const { body: { avatar } } = req;
    const user = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true });
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    res.send({
      token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
    });
  } catch (err) {
    next(new NotAuthorizedError(err.message));
  }
};
