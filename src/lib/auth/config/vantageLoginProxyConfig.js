function VantageLoginProxyConfig({ serverUrl, localUrl, localProto }) {
  return {
    '/start-login': {
      target: serverUrl,
      bypass: function(req, res, proxyOptions) {
        req.headers['X-Orig-Host'] = localUrl;
        req.headers['X-Orig-Proto'] = localProto;
      },
      pathRewrite: function(path) {
        return path.replace(/^(\/start-login)/, '') || '/';
      },
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
    },
  };
}
module.exports = VantageLoginProxyConfig;
