const express = require('express') //익스프레스 모듈을 가져온다
const app = express()   //새로운 익스프레스 앱을 만든다.
const port = 3000
const bodyParser = require('body-parser');
const { User } = require("./model/User");
const mongoose = require('mongoose')

const config =require('./config/key')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));
//application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connect...'))
    .catch(err => console.log(err))

//루트 디렉토리에 헬로월드 출력
app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요~~~')
})

app.post('/register', async (req, res) => {
    //회원 가입 시 필요한 정보들을 client에서 가져오면 데이터베이스에 넣어준다.
    const user = new User(req.body)

    const result = await user.save().then(() => {
        res.status(200).json({
            success : true
        })
    }).catch((err)=> {
        res.json({success : false, err})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})