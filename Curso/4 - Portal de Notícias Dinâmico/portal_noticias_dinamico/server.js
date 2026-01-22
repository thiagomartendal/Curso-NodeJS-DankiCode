import express from 'express'
import mongoose, { mongo } from 'mongoose'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import { News } from './News.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose.connect('mongodb://localhost:27017/PortalNoticiasDinamico')
    .then(() => {
        console.log('Banco conectado com sucesso.')
    })
    .catch(err => console.log(err.message))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/public', express.static(path.join(__dirname, 'public')))
// Pasta de imagens das notícias (deve ficar em um escopo de backend, e não em um diretório público como '/public')
app.use('/news_images', express.static(path.join(__dirname, 'news_images')))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '/pages'))

async function allNews(mostRead = false, search = undefined) {
    // A configuração no comando sort ordena os dados em ordem decrescente pelo campo _id
    let news = undefined
    if (search)
        news = await News.find({title: {$regex: search, $options: 'i'}})
    else
        news = ((mostRead)
            ? await News.find({}).sort({'views': -1}).limit(3).exec()
            : await News.find({}).sort({'_id': -1}).exec()
        )
    news = news.map(nws => {
        return {
            title: nws.title,
            image: nws.image,
            category: nws.category,
            content: nws.content,
            description: nws.content.substr(0, 100),
            slug: nws.slug,
            author: nws.author,
            views: nws.views
        }
    })
    return news
}

app.get('/', async (req, res) => {
    const {search} = req.query
    if (search == null) {
        let news = await allNews()
        let mostRead = await allNews(true)
        res.status(201).render('home', {news: news, mostRead: mostRead})
    } else {
        let news = await allNews(false, search)
        res.status(201).render('search', {query: search, news: news})
    }
})

app.get('/:slug', async (req, res) => {
    // res.send(req.params.slug)
    let news = await News.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true})
    let mostRead = await allNews(true)
    if (news)
        res.status(201).render('single', {news: news, mostRead: mostRead})
    else
        res.redirect('/')
})

app.listen(5000, () => {
    console.log('Servidor executando.')
})