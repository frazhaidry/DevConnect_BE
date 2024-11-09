const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://namastedev:namastedev@cluster0.dx3xoxx.mongodb.net/devTinder"
    )
}

module.exports = connectDB;





