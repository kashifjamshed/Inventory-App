//middleware function to get date in given format

const moment = require("moment");
function requestDate(req, res, next) {
  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const fullDate = moment().format("Do MMMM YYYY");
  
  req.date = new Date().tostring;
  next();
}
module.exports = requestDate;
