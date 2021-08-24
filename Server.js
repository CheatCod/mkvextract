var express = require('express');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const { startServer, createConfiguration, build } = require('snowpack');
var app = express();
const port = 3000;

// import c from './snowpack.config.mjs';
const config = createConfiguration({
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
});
let snowpackServer;

function endsWith(str, subStr) {
  return str.indexOf(subStr) === str.length - subStr.length;
}

app.get('*', async (req, res, next) => {
  console.log('got request', req.url);
  try {
    const buildResult = await snowpackServer.loadUrl(req.url);
    if (endsWith(req.url, '.js')) {
      res.contentType('application/javascript');
    }
    res.send(decoder.write(buildResult.contents));
  } catch (e) {
    next(e);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

async function startSnowpackServer() {
  snowpackServer = await startServer({ config });
}

startSnowpackServer();
