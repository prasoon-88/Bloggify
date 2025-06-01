import { Schema, model } from 'mongoose'

const blogSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		body: {
			type: String,
			required: true,
		},
		coverImageURL: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Blog = model('blog', blogSchema)

export default Blog
