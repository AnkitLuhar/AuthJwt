const express = require("express");
const router = express.Router();
const Person = require("../module/person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//post method to send data user to the datbase
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //assuming the request body conatins the person data;
    //create a newPerson document using the mongoose model
    const newPerson = new Person(data);
    //save the newPerson to the dataBase:
    const savedPerson = await newPerson.save();
    console.log("data is saved:");
    const prodToken = {
      id: savedPerson.id,
      username: savedPerson.username,
    };
    const token = generateToken(prodToken);
    res.status(200).json({ response: savedPerson, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

//now fetchong the data from the database:
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

//parameterized url:
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType; //extract the worktyper from ythe url:
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log("respnse fetched");
      res.status(200).json(response);
    } else {
      res.status(500).json({ error: "invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

//to update the value..we use put or patch::
router.put("/:id", async (req, res) => {
  try {
    const PersonId = req.params.id; //extract the id from the url
    const update = req.body; //update the data from the person

    const response = await Person.findByIdAndUpdate(PersonId, update, {
      new: true, //return the updates document
      runValidators: true, //run mongoose validation
    });

    if (!response) {
      return res.status(404).json({ error: "person not found" });
    }
    console.log("data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "not updated data" });
  }
});

//for deleting the ;
router.delete("/:id", async (req, res) => {
  try {
    const PersonId = req.params.id; //extracting the id for the url:
    const response = Person.findByIdAndDelete(PersonId);
    if (!response) {
      return res.status(404).json({ error: "not found" });
    }
    console.log("data is deleted");
    res.status(200).json({ message: "person deleted succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal error in server" });
  }
});

module.exports = router;
