const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
const cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/pacemaker/user', (req, res) => {
    console.log(req.body);
    const existUsers = getUserData();
    const findExist = existUsers.find(user => user.username === req.body.username);
    if (findExist) {
        return res.json(findExist);
    }
    else {
        return res.json({ status: false, msg: 'does not exists' });
    }
})

app.get('/user/list', (req, res) => {
    const users = getUserData();
    res.send(users);
})


// user management
app.post('/auth/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        const existUsers = getUserData();
        const findExist = existUsers.find(user => user.username === username);
        if (!findExist) {
            return res.status(409).send({ error: true, msg: 'username not exist' })
        }
        else {
            if (findExist.password === password) res.send(true);
            else res.send(false);
        }
    }
})

app.post('/auth/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        const existUsers = getUserData();
        const findExist = existUsers.find(user => user.username === username);
        if (!findExist) {
            return res.send(register(username, password))
        }
        else {
            return res.json({ status: false, msg: 'User exists.' });
        }
    }
})

// update parameters
app.post('/pacemaker/dispatch', (req, res) => {
    var result = updateUserData(req.body);
    if (result) return res.json({ status: true, msg: 'Dispatched successfully' });
    else return res.json({ status: false, msg: 'user not found.' })
});


function getUserData() {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData);
}


function updateUserData(body) {
    const existUsers = getUserData();
    const findExist = existUsers.find(user => user.username === body.username);
    if (findExist) {
        findExist.mode = body.mode ? body.mode : findExist.mode;
        findExist.lowerRateLimit = body.lowerRateLimit;
        findExist.upperRateLimit = body.upperRateLimit;
        findExist.atrialPulseAmplitude = body.atrialPulseAmplitude;
        findExist.ventriclePulseAmplitude = body.ventriclePulseAmplitude;
        findExist.atrialPulseWidth = body.atrialPulseWidth;
        findExist.ventriclePulseWidth = body.ventriclePulseWidth;
        findExist.ventricularRefractoryPeriod = body.ventricularRefractoryPeriod;
        findExist.atrialRefractoryPeriod = body.atrialRefractoryPeriod;
        var updatedList = existUsers.map(obj => findExist || obj);
        fs.writeFileSync('users.json', JSON.stringify(updatedList));
        return true;
    }
    else {
        return false;
    }
}



function register(username, password) {
    const jsonData = getUserData();
    const userCount = Object.keys(jsonData).length;
    console.log(userCount);
    if (userCount < 10) {
        body = {
            "username": username,
            "password": password,
            "mode": 0,
            "lowerRateLimit": 60,
            "upperRateLimit": 120,
            "atrialPulseAmplitude": 3.5,
            "ventriclePulseAmplitude": 3.5,
            "atrialPulseWidth": 0.4,
            "ventriclePulseWidth": 0.4,
            "ventricularRefractoryPeriod": 320,
            "atrialRefractoryPeriod": 250
        };
        jsonData.push(body);
        console.log(jsonData);
        fs.writeFileSync('users.json', JSON.stringify(jsonData));
        return { status: true, msg: 'Registered successfully.' };
    }
    else {
        return { status: false, msg: 'User spots are full.' };
    }
}

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});