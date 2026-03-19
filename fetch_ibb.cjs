const https = require('https');

https.get('https://ibb.co/d4s04nND', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    if (match) {
      console.log(match[1]);
    } else {
      console.log("Not found");
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
