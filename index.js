const express = require('express');
const morgan = require('morgan');
const connectToDatabase = require('./database');
const bodyParser = require('body-parser');
const multer = require('multer');

// routes
const orderRoutes = require('./routes/order.routes');
const adviserRoutes = require('./routes/adviser.routes');
const agencyRoutes = require('./routes/agency.routes');
const tripRoutes = require('./routes/trip.routes');


//instance of express
const app = express();

//config
const PORT = 3000;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// connect to database
connectToDatabase()

// multer
app.locals.uploader = multer({
    storage: multer.memoryStorage({}),
    limits: {fileSize: 10 * 1024 * 1024}, // Max Size 10mb
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")){
            cb(null, true);
        } else {
            cb(new Error("Only images are accepted"));
        }

    }
});


// endpoints
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use('/agencies', agencyRoutes)
app.use('/trips', tripRoutes)


// catch all :*
app.use((req, res) => {
    return res.status(404).send("Not Found");
});

// heartbeat
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});