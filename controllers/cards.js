import Card from '../models/card';

export const getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send({ data: cards });
};

export const createCard = async (req, res) => {
  try {
    const { body: { name, link, owner } } = req;

    const card = await Card.create({ name, link, owner });

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
  await Card.deleteOne({ _id: req.params.cardId });
  res.send({ data: 'Card is deleted' });
};

export const likeCard = async (req, res) => {
  const { user: { _id } } = req;
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  );

  res.send({ data: card });
};

export const dislikeCard = async (req, res) => {
  const { user: { _id } } = req;
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  );

  res.send({ data: card });
};
