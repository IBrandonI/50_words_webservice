El objetivo de este script es obtener las 50 palabras más utilizadas en un texto, presentarlas en un formato Json e incorporarlas dentro de una base de datos en MongoDb.
</br>
app.js hace uso de mongoose, que nos permite modificar una base de datos; a su vez utiliza un script de python(python_script.py) que recibe el texto, lo limpía de signos de puntuación para después retirar las palabras que no son utiles y devolver un archivo json que será devuelto como response por app.js
</br>
'''
>#Usamos el argumento proporcionado cuando se llama al script:</br>
>texto = sys.argv[1]</br>
>texto_sin_puntuacion = re.sub(pattern= "[^\w\s]",</br>
>       repl= "",</br>
>       string= texto)</br>
>vocab = texto_sin_puntuacion.lower().split(" ")</br>
>#Descartamos las palabras inutiles y el resto se añadirán a la lista texto final:</br>
>texto_final = [palabra for palabra in vocab if palabra not in stop_words]</br>
>#Se instancia y actualiza el counter con las todas las palabras del texto final:</br>
>counter = Counter()</br>
>counter.update(texto_final)</br>
>#Se toman las 50 palabras mas comunes:</br>
>mas_comunes = counter.most_common(50)</br>
>json_file = [{f"Palabra": i[0], f"Conteo": i[1]} for i in mas_comunes]</br>
>#Finalmete hacemos return del valor deseado imprimiendolo y haciendo sys.stdout.flush():</br>
>print(json.dumps(json_file))</br>
>sys.stdout.flush()</br>
'''

