import { validateToken } from '../services/authentication.js'

const checkForAuthCookie = (cookieName) => {
	return (req, res, next) => {
		const token = req.cookies[cookieName]
		if (!token) {
			return next()
		}
		const userPayload = validateToken(token)
		if (!userPayload) {
			return next()
		}
		req.user = userPayload
		next()
	}
}

export default checkForAuthCookie
