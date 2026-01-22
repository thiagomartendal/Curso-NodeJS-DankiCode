import express from 'express'
import ejs from 'ejs'
import path from 'path'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '/views'))

var tasks = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3', 'Tarefa 4']

app.get('/', (_, res) => { // Parâmetro coringa _ é utilizado no lugar de um parâmetro obrigatório, mas que não será usado (neste caso req não é utilizado nesta rota)
    res.render('index', {tasks: tasks})
})

app.get('/delete/:id', (req, res) => {
    const {id} = req.params
    tasks = tasks.filter((task, i) => {
        if (i != id)
            return task
    })
    res.redirect('/')
})

app.post('/', (req, res) => {
    const {task} = req.body
    tasks.push(task)
    res.redirect('/')
})

app.listen(5000, () => {
    console.log('Servidor executando.')
})