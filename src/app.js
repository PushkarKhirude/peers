const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //we use the User model to create new entry in our collection. It is like creating an obj of a class
  //creating a new instance of User model.
  const user = new User(req.body);

  //this will save the new user to our database
  try {
    await user.save();
    res.send("user added to db");
  } catch (err) {
    res.status(400).send("error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected...");

    //always start listening to requests after the database connection is established
    app.listen(3000, () => {
      console.log("server is running....");
    });
  })
  .catch((err) => {
    console.error("Database not connected....");
  });
