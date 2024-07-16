const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', // correspondência de prefixo para redirecionar
        createProxyMiddleware({
            target: 'http://localhost:3001', // URL do backend de destino
            changeOrigin: true, // para mudar a origem do cabeçalho para o destino
            secure: false // opcionalmente, desative a verificação SSL
        })
    );
};
