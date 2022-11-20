const mongoose = require("mongoose");

const connectToMongo = async () => {
  return mongoose.connect(process.env.MONGO_BASE_URL);
};

module.exports = {
  connectToMongo,
};
