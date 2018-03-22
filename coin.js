var pair = {
    'BTC-USD' : 'bittrex',
    'XTL-BTC' : 'crex24',
    'CREP-BTC' : 'crex24',
    'BBS-BTC' : 'crex24',
    'IPBC-BTC' : 'crex24',
    'BKC-BTC' : 'cryptohub',
    'PLURA-BTC' : 'tradeorge',
    'RTO-BTC' : 'octaex',
    'QWC-BTC' : 'octaex',
    'SUM-BTC' : 'octaex'
}

module.exports = {
    Pair : function()
    {
        return pair;
    }
}
