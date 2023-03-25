const express = require('express');
// const AppError = require('../utils/AppError');
const { globalErrorHandler,AppError } = require('../utils/errorHandler')
const authRoutes = require('./auth.router');
const masterFieldRoutes = require('./masterField.router');
const userRoutes = require('./user.router');
const adminRoutes = require('./admin.router');

const app = express();

function routerConfig(app) {

  app.get('/', (req, res) => {
      res.send("Welcome to AGM App V1.0.0")
  })
  app.use("/api/v1/auth/", authRoutes);
  app.use("/api/v1/admin/master-field", masterFieldRoutes);
  app.use("/api/v1/admin/profile/", userRoutes);
  app.use("/api/v1/admin/role/", adminRoutes);

  app.all('*', function (req, res, next) {
    return next( AppError(`Requested url ${req.originalUrl} not found!`, 404))
  })
  
  app.use(globalErrorHandler);

}

module.exports = routerConfig;
