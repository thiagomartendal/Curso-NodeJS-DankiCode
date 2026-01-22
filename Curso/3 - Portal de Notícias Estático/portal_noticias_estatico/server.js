import express from 'express'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '/pages'))

app.get('/', (req, res) => {
    const {search} = req.query
    if (search == null)
        res.status(201).render('home', {})
    else
        res.status(201).render('search', {})
})

app.get('/:slug', (req, res) => {
    // res.send(req.params.slug)
    res.status(201).render('single', {})
})

app.listen(5000, () => {
    console.log('Servidor executando.')
})