const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const { USER_MODEL } = require('../models')

const opt = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
}

module.exports = strategy = new JwtStrategy(opt, async function (payload, done) {
    // console.log("Payload::::::::::::", payload);
    try {
        const user = await USER_MODEL.findOne({
            email: payload.email,
            // isDeleted:false,
        }, { comments: 0, posts: 0 }).lean();

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }

});

