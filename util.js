const httpProxyAgent = require('http-proxy-agent');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const httpRequest = (url) => {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            },
            encoding: null
        }, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(body)
            } else {
                reject(err);
            }
        });
    });
}

const httpRequestProxy = (proxyUrl, acceptUrl) => (
    new Promise((resolve, reject) => {
        const agent = new httpProxyAgent(proxyUrl);
        request({
            uri: acceptUrl,
            method: "GET",
            agent: agent,
            timeout: 10000,
            pool: { maxSockets: 100 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body)
            }
        })
    })
)

const getProxyList2 = async () => {
    let ipList = [];

    for (let page = 1; page <= 4; page++) {
        let buf = await httpRequest(`http://www.xicidaili.com/nn/${page}`);
        let bodyStr = iconv.decode(buf, 'utf-8');
        let $ = cheerio.load(bodyStr);

        let rows = $('#ip_list tbody tr');

        rows.each((index, row) => {
            if (index > 0) {
                let qRow = $(row);
                let ip = qRow.find('td').eq(1).text();
                let port = qRow.find('td').eq(2).text();
                let http = qRow.find('td').eq(5).text().toLowerCase() == 'http';
                let fast = qRow.find('td').eq(6).find('div.fast').length > 0;
                if (http && fast) {
                    ipList.push([ip, port]);
                }
            }
        })
    }
    return ipList;
}

const sleep = (time) => (new Promise((resolve, reject) => {
    setTimeout(resolve, time);
}))

const getProxyList = async () => {
    let ipList = [];

    for (let page = 1; page <= 5; page++) {
        await sleep(5000);
        let buf = await httpRequest(`https://www.kuaidaili.com/free/inha/${page}/`);
        let bodyStr = iconv.decode(buf, 'utf-8');
        let $ = cheerio.load(bodyStr);

        let rows = $('#list table tbody tr');

        rows.each((index, row) => {
            let qRow = $(row);
            let ip = qRow.find('td').eq(0).text();
            let port = qRow.find('td').eq(1).text();
            let http = qRow.find('td').eq(3).text().toLowerCase().includes('http');
            if (http) {
                ipList.push([ip, port]);
            }
        })
    }

    return ipList;
}

module.exports = {
    httpRequest,
    httpRequestProxy,
    getProxyList,
    getProxyList2

}