const mongoose = require("mongoose");

const connectToMongo = async () => {
    mongoose.connect(process.env.MONGO_URL,
        {useNewUrlParser: true, useUnifiedTopology: true},
        () => {
        console.log("mongo connected successfully");
        // console.log(mongoURI);
    })
}

module.exports = connectToMongo;