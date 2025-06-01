import path from 'path'
import fs from 'fs'

const logger = (fileName) => {
	const logDirPath = path.resolve('./logs')
	if (!fs.existsSync(logDirPath)) {
		fs.mkdirSync(logDirPath, { recursive: true })
	}
	const logFilePath = path.join(logDirPath, fileName)

	const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' })

	process.on('exit', () => {
		logFileStream?.end()
	})

	return (req, res, next) => {
		const { method, originalUrl, ip } = req
		res.on('finish', () => {
			const { statusCode } = res
			const logMessage = `${new Date().toISOString()} - ${method} ${originalUrl} - ${statusCode} - IP: ${ip}\n`
			logFileStream.write(logMessage, (err) => {
				if (err) {
					console.error('Error writing to log file:', err)
				}
			})
		})
		next()
	}
}

export default logger
