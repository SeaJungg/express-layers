const { postSession, getSessionDetail,  getSessionsByAttribute} = require('../services/sessions');

module.exports = Object.freeze({
    postSession: (httpRequest) => postSession(httpRequest),
    getSessionDetail: (httpRequest) => getSessionDetail(httpRequest),
    getSessionsByAttribute: (httpRequest) => getSessionsByAttribute(httpRequest)
});