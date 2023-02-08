// Importar las dependencias necesarias
const cors = require("./cors")
const express = require("express");
const multer = require("multer");
const mysql = require("./mysql2");

// Inicializar Express

const app = express()


app.use(cors());

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});



// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'bzc2vs79rtlg1pmcnuf2-mysql.services.clever-cloud.com',
  user: 'uftekw6lr9o2a7oq',
  password:"kfrdejJwCGdj3j8IcrsO",
  database: 'bzc2vs79rtlg1pmcnuf2'
});

connection.connect(() => {
  
  console.log('Conectado como ID: ' + connection.threadId);
});




// Configurar Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "http:/localhost/static/photos");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });



// Definir el endpoint para procesar el formulario
app.post("/form", upload.array("image", 12), (req, res) => {
  const { name, email, details, latitude, longitude } = req.body;

  // Preparar la información de las imágenes para almacenarlas en la base de datos
  const image_url = req.files.map(file => "http://localhost/static/photos/" + file.filename);
  

  // Crear una consulta SQL para insertar los datos en la tabla
  const sql =
    "INSERT INTO users (name, email, details, latitude, longitude, image_url) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, email, details, latitude, longitude, JSON.stringify(image_url)];

  // Ejecutar la consulta
  connection.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error al procesar el formulario" });
    } else {
      res.send({ message: "Formulario procesado correctamente" });
    }
  });
});


app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error al obtener datos" });
    } else {
      const data = results.map(row => {
        return {
          name: row.name,
          email: row.email,
          details: row.details,
          latitude: row.latitude,
          longitude: row.longitude,
          imageUrls: JSON.parse(row.image_url)
        };
      });
      res.send({ data });
    }
  });
});














