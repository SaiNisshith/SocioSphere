const mongoose = require('mongoose');
const env = require('../config/environment')

main().catch(err => console.log("Error connecting to the DB",err));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
  console.log("Successfully connected to the DB");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}