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


const listProject = `https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/florentine-inexpensive-clutch|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/reminiscent-dour-screwdriver|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/mixed-crawling-dog|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/snow-thread-vein|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/grove-rapid-rake|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/wandering-periodic-edge|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/pickle-organic-temperature|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/legend-sleet-tourmaline|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/sunset-grandiose-wandflower|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/chatter-amplified-yard|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/ballistic-tinted-acai|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/ubiquitous-gem-gateway|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/diagnostic-rain-enigmosaurus|https://86922282-d454-4bd9-b82c-2d309f05e027@api.glitch.com/git/fine-island-kite`.trim().split('|');

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