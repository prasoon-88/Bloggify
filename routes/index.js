import { Router } from 'express'
import userRouter from './user/user.route.js'
import blogsRouter from './blogs/blogs.route.js'
import Blog from '../models/blog.model.js'
import commentRouter from './comment/comment.route.js'

const routes = Router()

routes.get('/', async (req, res) => {
	try {
		const { user } = req
		const blogs = await Blog.find({})
		return res.render('homepage', {
			blogs,
			user,
		})
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.render('blogs/blogs', { error: 'Something went wrong' })
	}
})

routes.use('/user', userRouter)
routes.use('/comments', commentRouter)
routes.use('/blogs/', blogsRouter)

export default routes
