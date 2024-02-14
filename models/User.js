const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxLength : 20
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String
    },
    lastname : {
        type : String,
        maxLength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
})

userSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            //hash => 암호화 된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    const user=this

    //jsonwebtoken을 이용해서 token 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token

    user.save().then(() => {
        return cb(null, user);
    }).catch((err) => {
        return cb(err);
    })
}

userSchema.statics.findByToken = function(token, cb){
    const user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token})
        .then(user => {
            cb(null, user);
        })
        .catch((err) => {
          return err;
        });
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}