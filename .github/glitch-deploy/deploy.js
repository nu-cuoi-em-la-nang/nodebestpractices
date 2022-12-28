const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/solstice-sulky-liquid|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/ruby-victorious-pufferfish|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/beautiful-chipped-periodical|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/wise-petal-wilderness|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/harvest-tungsten-spur|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/sunrise-sleet-tithonia|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/numerous-eggplant-school|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/silly-freezing-achillobator|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/lateral-peridot-feta|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/daily-yummy-coyote|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/almond-glowing-albertosaurus|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/brash-climbing-textbook|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/giant-wary-mollusk|https://e5070807-a2a7-41e6-9a9e-394ac59c3d3d@api.glitch.com/git/inexpensive-impartial-condition`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();