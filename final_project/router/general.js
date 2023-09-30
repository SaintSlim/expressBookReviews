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
  let getAvailableBooks = new Promise((resolve) => {
      resolve(JSON.stringify({books}, null, 4));
  })

  getAvailableBooks.then((availBooks) => {
      return res.status(200).send(availBooks);
  }).catch(() => {
      return res.status(500).json({message: "Unable to retrive books"});
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn] == null) {
          reject(`Books with isbn: ${isbn} not found`);
      } else {
          resolve(JSON.stringify(books[isbn], null, 4));
      }
  });

  getBookByISBN.then((val) => {
      return res.status(200).send(val);
  }).catch((err) => {
      return res.status(400).json({ message: err});
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = decodeURIComponent(req.params.author);
  const keys = Object.keys(books);


  const getBooksByAuthor = new Promise((resolve, reject) => {
    for (let i=0; i < keys.length; i++) {
        if (books[i+1].author == author) {
            resolve(JSON.stringify(books[i+1], null, 4))
        }
    }
    return reject(`Book with author ${author} not found`);
  })

  getBooksByAuthor().then((val) => {
      return res.status(200).send(val);
  }).catch((err) => {
      return res.status(400).json({message: err});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = decodeURIComponent(req.params.title);
  const keys = Object.keys(books);

  const getBooksByTitle = new Promise((resolve) => {
    for (let i = 0; i < keys.length; i++) {
        if (books[i+1].title == title) {
            resolve(JSON.stringify(books[i+1], null, 4));
        }
    }
  })
  getBooksByTitle().then((val) => {
      return res.status(200).send(val);
  }).catch(() => {
      return res.status(404).json({message: `Book with title: ${title} not found`});
  })
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
