/*
 * =============================================================================
 * 
 *                         M Ó D U L O    E S Q U E M A
 * 
 * =============================================================================
 */
import CONFIG from './config';


/**
 * Esquema
 * El "Esquema" es el objeto central que posibilita la definición de la gran mayoría
 * de las restantes "entidades del socorro", ya no como objetos estáticos, sino como 
 * colecciones de atributos dinámicos cuyos valores pueden ser recalculados durante  
 * el ciclo de ejecución de la "Escena". En otras palabras, la mayoría de las "entidades 
 * del socorro" son "Esquemas" con configuraciones de atributos que se evalúan en tiempo
 * de ejecución permitiendo, de esta manera, la implementación de lógica generativa.
 * 
 * ESQUEMAS PROTAGONISTAS DE LA OBRA:
 * La "entidades del socorro" (esquemas) esenciales para la representación de la "Obra" son:
 * 
 *  - La "Escena"  : representación de contenidos visuales en el espacio (el lienzo HTML) 
 *                   y en en el tiempo. Una "Obra" puede incluir múltiples "Escenas". 
 *  - El "Actor"   : es la única entidad que verdaderamente es representada en la "Escena".
 *                   Es una entidad con comportamiento, que se desplaza en la "Escena" y
 *                   que tiene representación visual (se dibuja en el lienzo).
 *  - El "Reparto" : definición de conjuntos de actores con posiciones y desplazamientos 
 *                   predeterminados dentro de la "Escena". El "Reparto" dirige a los
 *                   "Actores", determina sus posiciones en la "Escena", controla sus
 *                   entradas y salidas del cuadro y, también, puede coreografiar a otros
 *                   "Repartos" (siubrepartos) dentro de éste. 
 * 
 * ESQUEMAS PARA DEFINICIONES DINÁMICAS:
 * Una de las funciones principales del "Esquema" es la definición de los atributos de las
 * "entidades del socorro", pero su relevancia radica en el hecho de que, en lugar de definir
 * valores estáticos para los atributos, posibilita definir la manera en que sus valores serán
 * calculados (evaluados) dinámicamente durante la representación de la "Escena".
 * Las "entidades del socorro" que contribuyen a este fin son (que también "Esquemas"):
 * 
 * - La "Variable" : representación de un método de cálculo dinámico de un atributo del
 *                   "Esquema". En general, definen un mapeo entre un rango de valores 
 *                   de origen y un rango de valores de destino, donde es posible añadir
 *                   variaciones aleatorias o ruido en el cálculo del resultado.
 * - El "Variador" : es simplemente un caso particular de una "Variable", donde el método
 *                   de cálculo es aleatorio (por ruido "perlin"). Es decir, se trata de
 *                   una "Variable" que mapea ruido al azar entre 0 y 1 a un rango.
 * 
 * Cada vez que se solicita el valor de un atributo del esquema, definido como una "Variable"
 * o "Variador", su valor es calculado en el momento permitiendo, justamente, una variación
 * a lo largo del tiempo de ejecución de la "Escena".
 * 
 * ESQUEMAS PARA REPRESENTACIÓN VISUAL:
 * La única "entidad del socorro" que tiene representación visual en la "Escena" es el "Actor". 
 * Para esto, existe un tipo de entidad que posibilita la definición de sus atributos visuales
 * mediante "Variables" para el cálculo dinámico. Esta entidad (también un "Esquema") es:
 * 
 * - El "Estilo"   : colección de defniciones de atributos vinculados con la representación
 *                   visual de un "Actor". Básicamente, el "Estilo" reúne dos triadas de
 *                   valores: por un lado, <color-opacidad-grandor> (para la figura del 
 *                   "Actor") y, por otro lado, la triada <color-opacidad-grosor> (del trazo
 *                   a utilizar). Cualquiera de los componentes de ambas triadas puede ser 
 *                   definido mediante objetos "Variables" para su evaluación dinámica.
 * 
 * ESQUEMA AUXILIARES PARA LA DEFINICIÓN DE VALORES:
 * Adicionalmente, existen "entidades del socorro" con fines utilitarios a la hora de la
 * definición de los atributos. 
 * 
 *  - El "Vector"    : estructura de datos simple que permite operar con vectores de hasta
 *                     tres componentes <x,y,z>. Muchos de los atributos de los esquemas son,
 *                     en verdad, "Vectores". Ejemplos: origen, velocidad, aceleración, etc. 
 *  - El "VectorVar" : es un tipo de "Vector" utilizado internamente cuando algunas de las
 *                     componentes <x,y,z> es definida mediante objetos "Variable". Es una 
 *                     entidad de uso interno del módulo. Desde el punto de vista de la interfaz
 *                     siempre se crean "Vectores". Si el módulo detecta el uso de "Variables"
 *                     en la definición del "Vector" automáticamente crea un "VectorVar" en
 *                     lugar del "Vector" para evaluar sus componentes dinámicamente.
 * 
 * MÉTODOS PRINCIPALES DEL ESQUEMA:
 * El esquema sólo tiene cinco métodos públicos:
 *  - def         : define los atributos del esquema con sus valores. En realidad, define 
 *                  manera en que los valores de dichos atributos son calculados.
 *  - defval      : devuelve un objeto con todas las definiciones de atributos y valores
 *                  del "Esquema".
 *  - val         : Devuelve el valor de un atributo del "Esquema". Dependiendo cómo haya sido
 *                  definido el "Esquema", esta función puede retornar un valor simple, otra
 *                  "entidad del socorro", o un "subesquema". Cuando el valor del atributo
 *                  fue definido a través de las entidades de cálculo dinámico ("Variable" o 
 *                  "Variador"), esta función es la encargada de llevar a cabo la evaluación
 *                  dinámica en tiempo de ejecuión (motor de la lógica generativa).
 *  - exportar    : exporta el contenido del esquema (definición de atributos en formato JSON.
 *  - config      : deinir la configuración (o guion) del "Esquema", por ejemplo, para la
 *                  construcción de una GUI ("Interfaz Gráfica de Usuario"). El uso de esta
 *                  función no es un requisito para el utilizar las restantes funciones.
 */
