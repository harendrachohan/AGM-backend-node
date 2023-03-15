const express = require('express');
const AppError = require('../utils/appError');
const { globalErrorHandler } = require('../utils/errorHandler')
const authRoutes = require('./auth.router');
const masterFieldRoutes = require('./masterField.router');

const app = express();

function routerConfig(app) {

  app.get('/', (req, res) => {
      res.send("Welcome to AGM App V1.0.0")
  })
  app.use("/api/v1/auth/", authRoutes);
  app.use("/api/v1/super-admin/master-field", masterFieldRoutes);

  app.all('*', function (req, res, next) {
    return next(new AppError(`Requested url ${req.originalUrl} not found!`, 404))
  })
  
  app.use(globalErrorHandler);

}

module.exports = routerConfig;
