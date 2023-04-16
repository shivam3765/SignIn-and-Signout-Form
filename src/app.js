const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb")

const port = process.env.PORT || 8080;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates");

app.use(express.json());
app.use(express.urlencoded({ extented: false }));

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);


app.get("/", (req, res) => {
    res.render("registration")
});


app.get("/home", (req, res) => {
    res.render("home")
});

app.post("/registration", async (req, res) => {
    try {

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Email: req.body.Email,
            Password: req.body.Password,
            Phone: req.body.Phone,
            Gender: req.body.Radio
        }

        await collection.insertMany([data])
        res.status(201).render("registration");

    } catch (error) {
        res.status(400).send(error);
    }

});

app.post("/home", async (req, res) => {
    try {
        const checkEmail = await collection.findOne({ Email: req.body.Email })
        const checkPass = await collection.findOne({ Password: req.body.Password })
        
        if (checkEmail.Email === req.body.Email && checkPass.Password === req.body.Password) {
            res.render("home")
        }
        else {
            res.send("wrong password")
        }
    }
    catch {
        alart(res.send("wrong details"))
    }
});

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
});