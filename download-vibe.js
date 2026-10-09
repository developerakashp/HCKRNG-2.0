const https = require('https');
const fs = require('fs');

const urls = [
  "https://images.pexels.com/photos/1036855/pexels-photo-1036855.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800", 
  "https://images.pexels.com/photos/317377/pexels-photo-317377.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=800"
];

async function download(url, filename) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      console.log(`${filename}: ${res.statusCode}`);
      if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          const file = fs.createWriteStream(filename);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
      } else {
        resolve();
      }
    }).on('error', (e) => {
      console.log(`${filename}: error ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (let i = 0; i < urls.length; i++) {
    await download(urls[i], `public/images/vibe${i+1}.jpg`);
  }
}

run();
