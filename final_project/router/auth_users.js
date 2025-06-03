const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    const usersfiltered = users.filter((user) => user.username === username);
    if (usersfiltered.length > 0)
        return true;
    else
        return false;
}

const authenticatedUser = (username, password) => { //returns boolean
    const usersfiltered = users.filter((user) => (user.username === username) && (user.password === password));
    if (usersfiltered.length > 0)
        return true;
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        console.log("Usuario o contraseña no introducidos");
        return res.status(400).json({ message: "El usuario y la contraseña son obligatorios" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "Sesión iniciada correctamente", token: accessToken});
    }
    console.log(`El usuario con username: ${username} y contraseña: ${password} no es válido`);
    return res.status(400).json({ message: "Usuario no válido" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const username = req.session?.username;

    if (!username) {
        return res.status(401).json({ message: "Sesion no valida" });
    }
    if (!isbn) {
        return res.status(400).json({ message: "El isbn debe de ser obligatorio" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "No se ha encontrado ningún libro con ese isbn" });
    }

    if (!books[isbn].reviews || typeof books[isbn].reviews !== 'object') {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Reseña añadida/modificada correctamente", reviews: books[isbn].reviews });
});

// Deletes book reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.username;

    if (!username) {
        return res.status(401).json({ message: "Sesión no válida" });
    }

    if (!isbn) {
        return res.status(400).json({ message: "El ISBN es obligatorio" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "No se ha encontrado ningún libro con ese ISBN" });
    }

    if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({
            message: "Reseña eliminada correctamente",
            reviews: book.reviews
        });
    } else {
        return res.status(404).json({
            message: "No se encontró una reseña tuya para este libro"
        });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
