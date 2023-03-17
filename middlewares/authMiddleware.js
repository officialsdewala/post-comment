const passport = require('passport')

function authMiddleware(roles) {

	return function (req, res, next) {
		passport.authenticate('jwt', { session: false }, (err, user, info) => {
			if (err || !user) {
				console.log("::::::::::::Auth Error::::::::::", err, info)

				return res.status(401).json({ status:401,  message: "Unauthorized user!"  })
			} else {
				if (!roles || (!Array.isArray(roles) && roles == user.role)) {
					req.user = user;
					return next();
				}

				if (roles.includes(user.role)) {
					req.user = user;
					return next();
				}else{
					return res.status(403).json({ status:403,  message: "You are Unauthorized to do this action."  })
				}
			}
		})(req, res, next);
	}
}

module.exports = authMiddleware;
