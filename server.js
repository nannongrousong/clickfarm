const http = require('http');
let count = 0;
const server = http.createServer((req, res) => {
    console.log('用户IP:', getClientIP(req));
    console.log('访问次数', ++count);
    res.end();
})

const getClientIP = (req) => {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip;
};

server.listen(9999);

server.on('error', (e) => {
    console.log(e);
});
