import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 8080 } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '649de76265b8d3a3df7034e7',
  };

  next();
});

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
