const colors = require('colors/safe');
const moment = require('moment');
const fs = require('fs');

const log = (name) => {
  // Init
  const dir = 'logs';
  // create logs folder if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  function logInfo(message) {
    // Write to console
    const level = colors.white('INFO');
    const timeStamp = moment().format('DD-MM-YYYY HH:mm:ss');
    const moduleName = colors.yellow(name);
    console.log(`[${moduleName}] ${timeStamp} [${level}]  ${message}`);

    // Write to file
    const fileName = `logs/${moment().format('YYYY-MM')}.txt`; // monthly logs
    const stream = fs.createWriteStream(fileName, { encoding: 'utf-8', flags: 'a' }); // flag a = append
    stream.once('open', () => {
      stream.write(`[${name}] ${timeStamp} [INFO]  ${message}\n`);
      // Important to close the stream when you're ready
      stream.end();
    });
  }

  function logError(message) {
    const level = colors.red('ERROR');
    const timeStamp = moment().format('DD-MM-YYYY HH:mm:ss');
    const moduleName = colors.yellow(name);
    console.log(`[${moduleName}] ${timeStamp} [${level}]  ${message}`);

    // Write to file
    const fileName = `logs/${moment().format('YYYY-MM')}.txt`; // monthly logs
    const stream = fs.createWriteStream(fileName, { encoding: 'utf-8', flags: 'a' }); // flag a = append
    stream.once('open', () => {
      stream.write(`[${name}] ${timeStamp} [ERROR]  ${message}\n`);
      // Important to close the stream when you're ready
      stream.end();
    });
  }

  return {
    info: logInfo,
    error: logError
  };
};

module.exports = log;
