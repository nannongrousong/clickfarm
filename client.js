const util = require('./util');

let count = 0;
let usefulIp = [];

util.getProxyList().then((ipList) => {
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

/*
let ipList = [
    ['60.183.3.63', '61202'],
    ['183.159.94.143', '18118'],
    ['183.167.217.152', '63000'],
    ['112.193.96.120', '61234'],
    ['220.191.102.95', '6666'],
    ['106.56.102.139', '8070']
]

let index = 0;
let clockID = setInterval(() => {
    if (index < ipList.length) {
        const [ip, port] = ipList[index];
        index++;
        console.log();
        util.httpRequestProxy(`http://${ip}:${port}`, 'http://www.baidu.com').then((xxx) => {
            debugger;
            console.log(`成功咯 代理信息:${ip}:${port}`);
            console.log('成功次数', ++count);
        }, (err) => {
            debugger;
            console.log(`失败咯 代理信息:${ip}:${port}`);
        })
    } else {
        clearInterval(clockID);
    }
}, 5000)

*/