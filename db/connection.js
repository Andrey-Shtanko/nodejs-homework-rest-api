const mongoose = require("mongoose");

const connectToMongo = async () => {
  return mongoose.connect(process.env.MONGO_BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
  connectToMongo,
};