function Esquema(S, nombreEsquema) {
    const _ESQ = {};   // Esquema corriente (funciones y propiedades del "Esquema" en sí).
    const _VAL = {};   // Definición de atributos variables del esquema y sus valores.
    const _DEF = {};   // Configuraciones de atributos
          
    // Inicialización del "Esquema"
    _ESQ.nombre = nombreEsquema ?? CONFIG.SOS_ESQUEMA;
    _ESQ.clave  = S.O.S.obtenerClave(_ESQ.nombre);
    _ESQ.identificador = _ESQ.nombre + CONFIG.ATR_SEPARADOR + _ESQ.clave;
    _ESQ.visible = true;
        
    
    
    /**
     * def
     * Función para definir el valor de un atributo del esquema. Lo que es importante
     * remarcar de estar función es que, si bien permite definir los valores individuales
     * de los atributos, en la mayoría de los casos lo que se almacena es la definición
     * acerca de cómo calcular el valor del atributo dinámicamente en tiempo de ejecución.
     * Esto se consigue asociando objetos de tipo "Variable" o "Variador" en la definición
     * del atributo del "Esquema".
     * 
     * Adicionalmente, la función "def" permite asociar otras "entidades del socorro" en 
     * la definición de los atributos del "Esquema" creando, de esta forma, jerarquías
     * de entidades. Por ejemplo, la entidad "Escena" puede contener atributos que sean
     * "Actores" o "Repartos". Estos últimos, además, pueden tener "Actores" asociados o,
     * incluso, "Subrepartos".
     * 
     * ARGUMENTOS DE LA FUNCIÓN:
     * La función recibe un único argumento en la forma de un objeto JavaScript con la 
     * colección de pares <atributo, valor> a ser definidos. Por ejemplo:
     * 
     *   def({atributo1 : valor1, 
     *        atributo2 : valor2,
     *        ...
     *        atributoN : valorN});
     * 
     * Mediante esta función es posible definir jerarquías dentro del "Esquema". En decir,
     * además de poder definir valores simples para los atributos, es posible definir un
     * "subesquema" como valor de un atributo. En este caso, el valor del atributo pasar
     * a ser otro objeto JavaScript con la definición de tal "subesquema".
     * 
     *   def({atributo: {subatributo1 : valor1,
     *                   subatributo2 : valor2,
     *                   ...
     *                   subatributoN : valorN}
     *       });
     * 
     * Finalmente, esta misma función puede ser usada para definir el esquema a partir
     * de los datos importados desde un archivo JSON.
     */  
    _ESQ.def = (atributos) => {
        if (atributos) {
            _defEsquema(_VAL, atributos);
        }
        return _ESQ;
    };    

    
    
    /**
     * defval
     * Retorna la definición completa de los atributos del "Esquema" con sus valores,
     * es decir, retorna un objeto JavaScript con la estructura jerárquica del esquema
     * y subesquemas, detatallando los atributos y sus definiciones. Vale aclarar que
     * esta función no "evalúa" los valores, simplemente retorna sus definiciones.
     */
    _ESQ.defval = () => {
        return _ESQ.val();    
    };
    
    
    
    /**
     * val
     * Función para obtener el valor de un atributo del "Esquema". Esta función es la
     * responsable de la "Evaluación Dinámica" de aquellos atributos definidos a través
     * de "Variables" o "Variadores", es decir, cuyo valor no es estático y se calcula
     * en tiempo de ejeución mediante la invocación de funciones (ver la definición de
     * los objetos "Variable" y "Variador").
     * 
     * La función puede recibir un único argumento (el nombre del atributo del "Esquema"
     * del cual se quiere obtener su valor) o más de un argumento (en caso que se quiera
     * obtener el valor de un atributo de un subesquema). 
     * EJEMPLOS:
     * 
     *  val(<nombre>)            : Devuelve el valor (evaluado) del atributo indicado 
     *                             en el argumento (o "null" si no existe).
     *  val(<nombre1>, <nombre2>): Se asume que el valor del atributo <nombre1> es
     *                             un "subesquema". Se retorna, entonces, el valor
     *                             del atributo <nombre2> del subesquema <nombre1>.
     * 
     * EVALUACIÓN DINÁMICA
     * Como se mencionó arriba, esta función se ocupa de la evaluación de los valores de
     * los atributos, pero sólo si estos fueron definidos mediante "Variables" o "Variadores".
     * En cualquier otro caso, se retorna el objeto o "entidad del socorro" sin evaluar.
     * Por ejemplo, el código a continuación muestra dos formas diferentes de definir un mismo
     * "Actor" cuyo "Estilo" utiliza "Variables" para la definición de sus atributos:
     * 
     *  DEFINICIÓN MEDIANTE UN OBJETO JSON
     *   esc.def({actor: {velocidad: {x:2, y:2},
     *                    estilo   : {color     : {metodo:'ciclo',  valor:'tizado'},
     *                                color$alfa: {metodo:'perlin', valorDesde: 0, valorHasta: 1}},
     *                   }  
     *           });
     * 
     *  DEFINICIÓN MEDIANTE ENTIDADES DEL SOCORRO
     *   esc.def({actor: S.O.S.Actor(null, S.O.S.Vector(2, 2),
     *                               S.O.S.Estilo(S.O.S.Variable('ciclo', 'tizado'), 
     *                                            S.O.S.Variable('perlin', 0, 1)))
     *           });
     *
     * Los dos ejemplos anteriores hacen exactamente lo mismo. Independientemente de la forma en
     * que se defina, el "Esquema" termina almacenando las "entidades del socorro" referenciadas. 
     * Luego, al momento se solicitar el valor de estos atributos, la evaluación sólo tendrá lugar
     * al tratarse de una "Variable" o "Variador". En cualquier otro caso, se retorna el objeto.
     * 
     *   esc.val('actor')                    => Retorna el objeto de tipo "Actor" almacenado (sin evaluar)
     *   esc.val('actor', 'estilo')          => Retorna el objeto de tipo "Estilo" almacenado (sin evaluar)
     *   esc.val('actor', 'estilo', 'color') => Retorna el valor del "color" EVALUADO (incluyendo la opacidad)
     * 
     * En otras palabras, si el valor pedido fue definido como una "Variable" o un "Variador", entonces se
     * realiza la evaluación dinámica, sino se retorna el objeto tal como está almacenado. La función "val"
     * nunca retorna un objeto "Variable" o "Variador", sino que lo evalúa al momento de su invocación.
     *   
     */
    _ESQ.val = (...atributos) => {
        if (atributos.length > 0) {
            let _valoresDeAtributos = _VAL;
            for (let i = 0; i < atributos.length; i++) {
                if (_valoresDeAtributos.hasOwnProperty(atributos[i])) {
                    
                    // Si se trata del último nombre de la lista, se retorna su valor almacenado.
                    // Podría tratarse de un valor simple o un objeto ("Vector", "Estilo", etc).
                    // Ejemplo: en la instrucción de abajo "colorFondo" es el valor solicitado.
                    // 
                    //   escena.val("paletas", "nocturna", "colorFondo");
                    //                 ^           ^            ^
                    //             subesquema  subesquema    atributo                   
                    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                    if (i == atributos.length - 1) {
                      return _obtenerValor(_valoresDeAtributos, atributos[i]);
                    }
                    else {
                        // Si no se trata del último valor, se verifica si se está solicitando el 
                        // atributo de un objeto (ej. "Estilo", "Actor"). En ese caso, se delega el
                        // llamado a la función homónima del objeto en cuestión.
                        // Ejemplo: si el valor del atributo "opciones" fuese un objeto "Estilo".
                        // 
                        //    escena.val("opciones")          => Retorna un objeto de tipo "Estilo"
                        //    escena.val("opciones", "color") => Retorna el color del objeto "Estilo"
                        //                 
                        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                        let _subesquema = _valoresDeAtributos[atributos[i]];
                        if (S.O.S.esUnEstilo(_subesquema) || S.O.S.esUnActor(_subesquema) || S.O.S.esUnReparto(_subesquema)) {
                            return _subesquema.val(atributos.slice(i+1));
                        }
                        // Sino, se baja un nivel más en la jerarquía (al subesquema) y se continúa 
                        // con la búsqueda del valor del atributo solicitado en el "loop" principal.
                        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                        else {
                            _valoresDeAtributos = _subesquema;
                        }
                    }
                }
            }
        }
        return null;
    };
  
    

    /**
     * exportar
     * Devuelve una cadena de caracteres con el contenido del esquema
     * convertido a texto (en formato JSON).
     */
    _ESQ.exportar = (indentacion = "") => {
      return _convertirATexto(_VAL, indentacion);
    };
    
    
    
    /**
     * config
     * Función para obtener o definir la configuración de un atributo del esquema. 
     * También puede ser usada para obtener el conjunto completo de configuraciones
     * del equema (todas las definiciones de sus atributos). 
     * Según los argumentos que se indiquen, esta función actúa de formas diferentes:
     * 
     *  config()                       : Retorna un objeto con las configuraciones
     *                                   de todos los atributos del esquema.         
     *  config(<nombre>)               : Retorna un objeto ("ConfigAtributo") con  
     *                                   la configuración del atributo indicado.
     *  config(<nombre>, ...parametros): Define la configuración del atributo del esquema.
     *                                   Los parámetros definen su valor por defecto, el 
     *                                   rango de valores aceptados y/o la lista de valores
     *                                   (ver objeto "ConfigAtributo" para más detalles).
     */
    _ESQ.config = (...parametros) => {
      // 1. Sin argumentos, se devuelve la configuración completa del esquema
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      if (parametros.length == 0) {
        return _DEF;
      }
      // 2. Se retorna la configuración (objeto "ConfigAtributo") del atributo indicado
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      else if (parametros.length == 1) {
        if (_DEF.hasOwnProperty(parametros[0])) {
          return _DEF[parametros[0]];
        }
        else {
          return null;
        }
      }
      // 3. Se define o modifica la configuración del atributo indicado
      // del esquema (se crea y alamacena un objeto "ConfigAtributo")
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      else {
        const _atributo = ConfigAtributo(...parametros);
        _DEF[parametros[0]] = _atributo;
        
        // INICIALIZACIÓN DE LOS VALORES POR DEFECTO
        // Inicialización de un "subesquema" dentro del esquema
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (_atributo.valorPorDefecto !== null && typeof _atributo.valorPorDefecto === 'object' && !Array.isArray(_atributo.valorPorDefecto)) {
          for (const [atrNombre, atrValor] of Object.entries(_atributo.valorPorDefecto)) {
            if (!_VAL.hasOwnProperty(atrNombre)) {
              _VAL[atrNombre] = {};
            }
            if (!_VAL[atrNombre].hasOwnProperty(_atributo.nombre) || _VAL[atrNombre][_atributo.nombre] === undefined) {
              _VAL[atrNombre][_atributo.nombre] = atrValor;
            }
          }
        }
        // Inicialización de un atributo simple del esquema
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        else if (!_VAL.hasOwnProperty(_atributo.nombre) || _VAL[_atributo.nombre] === undefined) {
          _VAL[_atributo.nombre] = _atributo.valorPorDefecto;
        }
        return _atributo;
      }
    };
    

        
// --------------------------------------------------------------------------------------------------
//
//   F U N C I O N E S     P R I V A D A S
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    
    /**
     * _defEsquema
     * Función privada, utilizada internamente por el método "def" para definir los valores de los
     * atributos del "Esquema" (de manera recursiva). Lo relevante de la definición de los atributos 
     * de un "Esquema" es que posibilitan no sólo la asociación de valores simples a los atributos, 
     * sino la definición de la manera en que dicho valor debe ser calculado. En otras palabras: 
     * 
     *     LA DEFINICIÓN DE ATRIBUTOS DE UN ESQUEMA SIGNIFICA LA DEFINICIÓN DE LA MANERA  
     *            DE CALCULAR SUS VALORES DINÁMICAMENTE, EN TIEMPO DE EJECUCIÓN.
     * 
     * Cada atributo de un esquema puede albergar:
     *  - Un valor escalar simple (cualquier tipo de dato JavaScript).
     *  - Una definición de un "subesquema" de atributos (objeto JSON con pares <nombreAtributo: valor>).
     *  - Cualquier otra entidad del socorro que extienda de "Esquema" (Vector, Estilo, Actor, Reparto).
     *  - Un arreglo (array) de valores simples o, también, de cualquier "entidad del socorro".
     * 
     * Este mecanismo vuelve al "Esquema" extremadamente flexible. Por un lado, el "Esquema" posibilita 
     * establecer una jerarquía de entidades, por ejemplo, permite definir los "Actores" de una "Escena" 
     * o los "Actores" de un "Reparto" (incluso subrepartos dentro de un "Reparto"). Por otro lado, permite
     * definir "Variables" o "Variadores" asociados a sus atributos para que sus valores sean calculados
     * dinámicamente, en tiempo de ejecución.
     * 
     * En el caso de las "entidades del socorro", esta función admite que sean definidas, ya sea mediante
     * un objeto JSON conteniendo una colección de pares <nombreAtributo: valor> o mediante el uso de 
     * las entidades propiamente dichas. Por ejemplo:
     * 
     *   esc.def({actor: {origen   : {x:10, y:-50, z:0},         // Definición de un "Actor" de la "Escena" a 
     *                    velocidad: {x:2, y:1}                  // través de un objeto JSON. Esta definición 
     *                    estilo   : {color:189, color$trazo:8}  // incluye 2 "Vectores" y 1 "Estilo".   
     *                   }
     *            });
     *          
     *   esc.def({actor: S.O.S.Actor(S.O.S.Vector(10, -50, 0),   // La misma definición pero con "entidades SOS"
     *                               S.O.S.Vector(2, 1),
     *                               S.O.S.Estilo(189, null, null, 8))
     *           });
     * 
     * El "Esquema" es capaz de reconocer la definición de una "entidad del socorro" dentro del objeto JSON
     * pasado como argumento y crear su correspondiente objeto. Internamente, los dos ejemplos anteriores
     * terminan almacenando exactamente lo mismo, es decir, la definición del "Esquema" con las "entidades 
     * del socorro" referenciadas. Por ejemplo, al solicitar el valor del atributo "actor" lo que el "Esquema"
     * retorna es el objeto "Actor" instanciado.
     * 
     *   esc.val('actor')  =>  Retorna la entidad "Actor", indpendientemente como haya sido definida.
     * 
     * Los mismo ocurre al solicitar el valor de un atributo del "Actor" representado como una "entidad SOS".
     * Por ejemplo, al pedir el "origen" o el "estilo" del "Actor" se retorna la entidad correspondiente:
     * 
     *   esc.val('actor', 'origen')  =>  Retorna un objeto "Vector" con las coordenadas del punto origen
     *   esc.val('actor', 'estilo')  =>  Retorna un objeto "Estilo" con los atributos de su representación visual 
     *  
     */
    function _defEsquema(subesquema, subatributos, arreglo) {
        for (const [atrNombre, atrValor] of Object.entries(subatributos)) {
            // --------------------------------------------
            // DEFINCIÓN DE VALORES DEL OBJETO SUBESQUEMA
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (atrValor !== null && atrValor !== undefined && typeof atrValor === 'object' && !Array.isArray(atrValor)) {
              // Se verifica si el valor se corresponde a una DEFINICIÓN de algún objeto socorrista, por
              // ejemplo: un "Vector", una "Variable", un "Variador", un "Estilo", un "Actor", etc.
              let _entidadSocorrista = S.O.S.entidad(atrValor);
              if (_entidadSocorrista !== undefined) {
                  subesquema[atrNombre] = _entidadSocorrista().def(atrValor);
                  S.O.S.Reparto.fichar(_ESQ.identificador, subesquema[atrNombre], subesquema, atrNombre, arreglo);
                  continue;
              }
              else if (S.O.S.esUnVector(atrValor)   || S.O.S.esUnVectorVar(atrValor) || S.O.S.esUnaVariable(atrValor) || 
                       S.O.S.esUnVariador(atrValor) || S.O.S.esUnEstilo(atrValor)    || S.O.S.esUnActor(atrValor) || 
                       S.O.S.esUnReparto(atrValor)) {
                  subesquema[atrNombre] = atrValor;
                  S.O.S.Reparto.fichar(_ESQ.identificador, subesquema[atrNombre], subesquema, atrNombre, arreglo);
                  continue;
              }
              // Si el nombre del "subesquema" no está definido actualmente o ya existe pero
              // no se trata de un objeto "subesquema" o es un "array", se inicializa en blanco
              else if (!subesquema.hasOwnProperty(atrNombre) || typeof subesquema[atrNombre] !== 'object' || Array.isArray(subesquema[atrNombre])) {
                subesquema[atrNombre] = {};
              }
              // Invocación recursiva para definir los valores del "subesquema"
              _defEsquema(subesquema[atrNombre], atrValor);
            }

            // ------------------------------------------
            // DEFINICIÓN DE VALORES DE ARREGLOS (ARRAYS)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else if (Array.isArray(atrValor)) {
                subesquema[atrNombre] = [];
                // Invocación recursiva para definir los valores del "arreglo"
                _defEsquema(subesquema[atrNombre], atrValor, atrNombre);
            }  

            // ---------------------------------------------
            // DEFINICIÓN DE VALORES SIMPLES (ÚLTIMO NIVEL)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else {
              subesquema[atrNombre] = atrValor;
            }
        }
    }

    
    /**
     * _obtenerValor
     * Función privada para extraer el valor del atributo existente en el esquema.
     * Esta función tiene en cuenta los siguientes tipos de valores de atributos:
     *
     * - VARIABLE / VARIADOR: Si el valor buscado está representado como un objeto
     *   de tipo "Variable" o "Variador", entonces realiza el cálculo dinámico, según 
     *   el "método de evaluación" y retorna su valor. En el caso de tratarse de un
     *   objeto VECTORVAR (de uso interno), se evalúan sus componentes y se retorna
     *   un "Vector" con sus componentes evaluadas.
     * 
     * - COLOR: Si el valor obtenido es un "color" (de p5js), entonces verifica si 
     *   existe el atributo asociado que defina su opacidad. De ser así, lo calcula y
     *   lo aplica (los atributos asociados son atributos "vecinos" en el esquema a
     *   los que se les añade un sufijo, ejemplo: "$alfa" para indicar "opacidad").
     * 
     * - OTROS: Si no se trata de una "Variable", ni de un "Variador", ni de un color, 
     *   se retorna el valor sin ningún tipo de procesamiento. Por ejemplo, los "Vectores",
     *   los "Estilos", los "Actores" y los "Repartos" caen en esta categoría. El caso
     *   del objeto "VectorVar" es un caso particular: se evalúan primero sus componentes
     *   y se termina retornando un "Vector" evaluado. Nunca se retorna un "VectorVar".
     */
    function _obtenerValor(_valores, atrNombre) {
      let _valor = _valores[atrNombre];
      if (_valor) {
        if (S.O.S.esUnaVariable(_valor) || S.O.S.esUnVariador(_valor) || S.O.S.esUnVectorVar(_valor))
          _valor = _valor.val();
        if (S.O.S.esUnColor(_valor)) {
          let _atrNombreExtra = atrNombre + CONFIG.ATR_VARIABLE_ALFA;
          if (_valores.hasOwnProperty(_atrNombreExtra)) {
            let _alfa = _obtenerValor(_valores, _atrNombreExtra); // Busca la opacidad como atributo "vecino"
            if (_alfa) {
              _valor.setAlpha(_alfa * 255);
            }
          }
        }
      }
      return _valor;
    }      

    
    /**
     * _convertirATexto
     * Función privada que convierte a texto (en formato JSON) cada uno de
     * los pares <atributo, valor> del esquema recibido como argumento.
     * La función se invoca recursivamente en caso de detectar subesquemas.
     */
    function _convertirATexto(atributos, indentacion = "") {
      let esUnObjeto = true;
      if (atributos && Object.keys(atributos).length === 1 && Object.keys(atributos)[0] === CONFIG.ATR_ELEMENTO)
          esUnObjeto = false;
      let salida = esUnObjeto ? "{\n" : "\n";
      let existenValores = false;
        
      let nombres = Object.keys(atributos);
      for (let i = 0; i < nombres.length; i++) {
        let atrNombre = nombres[i];
        let atrValor  = atributos[atrNombre];
        if (atrValor !== null) {
          if (typeof atrValor === "object" && !Array.isArray(atrValor)) {
            let subesquema = atrValor.exportar?.(indentacion + "\t");
            if (subesquema === undefined) {
              subesquema = _convertirATexto(atrValor, indentacion + "\t");
            }
            if (subesquema !== null) {
              salida += _formatearRegistroExportado(indentacion, atrNombre, subesquema, esUnObjeto);
              existenValores = true;  
            }
          }
          else if (Array.isArray(atrValor)) {
            salida += indentacion + "\t\"" + atrNombre + "\"\t:\t[";
            for (let j = 0; j < atrValor.length; j++) {
                let elementoArray = {};
                elementoArray[CONFIG.ATR_ELEMENTO] = atrValor[j];
                salida += _convertirATexto(elementoArray, indentacion + "\t") + (j < atrValor.length - 1 ? "," : "");              
            }
            salida += "\n" + indentacion + "\t],\n";
            existenValores = true;
          }
          else {
            let valor = typeof atrValor === "number" || typeof atrValor === "boolean" ? atrValor : "\"" + atrValor + "\"";
            salida += _formatearRegistroExportado(indentacion, atrNombre, valor, esUnObjeto);
            existenValores = true;
          }
        }
      }
      if (existenValores) {
        if (esUnObjeto) {
            salida = salida.substring(0, salida.length-2) + "\n";
            salida += indentacion + "}";
        }
        return salida;
      }
      else
        return null;
    }
    
    /**
     * _formatearRegistroExportado
     * Función interna que construye una línea del formato de exportación
     */
    function _formatearRegistroExportado(indentacion, atrNombre, atrValor, esUnObjeto = true) {
        if (esUnObjeto)
            return indentacion + "\t\"" + atrNombre + "\"\t:\t" + atrValor + ",\n";
        else
            return indentacion + "\t" + atrValor;
    }
        
    return _ESQ;
}


export default Esquema;