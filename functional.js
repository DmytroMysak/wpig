const Translate = require('google-translate-api');
const Rp = require('request-promise');
const Data = require('./data');

const listTranslatedLanguages = () => {
  for (let key in Data.languages) {
    if (!Data.languages.hasOwnProperty(key)) continue;
    console.log(`${Data.languages[key]}: ${key}`);
  }
  return -1;
};
const listLanguages = () => {
  return Rp({ uri: Data.state.voices, json: true })
      .then(voices => {
        console.log('Languages:');
        let language = voices.Voices.filter((el,i,arr)=>arr.findIndex((t)=>t.LanguageCode===el.LanguageCode)===i);
        language = language.sort((a,b)=>(a.LanguageCode>b.LanguageCode)?1:((b.LanguageCode>a.LanguageCode)?-1:0));
        for (let i = 0; i < language.length; ++i) {
          console.log(`${language[i].LanguageCode} - ${language[i].LanguageName}`);
        }
        return -1;
      })
};
const listNames = () => {
  return Rp({ uri: Data.state.voices, json: true })
      .then(voices => {
        const names =
            voices.Voices.sort((a,b)=>(a.LanguageCode>b.LanguageCode)?1:((b.LanguageCode>a.LanguageCode)?-1:0));
        for (let i = 0; i < names.length; ++i) {
          if (i === 0 || names[i].LanguageName !== names[i - 1].LanguageName) {
            console.log(`\nLanguage: ${names[i].LanguageName}`)
          }
          console.log(`\tName: ${names[i].Name} Gender: ${names[i].Gender}`);
        }
        return -1;
      })
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
  if (language === 'list') return listTranslatedLanguages();
  return Translate(Data.state.body.text, {to: language})
      .then(res => Data.state.body.text = res.text);
};
const text = (text) => {
  Data.state.body.text = text;
};
const language = (language) => {
  if (language === 'list') return listLanguages();
  Data.state.body.language = language;
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
