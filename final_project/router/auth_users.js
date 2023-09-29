const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if (users.length == 0) {
    return true;
}
for(let i of users) {
    if (i.username === username) {
        return false;
    } else {
        return true;
    }
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

for (let i of users) {
    console.log(i.username);
    if (i.username !== username || i.password !== password) {
        return
    }
    return true;
}
return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  let authenticated = authenticatedUser(username, password)

  if (!authenticated) {
      return res.status(404).json({message: "Username or Password invalid, please check inputs and try again"})
  }
  let accessToken = jwt.sign({
      data: username
  }, "access", { expiresIn: 60 * 60});

  req.session.authorization = { accessToken }
  return res.status(200).json({message: `User ${username} successfully logged in`});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
