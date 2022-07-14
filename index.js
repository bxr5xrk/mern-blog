import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import UserSchema from "./models/User.js";

const app = express();
const url =
    "mongodb+srv://admin:root@cluster0.zzk45xw.mongodb.net/body?retryWrites=true&w=majority";

mongoose
    .connect(url)
    .then(() => console.log("BD SECCESS"))
    .catch((e) => console.log("BD ERROR", e));

// потрібно щоб express розумів json (console.log(req.body);)
app.use(express.json());

app.get("/", (req, res) => {
    res.send("test");
});

app.post("/auth/register", registerValidation, async (req, res) => {
    const errors = validationResult(req);

    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(pass, salt);
    const doc = new UserSchema({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        avatarUrl: req.body.avaratUrl,
        passwordHash,
    });

    const user = await doc.save();

    return !errors.isEmpty()
        ? res.status(400).json(errors.array())
        : res.json(doc);
});

app.listen(1488, (e) => (e ? console.log(e) : console.log("SUCCESS")));
