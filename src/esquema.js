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
function Esquema(S, nombre) {
    const _nombre = nombre ?? CONFIG.NOMBRE_ESQUEMA;
    const _clave  = S.O.S.obtenerClave(_nombre);
    const _DEF = {};
    const _VAL = {};
    _VAL[CONFIG.ATR_VISIBLE] = true;
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
    function def(atributos) {
      if (atributos) {
        const _defRecursiva = (atrVector, subatributos) => {
          for (const [atrNombre, atrValor] of Object.entries(subatributos)) {
            // DEFINCIÓN DE VALORES DE SUBESQUEMA
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (atrValor !== null && atrValor !== undefined && typeof atrValor === 'object' && !Array.isArray(atrValor)) {
              if (_esUnEfecto(atrValor)) {
                  atrVector[atrNombre] = S.O.S.Efecto();
                  atrVector[atrNombre].def(atrValor);
                  continue;
              }
              // Si el nombre del "subesquema" no está definido (o existe pero no es un "subesquema"), se inicializa
              else if (!atrVector.hasOwnProperty(atrNombre) || typeof atrVector[atrNombre] !== 'object' || Array.isArray(atrVector[atrNombre])) {
                atrVector[atrNombre] = atrValor;  // Esto es intencional, para mantener el puntero al objeto
                atrVector[atrNombre][CONFIG.ATR_SINCRONIZADO] = true;
              }
              // Invocación recursiva para definir los valores del "subesquema"
              _defRecursiva(atrVector[atrNombre], atrValor);
            }
            // DEFINICIÓN DE VALORES SIMPLES
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else {
              atrVector[atrNombre] = atrValor;
            }
          }
          // Se marca como "desincronizado" aún cuando no se haya definido ningún valor real.
          atrVector[CONFIG.ATR_SINCRONIZADO] = false;
        };
        _defRecursiva(_VAL, atributos);
      }
    }
  
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
    function val(...atributos) {
      if (atributos.length == 0) {
        return _VAL;
      }
      else {
        let _valoresDeAtributos = _VAL;
        for (let i = 0; i < atributos.length; i++) {
          if (_valoresDeAtributos.hasOwnProperty(atributos[i])) {
            if (i == atributos.length - 1) {
              let _valor = _valoresDeAtributos[atributos[i]];
              if (_valor && _valor.hasOwnProperty('val') && _valor.val && typeof _valor.val === 'function') {
                return _valor.val(S);
              }
              else {
                return _valor;
              }
            }
            else {
              _valoresDeAtributos = _valoresDeAtributos[atributos[i]];
            }
          }
          else {
            return null;
          }
        }
      }
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
    function config(...parametros) {
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
    }
  
      
    /**
     * clave
     * Devuelve la clave interna de identificación del objeto
     */
    function clave() {
      return _clave;
    }
  
    /**
     * inicializar
     * Función que crea la "Definición" del esquema asociado a la escena.
     * Los atributos que se inicialicen en este punto podrán ser importados,
     * exportados y/o manipulados desde la GUI del "Panel Conrolador".
     */
    function inicializar() {
    }

  
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
    function sincronizar(subesquema) {
      if (!subesquema) {
        _VAL[CONFIG.ATR_SINCRONIZADO] = true;
      }
      else {
        if (_VAL.hasOwnProperty(subesquema)) {
          _VAL[subesquema][CONFIG.ATR_SINCRONIZADO] = true;
        }
      }
    }

  
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
    function estaSincronizado(subesquema) {
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
    }

  
    /**
     * visible
     * Indica y/o define la visibilidad del esquema, es decir, si los
     * contenidos del esquema pueden ser visualizados por el usuario
     * (desplegados en pantalla).
     */
    function visible(valor) {
      if (valor !== undefined) {
        _VAL[CONFIG.ATR_VISIBLE] = valor;
      }
      return _VAL[CONFIG.ATR_VISIBLE];
    }

  
    /**
     * exportar
     * Devuelve una cadena de caracteres con el contenido del esquema
     * convertido a texto (en formato JSON).
     */
    function exportar(indentacion = "") {
      return _convertirATexto(_VAL, indentacion);
    }
  
  
    /**
     * _convertirATexto
     * Función privada que convierte a texto (en formato JSON) cada uno de
     * los pares <atributo, valor> del esquema recibido como argumento.
     * La función se invoca recursivamente en caso de detectar subesquemas.
     */
    function _convertirATexto(atributos, indentacion = "") {
      let salida = "{\n";
      let existenValores = false;
      for (const [atrNombre, atrValor] of Object.entries(atributos)) {
        if (atrValor !== null && atrNombre != CONFIG.ATR_SINCRONIZADO && atrNombre != CONFIG.ATR_VISIBLE) {
          if (typeof atrValor === 'object') {
            let subesquema = atrValor.exportar?.(indentacion + "\t");
            if (subesquema === undefined) {
              subesquema = _convertirATexto(atrValor, indentacion + "\t");
            }
            if (subesquema !== null) {
              salida += indentacion + "\t" + atrNombre + "\t:\t" + subesquema + ",\n";
              existenValores = true;  
            }
          }
          else {
            let valor = typeof atrValor === "number" || typeof atrValor === "boolean" ? atrValor : "'" + atrValor + "'";
            salida += indentacion + "\t" + atrNombre + "\t:\t" + valor + ",\n";
            existenValores = true;
          }
        }
      }
      salida += indentacion + "}";
      return existenValores ? salida : null;      
    }
  
    /**
     * _esUnEfecto
     * Función privada para indicar si el objeto recibido como
     * argumento es un "Efecto"
     */
    function _esUnEfecto(esquema) {
      return esquema.hasOwnProperty('metodo') &&
            (esquema.hasOwnProperty('valor') || esquema.hasOwnProperty('valorDesde') || esquema.hasOwnProperty('valorDesde'));
    }

  

    // ===============================================================
    // ===> Se exponen únicamente las funciones públicas del esquema 
    // ==> ("Revealing Module Pattern")
    // ===============================================================
    return {config,
           val,
           def,
           clave,
           inicializar,
           sincronizar,
           estaSincronizado,
           visible,
           exportar,
          };
}


export default Esquema;