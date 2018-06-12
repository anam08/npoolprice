var http = require('http');
var https = require('https');
var url = require('url');
var allowedOrigin = 'npool.pw';
const port = process.env.PORT || 9026;

var coin = require('./coin.js');
var pair = coin.Pair();

var server = http.createServer(function(request, response)
{
    if(typeof(request.headers.origin)!='undefined')
    {
        if(request.headers.origin.indexOf(allowedOrigin)==-1)
        {
            response.writeHead("204", "No Content", {
                "access-control-allow-origin": '*',
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                "access-control-allow-headers": "content-type, accept",
                "access-control-max-age": 10, // Seconds.
                "content-length": 0
            });
            
            return(response.end());
        }
    }
    
    if (request.method.toUpperCase() === "OPTIONS")
    {
        response.writeHead("204", "No Content", {
            "access-control-allow-origin": '*',
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10, // Seconds.
            "content-length": 0
        });
        
        return(response.end());
    }
    
    var urlParts = url.parse(request.url, true);
    var pairPart = (urlParts.pathname).replace('/', '');
    if(typeof(pair[pairPart])!='undefined')
    {
        var market = require('./lib/market.js');
        var price = market['getPrice'](pairPart);
        
        if(price && price['timestamp']<=Math.round(Date.now()/1000)+300)
        {
            respJSON = JSON.stringify(price);
            response.writeHead("200", {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Content-Length': respJSON.length
                });
            response.end(respJSON);
        }
        else
        {
            var func = 'handle'+pair[pairPart];
            market[func](pairPart, response);
        }
    }
    else
    {
        response.writeHead(404, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify({error: 'Invalid pair call'}));
    }
});

server.listen(port, function(err){
    if (err)
    {
        return console.log('something bad happened', err);
    }
    
    console.log('server is listening on '+port);
});
