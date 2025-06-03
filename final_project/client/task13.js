const axios = require('axios');

async function getLibrosByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Libros con título ${title}:`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error al obtener libros con título ${title}:`, error.message);
    }
}

getLibrosByTitle("One Thousand and One Nights");