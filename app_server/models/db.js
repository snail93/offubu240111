const goo = require('mongoose');

const dbURI = 'mongodb://localhost/clive';
goo.connect(dbURI, { useNewUrlParser: true });
goo.connection.on('connected',()=> {console.log(`Mongoose Connected to ${dbURI}`)} );
goo.connection.on('error',(err)=> {console.log('Mongoose Connection error:',err)} );
goo.connection.on('disconnected',()=> {console.log('Mongoose Disconnected')} );

const rollOff = (msg, callback)=> {
    goo.connection.close()
        .then(()=> {
            console.log(`Mongoose Disconnected through ${msg}`);
            callback();
        })
}
process.once('SIGUSR2',()=> { rollOff('nodemon restart', ()=> { process.kill(process.pid, 'SIGUSR2'); }); });
process.on('SIGINT',()=> { rollOff('app termination', ()=> { process.exit(0); }); });
process.on('SIGTERM',()=> { rollOff('Heroku SIGTERM termination', ()=> { process.exit(0); }); });

require('./locations');
