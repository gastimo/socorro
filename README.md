# S.O.S
Serviles entidades de socorro para asistir al programador en apuros en la creación de obras para pantallas e instalaciones.

## Siervos de la Obra del Socorro
Los "Siervos de la Obra del Socorro" son objetos JavaScript de auxilio (socorristas) que facilitan la creación y reproducción de **"escenas"** embebidas en páginas web, encapsulando y simplificando el acceso a las funciones para generación de gráficos que proveen las librerías JavaScript **Three.js** y **p5js**.

La **"escena"** termina materializándose como un *canvas* HTML dentro de la página web, construido a partir de las funciones de la librería **Three.js** o **p5js** (de acuerdo a los parámetros que se indiquen al momento de su creación). Las función del socorrista es justamente la de abstraer al programador de las complejidades en el uso de estas librerías y la de proveer una interfaz unificada para la creación de escenas, independientemente de la librería que se quiera emplear.

## Asistencia de los Socorristas
Para ser asistido por los siervos de la obra (socorristas) se debe importar el módulo dentro del código JavaScript con el siguiente comando:

```js
import * as S from 'socorro';
```

Luego, se puede invocar al socorrista recurriendo a los métodos de auxilio que el objeto `S.O.S` pone a disposición del programador. El ejemplo que se muestra a continuación ilustra, por ejemplo, la función que permite crear una nueva escena en la página HTML:
```js
/** 
 * Se crea una escena directamente dentro de <body> de la página HTML.
 * Al no indicar ningún otro parámetro, el tamaño del canvas se ajusta
 * a las dimensiones del viewport de manera "responsive".
 */
const e = S.O.S.crearEscena();
```
A modo de ejemplo, se enumeran sólo algunos métodos de ayuda brindados por los socorristas para ilustrar la forma de ser invocados.
```js
/** 
 * Cargar el código de un shader (VERTEX o FRAGMENT)
 */
 let vertexShader = S.O.S.cargarShader('arhivo-vertexshader.vert');
 let fragmentShader = S.O.S.cargarShader('archivo-fragmentshader.frag');
```

```js
/** 
 * Definir el valor de las variables UNIFORM
 * Para las variables asociadas al "tiempo", la "resolución" y la posición 
 * del "mouse" alcanza con definir sólo sus nombres. El socorrista se ocupa
 * de actualizar sus valores automáticamente durante la ejecución de la obra.
 */
 S.O.S.uniformTiempo("u_time");
 S.O.S.uniformResolucion("u_resolution");
 S.O.S.uniformMouse("u_mouse");
 S.O.S.uniform("u_nombre_var1", valor1);
 S.O.S.uniform("u_nombre_var2", valor2);
```
> **Nota**: ver el anexo de "Ejemplos" para más detalles acerca del empleo de los métodos de ayuda del socorrista para la creación, armado y despliegue de una escena.

## Instalación del módulo como dependencia
Para instalar el paquete se utiliza el comando `npm` dentro de la carpeta del proyecto, como se muestra a continuación:
```sh
$ npm install socorro
```
> Este comando no sólo instala el módulo JavaScript de la "Obra del Socorro", sino que también incluye las dependencias con las librerías de **Three.js** y **p5js**.