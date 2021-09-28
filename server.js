let express = require('express');
const path = require('path');
const db = require('./DB.js');
const passport = require('passport');
const passportConfig = require('./config/passport');
const app = express();

var cors = require('cors');
var corsOptions = {
    origin:  'http://localhost:4200', // 이 주소가 ionic node.js 서버가 동작하는 주소
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: "Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, x-access-token"
};

app.options(/\.*/, cors(corsOptions), function(req, res) {
  return res.sendStatus(200);
});
app.all('*', cors(corsOptions), function(req, res, next) {
  next();
});
db();
app.use(express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.raw());
//************************************** passport */
app.use(passport.initialize());
passportConfig();
//************************************** passportend */

app.enable('trust proxy');
const port = process.env.PORT || 4000;

//************************************** routes */
const authRoutes = require('./routes/auth.route.js');
app.use('/auth', authRoutes);
//************************************** */
const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
