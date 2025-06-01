import multer, { diskStorage } from 'multer'
import path from 'path'
import fs from 'fs'

const storage = diskStorage({
	destination: function (req, file, cb) {
		const { user } = req
		if (user?._id) {
			const imageDir = path.resolve(`./public/uploads/${user._id}/`)
			if (!fs.existsSync(imageDir)) {
				fs.mkdirSync(imageDir, { recursive: true })
			}
			cb(null, imageDir)
		} else {
			cb(null, path.resolve('./public/temp/'))
		}
	},
	filename: function (req, file, cb) {
		const { fieldname, originalname } = file
		const uniqueName = `${fieldname}-${Date.now()}-${originalname}`
		console.log(uniqueName)
		cb(null, uniqueName)
	},
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		return cb(null, true)
	}
	return cb('Only images are allowed to be uploaded', false)
}

const uploads = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

export default uploads
