const { Logger } = require("./Logger");
const args = process.argv.slice(2);
const [dir] = args;
module.exports.validateArguments = function validateArguments() {
  if (!dir) {
    Logger.error(
      "Please provide a path to the directory you want to create your server in."
    );
    Logger.info("Usage: create-flying-squid path");
    process.exit(1);
  }
};
