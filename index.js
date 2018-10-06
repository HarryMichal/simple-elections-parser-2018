const xmlparser = require('xml2js');
const fetch = require('node-fetch');
const townCodes = ['585017', '583952'];

(async function main() {
  try {
    var data = await getData(1, townCodes[0]);
    outputData(1, data);
  }
  catch(err) {
    console.error(`Error: ${err}`);
  }
})()

function getData(option, townCode) {
  return new Promise((resolve, reject) => {
    let urls = [
      'https://www.volby.cz/pls/kv2018/vysledky',
      'https://www.volby.cz/pls/kv2018/vysledky_obec?cislo_obce='
    ]
    switch(option) {
      case 0:
        fetch(urls[option]).
          then(res => res.text()).
          then(raw => {
            xmlparser.parseString(raw, (err, data) => {
              if (err)
                reject(err);
              if (data)
                resolve(data);
            })
          })
        break;
      case 1:
        fetch(urls[1] + townCode).
          then(res => res.text()).
          then(raw => {
            xmlparser.parseString(raw, (err, data) => {
              if (err)
                reject(err);
              if (data)
                resolve(data)
            })
          })
      break;
    }
  })
}

function outputData(option, data) {
  switch(option) {
    case 0:
      console.log('Option 22')
      break;
    case 1:
      var townData = data.VYSLEDKY_OBEC.OBEC[0];
      var info = {
        town: townData.$.NAZEVZAST,
        members: townData.$.VOLENO_ZASTUP,
        finished: townData.$.JE_SPOCTENO,
        vysledek: townData.VYSLEDEK[0]
      }
      console.log(`Město: ${info.town}, Zastupitelů: ${info.members}, Spočítáno: ${info.finished}`);
      console.log('============================')
      console.log('1. Účast');
      var ucast = info.vysledek.UCAST[0].$;
      for (infoucast in ucast) {
        console.log(`${infoucast} = ${ucast[infoucast]}`);
      }

      console.log('2. Volební strany');
      console.log('============================');

      var strany = info.vysledek.VOLEBNI_STRANA
      var i = 1;

      for (index in strany) {
        var strana = strany[index].$;
        console.log('----------------------------');
        console.log(`${i}.${strana.NAZEV_STRANY}`);
        console.log('----------------------------');

        for (infostrana in strana) {
          console.log(`${infostrana} = ${strana[infostrana]}`);
        }
        i++;
      }
      break;
  }
}
