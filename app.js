const express = require('express');
const sequelize = require('./config/database');
port = process.env.PORT || 4000
const userRoutes = require('./routes/userRoutes');
const routeRoutes = require('./routes/routeRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/rutas', routeRoutes);
app.use('/boletos', ticketRoutes);


app.listen(port, () => {
    console.log(`El servidor está ejecutando en el puerto ${port}`);
});

const conexion = require('./config/database'); 


