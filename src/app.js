const express = require("express");

const validator = require("validator");
const connectDB = require("./config/database.js");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user.js");

app.use(express.json()); //a middleware provided by express to parse the json payload

app.post("/signup", async (req, res) => {
  //this will save the new user to our database
  try {
    //validate the data
    validateSignupData(req);
    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); //10 is the number of salt rounds
    //we use the User model to create new entry in our collection. It is like creating an obj of a class
    //creating a new instance of User model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user added to db");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //sanitize email ID
    if (!validator.isEmail(emailId)) {
      throw new Error("Ivalid Credentials");
    }

    const user = await User.findOne({ emailId: emailId });
    //check if user is present or throw an error
    if (!user) {
      throw new Error("Ivalid Credentials");
    }

    //compare password sent by user and its hash in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//get user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong!");
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
