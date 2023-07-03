import { BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from '../errors';
import Card from '../models/card';

export const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send({ data: cards });
};

export const createCard = async (req, res) => {
  try {
    const { user: { _id } } = req;
    const { body: { name, link } } = req;

    const card = await Card.create({ name, link, owner: _id });

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { deletedCount } = await Card.deleteOne({ _id: req.params.cardId, owner: req.user._id });

    if (!deletedCount) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const likeCard = async (req, res) => {
  try {
    const { user: { _id } } = req;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    );

    if (!card) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};

export const dislikeCard = async (req, res) => {
  try {
    const { user: { _id } } = req;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: _id } },
      { new: true },
    );

    if (!card) {
      res.status(NOT_FOUND_ERROR).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request error' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
  }
};
