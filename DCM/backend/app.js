const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/user/list', (req, res) => {
    const users = getUserData();
    res.send(users);
});

app.post('/auth', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function getUserData () {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData);    
}