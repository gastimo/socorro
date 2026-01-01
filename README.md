# S.O.S

Funciones de auxilio en la producción de gráfica generativa para la web a través de las librerías **p5js** y **Three.js**. Importación y exportación (en formato JSON) de los parámetros de generación. Modificación “en vivo” de éstos durante la ejecución (via GUI).

# Paquete del “socorro”

Serviles entidades de socorro para asistir al programador en apuros en la creación de obras para pantallas e instalaciones. Se trata de objetos JavaScript de auxilio (socorristas) que facilitan la creación y reproducción de "**Escenas**" embebidas en páginas web, encapsulando y simplificando el acceso a las funciones para generación de gráficos que proveen las librerías JavaScript **Three.js** y **p5js**. La "Escena" termina materializándose como un `<canvas>` HTML dentro de la página web. La función del socorrista es, justamente, la de abstraer al programador de las particularidades de estas librerías, proveyendo una interfaz unificada para la creación de “Escenas”.

# Los Siervos de la Obra

El paquete del “socorro” define a la “Obra” como una entidad JavaScript única (*singleton*) y privada (invisible fuera del paquete), que se ocupa de la orquestación general de todas las “Escenas” que se crean con el paquete del “socorro”. Este objeto está a cargo del cuerpo de socorristas, denominados internamente “Siervos de la Obra”. En el inicio, la “Obra” pone a disposición a su primer socorrista, accesible al importar el paquete a través del objeto `S.O.S`. En la medida que se crean nuevas escenas, la “Obra” designa socorristas dedicados a atenderlas, es decir, “Siervos de la Obra” con dedicación exclusiva a una “Escena” en particular.

# La Escenificación

La función principal de los socorristas es brindar auxilio en la producción de “Escenas” de gráfica y sonido generativo para la web. Para ser asistido por estos “Siervos de la Obra” se debe importar el módulo dentro del código JavaScript con el siguiente comando:

```jsx
import * as S from 'socorro';
```

De esta forma, se obtiene acceso al primer socorrista, el “Siervo Originario de la “Obra”, el “Singleton del Obsequioso Socorro”: el objeto `S.O.S`. A través de éste, la “Obra” pone a disposición del programador sus métodos de ayuda. El principal auxilio que brinda este socorrista es la función para crear una nueva escena en la página HTML, tal como ilustra la línea de código a continuación:

```jsx
const e = S.O.S.crearEscena();
```

Esta invocación crea una escena (en la forma de un `<canvas>` HTML) directamente dentro de la etiqueta `<body>` de la página web. Al no indicar ningún argumento en la invocación de la función `crearEscena`, el tamaño del `<canvas>` creado se ajusta automáticamente a las dimensiones del *viewport* del navegador de forma *responsive*.

# Incrustación de Escenas en la Página Web

Para crear escenas dentro de otros contenedores HTML de la página (por ejemplo, en un `<div>`), se debe pasar el elemento del DOM (*Document Object Model*) como primer argumento de la función. Si no se especifica ningún otro argumento, la escena (el `<canvas>`) adoptará el mismo tamaño que dicho elemento HTML y, además, se ajustará automáticamente cada vez que éste modifique su tamaño y/o posición.  

```jsx
const contenedor = document.getElementById("ID-contenedor");
const e = S.O.S.crearEscena(contenedor);
```

De la misma forma, se pueden tener múltiples escenas dentro de una misma página web, asignando a cada una de ellas un contenedor HTML diferente.

```jsx
const e1 = S.O.S.crearEscena(document.getElementById("ID-contenedor-01"));
const e2 = S.O.S.crearEscena(document.getElementById("ID-contenedor-02"));
const e3 = S.O.S.crearEscena(document.getElementById("ID-contenedor-03"));
```

# Dimensiones y Proporciones de la Escena

La función para crear “Escenas” del socorrista `S.O.S` está diseñada para abstraer al programador del manejo de las dimensiones del `<canvas>`. En lugar de tener que definir programáticamente el tamaño de la “Escena”, se espera que su anchura y altura sean determinadas por la propia página web (a través de su código HTML/CSS). Los socorristas están instruidos para detectar las dimensiones de los objetos HTML contenedores y ajustar automáticamente el tamaño del `<canvas>`, incluso adaptándose de manera *responsive* ante posibles cambios de tamaño y posición. En otras palabras, es el contenedor HTML quien determina el tamaño de la “Escena” (`<canvas>`) y no al revés. No obstante, la función `crearEscena` admite, además del contenedor HTML, otros tres argumentos que son tenidos en cuenta a la hora de calcular (y recalcular) las dimensiones del `<canvas>` de la “Escena”. Estos son:

