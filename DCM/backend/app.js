const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
const cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/user/list', (req, res) => {
    const users = getUserData();
    res.send(users);
});

app.post('/auth/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        const existUsers = getUserData();
        const findExist = existUsers.find( user => user.username === username )
        if (!findExist) {
            return res.status(409).send({error: true, msg: 'username not exist'})
        }
        else {
            if(findExist.password === password) res.send(true);
            else res.send(false);
        }
    }
})

app.post('/auth/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        const existUsers = getUserData();
        const findExist = existUsers.find( user => user.username === username )
        if (!findExist) {
            return res.send(writeUserData(username, password))
        }
        else {
            return res.json({status: false, msg: 'User exists.'});
        }
    }
})



function getUserData () {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData);    
}

function writeUserData (username, password) {
    const jsonData = getUserData();
    const userCount = Object.keys(jsonData).length;
    console.log(userCount);
    if (userCount < 10) {
        jsonData.push({"username": username, "password": password});
        console.log(jsonData);
        fs.writeFileSync('users.json', JSON.stringify(jsonData));
        return { status: true, msg: 'Registered successfully.'};
    }
    else {
        return { status: false, msg: 'User spots are full.'};
    }
   
}

io.on('connection', (socket) => {
    console.log('a user connected');
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });