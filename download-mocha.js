const https = require('https');
const fs = require('fs');

const urls = [
  "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1596078841242-12f73dc697c6?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=500&q=80"
];

async function downloadFirstValid(urls) {
  for (const url of urls) {
    await new Promise((resolve) => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode === 200 || res.statusCode === 302) {
          console.log('Found valid:', url);
          const file = fs.createWriteStream("public/images/mocha.jpg");
          if (res.statusCode === 302) {
             https.get(res.headers.location, (res2) => {
                res2.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
             });
          } else {
             res.pipe(file);
             file.on('finish', () => { file.close(); resolve(); });
          }
        } else {
          resolve();
        }
      });
    });
    if (fs.existsSync("public/images/mocha.jpg")) return;
  }
}

downloadFirstValid(urls);
