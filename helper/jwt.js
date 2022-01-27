const expressJwt = require('express-jwt');

function authJwt(){
    return expressJwt({
        secret:'secret',
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url:/(.*)/},
        ]
    })
}
async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true) 
    }
    done()
}

module.exports = authJwt;