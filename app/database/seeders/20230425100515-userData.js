'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('User', [
      {
        "user_id": 1,
        "created_at": "2023-04-24T13:45:00",
        "updated_at": "2023-04-24T13:45:00",
        "email": "user1@example.com",
        "oauth_id": "user1oauthid",
        "oauth_provider": "kakao"
      },
      {
        "user_id": 2,
        "created_at": "2023-04-24T13:46:00",
        "updated_at": "2023-04-24T13:46:00",
        "email": "user2@example.com",
        "oauth_id": "user2oauthid",
        "oauth_provider": "kakao"
      },
      {
        "user_id": 3,
        "created_at": "2023-04-24T13:46:00",
        "updated_at": "2023-04-24T13:46:00",
        "email": "user3@example.com",
        "oauth_id": "user3oauthid",
        "oauth_provider": "kakao"
      }]
    , {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
