var express = require('express'),
  bodyParser = require('body-parser'),
  server = require('http').createServer(express),
  io = require('socket.io')(server),
  fs = require('fs'),
  http = require('http'),
  record = require('node-record-lpcm16'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  session = require('express-session')
  app = express(),
  router = express.Router(),
  gpio = require('onoff').Gpio







// Connexion database
mongoose.connect('mongodb://test:test@ds161021.mlab.com:61021/todo');


var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Templates
app.set('view engine', 'ejs');

// Fichiers Statiques
app.use(express.static('./public'));

//Ecoute le port
app.listen(3000);
console.log('Listening to port 3000');


// Login form

var UserSchema = new mongoose.Schema({
  type: String,
  mail: String,
  fullname: String,
  password: String
})

var User = mongoose.model('user', UserSchema);

app.get('/register', function(req, res){
  res.render('register');
});

app.post("/new", function(req, res){
  new User ({
    type: 'userlogin',
    mail: req.body.mail,
    fullname: req.body.fullname,
    password: req.body.password
  }).save(function(err, doc){
    if (err) res.json(err);
    else res.send('Ok')
  });
});


//Shéma data
var todoSchema = new mongoose.Schema({
  type: String,
  date: {
    type: Date,
    default: Date.now
  },
  item: String,
  aidant: String
});


var Todo = mongoose.model('Todo', todoSchema);

//get, post, delete actions
app.get('/todo', function(req, res) {
  Todo.find({}, function(err, data) {
    if (err) throw err;
    res.render('todo', {
      todos: data
    });
  });
});

app.post('/todo', urlencodedParser, function(req, res) {
  var newTodo = Todo(req.body).save(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.delete('/todo/:id', function(req, res) {
  Todo.findOne({
    _id: req.params.id
  }).remove(function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});



// GESTION VOCALE //


var file = fs.createWriteStream('test.flac', {
  encoding: 'binary'
})

file.on('finish', function() {
	console.log('fs finish')
	})

var transcription

function RecordAudio(callback) {
  record.start({
    sampleRate: 22050,
  }).pipe(file)

  console.log("début enregistrement")
  setTimeout(function() {
    record.stop()

    if (typeof callback == "function")
      callback()
    console.log("Fin enregistrement")
  }, 5000)
}


function GoogleSpeechWork() {
  const Speech = require('@google-cloud/speech');


  // Reconnaissance Vocale
  // Instantiates a client
  const speech = Speech();

  // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
  const filename = (__dirname + '/test.flac');

  // The encoding of the audio file, e.g. 'LINEAR16'
  const encoding = 'LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  const sampleRateHertz = 22050;

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
      transcription = results[0];
 
      console.log(`Transcription: ${transcription}`);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

function test() {
  console.log('----------');
  console.log('')
  led.write(0)
  /// Test ///
  if (transcription.includes('besoin')) {
    if (transcription.includes('pas')) {
      console.log('Pas de besoin');
    } else {
      var pattern = "de";
      var need = transcription.substr(transcription.indexOf(pattern) + pattern.length, transcription.length);
      console.log('Il y a besoin de ' + need);
      var storage = new Todo;
      storage.item = 'Monique a besoin de ' + need;
      storage.save(function(err) {
        if (err) throw err;
        console.log('Todo ajoutée')

      })


    }
  } else {
    console.log('Pas de besoin');
  }
  /// End Test ///
}

function Speech() {
	led.write(1)
  RecordAudio(GoogleSpeechWork);
  setTimeout(test, 15000)
}

button = new gpio(21, 'in', 'both')
led = new gpio(26, 'out')
button.watch(function(err, value) {
	if (err) { throw err}
	console.log(value)
	
	if (value == 1) {
		
		var transcription
		Speech()
	} 
	
	})
