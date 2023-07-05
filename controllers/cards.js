import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';

export const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send({ data: cards });
};

export const createCard = async (req, res, next) => {
  try {
    const { user: { _id } } = req;
    const { body: { name, link } } = req;

    const card = await Card.create({ name, link, owner: _id });

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const { deletedCount } = await Card.deleteOne({ _id: req.params.cardId, owner: req.user._id });

    if (!deletedCount) {
      next(new NotFoundError('Card is not found'));
      return;
    }

    res.send({ data: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const likeCard = async (req, res, next) => {
  try {
    const { user: { _id } } = req;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    );

    if (!card) {
      next(new NotFoundError('Card is not found'));
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};

export const dislikeCard = async (req, res, next) => {
  try {
    const { user: { _id } } = req;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: _id } },
      { new: true },
    );

    if (!card) {
      next(new NotFoundError('Card is not found'));
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Bad request error'));
      return;
    }

    next(new InternalServerError('Server error'));
  }
};