```jsx
const e = S.O.S.crearEscena(contenedor, guardarProporciones, ancho, alto);
```

- **contenedor**: como ya se explicó más arriba, se trata del elemento HTML que contendrá al `<canvas>`. Es caso de no indicarse, se asume el `<body>` de la página.
- **guardarProporciones**: parámetro para indicar si la “Escena” debe siempre mantener las mismas proporciones (*aspect ratio*) con las que fue creada inicialmente. Este argumento es tenido en cuenta cuando, por alguna razón, el tamaño del contenedor HTML de la “Escena” varía su tamaño,  por ejemplo, al redimensionar la ventana del navegador. Su valor por defecto es `false`, es decir, la “Escena” adopta exactamente el tamaño de su contenedor HTML.
- **ancho** y **alto**: estos dos argumentos no son utilizados necesariamente para definir el tamaño del `<canvas>` de la “Escena”. Si son especificados, sus valores se usan para lo siguiente:
    - Definen el tamaño máximo (en píxeles) para el ancho y la altura del `<canvas>` de la “Escena”.
    - Además, si el valor del argumento **guardarProporciones** es `true`, entonces estos dos parámetros definen la proporción que se debe respetar (*aspect ratio*) al redimensionar la “Escena” en la página.
    - Por último, sirven como valor de referencia para calcular la escala de los gráficos que se muestran en el `<canvas>`. El objeto socorrista `S.O.S` provee una función llamada `escala()` que retorna justamente el coeficiente que surge de la razón entre el tamaño actual del `<canvas>` y los valores indicados en estos parámetros. El valor devuelto por la función `escala()` es útil cuando lo que se busca es crear una escena cuyo contenido sea escalado proporcionalmente según las dimensiones de su contenedor.

A continuación, se incluye un ejemplo de creación de una “Escena” utilizando estos argumentos:

```jsx
const ancho = 800;                // Es el ancho de referencia máximo
const alto  = 600;                // Es la altura de referencia máxima
const mantenerProporcion = true;  // Keep aspect ratio 4:3
const contenedor = document.getElementById("ID-contenedor");
const e = S.O.S.crearEscena(contenedor, mantenerProporcion, ancho, alto);
```

Como se explicó más arriba, la ejecución de este código no implica que se terminará creando una escena de 800x600 píxeles necesariamente (aunque sí se mantendrá la proporción 4:3). El socorrista siempre crea el `<canvas>` en función del tamaño de su contenedor HTML, y no al revés, es decir, no se espera que el contenedor se adapte al tamaño del `<canvas>` sino que, por el contrario, lo restrinja.

En otras palabras, si lo que se pretende es crear una escena que tenga exactamente un tamaño de 800x600 píxeles, alcanza con definir las reglas CSS en la página para que su contenedor tenga ese tamaño preciso. En ese caso, no haría falta indicar ancho o alto al invocar a la función `crearEscena`.

# El Escenificador

Es importante aclarar que el valor retornado por la función `crearEscena` no es un objeto “Escena” en sí, sino otro tipo de objeto llamado “Escenificador”. El “Escenificador” es un objeto intermediario desde el cual es posible configurar y manipular programáticamente la escena mediante tres métodos que definen las funciones para la puesta en escena o los “Tres Actos”:

- **ACTO#1 - “alCargar”**: define la función que se invocará una única vez, al inicio, con el propósito de cargar cualquier archivo que se requiera utilizar luego: imágenes, shaders, fuentes, etc.
- **ACTO#2 - “alComenzar”**: define la función que se invocará una única vez (luego de la función de carga anterior) y que configura los parámetros de la escena para su ejecución.
- **ACTO#3 - “alDesplegar”**: define la función que se invocará en bucle por cada iteración del ciclo de ejecución de la “Escena”.

El ejemplo a continuación ilustra la manera en la que se pueden definir estas tres funciones (o actos) de la “Escena” a través del “Escenificador”.

```jsx
const escenificador = S.O.S.crearEscena();

escenificador.alCargar((S) => {
	// Acá va el código para la carga de archivos iniciales
});

escenificador.alComenzar((S) => {
	// Acá va el código para configurar o inicializar la escena
});

escenificador.alDesplegar((S) => {
	// Acá va el código a ejecutar por cada iteración del ciclo de ejecución
});
```

Las funciones o actos de la escena que define el objeto “Escenificador” reciben un único argumento (llamado “S”). A través de este objeto JavaScript, se pone a disposición de la “Escena” un siervo designado por la “Obra” como su socorrista exclusivo para atenderla (el objeto `S.O.S`). Mediante este objeto de auxilio es posible acceder a las funciones del paquete para configurar y crear la gráfica y el sonido de la “Escena”.

