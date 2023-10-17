/*

const path = require("path");
const uploadPath = path.join('public', book.coverImageBasePath);
// require multer for file upload
const multer = require("multer");


now we can actually import this inside of our books route in order to do that all we need to do is first take that variable we created in our book model and use that to create the path that we need but before we can do that we need to import a library which is called path built-in to nodejs 

and we can just do this by saying require and putting in path here as the name of the library that we're going to require then we can create our upload path variable this upload path variable we could just call upload path
and we can use this upload path by setting it equal to path join which is
going to combine together two different paths our first path is going to be our public folder and then after that we're going to use that book variable so we can say book dot cover image base path now this upload path that we see here is going to go from our public folder into that cover image base path we created and we can use that right down here to say that this is going to be upload path for our destination 

the last thing that we need to do is actually filter our files so we're going to use file filtered which allows us to actually filter which files our server accepts this is going to take a few variables it's going to take the request of our file it's going to take the actual file object as well as a callback which we need to call whenever we're done here with our actual file filter so let's create that arrow function and inside of our file  filter here we just want to call that callback function first parameter we want to send it is just going to be null since we have no error because this is an error parameter and the second option is going to be a boolean that says true if the file is accepted or false if the file is not accepted and all we want to do is accept image files so we want to set up a variable here we're going to call this a image mime types variable and this is just going to be an array that has all the different image types that we accept and these are default variables that you can find just by googling image mime types these are going to be available and they're always exactly the same from the server 

*/

const express = require("express");
const router = express.Router();
// require multer for file upload
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
const Author = require("../models/author");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// All Books Route
router.get("/", async (req, res) => {
  //create query object
  let query = Book.find();
  if ((req.query.title != null) & (req.query.title != "")) {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if ((req.query.publishedBefore != null) & (req.query.publishedBefore != "")) {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if ((req.query.publishedAfter != null) & (req.query.publishedAfter != "")) {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    //const books = await Book.find({});
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Book Route
router.get("/new", async (req, res) => {
  //res.send("New Book");
  renderNewPage(res, new Book());
});

// Create Book Route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;

  // console log
  console.log(`******* file name: ${fileName}`);

  //res.send("Create Book");
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });

  // console log
  console.log(`******* book: ${book}`);

  try {
    const newBook = await book.save();
    // console log
    console.log(`******* newBook: ${newBook}`);
    // res.redirect(`books/${newBook.id}`);
    res.redirect("/books");
  } catch {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
    //console.log("ERROR CREATING BOOK");
    //res.redirect("/books");
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error creating book";
    res.render("books/new", params);
  } catch {
    //renderNewPage(res, book, true);
    res.redirect("/books");
  }
}

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err);
  });
}

module.exports = router;
