const axios = require('axios');
async function translation(input, lang='hi') {

  // 'hi','bn','gu','kn','ml','mr'
  let headers = {
    headers : {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ya29.c.El-PBXRRLj2A2NIgO3UGj6fjk0ZW8rEh025djlwnXi6VS7wFExyyHVp21_kvFP5aTkLiXCdrj4FtF3H605cLJ9vrQ2cLd1VqIOQ9Pt61jfXFAPG3v0a6hp6ElvDg8LqsOQ'
    }
  };
  let data = {
    q: input,
    source: lang,
    target: 'en',
    format: 'text'
  };
  
  await axios.post('https://translation.googleapis.com/language/translate/v2', data, headers)
    .then((response) => {
      ttext = response.data.data.translations[0].translatedText
      console.log(response.data.data)
      return ttext
    })
    .catch((error) => {
      console.log(error)
    })
}


translation('हिन्दी में टाइप करें')

module.exports = {
  translation
}