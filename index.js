import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import UserSchema from "./models/User.js";

const PORT = 3000;
const key = "secret";
const url =
    "mongodb+srv://admin:root@cluster0.zzk45xw.mongodb.net/body?retryWrites=true&w=majority";

const app = express();

mongoose
    .connect(url)
    .then(() => console.log("BD SECCESS"))
    .catch((e) => console.log("BD ERROR", e));

// потрібно щоб express розумів json (console.log(req.body);)
app.use(express.json());

app.get("/", (req, res) => {
    res.send("works");
});

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        // if not validate (pattern registarValidation)
        if (!errors.isEmpty()) {
            return res.status(400).json({ validate: false, ...errors.array() });
        }

        // crypt password
        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(pass, salt);

        // create new user in base
        const doc = new UserSchema({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            avatarUrl: req.body.avaratUrl,
            passwordHash,
        });
        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            key
        );

        // log created user
        res.json({ ...user._doc, token });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "register error",
        });
    }
});

app.listen(PORT, (e) => (e ? console.log(e) : console.log("SUCCESS")));
