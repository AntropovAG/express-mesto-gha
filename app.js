require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { userLogin, createNewUser, userSignOut } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://projectmesto.antropovag.nomoredomains.sbs',
    'http://projectmesto.antropovag.nomoredomains.sbs',
    'https://antropovag.github.io',
  ],
  credentials: true,
};
const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);
app.use(requestLimiter);

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userLogin);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createNewUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/signout', userSignOut);

app.use((req, res, next) => next(new NotFoundError('?????????? ???????????????? ???? ????????????????????')));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT, console.log('???????????? ?????????????? ?? ?????????????? ????????:', PORT));
