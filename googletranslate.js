const axios = require('axios');
async function translation(input, lang='hi') {

  // 'hi','bn','gu','kn','ml','mr'
  let headers = {
    headers : {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ya29.c.El-PBXEbpnmEKhFA1I96C-293AnYEn8cZ1zG6GNmHhy-cQIgbLPNOmkQddqUW1h9MWrWG1iFqcNJWlQXqeNgXNICqLdFSJMQ4AXV8bi9GYHyBmeeuzFspg54dIUD4NMpFw'
    }
  };
  let data = {
    q: input,
    source: lang,
    target: 'en',
    format: 'text'
  };
  
  var translatedText = ''

  try {
    let response = await axios.post('https://translation.googleapis.com/language/translate/v2', data, headers)
    return response.data.data.translations[0].translatedText
  } catch (e) {
    console.error('some error in translate')
  }
    // .then((response) => {
    //   ttext = response.data.data.translations[0].translatedText
    //   // console.log(response.data.data)
    //   translatedText = ttext
    //   return ttext
    // })
    // .catch((error) => {
    //   // console.log(error)
    //   console.log('some error here')
    // })
}



module.exports = {
  translation
}

if (require.main === module) {

  async function _inner() {
    console.log(await translation('हिन्दी में टाइप करें'))
  }
  _inner();

}
