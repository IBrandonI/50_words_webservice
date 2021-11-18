//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var dataBase = "NombreDeBD";//CAMBIAR
var port = "27017";//CAMBIAR
const mongoConection = "mongodb://localhost:" + port + "/" + dataBase;
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//Establecemos conexión con la base de datos Mongo
mongoose.connect(mongoConection, {useNewUrlParser: true});

//Declaramos el esquema de Mongo para el conteo del palabras
const wordSchema = new mongoose.Schema({
  Palabra: {
      type:String,
      required:[true, "No hay palabra aquí"]
  },
  Conteo: {
      type:Number,
      required:[true, "Parece no haber conteo de la palabra"]
  }
});

//Declaramos el modelo
const Word = mongoose.model("Word", wordSchema);

//Se hace uso de app.route para todas las request a /words
app.route("/words")
.get(function(req, res){//Get request devuelve todos los registros de las palabras
  Word.find(function(err, foundWords){
    if (!err){
      res.send(foundWords);
    }else{
      res.send(err);
    }
  });
})
.post(callPython)//Post request:
.delete(function(req, res){
  Word.deleteMany(function(err){//Delete request BORRA TODO en la base de datos
     if(!err){
      res.send("Se han borrado los registros de todas las palabras");
     } else{
      res.send(err);
     }
  });
});

//Llamamos al script con child_process y se añade a la base de datos:
function callPython (req, res){
  var originalText = req.body.content;
  //Retiramos dobles espacios y saltos de linea y lo guardamos en finalText:
  var finalText = originalText.replace(/(\r\n|\n|\r|\s+)/gm, " ");
  const { spawn } = require('child_process');
  //Pasamos la string finalText como un argumento para el uso del script:
  const pyProg = spawn('python', ['./src/python_script.py', finalText]);
  //Hacemos uso de los datos que nos proporciona el script y se muestra en pantalla:
  var jsonArray
  pyProg.stdout.on('data', function(data) {
      jsonArray = JSON.parse(data.toString());
      res.send(jsonArray);
       res.end();
   });

  //Insertamos en la base de datos:
  Word.insertMany(jsonArray, function(err){
      if(err){
          console.error(error);
      }else{
          console.log("Todos los documentos fueron añadidos :)")
      }
   }); 
}

//Get request individual basado en la ID
app.get("/words/:id_word", function(req, res){
  Word.findOne({_id:req.params.id_word}, function(err, foundWord){
    if(foundWord){
      res.send(foundWord);
    }else{
      res.send("No se encontro ninguna ID similar :(")
    }
  });
});

//Delete request individual basado en la ID
app.delete("/words/:id_word",function(req, res){
  Word.deleteOne({_id:req.params.id_word}, function(err, foundWord){
    if (foundWord){
      res.send(foundWord)
    }else{
      res.send("No se encontro ninguna ID similar")
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});