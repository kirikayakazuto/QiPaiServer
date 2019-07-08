import * as mongodb from "mongodb";

const server = new mongodb.Server(
    'localhost',
    27017,
);


const db = new mongodb.Db('movies', server);

