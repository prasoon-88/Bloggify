import mongoose from 'mongoose'

const connectDB = async () => {
	const dbURI = process.env.MONGODB_URI
	if (!dbURI) {
		throw new Error('MONGODB_URI is not defined in environment variables')
	}
	const connection = await mongoose.connect(dbURI)
	console.log(`MongoDB connected: ${connection.connection.host}`)
	return connection
}

export default connectDB
