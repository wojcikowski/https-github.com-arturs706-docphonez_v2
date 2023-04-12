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
const { serialize } = require('cookie');
const smsclient = require('../twilio/smsconn');




router.get('/users', bodyParser.json(), authenticateToken, async (req, res) => {
    try {
        const users = await client.query('SELECT usid, fullname, dob, gender, mob_phone, email, created_at FROM users');
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
        if (user.rows.length > 0) {
            // Send verification email
            sendEmail(req.body.email, req.body.fullname, verificationToken);
            // Respond with success message
            res.status(201).json({"status": "success", "message": "Verification email has been sent"});
          } else {
            // Respond with error message
            res.status(400).json({"status": "error", "message": "User not found."});
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
router.get('/profile', bodyParser.json(), authenticateToken, async (req, res) => {
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

//create a protected route for a single user to delete their profile
router.delete('/deleteprofile', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;


    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        } else if (user.rows.length > 0) {
            await client.query('DELETE FROM users WHERE email = $1', [req.user.email]);
            res.clearCookie('refreshToken');
            res.status(200).json({"status": "success", "message": "User profile deleted successfully"});
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprofile', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    const fullname = req.body.fullname;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.user.email;
    const queryString = `UPDATE users SET
    fullname = COALESCE(NULLIF($1, '')),
    gender = COALESCE(NULLIF($2, '')),
    dob = COALESCE(NULLIF($3, ''))
    WHERE email = $4`;
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        } 
        if (user.rows.length < 1) {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
        await client.query(queryString, [fullname, gender, dob, email]);
        res.status(200).json({"status": "success", "message": "User profile updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});


const emailupdatetext = (userfullname, link) => `                
<body style='background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<h1 style='margin-top: 20px;'>Email Update Verification</h1>
</div>
<div style='padding: 20px;'>
<p>Dear ${userfullname},</p>
<p>You have requested to update your email address for your account with DoctorPhonez. Please click on the link below to confirm your new email address:</p>
<p><div style='margin-top: 20px';> Hello, please click the link below to verify your new email address. <br> <a href='${link}'>Verify email</a><div></p>
<p>If you did not request to update your email address for your DoctorPhonez account, please disregard this email.</p>
</div>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<p style='margin-top: 20px;'>This email confirms that your request to update your email address has been received. Thank you for choosing DoctorPhonez!</p>
</div>
</body>`

router.post('/updateprofile/contactdetails', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    const newEmail = req.body.email;
    const currentEmail = req.user.email;

    //all good up to here
    try {
        var userfullname = "";
        const user = await client.query('SELECT * FROM users WHERE email = $1', [currentEmail]);
        userfullname = user.rows[0].fullname; 
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        } 
        if (user.rows.length < 1) {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
        // Generate a unique token for email verification
        const token = generateToken(req.body.email);
        const verificationToken = token.emailUpdateToken;
        await client.query('INSERT INTO email_verification_tokens (email, token) VALUES ($1, $2)', [newEmail, verificationToken]);
        

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
          const verificationLink = `http://localhost:3000/account/settings/updatecontacts/${verificationToken}`;

          const sendEmail = async (newEmail, userfullname, verificationLink) => {
            try {
              const transporter = await establishConnection();
              const mailOptions = {
                from: process.env.SMTP_USERNAME,
                to: newEmail,
                subject: "Update email address",
                html: emailupdatetext(userfullname, verificationLink)
              };
              await transporter.sendMail(mailOptions);
              console.log("Email sent successfully");
            } catch (error) {
              console.error("Error sending email:", error);
              throw new Error("Failed to send email");
            }
          }
          sendEmail(newEmail, userfullname, verificationLink);

        res.status(200).json({"status": "success", "message": "A verification email has been sent to your new email address"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

// Route for handling email verification
router.put('/updateprofile/verifynewemail/:token', bodyParser.json(), authenticateToken, async (req, res) => {

    const token = req.params.token;
    //check if token has expired
    const decoded = jwt.verify(token, process.env.EMAIL_UPDATE_SECRET);
    if (decoded.exp * 1000 < Date.now()        ) {
        return res.status(403).json({"status": "error", "message": "Token has expired"});
    }
    if (!token) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const result = await client.query('SELECT email FROM email_verification_tokens WHERE token = $1', [token]);
        if (result.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Token not found or has expired"});
        }
        const email = result.rows[0].email;
        await client.query('UPDATE users SET email = $1 WHERE email = $2', [email, req.user.email]);
        await client.query('UPDATE userorders set useremail = $1 WHERE useremail = $2', [email, req.user.email]);
        await client.query('DELETE FROM email_verification_tokens WHERE token = $1', [token]);
        res.clearCookie('refreshToken');
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const tokens = generateToken(user.rows[0]);
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        const mob_phone = user.rows[0].mob_phone;
        const serialized = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);


        res.status(200).json({"status": "success", "message": "Your email address has been updated successfully", "accessToken": accessToken});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});


router.post('/updateprofile/mobpassnumber', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newMobilePhone = req.body.mob_phone;
    //check if newMobilePhone is valid phone number
    const ukPhoneNumberRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    const isValid = ukPhoneNumberRegex.test(newMobilePhone);
    if (!isValid) {
        return res.status(400).json({"status": "error", "message": "Invalid mobile phone number"});
    }
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await client.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (checkifexists.rows.length > 0) {
            return res.status(400).json({"status": "error", "message": "Mobile phone number already exists"});
        }
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }
        //check if user has already requested for a verification code
        const checkifexistscode = await client.query('SELECT * FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        if (checkifexistscode.rows.length > 0) {
            await client.query('DELETE FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const generatenumber = Math.floor(Math.random() * 9000) + 1000;
        await client.query('INSERT INTO mobp_verification_tokens (userid, mob_phone, secretcode, created_at) VALUES ($1, $2, $3, $4)', [userid, newMobilePhone, generatenumber, mysqlTimestamp]);
        try {
            await smsclient.messages.create({
                body: `Your verification code is ${generatenumber}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: newMobilePhone
            });
            res.status(200).json({"status": "success", "message": "4 digit verification code has been sent to your mobile phone number"});
        } catch (error) {
            return res.status(400).json({"status": "error", "message": "Failed to send SMS"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});


router.put('/updateprofile/mobilephone', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newMobilePhone = req.body.mob_phone;
    const secretcode = req.body.secretcode;

    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifExists = await client.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (checkifExists.rows.length > 0) {
            return res.status(400).json({"status": "error", "message": "Mobile phone number already exists"});
        }
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }
        const code = await client.query('SELECT secretcode FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        if (code.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Secret code not found or has expired"});
        }
        if (code.rows[0].secretcode !== secretcode) {
            return res.status(400).json({"status": "error", "message": "Invalid secret code"});
        }
        await client.query('UPDATE users SET mob_phone = $1 WHERE email = $2', [newMobilePhone, req.user.email]);
        await client.query('DELETE FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        res.status(200).json({"status": "success", "message": "Your mobile phone number has been updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});


router.post('/updateprofile/changepasscode', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const mobile = req.body.mob_phone;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid old password"});
        }
        //check if user has already requested for a verification code
        const checkifexistscode = await client.query('SELECT * FROM pass_verification_tokens WHERE userid = $1', [userid]);
        if (checkifexistscode.rows.length > 0) {
            await client.query('DELETE FROM pass_verification_tokens WHERE userid = $1', [userid]);
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const generatenumber = Math.floor(Math.random() * 9000) + 1000;
        await client.query('INSERT INTO pass_verification_tokens (userid, secretcode, created_at) VALUES ($1, $2, $3)', [userid, generatenumber, mysqlTimestamp]);
        try {
            await smsclient.messages.create({
                body: `Your verification code is ${generatenumber}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile
            });
            res.status(200).json({"status": "success", "message": "4 digit verification code has been sent to your mobile phone number"});
        } catch (error) {
            return res.status(400).json({"status": "error", "message": "Failed to send SMS"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});


router.put('/updateprofile/changepassword', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newPassword = req.body.newpassword;
    const secretcode = req.body.secretcode;

    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }
        const code = await client.query('SELECT secretcode FROM pass_verification_tokens WHERE userid = $1', [userid]);
        if (code.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Secret code not found or has expired"});
        }
        if (code.rows[0].secretcode !== secretcode) {
            return res.status(400).json({"status": "error", "message": "Invalid secret code"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await client.query('UPDATE users SET passwd = $1 WHERE email = $2', [hashedPassword, req.user.email]);
        await client.query('DELETE FROM pass_verification_tokens WHERE userid = $1', [userid]);
        res.status(200).json({"status": "success", "message": "Your password has been updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.get('/getprimaryaddress', authenticateToken, async (req, res) => {
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const address = await client.query('SELECT * FROM useraddr WHERE userid = $1', [userid]);
        if (address.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No address found"});
        }
        res.status(200).json({"status": "success", "message": "Address found", "data": address.rows[0]});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.get('/getsecondaryadddress', authenticateToken, async (req, res) => {
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const address = await client.query('SELECT * FROM useraddrsecondary WHERE userid = $1', [userid]);
        if (address.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No address found"});
        }
        res.status(200).json({"status": "success", "message": "Address found", "data": address.rows[0]});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprimaryaddress', bodyParser.json(), authenticateToken, async (req, res) => {
    const address = req.body.firstline;
    const secondline = req.body.secondline;
    const city = req.body.city;
    const postcode = req.body.postcode;
    const country = req.body.country;
    const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    const userid = user.rows[0].usid;
    if (!address || !secondline || !city || !postcode || !country) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await client.query('SELECT * FROM useraddr WHERE userid = $1', [userid]);
        if (checkifexists.rows.length > 0) {
            await client.query('UPDATE useraddr SET firstline = $1, secondline = $2, city = $3, postcode = $4, country = $5 WHERE userid = $6', [address, secondline, city, postcode, country, userid]);
            res.status(200).json({"status": "success", "message": "Address updated successfully"});
        } else {
            const uuid = uuidv4();

            await client.query('INSERT INTO useraddr (addrid, userid, firstline, secondline, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid, userid, address, secondline, city, postcode, country]);
            res.status(200).json({"status": "success", "message": "Address added successfully"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updatesecondaryaddress', bodyParser.json(), authenticateToken, async (req, res) => {
    const address = req.body.firstline;
    const secondline = req.body.secondline;
    const city = req.body.city;
    const postcode = req.body.postcode;
    const country = req.body.country;
    const user = await client.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    const userid = user.rows[0].usid;
    if (!address || !secondline || !city || !postcode || !country) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await client.query('SELECT * FROM useraddrsecondary WHERE userid = $1', [userid]);
        if (checkifexists.rows.length > 0) {
            await client.query('UPDATE useraddrsecondary SET firstline = $1, secondline = $2, city = $3, postcode = $4, country = $5 WHERE userid = $6', [address, secondline, city, postcode, country, userid]);
            res.status(200).json({"status": "success", "message": "Address updated successfully"});
        } else {
            const uuid = uuidv4();
            await client.query('INSERT INTO useraddrsecondary (addrid, userid, firstline, secondline, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid, userid, address, secondline, city, postcode, country]);
            res.status(200).json({"status": "success", "message": "Address added successfully"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});







        




module.exports = router;


