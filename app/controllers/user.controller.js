const { 
    getKakaoUserBeforeLogin,
    signUp,
    signIn,
    getUser
} = require('../services/users');

module.exports = Object.freeze({
    getKakaoUserBeforeLogin : (httpRequest) => getKakaoUserBeforeLogin(httpRequest),
    signUp : (httpRequest) => signUp(httpRequest),
    signIn : (httpRequest) => signIn(httpRequest),
    getUser : (httpRequest) => getUser(httpRequest)
});