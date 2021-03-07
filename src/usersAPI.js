const https = require('https');

option = (path, method = 'GET', bodyLength = 0) => {
    if (method === 'GET' || method === 'get') {
        return {
            hostname: 'web-nang-cao.herokuapp.com',
            path: path,
            port: 443,
            method: method
        }
    }
    else if (method === 'POST' || method === 'post') {
        return {
            hostname: 'web-nang-cao.herokuapp.com',
            path: path,
            port: 443,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': bodyLength
            }
        }
    }
    else if (method === 'DELETE' || method === 'delete') {
        return {
            hostname: 'web-nang-cao.herokuapp.com',
            path: path,
            port: 443,
            method: method,
        }
    }
    else {
        return undefined;
    }
}

resolvePromise = (path, method = 'GET', body = '') => {
    return new Promise((resolve, reject) => {
        let request = https.request(option(path, method, Buffer.byteLength(JSON.stringify(body))), res => {
            try {
                let body = '';
                res.on('data', data => {
                    body += data.toString();
                });

                res.on('end', () => {
                    body = JSON.parse(body);
                    resolve(body);
                })
            } catch (error) {
                reject(error);
            }
        });
        request.on('error', (e) => {
            reject(e.message);
        });
        if (method === 'POST' || method === 'post') {
            request.write(JSON.stringify(body));
        }
        request.end();
    })    
}

exports.getUsers = () => resolvePromise('/lab5/users');

exports.getUserById = id => resolvePromise(`/lab5/users/${id}`);

exports.addUser = user => resolvePromise('/lab5/users', 'post', user);

exports.deleteUser = idObj => resolvePromise(`/lab5/users/${idObj.id}`, 'delete', idObj);