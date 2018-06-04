const MongoClient = require('mongodb').MongoClient;
const {format} = require('util');

async function start(config, rec){
  const url = format('mongodb://%s:%d/',
                      config['server'],
                      config['port']);

  var client = await MongoClient.connect(url);
  rec.db = client.db(config['dbname']);
}

module.exports = {start};