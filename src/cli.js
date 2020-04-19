#!/usr/bin/env node
require("./validateArguments").validateArguments();
const inquirer = require("inquirer");
const git = require("./git");
const path = require("path");
const fs = require("fs-extra");
const args = process.argv.slice(2);
const exec = require("./run");
const ora = require("ora");
const { dots } = require("cli-spinners");
const { Logger } = require("./Logger");

let [dir] = args;
async function main() {
  Logger.info("Thank you for using create-flying-squid");
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "version",
      message: "Which minecraft version do you want to use",
      choices: ["1.12.2", "1.8.9"],
    },

    {
      type: "confirm",
      name: "onlinemode",
      message: "Use online mode?",
    },
    {
      type: "checkbox",
      name: "plugins",
      message: "Which plugins do you want to use",
      choices: [
        "flying-squid-irc",
        "flying-squid-schematic",
        "flying-squid-modpe",
        "flying-squid-essentials",
        "squidcord",
      ],
    },
  ]);
  Logger.info("Setting up the server, please wait...");
  if (path.isAbsolute(dir)) {
    dir = path.normalize(dir);
  } else {
    dir = path.join(process.cwd(), dir);
  }
  let spinner = ora({
    text: `Downloading the server...`,
    spinner: dots,
    color: "blue",
  }).start();
  await git.download("github:dada513/flying-squid-template", dir);
  spinner.stop();
  Logger.success("Downloaded the server.");
  spinner = ora({
    text: `Installing modules...`,
    spinner: dots,
    color: "blue",
  }).start();
  await exec("npm install", {
    cwd: dir,
  });
  spinner.stop();
  Logger.success("Installed node modules");
  spinner = ora({
    text: `Installing plugins...`,
    spinner: dots,
    color: "blue",
  }).start();
  const promises = [];
  answers.plugins.forEach((plugin) => {
    promises.push(
      exec(`npm install ${plugin}`, {
        cwd: dir,
      })
    );
  });
  await Promise.all(promises);
  spinner.stop();
  Logger.success("Installed plugins.");
  const config = require(`${dir}/config/config.json`);
  config.version = answers.version;
  config["online-mode"] = answers.onlinemode;
  answers.plugins.forEach((plugin) => (config.plugins[plugin] = ""));
  if (answers.plugins.indexOf("flying-squid-modpe") > -1) config.modpe = true;
  await fs.writeFile(
    `${dir}/config/config.json`,
    JSON.stringify(config, null, 2),
    "utf8"
  );
  Logger.success("Server has been configured.");
  Logger.info("Setup complete, we recommend that you start the server now.");
  Logger.info("");
  Logger.info(`cd ${args[0]}`);
  Logger.info(`npm start`);
  Logger.info("");
  Logger.warn(
    "Keep in mind that you need to configure the plugins you have choosen for them to work properly."
  );
  Logger.info("The server's config is located in /config/config.json");
  process.exit(0);
}
main();
