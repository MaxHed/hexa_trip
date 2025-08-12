const mongoose = require('mongoose');

const mongoUriAtlas = ``
const mongoUriLocal = `mongodb://localhost:27017/hexa-trip`;
const mongoUriDocker = process.env.MONGODB_URI || `mongodb://admin:password123@localhost:27017/hexa-trip?authSource=admin`;

let mongoUri = ``

const connectToDatabase = async () => {
    if(process.env.NODE_ENV === 'production') {
        mongoUri = mongoUriAtlas;
    } else {
        // Essayer d'abord la connexion avec authentification (Docker)
        try {
            await mongoose.connect(mongoUriDocker, {
                dbName: 'hexa-trip',
                tls: false,
                connectTimeoutMS: 5000,
                serverSelectionTimeoutMS: 5000,
            });
            console.log('Connected to MongoDB with authentication (Docker)');
            return;
        } catch (error) {
            console.log('Failed to connect with authentication, trying without...');
            // Si échec, essayer sans authentification (MongoDB local)
            mongoUri = mongoUriLocal;
        }
    }

    try {
        await mongoose.connect(mongoUri, {
            dbName: 'hexa-trip',
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            tls: process.env.NODE_ENV === 'production',
        });
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}


module.exports = connectToDatabase