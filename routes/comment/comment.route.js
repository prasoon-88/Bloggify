import { Router } from 'express'
import Comment from '../../models/comment.model.js'

const commentRouter = Router()

commentRouter.post('/:blogId', async (req, res) => {
	const { blogId } = req.params
	try {
		const { _id: user } = req.user

		const { content } = req.body

		await Comment.create({
			content,
			user,
			blog: blogId,
		})
	} catch (error) {
		console.log(error)
	}
	return res.redirect(`/blogs/${blogId}`)
})

export default commentRouter
