const couchbase = require('couchbase');
const log = require('./log')(' DB ');
const uuidv1 = require('uuid/v1');
const N1qlQuery = couchbase.N1qlQuery;

let db = null;
let bucket_name = null;

const DB = (config) => {

  const cluster = new couchbase.Cluster(config.host);
  cluster.authenticate(config.user, config.password);
  bucket_name = config.bucket;

  function open() {
    return new Promise((resolve, reject) => {
      let bucket = cluster.openBucket(config.bucket, function (err) {
          if (err) {
              reject(err);
          }
          db = bucket;            
          resolve(db);
        });
    });
}

  return {
    open,
    getUser,
    addUser
  };
};

function getUser(email) {
  return new Promise((resolve, reject) => {
    const statement = "SELECT * FROM `" + bucket_name + "` WHERE email=$1";
    db.query(N1qlQuery.fromString(statement), [email], (err, rows) => {
      if (err) reject(err)
      resolve(rows[0][bucket_name]);
    });
  });
}

function addUser(user) {
  return new Promise((resolve, reject) => {
    db.upsert(uuidv1(), user, function(error, result) {
      if(error) {
          reject(error);
      }
      resolve(result);
    });
  });
}

module.exports = DB;
