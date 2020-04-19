const download = require("download-git-repo");
module.exports.download = function downloadGitRepo(repo, path) {
  return new Promise((resolve, reject) => {
    download(repo, path, { clone: false }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
