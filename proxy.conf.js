const vantageLoginProxyConfig = require('./src/lib/auth/config/vantageLoginProxyConfig');

/* * * * * * * * * * * */
/* Edit these variables to point to your */
/* Vantage and local development environments */
/* * * * * * * * * * * */

const serverUrl = 'https://appcenter.ux.ac.uda.io/'; // REPLACE WITH VANTAGE BASE URL
const localUrl = "localhost:4200";
const localProto = "http"; // http or https

/* * * * * * * * * * * */
/* This section contains the routes proxied through */
/* your local development environment and the Vantage deployment */
/* * * * * * * * * * * */

const PROXY_CONFIG = {
  ...vantageLoginProxyConfig({ serverUrl, localUrl, localProto }),
  '/api': {
    target: serverUrl,
    secure: false,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
