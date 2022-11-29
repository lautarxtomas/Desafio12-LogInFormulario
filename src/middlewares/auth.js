const login = (req, res, next) => {
	if (req.session?.name) {
		next();
	} else {
		res.render('../views/login.handlebars');
	}
}

module.exports = login;