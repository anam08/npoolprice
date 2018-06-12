var prices = {};

module.exports =
{
    handlecrex24 : function (pair, response)
    {
        pair = pair.replace('-', '_');
        var spair = pair.split('_');
        
        var https = require('https');
        https.get('https://api.crex24.com/CryptoExchangeService/BotPublic/ReturnTicker?request=[NamePairs='+spair[1]+'_'+spair[0]+']', function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(respData.Tickers.length==0)
                {
                    response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({error: respData.Error}));
                return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            if(respData.error)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({error: true}));
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: longnumberstring(respData.Tickers[0].Last),
                    market: 'https://crex24.com/exchange/'+spair[0]+'-'+spair[1]
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    
    handlecryptohub : function (pair, response)
    {
        pair = pair.replace('-', '_');
        var spair = pair.split('_');
        
        var https = require('https');
        https.get('https://cryptohub.online/api/market/ticker/'+spair[0]+'/', function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(typeof(respData[spair[1]+'_'+spair[0]])=='undefined')
                {
                    response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({error: respData.Error}));
                return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: longnumberstring(respData[spair[1]+'_'+spair[0]].last),
                    market: 'https://cryptohub.online/market/'+spair[0]+'/'
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    
    handletradeorge : function (pair, response)
    {
        pair = pair.replace('-', '_');
        var spair = pair.split('_');
        
        var https = require('https');
        https.get('https://tradeogre.com/api/v1/ticker/'+spair[1]+'-'+spair[0], function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(respData.error)
                {
                    response.writeHead(404, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({error: respData.message}));
                    return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: respData.price,
                    market: 'https://tradeogre.com/exchange/'+spair[1]+'-'+spair[0]
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    
    handleoctaex : function (pair, response)
    {
        pair = pair.replace('-', '_');
        var spair = pair.split('_');
        
        var https = require('https');
        https.get('https://octaex.com/api/trade/ticker?market='+pair.toLowerCase(), function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(respData.err)
                {
                    response.writeHead(404, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({error: "Pair not found at the market"}));
                    return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: respData.new_price,
                    market: 'https://octaex.com/trade/index/market/'+pair.toLowerCase()
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    handlebittrex : function (pair, response)
    {
        var spair = pair.split('-');
        
        if(spair[0]=='USD')
        {
            spair[0] = 'USDT';
        }
        
        if(spair[1]=='USD')
        {
            spair[1] = 'USDT';
        }
        
        var https = require('https');
        https.get('https://bittrex.com/api/v1.1/public/getticker?market='+spair[1]+'-'+spair[0], function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(!respData.success)
                {
                    response.writeHead(404, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({error: respData.message}));
                    return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: respData.result.Last,
                    market: 'https://bittrex.com/Market/Index?MarketName='+spair[1]+'-'+spair[0]
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    handlealtex : function (pair, response)
    {
        pair = pair.replace('-', '_');
        var spair = pair.split('_');
        
        var https = require('https');
        https.get('https://api.altex.exchange/v1/marketHistory/market/'+spair[1]+'_'+spair[0], function(resp) {
        var data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', function(chunk)  {
            data += chunk;
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', function() {
            
            var respData;
            try{
                respData = JSON.parse(data);
                if(!respData.success)
                {
                    response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({error: respData.message}));
                return;
                }
            }
            catch(e)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*'
                });
                response.end('null');
                console.log("JSON.parse Error: " + e.toString());
                return;
            }
            
            if(respData.error)
            {
                response.writeHead(404, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({error: true}));
                return;
            }
            
            var resp = {
                error: null,
                timestamp : Math.round(Date.now()/1000),
                success: true,
                ticker: {
                    base: spair[0],
                    target: spair[1],
                    price: respData.data[0].price,
                    market: 'https://altex.exchange/register&ref=78'
                }
            };
            
            writeResp(response, resp, spair[0]+'-'+spair[1]);
        });
         
        }).on("error", function(err) {
            response.writeHead(404, {
                'Access-Control-Allow-Origin': '*'
            });
            response.end('null');
    
            console.log("https.get Error: " + err.message);
        });
    },
    getPrice: function(pair){
        return prices[pair]?prices[pair]:false;
    }
}

function writeResp(resp, data, pair){
    prices[pair] = data;
    respJSON = JSON.stringify(data);
    resp.writeHead("200", {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Content-Length': respJSON.length
    });
    resp.end(respJSON);
}

function longnumberstring(n){
    var str, str2= '', data= n.toExponential().replace('.','').split(/e/i);
    str= data[0], mag= Number(data[1]);
    if(mag>=0 && str.length> mag){
        mag+=1;
        return str.substring(0, mag)+'.'+str.substring(mag);            
    }
    if(mag<0){
        while(++mag) str2+= '0';
        return '0.'+str2+str;
    }
    mag= (mag-str.length)+1;
    while(mag> str2.length){
        str2+= '0';
    }
    return str+str2;
}
