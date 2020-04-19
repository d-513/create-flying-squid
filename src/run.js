const { exec } = require("child_process");

module.exports = function run(cmd, opts) {
  return new Promise((resolve) => {
    exec(cmd, opts, (error, stdout) => {
      resolve(stdout);
    });
  });
};
