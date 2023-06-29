import User from '../models/user';

export const getUserss = async (req, res) => {
  const users = await User.find({});
  res.send({ data: users });
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).send({ message: 'User is not found' });
      return;
    }

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'User is not found' });
      return;
    }

    res.status(500).send({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { body: { name, about, avatar } } = req;

    const user = await User.create({ name, about, avatar });

    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  await User.deleteOne({ _id: req.params.userId });
  res.send({ data: 'User is deleted' });
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
    res.status(500).send({ message: err.message });
  }
};

export const editUserAvatar = async (req, res) => {
  try {
    const { user: { _id } } = req;
    const { body: { avatar } } = req;
    const user = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true });
    res.send({ data: user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
