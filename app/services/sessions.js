const db = require("../database/models/index");
const Session = db.Session;
const SessionHistory = db.SessionHistory;
const Op = db.Sequelize.Op;

async function createSessionWithHistory(sessionData, user_id) {
  let result;
  try {
    const session = await Session.create({
      ...sessionData,
      user_id: user_id,
      SessionHistory: [{
        user_id: user_id,
        is_supporter_dj: false,
        is_supporter_car: false,
        is_supporter_welcome: false
      }]
    }, {
      include: [{
        model: SessionHistory,
        as: "SessionHistory"
      }]
    }); // create session and its associated session history
    result = { session };

  } catch (err) {
    console.error(err)
    throw err;
  }
  return result;
}


module.exports = Object.freeze({
  postSession: async (httpRequest) => {
    console.log(httpRequest.session.kakao)
    console.log(httpRequest.method, httpRequest.path, httpRequest.headers.userid);
    const sessionData = httpRequest.body;
    const user_id = httpRequest.headers.userid;
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
      const attendees = sessionData.SessionHistory.map((attendee) => {
        return {
          attendance_at: attendee.attendance_at ? new Date(attendee.attendance_at).toLocaleString() : null,
          is_supporter_welcome: attendee.is_supporter_welcome,
          is_supporter_dj: attendee.is_supporter_dj,
          is_supporter_car: attendee.is_supporter_car,
          user_name: attendee.User.user_name,
          user_id: attendee.User.user_id,
          phone: attendee.User.phone
        }
      });

      const supporters_dj = attendees.filter(attendee => attendee.is_supporter_dj);
      const supporters_car = attendees.filter(attendee => attendee.is_supporter_car);
      const supporters_welcome = attendees.filter(attendee => attendee.is_supporter_welcome);

      let result = { 
        session_id : sessionData.session_id,
        user_name : sessionData.User.user_name,
        phone : sessionData.User.phone,
        imageUrl : sessionData.imageUrl,
        session_name : sessionData.name,
        description : sessionData.description,
        location : sessionData.location,
        launch_date : new Date(sessionData.launch_date).toLocaleString(),
        application_fee : sessionData.application_fee,
        total_attendee_count : (sessionData.SessionHistory.length > 0 ? sessionData.SessionHistory.length : 0),
        max_attendee_count : sessionData.max_attendee_count ? sessionData.max_attendee_count  : null,
        attendees : attendees,
        supporters_dj : supporters_dj,
        supporters_car : supporters_car,
        supporters_welcome : supporters_welcome
       };
       
      return result;
    } catch (err) {
      console.error(err)
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
  },
  applySession: async (httpRequest) => {
    try {
      const session_id = httpRequest.params.session_id;
      const user_id = httpRequest.headers.userid;
      const attendee = await SessionHistory.create({session_id, user_id})
      return attendee;
    } catch (err) {
      throw err;
    }
  },
  recordAttendance: async (httpRequest) => {
    try {
      const session_id = httpRequest.params.session_id;
      const user_id = httpRequest.params.user_id;
      const attendanceTime = new Date().toISOString();
      await SessionHistory.update(
        { attendance_at: attendanceTime },
        { where: { session_id, user_id } }
      );
      return { success: true };
    } catch (err) {
      throw err;
    }
  },
  applyDailySupporter: async (httpRequest) => {
    try {
      const session_id = httpRequest.params.session_id;
      const user_id = httpRequest.params.user_id;
      const supporter_type = httpRequest.query.supporter_type;
      let updateObj = {};
  
      // set the corresponding supporter type column based on the query parameter
      switch (supporter_type) {
        case 'dj':
          updateObj.is_supporter_dj = true;
          break;
        case 'car':
          updateObj.is_supporter_car = true;
          break;
        case 'welcome':
          updateObj.is_supporter_welcome = true;
          break;
        default:
          throw new Error('Invalid supporter type');
      }
  
      const supporter = await SessionHistory.update(
        updateObj,
        { where: { session_id, user_id } }
      );
      return { success: true };
    } catch (err) {
      throw err;
    }
  },  
});
/*
curl -X 'PUT' \ 
  'http://localhost:3000/sessions/8/supporters/2' \
  -H 'accept: application/json'  
{"success":true,"code":200,"data":{"success":true}}%  
*/