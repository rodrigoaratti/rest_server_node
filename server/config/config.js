process.env.PORT = process.env.PORT || 3000;
process.env.MONGO_DB_SERVER = 'localhost';
process.env.MONGO_DB_PORT = '27017';
process.env.MONGO_DB_DATABASE = 'cafe';
//process.env.NODE_ENV = 'prod';

process.env.VENCIMIENTO_TOKEN = 60 * 60 * 24 * 30;
process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || 'Secreto de prueba';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    process.env.URL_DB_MONGO = `mongodb://${process.env.MONGO_DB_SERVER}:${process.env.MONGO_DB_PORT}}/${process.env.MONGO_DB_DATABASE}`;
} else {
    process.env.URL_DB_MONGO = process.env.hostmong;

}

process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '211327220145-2cfnfhh5iuvlfesirqjmu1sb76di9ons.apps.googleusercontent.com';