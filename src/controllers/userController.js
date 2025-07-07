import bcrypt from "bcrypt";
import database from "../config/database.js";


// register new user controller
const registerUser = async (req, res) => {
const {name, email, password} = req.body;


try {
    //checking if all data are send in request body
    if(!name || !email || !password) {
       return res.status(400).json({message: "All fields are required"})
    }

    //TODO: checking if user already exists in DB
    // TODO:dodaj User u model

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    database.query(query, [name, email, hashedPassword], (err, result) => {
        if(err) {
            return res.status(500).json({message: err});
        }

        res.status(201).json({message: "User registered successfully"})
    })

    } catch (error) {
        res.status(500).json({message: "Error registering user"})
    } 
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    // TODO: check if user already exists in DB
    // TODO: hash password
    // TODO: check if password is correct
    // TODO: generate JWT token

    // Find the user by email
    const query = "SELECT * FROM users WHERE email = ?";

    database.query(query, [email], async (err, result) => {
        if(err) {
            return res.status(500).json({message: err});
        }

        if(result.length > 0) {
            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch) {
                res.status(200).json({message: "Login Successfull"})
            } else {
                res.status(401).json({message: "Invalid credentials"})
            }
        } else {
            res.status(404).json({message: "User not found"})
        }
    })

 }

export { registerUser, loginUser }