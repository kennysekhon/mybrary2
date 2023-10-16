// Create model
// This authors model will let us actually do stuff with authors

// connect to mongo db
const mongoose = require("mongoose");

// Create a Schema
// A schema is a table in a normal database
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// export this schema
// name of model: "Author" <-- this is esentially the name of the table inside our database
// and we pass it the database which defines the table, which in our case is authorSchema
// Now, we'll pass this schema to our author route
module.exports = mongoose.model("Author", authorSchema);
