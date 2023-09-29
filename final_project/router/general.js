const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(404).json({message: `Username or Password invalid, please check input and try again`})
  }

  let valid = isValid(username);

  if (valid) {
    users.push({"username": req.body.username, "password":req.body.password});
    return res.status(200).json({message: `User ${username} has successfully registered`});
  } else {
    return res.status(500).json({ message: `User with username ${username} already exists, enter new username or sign in`})
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] == null) {
      return res.status(404).json({ message: `Books with isbn: ${isbn} not found`})
  }
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = decodeURIComponent(req.params.author);
  const keys = Object.keys(books);

  for (let i=0; i < keys.length; i++) {
      if (books[i+1].author == author) {
          return res.status(200).send(JSON.stringify(books[i+1], null, 4))
      }
  }
  return res.status(400).json({message: `Book with author ${author} not found`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = decodeURIComponent(req.params.title);
  const keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
      if (books[i+1].title == title) {
          return res.status(200).send(JSON.stringify(books[i+1], null, 4));
      }
  }
  return res.status(404).json({message: `Book with title: ${title} not found`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] == null) {
      return res.status(404).json({message: `Book with ISBN: {isbn} not found`})
  }
  return res.status(200).send(`
  Reviews for the book ${books[isbn].title} are:
  ${JSON.stringify(books[isbn].reviews, null, 4)}
  `);
});

module.exports.general = public_users;
