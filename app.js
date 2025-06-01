import dotenv from 'dotenv'
dotenv.config()

// Packages
import express from 'express'
import path from 'path'
// Custom
import connectDB from './config/mongodb.js'
import routes from './routes/index.js'
import logger from './middlewares/logger.middleware.js'
import cookieParser from 'cookie-parser'
import checkForAuthCookie from './middlewares/authentication.middleware.js'
import { AUTH_KEY } from './utils/constants.js'

const app = express()

// Middleware
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('./public'))
app.use(logger('serverLogs.txt'))
app.use(checkForAuthCookie(AUTH_KEY))

// Routes handling
app.use('/', routes)

const startServer = async () => {
	try {
		await connectDB()
		const PORT = process.env.PORT || 8000
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch (error) {
		console.error('Error connecting to the database:', error)
		process.exit(1) // Exit the process with failure
	}
}

startServer()
