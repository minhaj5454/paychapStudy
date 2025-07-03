const sendSuccess = (res, statusCode, message, result = {}) => {
  return res.status(statusCode).send({
    response : "success",
    message,
    result,
  });
};
 
const sendError = (res, message) => {
  return res.status(400).send({
    response : "failed",
    message,
  });
};
 
module.exports = {
  sendSuccess,
  sendError,
};