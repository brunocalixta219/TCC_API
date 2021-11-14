const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routers');
const mongoose = require('mongoose');

// Routes
const authRouter = require('./routers/authRouter');
const cepRouter = require('./routers/cepRouter');
const contactsRouter = require('./routers/contactsRouter');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let telefones, groups = [];
let connId = "";

mongoose.connect(
    'mongodb+srv://tcc:lGwai71c1nYOChJA@neuronuvem.4pp5a.mongodb.net/HWatch?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'Connection Error'));
connection.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept", "Set-Cookie: cross-site-cookie=name; SameSite=None; Secure");
    next();
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            name: 'name of your app',
            version: '0.1.0'
        }
    });
});

app.use('/auth', authRouter);
app.use('/cep', cepRouter);
app.use('/contacts', contactsRouter);

console.log('Yarn coisa de otario');

io.on('connection', socket => {

    console.log('Peninsula');

    app.get('/monitoria/:phone', (req, res) => {
        sql = 'SELECT * FROM infra WHERE numero = ?'
        let mobile = '"' + req.params.phone + '@c.us"'
        params = [mobile]

        conn.query(sql, params)
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                console.log("Data: ", new Date().toLocaleString(), "\nErro: ", err)
            });
    })

    app.post('/infra', (req, res) => {
        res.send(telefones)
    });

    app.post('/client', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.infra + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            if (req.body.media != 'chat' && req.body.media != 'document') io.to(connId).emit('extMedia', [req.body.msg, req.body.id, req.body.media, req.body.image, req.body.msguuid])
            else io.to(connId).emit('extReceive', [req.body.msg, req.body.id, req.body.msguuid])
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    })

    app.post("/replyMsg", (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.infra + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }   
        console.log(req.body)
        if (connId != "") {
            io.to(connId).emit('replyMsg', { msguuid: req.body.msguuid, msgid: req.body.msgid, msg: req.body.msg })
            res.status(200).send('ok')
        } else res.status(400).send("Celular nao conectaddo")
    });

    app.post("/deleteMsg", (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.infra + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }

        if (connId != "") {
            io.to(connId).emit('deleteMsg', { chatid: req.body.chatid, msgid: req.body.msgid })
            res.status(200).send('ok')
        } else res.status(400).send("Celular nao conectaddo")
    });

    app.post('/groups', (req, res) => {
        // console.log(groups)
        var phone = req.body.phone
        var groupIndex = groups.findIndex(function (group, index) {
            if (group.phone == `"${phone}"`) {
                return true
            }
        })

        if (groupIndex != -1) {
            res.status(200).send(groups[groupIndex])
        } else {
            res.status(200).send([])
        }
    });

    app.post('/deleteChat', (req, res) => {
        socket.broadcast.emit('deleteChats', [])
        res.status(200).send('ok')
    })

    app.post('/createGroup', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('createGroup', {
                nome: req.body.name,
                contacts: req.body.contacts,
                callbackurl: req.body.callbackurl,
                fkid: req.body.fkid
            })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    });

    app.post('/addUser', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('addUser', { groupid: req.body.groupid, user: req.body.user })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    })

    app.post('/removeUser', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('removeUser', { groupid: req.body.groupid, user: req.body.user })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    })

    app.post('/leaveGroup', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('leaveGroup', { groupid: req.body.groupid })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    });

    app.post('/promoteAdm', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('promoteAdm', { groupid: req.body.groupid, user: req.body.user })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    });

    app.post('/demoteAdm', (req, res) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + req.body.mobile + '"') {
                connId = telefones[i].id
                break;
            }
            else connId = ""
        }
        if (connId != "") {
            io.to(connId).emit('demoteAdm', { groupid: req.body.groupid, user: req.body.user })
            res.status(200).send('ok')
        }
        else res.status(400).send("Celular nao conectaddo")
    });

    socket.on("syn-extension", payload => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == '"' + payload.phone + '"') {
                telefones.splice(i, 1);
                break;
            }
        }

        if (payload.phone != undefined) {
            telefones.push(payload);
        }
    });

    socket.on("clientMsg", async (payload) => {
        if (payload[0] == "gp2") {
            let gpType = payload[0]
            let gpSubType = payload[1]
            let groupid = payload[2]
            let author = payload[3]
            let update = payload[4]
            let admins = payload[5]
            let mobile = payload[6]

            // Group

        }
    });

    socket.on("batteryLevel", (payload) => {
        // Change Battery Level
    })

    socket.on("createGroupCallback", (payload) => {
        let body = {
            "groupname": payload.groupname,
            "groupid": payload.groupid,
            "participants": payload.participants,
            "fkid": payload.fkid
        }
        console.log(payload)
    })

    socket.on("banHammer", (payload) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == payload.phone) {
                telefones.splice(i, 1);
            }
        }
    });

    socket.on("phoneDisconnected", (payload) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == payload.phone) {
                // Alt
            }
        }
    });

    socket.on("updateMsgId", (payload) => {
        let urlJson = [
            { "mobile": "5511961834601@c.us", "url": "https://testecielo.ubicuacloud.com.br/api/v1/updateMsgId", "name": "Cielo Ubc HML" },
            { "mobile": "5511976806447@c.us", "url": "https://ubc.hdevelo.com.br/api/v1/updateMsgId", "name": "Cielo HML" }
        
        ]
        let url = urlJson.filter(el => el.mobile == payload.ccsMobile)

        console.log(payload)
        console.log(url)
        
        if (url.length > 0) {
            url = url[0].url
            let form = payload
        }
    });

    socket.on("phoneConnected", (payload) => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].phone == payload.phone) {
                // Alt
            }
        }
    });

    socket.on("updateGroups", (payload) => {
        // console.log(payload)
        var groupIndex = groups.findIndex(function (group, index) {
            if (group.phone == payload.phone) {
                return true
            }
        })

        if (groupIndex != -1) {
            groups[groupIndex] = payload
        } else {
            groups.push(payload)
        }
    })

    socket.on("disconnect", () => {
        for (let i = 0; i < telefones.length; i++) {
            if (telefones[i].id == socket.id) {
                telefones.splice(i, 1);
            }
        }
    });
})

const port = process.env.PORT || '5050';

server.listen(port, function () {
    console.log(`App listening on port ${port}`);
});

