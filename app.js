var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const {handlerError} = require('./middleware/handler-error')

require('dotenv').config()
const authJwt = require('./middleware/auth-jwt')

var productRouter = require('./routes/product');
var orderRouter = require('./routes/orders');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(authJwt())
app.use(express.static(path.join(__dirname, 'public')));
const version = process.env.VERSION
app.use(`${version}/products`, productRouter);
app.use(`${version}/orders`, orderRouter);
app.use(`${version}/users`, usersRouter);
app.use(`${version}/category`, categoryRouter);

app.use(handlerError)
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json('error');
// });

module.exports = app;
