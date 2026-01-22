import mongoose, { mongo } from 'mongoose'

const Schema = mongoose.Schema

const newsSchema = new Schema({
    title: String,
    image: String,
    category: String,
    content: String,
    author: String,
    slug: String,
    views: Number
}, {collection: 'news'})

export const News = mongoose.model("news", newsSchema)