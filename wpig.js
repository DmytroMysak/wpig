// version 0.3
// TODO Покращити вивід ім'я чувака
// TODO Покращити вивід мови для перекладу
// TODO Можна вибирати мову з якої перекласти
// TODO Логування
'use strict';
const Translate = require('google-translate-api');
const ReadlineSync = require('readline-sync');
const Rp = require('request-promise');
const data = require('./data');

let state = {
  body: {
    name: '',
    language: 'ru-RU',
    text: ''
  }
};

const httpPost = (body) => {
  const options = {
    method: 'POST',
    uri: 'http://192.168.0.60:3005/say',
    body: body,
    json: true
  };
  return Rp(options);
};
const httpGet = () => {
  const options = {
    uri: 'http://192.168.0.60:3005/voices',
    json: true
  };
  return Rp(options);
};
const error = (msg) => {
  console.error(msg);
  process.exit();
};
const listLanguages = () => {
  for (let key in data.languages) {
    if (!data.languages.hasOwnProperty(key)) continue;
    console.log(`${data.languages[key]}: ${key}`);
  }
  error('');
};
const listNames = () => {
  httpGet().then(names => console.log(names));
  error(' ');
};
const repeat = (count) => {
  count = parseInt(count, 10);
  if (typeof count !== 'number') error(`bad value after -r argument: ${count}`);
  const text = state.body.text;
  for (let i = 1; i < count; ++i) {
    state.body.text += ' ' + text;
  }
};
const translate = (language) => {
  if (language === 'list') return listLanguages();
  return Translate(state.body.text, {to: language})
      .then(res => state.body.text = res.text);
};
const text = (text) => {
  state.body.text = text;
};
const language = (language) => {
  state.body.language = `${language}-${language.toUpperCase()}`;
};
const name = (name) => {
  if (name === 'list') return listNames();
  state.body.language = ``;
  state.body.name = `${name}`;
};


const functional = new Map();
functional.set('-r', repeat);
functional.set('-t', translate);
functional.set('-s', text);
functional.set('-l', language);
functional.set('-n', name);

let args = process.argv.slice(2);

if (args.includes('-s')) {
  const start = args.indexOf('-s');
  let end = start + 1;
  let text = '';
  while (!functional.has(args[end])) {
    text += args[end++] + ' ';
  }
  args.splice(start, end);
  args = ['-s', text, ...args];
} else {
  state.body.text = ReadlineSync.question('Enter text: ');
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
    .then(()=> httpPost(state.body))
    .then(res => console.log(res))
    .catch(err => error(err));
