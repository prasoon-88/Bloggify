import { Router } from 'express'
import User from '../../models/user.model.js'
import { AUTH_KEY } from '../../utils/constants.js'

const userRouter = Router()

userRouter
	.route('/signup')
	.get((req, res) => {
		return res.render('user/signup')
	})
	.post(async (req, res) => {
		try {
			const { fullName, email, password, profileImageURL } = req.body

			const requiredFields = ['fullName', 'email', 'password']
			const notFoundFields = requiredFields.filter((field) => !req.body[field])
			if (notFoundFields.length) {
				return res.status(400).json({
					message: `Missing required fields: ${notFoundFields.join(', ')}`,
				})
			}

			const user = await User.create({
				fullName,
				email,
				password,
				profileImageURL,
			})

			if (!user?._id) {
				return res.status(500).json({ message: 'User creation failed' })
			}

			return res.redirect('/user/login')
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error' })
		}
	})

userRouter
	.route('/login')
	.get((req, res) => {
		return res.render('user/login')
	})
	.post(async (req, res) => {
		try {
			const { email, password } = req.body

			const requiredFields = ['email', 'password']
			const notFoundFields = requiredFields.filter((field) => !req.body[field])
			if (notFoundFields.length) {
				return res.status(400).json({
					message: `Missing required fields: ${notFoundFields.join(', ')}`,
				})
			}
			const token = await User.matchPasswordAndGenerateToken(email, password)

			return res
				.cookie(AUTH_KEY, token, {
					httpOnly: true,
					sameSite: 'strict',
				})
				.redirect('/')
		} catch (error) {
			console.log(error)
			return res.render('user/login', { error: 'Invalid email or password' })
		}
	})

userRouter.get('/logout', (req, res) => {
	return res
		.clearCookie(AUTH_KEY, {
			httpOnly: true,
			sameSite: 'strict',
		})
		.redirect('/')
})

export default userRouter
