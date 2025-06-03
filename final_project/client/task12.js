const axios = require('axios');

async function getLibrosByAuthor(authorName) {
    try {
        const encodedAuthor = encodeURIComponent(authorName);
        const response = await axios.get(`http://localhost:5000/author/${encodedAuthor}`);
        console.log(`Libros del autor ${authorName}:`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error al obtener libros del autor ${authorName}:`, error.message);
    }
}

getLibrosByAuthor("Unknown");