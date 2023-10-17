// Create model

// connect to mongo db
const mongoose = require("mongoose");
const path = require("path");

// define path to save book covers
const coverImageBasePath = "uploads/bookCovers";

// Create a Schema
// A schema is a table in a normal database
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImageName: {
    type: String,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

/*
author is going to be a little bit different because we want to
actually reference the author from our author's collection that we created
over here so instead of putting the type here to be some kind of author type or
ID type we're going to be using the 
Mongoose.schema.types.objectID and this essentially is just referencing another object this
is just the ID of the author object and this is telling Mongoose that this
reference is another object inside of our collections 
*/

/// what does this do?
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

// export this schema
module.exports = mongoose.model("Book", bookSchema);
// export coverImageBasePath (import to books route)
module.exports.coverImageBasePath = coverImageBasePath;
