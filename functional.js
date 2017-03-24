const Translate = require('google-translate-api');
const Rp = require('request-promise');
const Data = require('./data');

const httpGet = () => {
  const options = {
    uri: 'http://192.168.0.60:3005/voices',
    json: true
  };
  return Rp(options);
};
const listLanguages = () => {
  for (let key in Data.languages) {
    if (!Data.languages.hasOwnProperty(key)) continue;
    console.log(`${Data.languages[key]}: ${key}`);
  }
  process.exit();
};
const listNames = () => {
  httpGet().then(names => console.log(names));
  process.exit();
};
const repeat = (count) => {
  count = parseInt(count, 10);
  if (typeof count !== 'number') throw `bad value after -r argument: ${count}`;
  const text = Data.state.body.text;
  for (let i = 1; i < count; ++i) {
    Data.state.body.text += ' ' + text;
  }
};
const translate = (language) => {
  if (language === 'list') return listLanguages();
  return Translate(Data.state.body.text, {to: language})
      .then(res => Data.state.body.text = res.text);
};
const text = (text) => {
  Data.state.body.text = text;
};
const language = (language) => {
  if (language === 'list') return listLanguages();
  Data.state.body.language = `${language}-${language.toUpperCase()}`;
};
const name = (name) => {
  if (name === 'list') return listNames();
  Data.state.body.language = ``;
  Data.state.body.name = `${name}`;
};

const functional = new Map();
functional.set('-r', repeat);
functional.set('-t', translate);
functional.set('-s', text);
functional.set('-l', language);
functional.set('-n', name);

exports.functional = functional;