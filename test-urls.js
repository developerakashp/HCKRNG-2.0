const https = require('https');

const urls = {
  "mocha_wiki1": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Caff%C3%A8_Mocha_by_Nate_Steiner.jpg/500px-Caff%C3%A8_Mocha_by_Nate_Steiner.jpg",
  "mocha_wiki2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Mocha_coffee.jpg/500px-Mocha_coffee.jpg",
  "mocha_wiki3": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Caffe_Mocha.jpg/500px-Caffe_Mocha.jpg"
};

async function testUrl(name, url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`${name}: ${res.statusCode}`);
      resolve();
    }).on('error', (e) => {
      console.log(`${name}: error ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(urls)) {
    await testUrl(name, url);
  }
}

run();
