// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Sirve todos los archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});