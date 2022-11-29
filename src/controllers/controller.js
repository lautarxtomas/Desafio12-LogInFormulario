const home = (req, res) => {
	const { name } = req.body;
	req.session.name = name;
	res.redirect('/');
}

const form = (req, res) => {
	res.render('form', { name: req.session.name });
};

const destroy = (req, res) => {
	try {
		req.session.destroy();
		res.redirect('/');
	} catch (err) {
		res.status(500).send('Error: ', err);
	}
}

module.exports = { form, home, destroy };