# Los Socorristas

Los socorristas son objetos “Siervos de la Obra” que contienen las funciones de auxilio para el armado y la reproducción de las “Escenas”. Al importar en el código JavaScript del paquete “socorro”, se habilita automáticamente el primer socorrista, también llamado “Siervo Originario de la Obra” (`S.O.S`), con el cual es posible crear “Escenas”. 

```jsx
import * as S from 'socorro';
const e = S.O.S.crearEscena();  // Creación de una escena con el primer socorrista
```

Luego, los métodos del objeto “Escenificador” para definir cada uno de los actos de la “Escena”, permiten declarar las funciones que se deben ejecutar “*alCargar*”, “*alComenzar*” y “*alDesplegar*” dicha escena. Estas funciones o actos reciben, como único argumento, otro objeto también llamado “S”, pero en este caso no se trata del mismo “Siervo Originario de la Obra”, sino de un socorrista dedicado a atender esa “Escena” en particular. Este socorrista tiene las mismas funciones que el socorrista originario pero además, por el mecanismo de herencia de “prototipos” de JavaScript, brinda acceso a los métodos de la propia “Escena” recién creada. En otras palabras, a través de este socorrista dedicado se exponen tanto los métodos del “Siervo Originario de la Obra” como los de la “Escena” recién creada. En el ejemplo incluido debajo se muestra la creación de una “Escena” y la forma en que se puede acceder a los métodos de “Escena” recién creada a través de su socorrista dedicado.

```jsx
const esc = S.O.S.crearEscena();  // "S.O.S" es el Siervo Originario de la Obra
esc.alCargar((S) => {
	let ancho  = S.O.S.ancho();      // En estas tres líneas, el objeto "S.O.S" no es
	let alto   = S.O.S.alto();       // el mismo que el de arriba (el originario), sino
	let escala = S.O.S.escala();     // que se trata del socorrista dedicado a la escena
});
```

Como se puede ver en el ejemplo, el objeto `S.O.S` de la primera línea es el primer socorrista o “Siervo Originario de la Obra” a través del cual se crea la “Escena”. Luego, dentro de la función declarada como argumento del método `alCargar()` del “Escenificador”, se otorga acceso a otro objeto `S.O.S`, pero en este caso se trata del socorrista dedicado que expone no sólo a las mismas funciones que el “Siervo Originario de la Obra”, sino que también hereda todos los métodos de la “Escena” recién creada (`ancho()`, `alto()` y `escala()` son, en realidad, funciones de la propia “Escena” y no están presentes en el objeto `S.O.S`  de la primera línea).

## Utilización de Shaders

Por ejemplo, si se desea utilizar *shaders* para la construcción de la escena, los archivos con el código de éstos deben ser cargados en la función definida mediante el método `alCargar` del “Escenificador”. 

```jsx
escenificador.alCargar((S) => {
	let vertexShader = S.O.S.cargarShader('arhivo-vertexshader.vert');
	let fragmentShader = S.O.S.cargarShader('archivo-fragmentshader.frag');
}
```

De la misma forma, si se quisiera definir los valores de los parámetros *uniform* del *shader*, se debe colocar el código dentro de la función que se define mediante el método `alComenzar` del “Escenificador” (en caso que los valores sólo se establezcan una vez al inicio) o `alDesplegar` (en caso de necesitar actualizar los valores en cada iteración del ciclo).

```jsx
escenificador.alComenzar((S) => {
   S.O.S.uniformTiempo("u_time");           // Define el nombre del uniform para "tiempo" (no su valor)
   S.O.S.uniformResolucion("u_resolution"); // Define el nombre del uniform para "resolución" (no su valor)
   S.O.S.uniformMouse("u_mouse");           // Define el nombre del uniform para "mouse" (no su valor)
}
escenificador.alDesplegar((S) => {
   S.O.S.uniform("u_nombre_var1", valor1);  // Define el valor para el uniform "u_nombre_var1"
   S.O.S.uniform("u_nombre_var2", valor2);  // Define el valor para el uniform "u_nombre_var2"
}
```

> **Nota**: El paquete del "socorro" actualiza automáticamente los valores de las variables *uniform* para el "tiempo", la "resolución" y al "posición del mouse". Sólo es necesario definir el nombre con el cual se los accederá desde el *shader*.

---

# Instalación del módulo como dependencia
Para instalar el paquete se utiliza el comando `npm` dentro de la carpeta del proyecto, como se muestra a continuación:
```sh
$ npm install socorro
```
> Este comando no sólo instala el módulo JavaScript de la "Obra del Socorro", sino que también incluye las dependencias con las librerías de **Three.js** y **p5js**.
