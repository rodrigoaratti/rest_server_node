process.env.PORT = process.env.PORT || 3000;
process.env.MONGO_DB_SERVER = 'localhost';
process.env.MONGO_DB_PORT = '27017';
process.env.MONGO_DB_DATABASE = 'cafe';
//process.env.NODE_ENV = 'prod';


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    process.env.URL_DB_MONGO = `mongodb://${process.env.MONGO_DB_SERVER}:${process.env.MONGO_DB_PORT}}/${process.env.MONGO_DB_DATABASE}`;
} else {
    process.env.URL_DB_MONGO = process.env.hostmong;

}