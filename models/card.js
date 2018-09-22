const mongoose = require('mongoose');

/*
The schema for the MongoDB database. Once the database is created and 
the user information is attached to the URL, on the first Post the database will be generated automatically.
*/
const cardSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  icon: { type: String, required: true },
  turned: { type: Boolean, required: true },
  color: { type: String, required: true }
});

module.exports = mongoose.model('Card', cardSchema);