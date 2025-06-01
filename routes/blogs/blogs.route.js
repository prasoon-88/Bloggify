import { Router } from 'express'
import Blog from '../../models/blog.model.js'
import uploads from '../../middlewares/upload.middleware.js'
import Comment from '../../models/comment.model.js'

const blogsRouter = Router()

blogsRouter.post('/', uploads.single('coverImageURL'), async (req, res) => {
	try {
		const coverImageURL = req?.file?.path
		const { user } = req
		const { title, description, body } = req.body

		if (!title || !body) {
			return res.status(400).render('blogs/createBlog', {
				error: 'Title and body is required fields',
			})
		}

		const payload = { title, description, body, user: user._id }
		if (coverImageURL) {
			const pathToImage = coverImageURL.split('public')[1]
			payload.coverImageURL = pathToImage
		}

		const blog = await Blog.create(payload)

		if (!blog) {
			throw new Error('Error while creating blog')
		}

		return res.redirect(`/blogs/${blog._id}`)
	} catch (error) {
		console.log(error)
		return res.status(500).redirect('blogs')
	}
})

blogsRouter.route('/create').get((req, res) => {
	const { user } = req
	return res.render('blogs/createBlog', {
		user,
	})
})

blogsRouter.route('/:id').get(async (req, res) => {
	try {
		const { user } = req
		const { id } = req.params
		const blog = await Blog.findById(id).populate('user')
		if (!blog) {
			return res.redirect('blogs')
		}
		const {
			title,
			description,
			body,
			coverImageURL,
			user: createdBy,
			createdAt,
		} = blog

		const comments = await Comment.find({ blog: id }).populate('user')
		return res.render('blogs/blog', {
			title,
			description,
			coverImageURL,
			body,
			createdBy,
			user,
			createdAt,
			comments,
			id,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).redirect('blogs')
	}
})

export default blogsRouter
