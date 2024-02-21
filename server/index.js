const express = require('express') //익스프레스 모듈을 가져온다
const app = express()   //새로운 익스프레스 앱을 만든다.
const port = 4000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const mongoose = require('mongoose')

const config =require('./config/key')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology : true
}).then(()=> console.log('MongoDB Connect...'))
    .catch(err => console.log(err))

//루트 디렉토리에 헬로월드 출력
app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요~~~')
})
app.get('/api/hello', (req, res) =>{
  res.send("안녕하세여");
})

app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', (req, res) => {
    //요청 된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email : req.body.email})
    .then(user=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password , (err, isMatch)=> {
            if(!isMatch){
                return res.json({loginSuccess : false , message : "비밀번호가 틀렸습니다."})
            }

            //비밀번호가 맞다면 Token 생성
            user.generateToken((err, user) => {
                if(err) res.status(400).send(err);

                //token을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess : true, userId : user._id});
            })
        })
    }).catch((err)=>{
        return res.status(400).send(err);
    })
})


app.get('/api/users/auth', auth ,(req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 true 라는 말.
    res.status(200).json({
       _id : req.user._id ,
       isAdmin : req.user.role === 0 ? false : true ,
       isAuth : true ,
       email : req.user.email ,
       name : req.user.name ,
       lastName : req.user.lastName ,
       role : req.user.role,
       image : req.user.image
    });
})

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({_id : req.user._id}, {token : ""})
        .then(user => {
            return res.status(200).send({success : true})
        })
        .catch(err => {
            return res.json({success : false , err})
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})