from collections import Counter
import re
import sys
import json
stop_words = ["a","acá","ahí", "al", "algo", "algún","alguna","alguno","algunos","allá", "allí",
              "ambos", "ante", "antes", "aquel", "aquella", "aquello", "aquellos", "aquellas","aquí",
              "arriba", "así", "atrás", "aun", "aunque", "bien", "cada", "casi", "como", "con", "cual",
              "cuales", "cualquier", "cualquiera","cuan","cuando","cuanto","cuanta","cuantos", "cuantas","de",
              "del","demás","desde", "donde", "dos", "el", "él","ella", "ello", "ellas", "ellos","en","eres",
              "es", "esa", "ese", "eso", "esos", "esas","esta","está", "estas","este","esto", "estos", "etc",
              "ha","habían", "había", "han", "hasta", "la", "lo", "las", "los", "más", "me", "mi","mis","mía","mías", "mientras",
              "muy", "no", "ni","nosotras", "nosotros", "nuestra", "nuestro", "nuestras", "nuestros",
              "otra","otro", "otros", "para", "pero", "por","pues", "que", "qué", "son", "si", "sí",
              "siempre", "siendo", "sin", "sino", "sobre", "sr", "sra", "sres",
              "sta", "su","sus", "te", "tu", "tus","un", "una", "uno", "unos", "unas", "usted","ustedes",
              "vosotras", "vosotros", "vuestra", "vuestro", "nuestras", "nuestros","y", "ya", "yo", "se"]

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