import http from 'http'
import fs from 'fs'
import readline from 'readline'
import Module from './module.js'

const hostname = '127.0.0.1'
const port = 3000

// Inicialização de servidor padrão
const server = http.createServer((req, res) => {
    if (req.url == '/ola')
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            return res.end()
        })
    else
        return res.end()
})

server.listen(port, hostname, () => {
    // console.log('Servidor está rodando.')
})

const module = new Module()
module.hello()

function tratamentoArquivos() {
    // Escrita em arquivo
    fs.writeFileSync('arquivo', 'Teste', (err) => {
        if (err) throw err
        console.log('Arquivo criado com sucesso.')
    })

    // Cria novo arquivo ou escreve em arquivo existente
    fs.appendFileSync('arquivo', '\nNovo Teste', (err) => {
        if (err) throw err
        console.log('Salvo com sucesso.')
    })

    fs.rename('arquivo', 'arquivo_renomeado', (err) => {
        if (err) throw err
        console.log('Arquivo renomeado.')
    })

    // Leitura de arquivo
    fs.readFile('arquivo_renomeado', (err, data) => {
        if (err) throw err
        let str = data.toString()
        let newStr = str.split('\n')
        // let newStr = str.substring(0, 3)
        console.log(newStr)
    })

    // Exclusão de arquivo
    fs.unlink('arquivo_renomeado', (err) => {
        if (err) throw err
        console.log('Arquivo deletado.')
    })
}

function leituraInputConsole() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    rl.question('Qual o seu nome? ', (name) => {
        console.log('O nome do usuário é:', name)
        rl.question('Qual sua idade? ', (age) => {
            console.log('A idade do', name, 'é:', age)
        })
    })
    
    rl.on('close', () => {
        console.log('Adeus.')
        process.exit(0)
    })
}

leituraInputConsole()