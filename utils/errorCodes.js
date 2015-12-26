

module.exports = {

	characters: {
		XML_PARSE_ERROR: (err) => {
			return {
				code: 'XML_PARSE_ERROR',
				message: 'Name not found',
				status: 404,
				innerError: err
			};
		},
		CHARACTER_EXISTS: (err, name) => {
			return {
				code: 'CHARACTER_EXISTS',
				message: name + ' is already in the database.',
				status: 409,
				innerError: err
			};
		},
		CHARACTER_INVALID: (err, name) => {
			return {
				code: 'CHARACTER_INVALID',
				message: name + ' is not a registered citizen of New Eden.',
				status: 404,
				innerError: err
			};
		}
	}

}