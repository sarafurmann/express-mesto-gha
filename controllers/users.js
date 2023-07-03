import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../errors';
import User from '../models/user';

export const getUserss = async (req, res) => {
  const users = await User.find({});
  res.send({ data: users });
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(NOT_FOUND_ERROR).send({ message: 'User is not found' });
      return;
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(NOT_FOUND_ERROR).send({ message: 'User is not found' });
      return;
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const createUser = async (req, res) => {
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

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const editUser = async (req, res) => {
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
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const editUserAvatar = async (req, res) => {
  try {
    const { user: { _id } } = req;
    const { body: { avatar } } = req;
    const user = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true });
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    res.send({
      token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
    });
  } catch (err) {
    res
      .status(401)
      .send({ message: err.message });
  }
};
