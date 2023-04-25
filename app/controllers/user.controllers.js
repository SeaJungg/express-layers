// /controllers/user.controller.js

import {
    postUser,
    // ...
  } from 'use-cases/users';
  
  import {
    postPaymentLink
  } from 'use-cases/payments';
  
  export default Object.freeze({
    postUser: (httpRequest) => postUser(httpRequest, postPaymentLink),
    // ...
  });