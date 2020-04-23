const http = require('http')
const { parse } = require('url')
const next = require('next')
const socket_io = require('socket.io')
const sqlite3 = require('sqlite3').verbose()
const dbSource = 'db.sqlite'

const dev = process.env.NODE_ENV != 'production'
const app = next({dev, preserveLog:true})
const handle = app.getRequestHandler()

let db = new sqlite3.Database(dbSource, err=>{
    if(err){
        console.error(err.message)
        throw err
    }else{
        console.log('Conneted to the SQLite database')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            avatar TEXT,
            text TEXT,
            file TEXT,
            date TEXT,
            event TEXT
        )`,err=>{
            // if created, show some message
            console.log(err?'table user is already created':'table user created')
        })
    }
})

app.prepare().then(()=>{
    const server = http.createServer((req, res)=>{
        const parsedUrl = parse(req.url, true)
        const {pathname, query} = parsedUrl
        if(pathname == '/customURL'){
            app.render(req,res,'/customURL',query)
        }else{
            handle(req, res, parsedUrl)
        }
    })
    const io = socket_io(server)
    io.on('connection', socket=>{
        console.log('user connected at '+new Date().toLocaleString())
        let name = '' 
        db.all('SELECT * FROM user LIMIT 100', (err,rows)=>{
            io.emit('loadMsg', rows)
        })
        // user leave app event
        socket.on('disconnect', ()=>{
            console.log(name+' disconnected')
            let msg = {name,date:new Date().toString(),event:'離開聊天室'}
            db.run('INSERT INTO user (name,date,event) VALUES (?,?,?)', [msg.name,msg.date,msg.event])
            io.emit('chat', msg)
        })
        // user send message event
        socket.on('chat', msg=>{
            name = msg.name
            db.run('INSERT INTO user (name,avatar,text,file,date,event) VALUES (?,?,?,?,?,?)', [msg.name,msg.avatar,msg.text,msg.file,msg.date,msg.event])
            io.emit('chat', msg)
        })
    })
    server.listen(3000, err=>{
        if(err) throw err
        console.log('Server ready on http://localhost:3000')
    })
})