require('dotenv').config();  
const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const e = require('express');


const port = process.env.PORT || 8080;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates");

app.use(bodyParser.urlencoded({ extented: false }));
app.use(bodyParser.json());

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);


app.get("/", (req, res) => {
    res.render("registration")
});


app.post("/registration", [
    check('firstName').exists().isLength({ min: 3 }).withMessage('firstName length should be more then 3 characters'),
    check('lastName').exists().isLength({ min: 3 }).withMessage('lastName length should be morethen 3 characters'),
    check('Email').isEmail().normalizeEmail().withMessage('Email is not valid'),
    check('Password').isStrongPassword().isLength({ min: 6 }).withMessage( "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"),
    check('Phone').isLength({ min: 10, max: 10 }).withMessage('Phone number should contains 10 digits')
    
], async (req, res) => {
    try {

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Email: req.body.Email,
            Password: req.body.Password,
            Phone: req.body.Phone,
            Gender: req.body.Radio
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send("Invalid Details.....")

        }
        else {
            await collection.insertMany([data])
            res.status(201).render("registration")
            
        }

    } catch (error) {
        res.status(400).send(error);
    }

});

app.post("/", async (req, res) => {
    try {
        const email = req.body.loginEmail;
        const password = req.body.loginPassword;

        const checkEmail = await collection.findOne({ Email:email})
        
        if (checkEmail.Password === password) {
            res.send("Welcome to my website...")
        }
        else {
            res.send("invalid id password")
        }
    }
    catch(error) {
        res.status(400).send("wrong details")
    }
});

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
});