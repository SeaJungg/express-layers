require("dotenv").config();
const db = require("../database/models/index");
const User = db.User;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const qs = require("qs");
const axios = require('axios');

async function call(method, uri, param, header){
    console.log(`call ${uri}`)
    try {
        let rtn = await axios({
            method: method,
            url: uri,
            headers: header,
            data: param
        })
        return rtn.data;
    } catch (err) {
        console.error(err)
        return err;
    }    
}


module.exports = Object.freeze({
    getUser: async function getUser(httpRequest) {
        const user = await User.findByPk(httpRequest.user_id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    signUp: async (httpRequest) => {
        const { user_name, phone } = httpRequest.body;
        const { oauth_id, email, age_range, gender } = httpRequest.session.kakao;
        try{
            // Create a new user
            const newUser = await User.create({
            user_name,
            phone,
            email,
            oauth_id,
            oauth_provider : 'kakao',
            });
        
            // Generate a JWT token
            const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET);
        
            // Return the token
            return token;
        } catch(e){
            return e;
        }
    },
    signIn: async function signIn(httpRequest) {
        const token = httpRequest.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('A token is required for authentication');
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            httpRequest.user_id = decoded.user_id;
            return this.getUser(httpRequest);
        } catch (err) {
            console.error(err);
            throw new Error('Invalid token');
        }
    },
    getKakaoUserBeforeLogin: async (httpRequest) => {
        let code = httpRequest.query.code;
        console.log(code)
        if(!code) {
            throw new Error('invalid requesst');
        }
        try{
            console.log(`get token start`)
            const tokenData = await call(
                'POST', 
                'https://kauth.kakao.com/oauth/token', 
                qs.stringify({
                  "grant_type": 'authorization_code',
                  "client_id": process.env.KAKAO_CLIENT_ID,
                  "redirect_uri": process.env.KAKAO_REDIRECT_URL,
                  "client_secret": '',
                  "code": code
                }),
                { 'content-type': 'application/x-www-form-urlencoded' }
              );
              
              const userData = await call(
                'GET', 
                'https://kapi.kakao.com/v2/user/me',
                null,
                { 'Authorization' : `Bearer ${tokenData.access_token }`}
              );
              
            console.log(tokenData.access_token)
            console.log('%j', userData)
            let personalData = {
                oauth_id : userData.id,
                "email": userData.kakao_account.email,
                "age_range": userData.kakao_account.age_range,
                "gender": userData.kakao_account.gender
            };
            
            httpRequest.session.kakao = personalData;
            const existingUser = await User.findOne({
                where: {
                  [Op.or]: [{ email : userData.kakao_account.email}, { oauth_id : userData.id}],
                },
            });
            if (!existingUser) {
                return {exists : false};
            } else {
                return this.signIn(httpRequest);
            }
        } catch(e){
            throw new Error(e);
        }
    }
})
