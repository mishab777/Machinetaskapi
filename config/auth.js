import { json } from "express"
import { db } from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`email`, `password`) VALUES (?, ?)";
        const values = [req.body.email, hashedPassword];

        db.query(q, values, (err, data) => { // Pass `values` directly instead of wrapping in an array
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        });
    });
};

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json("Wrong password or email");

        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json({
            ...others,
            token: token, // Include the token in the response body
        });
    });
};

export const logout = (req,res)=>{

    res.clearCookie("accessToken",{
        secure:true,
        samSite:"none"
    }).status(200).json("User has been logged out") 
}