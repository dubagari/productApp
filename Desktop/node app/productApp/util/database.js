/** @format */

const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      "mongodb+srv://dubagari:dubagari@dubagari1.nmpipjp.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((result) => {
      console.log("connected!!");
      _db = result.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }

  throw "no database found!!!";
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
