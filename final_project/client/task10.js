const axios = require('axios');

async function getLibros() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(`Error al obtener los libros`, error.message);
    }
}

getLibros();