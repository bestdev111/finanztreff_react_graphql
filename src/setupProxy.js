const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/graphql',
        createProxyMiddleware({
            target: 'https://ftreff-test.ftreff-t01.devalex.consulting/',
            // target: 'http://localhost:8080/',
            changeOrigin: true,
            ws: true
        })
    );
    app.use(
        '/websocket',
        createProxyMiddleware({
            target: 'https://ftreff-test.ftreff-t01.devalex.consulting//',
            // target: 'http://localhost:8080/',
            changeOrigin: true,
            ws: true
        })
    );
    app.use(
        '/keycloak.json',
        createProxyMiddleware({
            target: 'https://ftreff-test.ftreff-t01.devalex.consulting//',
            changeOrigin: true,
        })
    );

};
