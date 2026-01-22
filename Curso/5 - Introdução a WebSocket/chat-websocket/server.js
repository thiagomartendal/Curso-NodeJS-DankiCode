import express from 'express'
import http from 'http'
import path from 'path'
import ejs from 'ejs'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use('/public', express.static(path.join(__dirname, 'public')))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '/pages'))

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => {
    console.log('Conectado.')
    io.emit('conectado','Estou conectado!');
    socket.broadcast.emit('novo usuario','Um novo usuário se conectou!')
    socket.on('disconnect', () => {
        console.log('Desconectado.')
    })
})

httpServer.listen(3000)