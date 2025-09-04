const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pushkarkhirude:vtDUJ5ywq5AeGqEQ@onenode.qx65dpm.mongodb.net/peers",
  );
};

module.exports = connectDB;
