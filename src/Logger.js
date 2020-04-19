const logSymbols = require("log-symbols");

module.exports.Logger = class Logger {
  constructor() {}

  static info(message) {
    return console.log(logSymbols.info, message);
  }
  static success(message) {
    return console.log(logSymbols.success, message);
  }
  static warn(message) {
    return console.log(logSymbols.warning, message);
  }
  static error(message) {
    return console.log(logSymbols.error, message);
  }
};
