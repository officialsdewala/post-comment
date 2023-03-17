const express = require('express');
const path = require('path')  //cjs //es
const passport = require('passport');

const swaggerUI = require('swagger-ui-express');
const resolve = require('json-refs').resolveRefs;

const swaggerDoc= require('./swagger/index.json')


resolve(swaggerDoc, {
    location:'./swagger/index.json'
}).then(function (results) {
    results.resolved
   //swagger ui
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(results.resolved))
});



// const options = {
//     definition:{
//         openapi: "3.0.0",
//         info: {
//             title:"Demo API",
//             version:"1.0.0",
//             description:"My first demo API."
//         },

    //     servers: [
    //         {
    //             url: `http://localhost:${process.env.PORT || 4000}`
    //         }
    //     ]
        
    // },
    // apis:[
    //     './routes/*.js'
    // ]
// }

// const swaggerSpecs = swaggerJsDoc(options);



require('dotenv').config();

const jwtStrategy = require('./middlewares/passpostJwtStrategy');

const app = express();

app.set('view engine', '.ejs');

///apps middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





///passport's middleware
passport.use("jwt", jwtStrategy);

///static contents
app.use('/public', express.static(path.join(__dirname, 'public')))


///linking routers
const router = require('./routes');

app.use('/', router)


module.exports = app;



