require('dotenv').config();
const jwt = require('jsonwebtoken');


const generateToken = ({id, email}) => {
    //create roles based on user email address, 5 emails are admin
    const user = {id, email};
    let role = [];
    switch (email) {
        case '21515838@student.uwl.ac.uk':
            role = 'admin';
            break;
        case '21437262@student.uwl.ac.uk':
            role = 'admin';
            break;
        case '21482994@student.uwl.ac.uk':
            role = 'admin';
            break;
        case '21461264@student.uwl.ac.uk':
            role = 'admin';
            break;
        case '20215493@student.uwl.ac.uk':
            role = 'admin';
            break;
        default:
            role = 'user';
            break;
    }

        

        
    const accessToken = jwt.sign({id, email, role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({id, email, role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
    const verificationToken = jwt.sign({id : user.id, email : user.email}, process.env.EMAIL_VERIFICATION_SECRET, {expiresIn : '2d'});

    return ({accessToken, refreshToken, verificationToken});



}

module.exports = {generateToken}
