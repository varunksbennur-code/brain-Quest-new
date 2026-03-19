const https = require('https');

https.get('https://www.keevx.com/share/KEXQ2GF54L6P', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    if (match) {
      console.log(match[1]);
    } else {
      const imgMatch = data.match(/<img[^>]+src="([^"]+)"/g);
      console.log(imgMatch);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});