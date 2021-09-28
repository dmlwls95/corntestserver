// DB.js
const mongoose = require('mongoose');

module.exports = () => {
    function connect() {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/korntest',{ useNewUrlParser: true}, function(err){
            if(err) {
                console.error('mongodb connection err', err);
            }
            console.log('mongodb connected');
        });
    }
    connect();
    mongoose.connection.on('disconnected', connect);
    require('./models/Admin.js');
    require('./models/user.js');
 };