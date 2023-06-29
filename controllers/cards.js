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
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { deletedCount } = await Card.deleteOne({ _id: req.params.cardId });

    if (!deletedCount) {
      res.status(404).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: err.message });
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
      res.status(404).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: err.message });
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
      res.status(404).send({ message: 'Card is not found' });
      return;
    }

    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: err.message });
  }
};
