const { 
    getKakaoUserBeforeLogin,
    signUp,
    signIn,
    getUser,
    postToken
} = require('../services/users');

module.exports = Object.freeze({
    getKakaoUserBeforeLogin : (httpRequest) => getKakaoUserBeforeLogin(httpRequest),
    signUp : (httpRequest) => signUp(httpRequest),
    getUser : (httpRequest) => getUser(httpRequest),
    postToken : (httpRequest) => postToken(httpRequest)
});