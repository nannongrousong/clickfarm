const util = require('./util');

let count = 0;
let usefulIp = [];


util.getProxyList2().then((ipList) => {
    let index = 0;
    let clockID = setInterval(() => {
        if (index < ipList.length) {
            const [ip, port] = ipList[index];
            index++;
            util.httpRequestProxy(`http://${ip}:${port}`, 'http://www.ifeng.com').then(() => {
                usefulIp.push(ipList[index]);
                console.log(`成功咯 代理信息:${ip}:${port}`);
                console.log('成功次数', ++count);
            }, (err) => {
                console.log(`失败咯 代理信息:${ip}:${port}`);
            })
        } else {
            index = 0;
            ipList.length = 0;
            ipList = usefulIp.slice();

            if (ipList.length < 3) {
                window.clearInterval(clockID);
            }
        }
    }, 5000)
});