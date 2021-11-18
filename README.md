El objetivo de este script es obtener las 50 palabras más utilizadas en un texto, presentarlas en un formato Json e incorporarlas dentro de una base de datos en MongoDb.
</br>
```app.js``` hace uso de ```mongoose```, que nos permite modificar una base de datos de MongoDB y a su vez utiliza un script de python(```python_script.py```) que recibe el texto, lo limpía de signos de puntuación para después retirar las palabras que no son utiles y devolver un archivo json que será devuelto como response por ```app.js```
</br>
```javascript
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
```
</br>

```python
#Usamos el argumento proporcionado cuando se llama al script:
texto = sys.argv[1]
texto_sin_puntuacion = re.sub(pattern= "[^\w\s]",
       repl= "",
       string= texto)
vocab = texto_sin_puntuacion.lower().split(" ")
#Descartamos las palabras inutiles y el resto se añadirán a la lista texto final:
texto_final = [palabra for palabra in vocab if palabra not in stop_words]
#Se instancia y actualiza el counter con las todas las palabras del texto final:
counter = Counter()
counter.update(texto_final)
#Se toman las 50 palabras mas comunes:
mas_comunes = counter.most_common(50)
json_file = [{f"Palabra": i[0], f"Conteo": i[1]} for i in mas_comunes]
#Finalmete hacemos return del valor deseado imprimiendolo y haciendo sys.stdout.flush():
print(json.dumps(json_file))
sys.stdout.flush()
```

