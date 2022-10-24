# Coderhouse-Entrega final
 
**Login Y Registro:**
* se realizo un login y registro con validaciones.
* el login guardado al Session Storage y el Registro guardado en el LocalStorage. sin registro no  se puede ingresar a las funciones de tablas y el buscador de recetas.

**Buscador de Recetas:**
buscador de recetas a traves del consumo de la API de Edaman. el buscador se busca por nombre del tipo de plato, ingrediente o etiqueta saludable . Ej.:"Pizza", "zanahoria" o "libre de azucar".las api tiene la mayoria de recetas en ingles pero tambien recetas en español. por tanto al ejecutar el busqueda apareceran en pantalla 20 recetas con el nombre de la receta,foto de la receta, healthLabels, informacion nutricional, calorias y con un boton que redirige al sitio donde la receta del plato se encuentra.

**favoritos:**
* se incorporo un boton para agregar o eliminar de los favoritos, que es un corazon similar al de twitter, estas recetas se guardan dentro del localStorage.
* se agregaron 4 botones en el header, ordenar por calorias, ordenar por nombre de receta, busqueda por nombre y borrar los favoritos.
* los primeros dos botones de ordenar, son dos funciones que llaman al localstorage y a traves de un ciclo for trae y ordena las recetas.
* busqueda por nombre, se busca dentro de la localstorage un nombre a traves de la funcion find, en los labels alojados de cada receta.
* el ultimo boton borra todos los favoritos del localstorage.

**links de atajo a recetas predeterminadas**
son 11 botones que realizan la busqueda de recetas de los que dice cada boton  en pantalla, como pollo, pastas, ensalada, etc.




