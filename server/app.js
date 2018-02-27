const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const newTime = "";
app.use(bodyParser.json());
app.use((req, res, next) => {
    // write your logging code here  
    const newTime = new Date().toISOString();
    const logLine = req.headers['user-agent'].replace(/,/g, '') + ',' + newTime + ',' + req.method
        + ',' + req.originalUrl + ',' + ('HTTP/' + req.httpVersion) + ',' + res.statusCode;

        
    fs.appendFile('log.csv',
         '\n' + logLine, function (err) {
            if (err) throw err;
    });
    console.log(logLine);
    next();
});


app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.end("ok");
});


app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    const arrayJson =[];

    fs.readFile('log.csv', 'utf8', function (err, data) {
        if (err) throw err;
        var linesArray = data.split('\n');
        linesArray.shift();
        linesArray.forEach(function (IgLine) {
        var value = IgLine.split(',');
        var dataArray = {
            'Agent': value[0],
            'Time': value[1],
            'Method': value[2],
            'Resource': value[3],
            'Version': value[4],
            'Status': value[5]
        };
        arrayJson.push(dataArray);  
    });    
        res.json(arrayJson);
    });
});

module.exports = app;