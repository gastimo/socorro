/*
 * =============================================================================
 * 
 *                          M Ó D U L O    G U I O N
 * 
 * =============================================================================
 */
import CONFIG from './config';


/**
 * Guion
 * El "Guion" describe los rasgos principales de la "Escena" y de sus dos entidades actuantes
 * principales: el "Actor" y el "Reparto". A diferencia del objeto "Esquema", que guarda la 
 * definición de instancias individuales de las entidades actuantes (detallando sus atributos
 * y sus valores particulaes), el "Guion" describe a modo general sólo entidades principales  
 * e, incluso, antes de que éstas sean instanciadas. 
 * 
 * Otra diferencia entre el "Guion" y el "Esquema" es que este último admite la definición de
 * sus atributos de manera jerárquica, en otras palabras, puede haber atributos anidados dentro
 * de otros atributos. En el "Guion" se describe una estructura plana con las propiedades de 
 * los atributos del primer nivel únicamente.
 * 
 * El "Guion" tiene dos funciones principales durante la representación de la "Escena":
 *  1. INTERFAZ: Aporta detalles de la "Escena" y de cada una de sus entidades actuantes (actor, 
 *     reparto) que permiten, luego, confeccionar una GUI (uan "Interfaz Gráfica de Usuario") 
 *     para manipular, en tiempo de ejecución, la representación de los "Actores" y "Repartos".
 *     Por ejemplo, el "Guion" define las etiquetas a mostrar en la GUI por cada atributo, 
 *     sus repertorios o espacios de valores permitidos y sus lógicas a la hora de variar sus
 *     valores (rango de valores permitidos, tamaño de los incrementos, etc).
 * 
 *  2. CÁLCULO: En el "Guion" también se pueden especificar comportamientos opcionales vinculados
 *     con el cálculo del valor de los atributos del "Esquema", esto es, sus valores por defectos
 *     y la posibilidad de heredar los valores desde entidades actuantes superiores cuando la
 *     información no está presente.
 * 
 * En resumen, en el "Guion" se incluye un apartado por cada una de las tres entidades actuantes
 * principales, o sea: la "Escena", el "Reparto" y el "Actor". Las indicaciones del "Guion" se 
 * aplicarán, luego, al "Esquema" en tiempo de ejecución.
 *  
 */
function Guion() {
    const _GUION = {};
    
    // --------------------------------------------------------------------
    // 
    //  GUIONES INDIVIDUALES DE LOS "ESQUEMAS" DEL MÓDULO
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    _GUION.def = (esquema, guion) => {
        _GUION[esquema] = guion;
        return _GUION;
    };
    
    _GUION.cargar = (guiones) => {
        if (guiones) {
            for (const [esquema, guion] of Object.entries(guiones)) {
                if (esquema == CONFIG.NOMBRE_ESCENA || esquema == CONFIG.NOMBRE_ACTOR || esquema == CONFIG.NOMBRE_REPARTO) {
                    _GUION.def(esquema, guion);
                }
            }
        }
    };

    _GUION.obtener = (esquema, atributo) => {
        let _g;
        if (!atributo)
            _g = _GUION[esquema];
        else {
            for (let i = 0; i < _GUION[esquema].length; i++) {
                if (_GUION[esquema][i][CONFIG.GUI_NOMBRE] == atributo) {
                    _g = _GUION[esquema][i];
                    break;
                }
            }
        }
        return _g;
    };
    
    
    /**
     * _DetalleGuion
     * Objeto interno para almacenar los detalles de un atributo individual de una entidad
     * actuante de la "Escena". Admite una serie de parámetros (sólo el primero es obligatorio):
     *  1. Nombre               : Nombre del atributo del esquema.
     *  2. Valor por defecto    : Valor por defecto para su incialización.
     *  3. Valor mínimo/valores : Junto con el siguiente argumento, definen el rango
     *                            de valores aceptado. Pero, si se indica un "array"
     *                            o un "objeto", entonces se asume el "Repertorio".
     *  4. Valor máximo         : Junto con el argumento anterior (si no es un "array"
     *                            u "objeto") definen el rango de valores aceptado.
     *  5. Incremento           : Si se estableció un rango de valores (con los dos 
     *                            argumentos anteriores), indica de cuánto en cuánto
     *                            se debe incrementar el valor.
     */
    function _DetalleGuion(S, ...parametros) {

        const _DET = {
            nombre          : undefined,
            valorPorDefecto : undefined,
            valorMinimo     : undefined,
            valorMaximo     : undefined,
            incremento      : undefined,
            repertorio      : undefined,
            heredar         : undefined,
            etiqueta        : undefined,
            atributo        : undefined
        };

        // Especificación por objeto JSON
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (parametros.length == 1) {
            for (const [atrGuionNombre, atrGuionValor] of Object.entries(parametros)) {
                if (atrGuionNombre == CONFIG.GUI_NOMBRE)
                    _DET[CONFIG.GUI_NOMBRE] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_VALOR_DEFECTO)
                    _DET[CONFIG.GUI_VALOR_DEFECTO] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_VALOR_MINIMO)
                    _DET[CONFIG.GUI_VALOR_MINIMO] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_VALOR_MAXIMO)
                    _DET[CONFIG.GUI_VALOR_MAXIMO] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_INCREMENTO)
                    _DET[CONFIG.GUI_INCREMENTO] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_REPERTORIO)
                    _DET[CONFIG.GUI_REPERTORIO] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_HEREDAR)
                    _DET[CONFIG.GUI_HEREDAR] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_ETIQUETA)
                    _DET[CONFIG.GUI_ETIQUETA] = atrGuionValor;
                else if (atrGuionNombre == CONFIG.GUI_ATRIBUTO)
                    _DET[CONFIG.GUI_ATRIBUTO] = atrGuionValor;
            }
        }
        // Especificación por argumentos posicionales
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        else if (parametros.length > 1) {
            _DET.nombre          = parametros[0];
            _DET.valorPorDefecto = parametros.length > 1 ? parametros[1] : undefined;
            _DET.valorMinimo     = parametros.length > 2 ? parametros[2] : undefined;
            _DET.valorMaximo     = parametros.length > 3 ? parametros[3] : undefined;
            _DET.incremento      = parametros.length > 4 ? parametros[4] : undefined;
            if (_DET.valorMinimo && (Array.isArray(_DET.valorMinimo) || typeof _DET.valorMinimo === 'object')) {
                _DET.repertorio = Array.isArray(_DET.valorMinimo) ? _DET.valorMinimo : Object.keys(_DET.valorMinimo);
                _DET.valorMinimo = null;
                _DET.valorMaximo = null;
            }
        }

        return _DET;
    }
        
    return _GUION;
}


export default Guion;