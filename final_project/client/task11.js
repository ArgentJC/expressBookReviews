const axios = require('axios');

async function getLibroByIsbn(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Libro con isbn ${isbn}:`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error al obtener libros con isbn: ${isbn}:`, error.message);
    }
}

getLibroByIsbn(10);
