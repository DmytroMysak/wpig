// version 0.4.3
// TODO Зробити автопереклад
'use strict';

const ReadlineSync = require('readline-sync');
const Rp = require('request-promise');
const Data = require('./data');
const functional = require('./functional').functional;
const fs = require('fs');

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
  args.splice(start, end - start);
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
    .then(res => (res.toString() === '-1') ? '-1' : Rp({ method: 'POST', uri: Data.state.say, body: Data.state.body, json: true }))
    .then(res => {
      if (res.toString() === '-1') return;
      console.log(res);
      fs.appendFile(
            `${__dirname}/log`,
            `${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}-->${Data.state.body.text};\n`,
            (err) => { if (err)  throw err; }
          )
    })
    .catch(err => error(err));
