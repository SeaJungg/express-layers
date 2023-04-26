const db = require("../database/models/index");
const Session = db.Session;
const SessionHistory = db.SessionHistory;
const Op = db.Sequelize.Op;

async function createSessionWithHistory(sessionData, user_id) {
  let result;

  try {
    const session = await Session.create({
      ...sessionData,
      SessionHistories: [{
        user_id: user_id,
        attendance_at: new Date(),
        is_supporter_dj: false,
        is_supporter_car: false,
        is_supporter_welcome: false,
      }]
    }, {
      include: [SessionHistory]
    }); // create session and its associated session history

    result = { session };
  } catch (error) {
    throw error;
  }
  return result;
}


module.exports = Object.freeze({
  postSession: async (httpRequest) => {
    const sessionData = httpRequest.body.session;
    const user_id = httpRequest.body.user_id;
    const result = await createSessionWithHistory(sessionData, user_id);
    return result.session;
  },
  getSessionDetail: async (httpRequest) => {
    console.log(httpRequest.method, httpRequest.path)
    const session_id = httpRequest.params.session_id;
    try {
      const sessionData = await Session.findByPk(session_id, {
        include: [
          {
            model: db.User,
            as: 'User',
            attributes: ['user_id', 'user_name', 'phone']
          },
          {
            model: db.SessionHistory,
            as: "SessionHistory",
            include: [{
              model: db.User,
              as: 'User',
              attributes: ['user_id', 'user_name', 'phone']
            }]
          }
        ]
      });
      // sessionData.attendee = sessionData.SessionHistory;
      // delete sessionData.SessionHistory;
      // if (sessionData.attendee) {
      //   sessionData.attendee = sessionData.SessionHistory;
      //   delete sessionData.SessionHistory;

      //   sessionData.attendee.forEach(person => {
      //     person.user_name = person.User.user_name;
      //     delete person.User;
      //   });
      // }
      return sessionData;
    } catch (err) {
      throw err;
    }
  },
  getSessionsByAttribute: async (httpRequest) => {
    console.log(httpRequest.query)
    const { name, location, user_id, description, launch_date, application_fee, start_date, end_date } = httpRequest.query;
    const condition = {};

    if (name) {
      condition.name = { [Op.like]: `%${name}%` };
    }

    if (location) {
      condition.location = { [Op.like]: `%${location}%` };
    }

    if (user_id) {
      condition.user_id = user_id;
    }

    if (description) {
      condition.description = { [Op.like]: `%${description}%` };
    }


    if (launch_date) {
      condition.launch_date = { [Op.eq]: launch_date };
    }

    if (start_date && end_date) {
      condition.launch_date = {
        [Op.gt]: start_date + ' 00:00:00',
        [Op.lt]: end_date + ' 23:59:59'
      };
    }

    if (application_fee) {
      condition.application_fee = { [Op.eq]: application_fee };
    }

    try {
      const sessions = await Session.findAll({ raw: true, where: condition })
      return sessions;
    } catch (err) {
      throw err;
    }
  }
});