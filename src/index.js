const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');


const { v4: uuid } = require('uuid');

const { format } = require('timeago.js');

// Init 
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuid() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));

// Global variables
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});
// Routes
app.use(require('./routes'));


// static files
app.use(express.static(path.join(__dirname, 'public')));

// Start srever
app.listen(app.get('port'), () => {
  console.log('server On port::'+app.get('port'));
});
