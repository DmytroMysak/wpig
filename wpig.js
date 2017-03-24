// version 0.4.2
// TODO Зробити автопереклад
'use strict';

const ReadlineSync = require('readline-sync');
const Rp = require('request-promise');
const Data = require('./data');
const functional = require('./functional').functional;
const fs = require('fs');

const httpPost = (body) => {
  const options = {
    method: 'POST',
    uri: 'http://192.168.0.60:3005/say',
    body: body,
    json: true
  };
  return Rp(options);
};
const error = (msg) => {
  console.error(msg);
  process.exit();
};
let args = process.argv.slice(2);

if (args.includes('-s')) {
  const start = args.indexOf('-s');
  let end = start + 1;
  let text = '';
  while (args[end] && !functional.has(args[end])) {
    text += args[end++] + ' ';
  }
  args.splice(start, end);
  args = ['-s', text, ...args];
} else if (!args.includes('list')) {
  Data.state.body.text = ReadlineSync.question('Enter text: ');
}

const all = [];
for (let i = 0; i < args.length; ++i) {
  if (functional.has(args[i])) {
    all.push(functional.get(args[i])(`${args[++i]}`));
  } else {
    error(`bad argument ${args[i]}`);
  }
}

Promise.all(all)
    .then(() => Rp({ method: 'POST', uri: 'http://192.168.0.60:3005/say', body: Data.state.body, json: true }))
    .then(res => {
      console.log(res);
      fs.appendFile(
            `${__dirname}/log`,
            `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}-->${Data.state.body.text};\n`,
            (err) => { if (err)  throw err; }
          )
    })
    .catch(err => error(err));
