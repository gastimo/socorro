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
 * Un esquema es un objeto genérico para almacenar un conjunto de datos (en la 
 * forma de una colección de pares <atributo, valor>, junto con sus metadatos, 
 * en otras palabras, permite guardar la definición del esquema (las "configuraciones"
 * de sus atributos) además de los valores para cada uno de ellos (su contenido).
 * La utilización de esquemas permite, entre otras cosas:
 *  - Inicializar objetos automáticamente con sus valores por defecto.
 *  - Validar los valores que se le asignen a sus atributos mediante la GUI.
 *  - Importar y exportar los datos de los atributos en formato JSON.
 *  - Construir una GUI (panel de control) para modificar los valores
 *    de sus atributos en tiempo real.
 * 
 * MÉTODOS PRINCIPALES:
 *  - def         : define los atributos del esquema con sus valores. No requiere
 *                  la invocación de la función "config" previamente.
 *  - val         : retorna el valor de un atributo del esquema o, incluso, un 
 *                  subesquema. No requiere el uso previo de la función "config".
 *  - config      : establece la configuración de un atributo del esquema. Las 
 *                  configuraciones son opcionales. Sólo son necesarias para 
 *                  construir la GUI o definir los valores por defecto de los 
 *                  atributos durante su inicialización.
 *  - exportar    : exporta el contenido del esquema (nombre de atributos y
 *                  sus valores) en formato JSON.
 *  - sincronizar : marca internamente el contenido del esquema como "sincronizado"
 *                  (ver apartado "SINCRONIZACIÓN", debajo).
 * 
 * SINCRONIZACIÓN:
 * La "sincronización" es un mecanismo opcional. Puede ser útil cuando el objeto
 * que hace uso del esquema mantiene internamente una copia de los mismos atributos
 * almacenados en su esquema. De esta forma, si el esquema fuera modificado de
 * manera externa (desde la GUI, por ejemplo), los valores del esquema no concordarían
 * con los valores que el objeto tiene almacenados (estarían "desincronizados").
 * Para solucionar esto, en cada iteración del bucle de la "Obra", los objetos que
 * hagan uso de esquemas (y que mantienen copias internas de los mismos atributos),
 * debe preguntar si sus esquemas asociados se encuentran "desincronizados" y, de ser
 * así, encargarse de la actualización.
 */
function Esquema(S, nombreEsquema) {
    const _ESQ = {};   // Esquema corriente (funciones y propiedades del "Esquema" en sí).
    const _VAL = {};   // Definición de atributos variables del esquema y sus valores.
    const _DEF = {};   // Configuraciones de atributos (para valores x defecto y GUI).

    // Inicialización del "Esquema"
    _ESQ.nombre = nombreEsquema ?? CONFIG.NOMBRE_ESQUEMA;
    _ESQ.clave  = S.O.S.obtenerClave(_ESQ.nombre);
    _ESQ.identificador = _ESQ.nombre + CONFIG.ATR_SEPARADOR + _ESQ.clave;
    _ESQ.visible = true;
    _VAL[CONFIG.ATR_SINCRONIZADO] = true;
    
  
   /*
    * =============================================================================
    * 
    *           O B J E T O S    I N T E R N O S    D E L    E S Q U E M A
    * 
    * =============================================================================
    */
  
    /**
     * ConfigAtributo
     * Objeto para almacenar la configuración de un atributo individual del esquema.
     * Admite una serie de parámetros (sólo el primero es obligatorio):
     *  1. Nombre               : Nombre del atributo del esquema.
     *  2. Valor por defecto    : Valor para su incialización.
     *  3. Valor mínimo/valores : Junto con el siguiente argumento, definen
     *                            el rango de valores aceptado. Pero, si se indica
     *                            un "array", entonces es la "Lista de valores".
     *  4. Valor máximo         : Junto con el argumento anterior (si no es un 
     *                            "array") definen el rango de valores aceptado.
     *  5. Incremento           : Si se estableció un rango de valores (con los 
     *                            dos argumentos anteriores), indica de cuánto 
     *                            en cuánto se debe incrementar el valor.
     * 
     * NOTA : esta objeto es usado únicamente por la función "config" para almacenar
     *        las definiciones de un atributo. Su uso principal es en el armado de la GUI.
     */
    function ConfigAtributo (...parametros) {
      let _nombrePropiedad;  // Para mapear el atributo a una propiedad del objeto maestro
      let _etiqueta;         // Para la descripción o rótulo a desplegar en la GUI
      const _configuracion = {
        nombre          : null,
        valorPorDefecto : null,
        valorMinimo     : null,
        valorMaximo     : null,
        incremento      : null,
        listaDeValores  : null,
        etiqueta        : (texto) => {_etiqueta = texto; return _configuracion;},
        propiedad       : (prop)  => {_nombrePropiedad = prop; return _configuracion;}
      };
      _configuracion.nombre          = parametros.length > 0 ? parametros[0] : null;
      _configuracion.valorPorDefecto = parametros.length > 1 ? parametros[1] : null;
      _configuracion.valorMinimo     = parametros.length > 2 ? parametros[2] : null;
      _configuracion.valorMaximo     = parametros.length > 3 ? parametros[3] : null;
      _configuracion.incremento      = parametros.length > 4 ? parametros[4] : null;
      if (Array.isArray(_configuracion.valorMinimo)) {
        listaDeValores = _configuracion.valorMinimo;
        _configuracion.valorMinimo = null;
        _configuracion.valorMaximo = null;
      }
      return _configuracion;
    }


/*
 * =============================================================================
 * 
 *                              E S Q U E M A
 * 
 * =============================================================================
 */

    
    
    /**
     * def
     * Función para definir el valor de un atributo del esquema. La función 
     * recibe un único argumento en la forma de un objeto JavaScript con la 
     * colección de pares <atributo, valor> a ser definidos. Ejemplo:
     * 
     *   def({atributo1 : valor1, 
     *        atributo2 : valor2,
     *        ...
     *        atributoN : valorN});
     * 
     * La función permite definir tanto valores simples para los atributos
     * como "subesquemas". En este caso, el valor del atributo debe ser
     * otro objeto JavaScript con la información del "subesquema".
     *   def({atributo: {subatributo1 : valor1,
     *                   subatributo2 : valor2,
     *                   ...
     *                   subatributoN : valorN}
     *       });
     * 
     * Esta misma función puede ser usada para definir el esquema a partir
     * de los datos importados desde un archivo JSON.
     */  
    _ESQ.def = (atributos) => {
      if (atributos) {
        const _defRecursiva = (subesquema, subatributos) => {
          for (const [atrNombre, atrValor] of Object.entries(subatributos)) {
              
            // --------------------------------------------
            // DEFINCIÓN DE VALORES DEL OBJETO SUBESQUEMA
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (atrValor !== null && atrValor !== undefined && typeof atrValor === 'object' && !Array.isArray(atrValor)) {
              // Se verifica si el valor se corresponde a una DEFINICIÓN de algún objeto socorrista,
              // por ejemplo: un "Vector", una "Variable", un "Estilo", un "Actor", etc.
              let _funcionSocorrista = _obtenerFuncionSocorrista(atrValor);
              if (_funcionSocorrista !== undefined) {
                  subesquema[atrNombre] = _funcionSocorrista();
                  subesquema[atrNombre].def(atrValor);
                  _incorporarAlReparto(subesquema[atrNombre]);
                  continue;
              }
              else if (S.O.S.esUnVector(atrValor) || S.O.S.esUnaVariable(atrValor) || 
                       S.O.S.esUnEstilo(atrValor) || S.O.S.esUnActor(atrValor)) {
                  subesquema[atrNombre] = atrValor;
                  _incorporarAlReparto(subesquema[atrNombre]);
                  continue;
              }
              // Si el nombre del "subesquema" no está definido actualmente o ya existe pero
              // no se trata de un objeto "subesquema" o es un "array", se inicializa en blanco
              else if (!subesquema.hasOwnProperty(atrNombre) || typeof subesquema[atrNombre] !== 'object' || Array.isArray(subesquema[atrNombre])) {
                subesquema[atrNombre] = atrValor;      // ¡INTENCIONAL! para mantener el puntero al objeto recibido
                subesquema[atrNombre][CONFIG.ATR_SINCRONIZADO] = true;
              }
              // Invocación recursiva para definir los valores del "subesquema"
              _defRecursiva(subesquema[atrNombre], atrValor);
            }
              
            // ------------------------------------------
            // DEFINICIÓN DE VALORES DE ARREGLOS (ARRAYS)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else if (Array.isArray(atrValor)) {
                subesquema[atrNombre] = [];
                // Invocación recursiva para definir los valores del "arreglo"
                _defRecursiva(subesquema[atrNombre], atrValor);
            }  
              
            // ------------------------------------------
            // DEFINICIÓN DE VALORES SIMPLES
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else {
              subesquema[atrNombre] = atrValor;
            }
          }
          // Se marca como "desincronizado" aún cuando no se haya definido ningún valor real.
          subesquema[CONFIG.ATR_SINCRONIZADO] = false;
        };
        _defRecursiva(_VAL, atributos);
      }
      return _ESQ;
    };
  
    /**
     * val
     * Función para obtener el valor de un atributo del esquema o, incluso, el
     * conjunto completo de todos los valores de los atributos del esquema. 
     * La función puede recibir un único argumento (el nombre del atributo del
     * cual se quiere obtener su valor) o más de un argumento (en caso que se
     * quiere obtener el valor de un atributo de un subesquema). Si la función
     * es invocada sin argumentos, retorna un objeto con todos los valores.
     * 
     *  val()                    : Devuelve un objeto con todos los atributos
     *                             del esquema y sus respectivos valores.
     *  val(<nombre>)            : Devuelve el valor del atributo indicado 
     *                             en el argumento (o "null" si no existe).
     *  val(<nombre1>, <nombre2>): Se asume que el valor del atributo <nombre1> es
     *                             un "subesquema". Se retorna, entonces, el valor
     *                             del atributo <nombre2> del subesquema <nombre1>.
     */
    _ESQ.val = (...atributos) => {
      if (atributos.length == 0) {
        return _VAL;
      }
      else {
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
              if (S.O.S.esUnEstilo(_subesquema) || S.O.S.esUnActor(_subesquema)) {
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
          else {
            return null;
          }
        }
      }
    };
  
    /**
     * _obtenerValor
     * Función privada para extraer el valor del atributo existente en el esquema.
     * Esta función tiene en cuenta los siguientes tipos de valores de atributos:
     * - VARIABLE: Si el valor buscado está representado como una "Variable", 
     *   entonces realiza el cálculo dinámico o "evaluación" y retorna su valor.
     * - COLOR: Si el valor obtenido es un "color" (de p5js), entonces verifica si 
     *   existe el atributo asociado que defina su opacidad. De ser así, lo calcula y
     *   lo aplica (los atributos asociados son los que añaden un sufijo, ej: "$alfa").
     * - OTROS: Si no se trata de una "Variable" ni de un color, retorna el valor 
     *   sin ningún tipo de procesamiento. Los "Vectores" caen en esta categoría.
     */
    function _obtenerValor(_valores, atrNombre) {
      let _valor = _valores[atrNombre];
      if (_valor) {
        if (S.O.S.esUnaVariable(_valor))
          _valor = _valor.val();
        if (S.O.S.esUnColor(_valor)) {
          let _atrNombreExtra = atrNombre + CONFIG.ATR_VARIABLE_ALFA;
          if (_valores.hasOwnProperty(_atrNombreExtra)) {
            let _alfa = _obtenerValor(_valores, _atrNombreExtra);
            if (_alfa) {
              _valor.setAlpha(_alfa * 255);
            }
          }
        }
      }
      return _valor;
    }

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
     * 
     *  NOTA 1: Definir la configuración del esquema mediante esta función no es 
     *          un requisito necesario para poder usar las funciones "def" y "val".
     *          Las configuraciones son usadas simplemente para definir valores
     *          por defecto durante la inicialización o para construir la GUI.
     *  NOTA 2: Si bien los atributos admiten la definición de "subesquemas", esta
     *          función sólo permite definir una lista plana de configuraciones.
     *          En otras palabras, no es posible definir "subconfiguraciones" 
     *          dentro de una configuración. Esa debe resolverlo la GUI.
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
              _VAL[atrNombre][CONFIG.ATR_SINCRONIZADO] = false;
            }
            if (!_VAL[atrNombre].hasOwnProperty(_atributo.nombre) || _VAL[atrNombre][_atributo.nombre] === undefined) {
              _VAL[atrNombre][_atributo.nombre] = atrValor;
              _VAL[atrNombre][CONFIG.ATR_SINCRONIZADO] = false;
              _VAL[CONFIG.ATR_SINCRONIZADO] = false;
            }
          }
        }
        // Inicialización de un atributo simple del esquema
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        else if (!_VAL.hasOwnProperty(_atributo.nombre) || _VAL[_atributo.nombre] === undefined) {
          _VAL[_atributo.nombre] = _atributo.valorPorDefecto;
          _VAL[CONFIG.ATR_SINCRONIZADO] = false;
        }
        return _atributo;
      }
    };
    
    /**
     * sincronizar
     * Marca internamente al esquema para indicar que sus contenidos ya fueron
     * sincronizados. Esto quiere decir que los valores del objeto que hace uso
     * del esquema concuerdan con los contenidos almacenados en la colección de
     * pares "atributo-valor" que se mantiene dentro del propio esquema.
     * Si se indica un "subesquema", entonces se marcan como "sincronizados" los
     * contenidos de dicho subesquema en lugar del esquema completo.
     * La "desincronización" puede ocurrir cuando los valores del esquema son 
     * modificados externamente (por ejemplo, desde la GUI). La sincronización, 
     * en ese caso, debe actualizar los datos del objeto que hace uso del esquema
     * (por ejemplo, una "Escena") para que ambos concuerden.
     */
    _ESQ.sincronizar = (subesquema) => {
      if (!subesquema) {
        _VAL[CONFIG.ATR_SINCRONIZADO] = true;
      }
      else {
        if (_VAL.hasOwnProperty(subesquema)) {
          _VAL[subesquema][CONFIG.ATR_SINCRONIZADO] = true;
        }
      }
    };

    /**
     * estaSincronizado
     * Indica si los contenidos del esquema están sincronizados. Si se indica
     * el nombre de un "subesquema", es decir, un tipo de atributo especial que 
     * guarda un esquema de atributos subordinado en lugar de un valor simple, 
     * entonces la función indica si los contenidos de dicho subesquema están 
     * sincronizados.
     * Un esquema está sincronizado, cuando los valores de sus atributos concuerdan
     * con los del objeto que hace uso de éste (por ejemplo, una "Escena"). La 
     * "desincronización" puede darse cuando el esquema es modificado de forma
     * externa, por ejmplo, desde una GUI.
     */
    _ESQ.estaSincronizado = (subesquema) => {
      if (!subesquema) {
        return _VAL[CONFIG.ATR_SINCRONIZADO];
      }
      else {
        if (_VAL.hasOwnProperty(subesquema) && _VAL[subesquema].hasOwnProperty(CONFIG.ATR_SINCRONIZADO)) {
          return _VAL[subesquema][CONFIG.ATR_SINCRONIZADO];
        }
        else {
          return true;
        }
      }
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
        
      for (const [atrNombre, atrValor] of Object.entries(atributos)) {
        if (atrValor !== null && atrNombre != CONFIG.ATR_SINCRONIZADO) {
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
            salida += indentacion + "\t" + atrNombre + "\t:\t[";
            for (let i = 0; i < atrValor.length; i++) {
                let elementoArray = {};
                elementoArray[CONFIG.ATR_ELEMENTO] = atrValor[i];
                salida += _convertirATexto(elementoArray, indentacion + "\t") + (i < atrValor.length - 1 ? "," : "");              
            }
            salida += "\n" + indentacion + "\t],\n";
            existenValores = true;
          }
          else {
            let valor = typeof atrValor === "number" || typeof atrValor === "boolean" ? atrValor : "'" + atrValor + "'";
            salida += _formatearRegistroExportado(indentacion, atrNombre, valor, esUnObjeto);
            existenValores = true;
          }
        }
      }
      salida += esUnObjeto ? indentacion + "}" : "";
      return existenValores ? salida : null;      
    }
    
    /**
     * _formatearRegistroExportado
     * Función interna que construye una línea del formato de exportación
     */
    function _formatearRegistroExportado(indentacion, atrNombre, atrValor, esUnObjeto = true) {
        if (esUnObjeto)
            return indentacion + "\t" + atrNombre + "\t:\t" + atrValor + ",\n";
        else
            return indentacion + "\t" + atrValor;
    }

    /**
     * _obtenerFuncionSocorrista
     * Verifica si el objeto recibido como argumento corresponde a alguna de las definiciones
     * de entidades del módulo del "socorro" (ej.: una "Variable", un "Vector", un "Estilo", 
     * un "Actor", etc). En ese caso, retorna la función del socorrista que corresponda para 
     * crear el objeto. Sino, devuelve "undefined".
     */
    function _obtenerFuncionSocorrista(objeto) {
      // --------------------------------------
      // Se verifica si es una "VARIABLE"
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      if (objeto.hasOwnProperty('metodo') &&
         (objeto.hasOwnProperty('valor') || objeto.hasOwnProperty('valorDesde') || objeto.hasOwnProperty('valorDesde'))) {
        return S.O.S.Variable;
      }
      // --------------------------------------
      // Se verifica si es un "VECTOR"
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      else if (_cumplimentaDef(objeto, 'x', 'y', 'z')) {
        return S.O.S.Vector;
      }
      // --------------------------------------
      // Se verifica si es un "ESTILO"
      // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
      else if (_cumplimentaDef(objeto, CONFIG.EST_COLOR, CONFIG.EST_GRANDOR, 
                                       CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO, CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO,
                                       CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_ALFA, CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO + CONFIG.ATR_VARIABLE_ALFA)) {
          return S.O.S.Estilo;
      }
      else if (_cumplimentaDef(objeto, CONFIG.ACT_ORIGEN, CONFIG.ACT_VELOCIDAD, CONFIG.ACT_ESTILO)) {
          return S.O.S.Actor;
      }

      // Si no corresponde a ningún objeto, se retorna "undefined"
      return undefined;
    }
  
    /**
     * _cumplimentaDef
     * Retorna "true" o "false" indicando si el objeto recibido como primer
     * argumento cumplimenta con los atributos indicados por la lista del
     * segundo argumento. Es decir, cualquier atributo del objeto debe estar
     * definido en la lista de atributos indicada. No debe necesariamente
     * incluirlos todos, pero no puede tampoco tener atributos que no estén
     * indicados en dicha lista.
     */
    function _cumplimentaDef(objeto, ...atributos) {
      const _claves = Object.keys(objeto);
      let _verifica = true;
      for (let i = 0; i < _claves.length; i++) {
        let _claveEncontrada = false;
        for (let j = 0; j < atributos.length; j++) {
          if (_claves[i] == atributos[j]) {
            _claveEncontrada = true;
            break;
          }
        }
        if (!_claveEncontrada) {
          _verifica = false;
          break;
        }
      }
      return _verifica && _claves.length >= 1 && _claves.length <= atributos.length;
    }
    
    /**
     * _incorporarAlReparto
     * Función interna que se encarga de sumar al objeto recibido como argumento
     * al reparto general de la "Escena", siempre y cuando el objeto sea un "Actor".
     */
    function _incorporarAlReparto(objeto) {
        if (S.O.S.esUnActor(objeto)) {
            objeto.ficha(S.O.S.ficharReparto(_ESQ.identificador, objeto));
        }
    }
    
    return _ESQ;
}


export default Esquema;