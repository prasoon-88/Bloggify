import jsonWebToken from 'jsonwebtoken'

export const createTokenForUser = (user) => {
	const { _id, fullName, email, profileImageURL, role } = user
	const payload = { _id, fullName, email, profileImageURL, role }
	const token = jsonWebToken.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '2d',
	})
	return token
}

export const validateToken = (token) => {
	try {
		if (!token) {
			throw new Error('Token is required for validation')
		}
		return jsonWebToken.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		console.log('Error while parsing token', error)
	}
}
