import { Schema, model } from 'mongoose'
import { createHmac, randomBytes } from 'crypto'
import { createTokenForUser } from '../services/authentication.js'

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		salt: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		profileImageURL: {
			type: String,
			default: '/default-avatar.webp',
		},
		role: {
			type: String,
			enum: ['USER', 'ADMIN'],
			default: 'USER',
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', function (next) {
	const user = this

	if (!user.isModified('password')) return next()

	const salt = randomBytes(16).toString('hex')
	const hashedPassword = createHmac('sha256', salt)
		.update(user.password)
		.digest('hex')

	this.salt = salt
	this.password = hashedPassword
	next()
})

userSchema.static(
	'matchPasswordAndGenerateToken',
	async function (email, password) {
		const user = await this.findOne({ email })

		if (!user) {
			throw new Error('user not found')
		}

		const { salt, password: hashedPassword } = user
		const userProvidedHashedPassword = createHmac('sha256', salt)
			.update(password)
			.digest('hex')

		if (userProvidedHashedPassword !== hashedPassword) {
			throw new Error('Incorrect id or password')
		}

		const token = createTokenForUser(user)

		return token
	}
)

const User = model('User', userSchema)

export default User
