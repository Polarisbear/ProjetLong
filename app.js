var app = require ('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
fs = require('fs'),
http = require('http'),
record = require('node-record-lpcm16'),
lame = require('lame')

var file = fs.createWriteStream('test.flac', { encoding: 'binary' })

function RecordAudio(callback){
  record.start({
    sampleRate : 16000,
  }).pipe(file)
  console.log("début enregistrement")
  setTimeout(function () {
    record.stop()
  console.log("Fin enregistrement")
  }, 5000)

  if (typeof callback == "function")
		callback()
}


function GoogleSpeechWork(){
  const Speech = require('@google-cloud/speech');


  // Reconnaissance Vocale
  // Instantiates a client
  const speech = Speech();

  // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
  const filename = (__dirname + '/test.flac');

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  const languageCode = 'fr-FR';

  const request = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  };

  // Detects speech in the audio file
  speech.recognize(filename, request)
    .then((results) => {
      const transcription = results[0];

      console.log(`Transcription: ${transcription}`);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

RecordAudio();
setTimeout(GoogleSpeechWork,7000)




// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


// io.sockets.on('connection', function (socket, pseudo) {
//     // Quand un client se connecte, on lui envoie un message
//     socket.emit('message', 'Vous êtes bien connecté !');
//     // On signale aux autres clients qu'il y a un nouveau venu
//     socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');
//
//     // Dès qu'on nous donne un pseudo, on le stocke en variable de session
//     socket.on('petit_nouveau', function(pseudo) {
//         socket.pseudo = pseudo;
//     });
//
//     // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
//     socket.on('message', function (message) {
//         // On récupère le pseudo de celui qui a cliqué dans les variables de session
//         console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
//     });
// });


server.listen(8080);
