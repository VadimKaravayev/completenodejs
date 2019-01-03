const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/todoapp", {useNewUrlParser: true});

module.exports = {mongoose};