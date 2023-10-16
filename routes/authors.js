const express = require("express");
const router = express.Router();
// Author is an instance of the database model (name of table)
const Author = require("../models/author");

// All Authors Route

/*
To actually implement searching: 
because if we for example try to search for John and we search it still returns all of our different properties and we only want to return the ones for John. 
Luckily it is incredibly easy to do in MongoDB to go back to our author's route here we can create our search options so what we want to do is we want to create a new variable which is going to store all of our search objects so it will say search options set it to an empty JavaScript object and then we're going to search for all the different request parameters that we sent and add them to our search options and then finally instead of passing an empty object here we're going to pass search options 

So in our case the only field we have is this name field so we're going to check to see if we passed a name field and we're going to say request query instead of request.body  
Because a give request sends information through the query string as you can see this name parameter is up here in our query string and a post request actually sends it through the body 

So since we have a get here we need to use request query in order to access
our parameters so we can check if the name is not equal to null and we want to make sure that the name is not blank so we'll check that the query dot name is not equal to an empty string and this is essentially just allowing us to make sure that we actually have a name passed to the server and if we do have a name for the server being passed to it we want to add that to our search options so we'll say search options name and we actually want to set this to a new regular expression 

we're going to put our request query.name and we're going to pass it the "i"-- which says that it's going to be case insensitive

One last thing we want to do is send back the request to the user so that it'll repopulate these fields for them so we're going to send that back as search options and we're just going to send back the query to the user let's format this so it's slightly easier to understand what's going on

*/

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    // get all authors from the database
    // we pass in an empty object {} so it will return all authors
    // the authors object will be an array of objects containing all authors
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Authors Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author Route
/*
so we can actually use this name to create a
new author with that name and add it to
our database 

So in order to create a new
author we're going to do something very
similar to using new Author() above 


So we'll create a constant variable called
author we'll set it to a new author and
we're going to pass it a different
parameters that we're going to use, in
our case we want to set just the name
which is coming from 
request.body.name 

so when we have our author with our new name we can save that author and to do that it's incredibly easy all we do is call the save method on the author object

*/

router.post("/", async (req, res) => {
  //console.log(req.body.name);
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    //res.redirect(`/authors/${newAuthor.id}`)
    console.log(newAuthor);
    res.redirect("authors");
  } catch {
    res.render("authors/new", {
      author: author, //this will pre-populate author name field
      errorMessage: "Error creating author",
    });
  }
});

module.exports = router;
