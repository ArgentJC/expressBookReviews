const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Comprobamos que el usuario y la contraseña hayan sido introducidos
    if (username && password){
        if (!isValid(username)) {
            let user = { "username": username, "password": password };
            users.push(user);
            return res.status(200).json({ message: "Register completed" });
        }
        else {
            return res.status(400).json({ message: "User repeated" });
        }
    }
    else {
        return res.status(400).json({ message: "El usuario y la contraseña son obligatorios" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let book_respond = JSON.stringify(books);
    return res.status(200).json({ message: "Ok result", result: book_respond });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let book_by_isbn = 0;
    if (req.params.isbn > 0) {
        book_by_isbn = books[req.params.isbn];
    }
    else {
        return res.status(403).json({ message: "Isbn not valid" });
    }

    if (book_by_isbn)
        return res.status(200).json({ message: "Ok result", result: book_by_isbn });
    else
        return res.status(404).json({ message: "Not found by isbn" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let book_by_author = []; // Creamos el array vacío para ir metiendo las coincidencias con el autor
    if (req.params.author) { // Comprobamos que el parametro se le pase realmente
        Object.values(books).forEach(book => { // Recorremos la estructura de libros
            if (book.author == req.params.author) // Si el autor es el mismo que el introducido, se añade al array de libros
                book_by_author.push(book);
        });
    }
    else {
        return res.status(400).json({ message: "Author is required" });
    }
    return res.status(200).json({ message: "Ok result", result: book_by_author }); // Devolvemos un 200 si es correcto
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    let book_by_title = []; // Creamos el array vacío de libros por título
    if (req.params.title) { // comprobamos que le estamos pasando realmente un parametro
        Object.values(books).forEach(book => { // Recorremos el array para comprobar que hay libros con ese título
            if (book.title == req.params.title)
                book_by_title.push(book);
        });
    }
    else {
        return res.status(400).json({ message: "Bad request: Title is required" }); // Bad request si no metemos parametro
    }

    if (book_by_title.length > 0) // Si tiene contenido el array, devolvemos un Ok
        return res.status(200).json({ message: "Ok result", result: book_by_title });
    else  // Si no contiene nada, devolvemos un Not Found
        return res.status(404).json({ message: "Not found books by that title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let reviews = []; 

    if (req.params.isbn) {
        Object.values(books).forEach(book => {
            if (book.isbn == req.params.isbn)
                reviews.push(book[reviews]);
        });
    }
    else {
        return res.status(400).json({ message: "No se ha introducido el isbn" });
    }

    if (reviews.length > 0) {
        return res.status(200).json({ message: "Ok result", result: reviews});
    }
    else {
        return res.status(400).json({ message: "No hay reviews para ese libro" });
    }
});

module.exports.general = public_users;
