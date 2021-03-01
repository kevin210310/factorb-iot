const moment = require('moment');

function formatMessage(username, text, nodo) {
  return {
    username,
    text,
    nodo,
    time: moment().format('HH:mm:ss')
  };
}

module.exports = formatMessage;