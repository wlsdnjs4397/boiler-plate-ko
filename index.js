const express = require('express') //익스프레스 모듈을 가져온다
const app = express()   //새로운 익스프레스 앱을 만든다.
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jinwon7620:qVUPYILEJVBycHDa@cluster0.9dupmqj.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connect...'))
    .catch(err => console.log(err))

//루트 디렉토리에 헬로월드 출력
app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요~')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})