import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { NOT_FOUND_ERROR } from './errors';
import auth from './middlewares/auth';
import { login, createUser } from './controllers/users';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/cards', auth, cardRouter);
app.use('/users', auth, userRouter);
app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  next(res.status(NOT_FOUND_ERROR).send({ message: 'Страницы по запрошенному URL не существует' }));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
