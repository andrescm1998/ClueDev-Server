const Token = require("../models/token");

async function authenticator(req, res, next) {
    
    try {
        console.log(req.cookies)
        const userCookie = req.cookies.discretionUser;
        console.log("this is at auth: ", userCookie)

        if (!userCookie) {
            throw new Error("User not authenticated.");
        } else {
            const validToken = await Token.getOneByToken(userCookie);

            next();
        }

    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

module.exports = authenticator;
