require('dotenv').config();
const client = require('../db/conn')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authz')
const { v4: uuidv4 } = require('uuid');
var moment = require('moment'); 
const {generateToken} = require('../utils/jwt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');




router.get('/users', bodyParser.json(), async (req, res) => {
    try {
        const users = await client.query('SELECT * FROM users');
        res.json({users : users.rows});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

const emailtext = (userfullname, token) => `                
<body style='background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<h1 style='margin-top: 20px;'>Registration Verification</h1>
</div>
<div style='padding: 20px;'>
<p>Dear ${userfullname},</p>
<p>Thank you for registering with DoctorPhonez! Please click on the link below to confirm your registration:</p>
<p><div style='margin-top: 20px';> Hello, please click the link below to verify your email address. <br> <a href='http://localhost:3000/account/register/${token}'>Verify email</a><div></p>
<p>If you did not register for an account with DoctorPhonez, please disregard this email.</p>
</div>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<p style='margin-top: 20px;'>This email confirms that your registration has been received. Thank you for choosing DoctorPhonez!</p>
</div>
</body>`

const establishConnection = async () => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
    return transporter;
  }
  
  const sendEmail = async (customerEmail, userfullname, token) => {
    try {
      const transporter = await establishConnection();
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: customerEmail,
        subject: "Welcome to DoctorPhonez",
        html: emailtext(userfullname, token)
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
    

router.post('/register', bodyParser.json(), async (req, res) => {
    try {
        const isunderverification = await client.query("SELECT email_ver FROM users WHERE email = $1", [req.body.email]);
        if (isunderverification.rows.length > 0) {
            if (isunderverification.rows[0].email_ver === false) {
                return res.status(403).json({"status": "error", "message": "Email already exists and is under verification"});
            }
        }
        if (!req.body || !req.body.email || !req.body.fullname || !req.body.dob || !req.body.gender || !req.body.mob_phone || !req.body.passwd) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const emailExists = await client.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
        if (emailExists.rows.length > 0) {
            return res.status(403).json({"status": "error", "message": "Email already exists"});
        }
        const mob_phoneExists = await client.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (mob_phoneExists.rows.length > 0) {
            return res.status(403).json({"status": "error", "message": "Mobile number already exists"});
        }

        const uuid = uuidv4();
        const hashedPassword = await bcrypt.hash(req.body.passwd, 10);
        const token = generateToken(req.body.email);
        const verificationToken = token.verificationToken;
        const user = await client.query('INSERT INTO users (usid, fullname, dob, gender, mob_phone, email, passwd, email_ver_token, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [uuid, req.body.fullname, req.body.dob, req.body.gender, req.body.mob_phone, req.body.email, hashedPassword, verificationToken, mysqlTimestamp]);
        if (user) {
            sendEmail(req.body.email, req.body.fullname, verificationToken);
            res.status(201).json({"status": "success", "message": "Verification email has been sent"});
        }                   
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/register/success/:token', bodyParser.json(), async (req, res) => {
    try {
        const token = req.params.token;
        //check if token has expired
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        if (decoded.exp * 1000 < Date.now()        ) {
            console.log(decoded.exp, Date.now());
            return res.status(403).json({"status": "error", "message": "Token has expired"});
        }
        if (!token) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        const user = await client.query('SELECT * FROM users WHERE email_ver_token = $1', [token]);
        if (user.rows.length > 0) {
          //update email verification status and remove token
            await client.query('UPDATE users SET email_ver = $1, email_ver_token = $2 WHERE email_ver_token = $3', [true, null, token]);
            res.status(200).json({"status": "success", "message": "Email verified successfully"});
        } else {
            res.status(404).json({"status": "error", "message": "Invalid token"});
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({"status": "error", "message": "Token has expired"});
        } else {
            res.status(500).json({error : error.message});
        }
    }
});

router.post('/resendemail', bodyParser.json(), async (req, res) => {
    const email = req.body.email;
    const passwd = req.body.passwd;
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            const isunderverification = await client.query("SELECT email_ver FROM users WHERE email = $1", [email]);
            if (isunderverification.rows.length > 0) {
                if (isunderverification.rows[0].email_ver === false) {
                    const token = generateToken(email);
                    const verificationToken = token.verificationToken;
                    await client.query('UPDATE users SET email_ver_token = $1 WHERE email = $2', [verificationToken, email]);
                    sendEmail(email, user.rows[0].fullname, verificationToken);
                    res.status(200).json({"status": "success", "message": "Verification email has been sent"});
                } else {
                    res.status(403).json({"status": "error", "message": "Email already verified"});
                }
            }
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});



//create a protected route for a single user to view their profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        if (user.rows.length > 0) {
            res.status(200).json({"status": "success", "message": "User profile retrieved successfully", "data": user.rows[0]});
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});





module.exports = router;


