const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.json());

function endsWith(str, subStr) {
  return str.indexOf(subStr) === str.length - subStr.length;
}

app.use((req, res, next) => {
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  res.set('Cross-Origin-Opener-Policy', 'same-origin');

  if (endsWith(req.url, '.js')) {
    res.contentType('application/javascript');
  }
  next();
  // res.sendFile(path.join(__dirname, 'build/'));
});

app.use(express.static(path.join(__dirname, 'build')));

// app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
