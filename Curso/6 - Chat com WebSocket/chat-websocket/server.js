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

let users = []
let socketIds = []

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => {
    socket.on('new user', (data) => {
        if (users.includes(data))
            socket.emit('new user', {success: false})
        else {
            users.push(data)
            socketIds.push(socket.id)
            socket.emit('new user', {success: true})
        }
    })

    socket.on('chat message', (obj) => {
        if (users.indexOf(obj.name) != -1 && users.indexOf(obj.name) == socketIds.indexOf(socket.id))
            io.emit('chat message', obj)
    })

    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id)
        socketIds.splice(id, 1)
        users.splice(id, 1)
    })
})

httpServer.listen(3000)