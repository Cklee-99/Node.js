// This is a Node.js server with Express.js
const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync('./views/overview/overview.html', 'utf-8');
const tempCard = fs.readFileSync('./views/card/card.html', 'utf-8');
const tempProduct = fs.readFileSync('./views/product/product.html', 'utf-8');
const tempError = fs.readFileSync('./views/error/error.html', 'utf-8');

const data = fs.readFileSync('./models/data.json', 'utf-8');
const dataObject = JSON.parse(data)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }
    else if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObject.map(element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }
    else if (pathname === '/product') {
        let product = dataObject[query.id]
        let output = replaceTemplate(tempProduct, product);

        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end(output);
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end(tempError);
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening on 8000...");
});