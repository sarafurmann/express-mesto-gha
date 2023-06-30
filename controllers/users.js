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

export const createUser = async (req, res) => {
  try {
    const { body: { name, about, avatar } } = req;

    const user = await User.create({ name, about, avatar });

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
