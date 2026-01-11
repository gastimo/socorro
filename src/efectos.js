/*
 * =============================================================================
 * 
 *                       M Ó D U L O    E F E C T O S
 * 
 * =============================================================================
 */
import CONFIG from './config';
import COLOR  from './color';
import Esquema from './esquema';


/**
 * Efecto
 * Un "Efecto" es un objeto JavaScript utilitario para evaluar (calcular), en tiempo 
 * de ejecución, el valor de un atributo NUMÉRICO de un "Esquema". El "Efecto" puede 
 * ser usado, entonces, para variar dinámicamente los valores de aquellos atributos 
 * cuya representación interna sea numérica como, por ejemplo, el color, la opacidad, 
 * el grosor, el tamaño o, incluso, las coordenadas <x, y> de un "Esquema".
 * 
 * Los "Métodos de Evaluación" para el cálculo dinámico del valor del "Efecto", junto 
 * con sus parámetros, se definen con la función "map" y pueder agruparse bajo las
 * siguientes categorías (por cada una hay más de un método):
 * 
 *  1. FIJO   : Retorna un valor estático (no hay variación en tiempo de ejecución).
 *  2. MAPA   : Mapea un rango de valores de origen a un rango de valores admitidos.
 *  3. TIEMPO : Mapea intervalos (cíclicos) de tiempo con un rango de valores admitidos.
 *  4. AZAR   : Mapea un rango de valores al azar (0..1) con un rango de valores admitidos.
 * 
 * Independientemente del método de cálculo configurado, el "Efecto" también puede
 * aplicar ruido aleatorio adicional (perlin) al valor resultante. 
 * 
 * Por último, vale aclarar que un "Efecto" es también un "Esquema", por lo tanto,
 * hereda todas las funciones de éste (y, también, incorpora nuevas):
 *  - def()   - Definición de atributo. Función heredada de "Esquema", tal cual.
 *  - map()   - Configuración del "Método de Evaluación" para realizar el mapeo dinámico.
 *  - ruido() - Define el ruido aleatorio a incorporar al resultado final de la evaluación.
 *  - val()   - Obtención del valor. Redefine la función heredada de "Esquema" para hacer el mapeo.
 */
function Efecto(S) {
    let _esquema;
    let _valorDinamico = null;
    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Efecto".
     */
    function _inicializar() {
        _esquema = Esquema(S, CONFIG.NOMBRE_EFECTO);
        _esquema.def({metodo         : CONFIG.METODO_EVAL_FIJO});
        _esquema.def({valor          : null});
        _esquema.def({modulador      : null});
        _esquema.def({origenDesde    : null});
        _esquema.def({origenHasta    : null});
        _esquema.def({valorDesde     : null});
        _esquema.def({valorHasta     : null});
        _esquema.def({ruidoVelocidad : null});
        _esquema.def({ruidoEscala    : null});
        return _esquema;
    }

    /**
     * map
     * Define los parámetros del "Efecto" para realizar, en tiempo de ejecución, el mapeo o cálculo 
     * del valor numérico del atributo del "Esquema", mediante los diferentes "Métodos de Evaluación".
     * 
     * EJEMPLOS: 
     * 1. CATEGORÍA FIJO - Valores estáticos que no cambian en ejecución:
     *   ef.map(<valor>); 
     *   ef.map(EVAL.fijo, <valor>);
     * 
     * 2. CATEGORÍA AZAR - Mapea rangos al azar. El "modulador" ajusta el ruido perlin:
     *   ef.map(EVAL.azar,   <valorDesde>,   <valorHasta>);
     *   ef.map(EVAL.perlin, <valorDesde>,   <valorHasta>, <modulador>);
     *   ef.map(EVAL.azar,   <arrayValores>);
     *   ef.map(EVAL.ruido, <arrayValores>, <modulador>); 
     * 
     * 3. CATEGORÍA TIEMPO - Mapea intervalos de tiempo. El "modulador" permite acelerar o enlentecer:
     *   ef.map(EVAL.ciclo,  <valorDesde>,   <valorHasta>, <modulador>);
     *   ef.map(EVAL.lapso,  <valorDesde>,   <valorHasta>, <modulador>);
     *   ef.map(EVAL.ciclo,  <arrayValores>, <modulador>);
     *   ef.map(EVAL.lapso,  <arrayValores>, <modulador>);
     * 
     * 4. CATEGORÍA MAPA - Mapea propiedades de objetos. Requiere indicar el rango origen de valores a mapear:
     *   ef.map(EVAL.orden,  <origenDesde>, <origenHasta>, <valorDesde>,   <valorHasta>, <modulador>);
     *   ef.map(EVAL.dist,   <origenDesde>, <origenHasta>, <valorDesde>,   <valorHasta>, <modulador>);
     *   ef.map(EVAL.orden,  <origenDesde>, <origenHasta>, <arrayValores>, <modulador>);
     *   ef.map(EVAL.dist,   <origenDesde>, <origenHasta>, <arrayValores>, <modulador>);
     * 
     * NOTA: En todos los casos, para indicar el rango de valores finales, se pueden usar los argumentos
     *       <valorDesde> y <valorHasta> o, en su lugar, se puede especificar un nombre de rango predefinido
     *       (<arrayValores>). Por ejemplo, para trabajar con "Gradientes" de colores se usa esta opción.
     */
    function map(...parametros) {
        _inicializar();  // Primero, se inicializan TODOS los parámetros del "Efecto" en nulo
        _valorDinamico = null;
        let _metodoEvaluacion = _esquema.val('metodo');
        if (parametros.length >= 1) {
            if (_esUnMetodoDeEvaluacion(parametros[0])) {
                _metodoEvaluacion = parametros[0];
                _esquema.def({metodo : _metodoEvaluacion});            
            }
            else {
                _esquema.def({valor : parametros[0]});
                return;
            } 
            // ---------------------------------------------------------------------------
            // ANÁLISIS DE LOS ARGUMENTOS DE LA INVOCACIÓN (2+ ARGUMENTOS)
            if (parametros.length >= 2) {
                if (_metodoEvaluacion == CONFIG.METODO_EVAL_FIJO) {
                    _esquema.def({valor : parametros[1]});
                    return;
                }                
                // 2 ARGUMENTOS ---------------------------------------------------------
                if (_esUnRangoDeValores(parametros[1])) { 
                    _esquema.def({valor : parametros[1]});
                    if (parametros.length > 2)
                        _esquema.def({modulador : parametros[2]});
                }
                // ANÁLISIS DE LOS ARGUMENTOS DE LA INVOCACIÓN (3+ ARGUMENTOS)
                else if (parametros.length >= 3) {
                    // 3 ARGUMENTOS ----------------------------------------------------
                    if (parametros.length == 3) {
                        _esquema.def({valorDesde : parametros[1]});
                        _esquema.def({valorHasta : parametros[2]});  
                    }
                    // 4 ARGUMENTOS ----------------------------------------------------
                    else if (parametros.length == 4) {
                        if (_esUnRangoDeValores(parametros[3])) {
                            _esquema.def({origenDesde : parametros[1]});
                            _esquema.def({origenHasta : parametros[2]}); 
                            _esquema.def({valor       : parametros[3]});
                        }
                        else {
                            _esquema.def({valorDesde : parametros[1]});
                            _esquema.def({valorHasta : parametros[2]}); 
                            _esquema.def({modulador  : parametros[3]});
                        }
                    }
                    // 5 ARGUMENTOS ----------------------------------------------------
                    else if (parametros.length == 5) {
                        if (_esUnRangoDeValores(parametros[3])) {
                            _esquema.def({origenDesde : parametros[1]});
                            _esquema.def({origenHasta : parametros[2]}); 
                            _esquema.def({valor       : parametros[3]});
                            _esquema.def({modulador   : parametros[4]});
                        }
                        else {
                            _esquema.def({origenDesde : parametros[1]});
                            _esquema.def({origenHasta : parametros[2]}); 
                            _esquema.def({valorDesde  : parametros[3]});
                            _esquema.def({valorHasta  : parametros[4]});
                        }                            
                    }
                    // 6+ ARGUMENTOS ---------------------------------------------------
                    else if (parametros.length >= 6) {
                        _esquema.def({origenDesde : parametros[1]});
                        _esquema.def({origenHasta : parametros[2]}); 
                        _esquema.def({valorDesde  : parametros[3]});
                        _esquema.def({valorHasta  : parametros[4]});
                        _esquema.def({modulador   : parametros[5]});
                    }
                }
                // EXCEPCIÓN: 2 argumentos, pero sin rango. Se asumen un rango desde "0".
                else {
                    _esquema.def({valorDesde : 0});
                    _esquema.def({valorHasta : parametros[1]});  
                }
            }
        }
    } 
    
    /**
     * ruido
     * Mediante esta función se indica cuánto ruido (distorsión aleatoria) se 
     * debe añadir al valor calculado dinámicamente. Para esto, se utiliza
     * la función de P5 que genera ruido "Perlin". 
     * - <velocidad> : indica que tan rápido el ruido generado varía entre invocación
     *                 e invocación (qué tan suavizado o intenso es). 
     * - <escala>    : indica la variacion máxima que puede llegar a distorsionarse
     *                 el valor calculado. Es decir, el ruido generado será siempre
     *                 un porcentaje de la escala.
     */
    function ruido(velocidad = 0.1, escala = 1.0) {
        _esquema.def({ruidoVelocidad : velocidad});
        _esquema.def({ruidoEscala    : escala});
    }
    
    /**
     * val
     * Función que se ocupa de calcular, en tiempo de ejecución, el valor del "Efecto"
     * según el "Método de Evaluación" que se haya configurado durante su definición.
     */
    function val(S) {
        let _contextoEjecucion;

        // 1. CREACIÓN DEL OBJETO AUXILIAR "VALOR DINÁMICO"
        // La primera vez que es invocado este método, se crea su "ValorDinámico"
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (!_valorDinamico) {
            _valorDinamico = ValorDinamico();
            let _valorEfecto = _esquema.val('valor');
            let _valorDesde  = _esquema.val('valorDesde');
            let _valorHasta  = _esquema.val('valorHasta');
            if (_esUnRangoDeValores(_valorEfecto)) {
                let _valoresRango = []; 
                if (COLOR.GRADIENTES.hasOwnProperty(_valorEfecto))  // TODO: ¿Podrían ser otros rangos además de colores?
                    _valoresRango = COLOR.GRADIENTES[_valorEfecto](S);
                _valorDinamico.desde(_esquema.val('metodo'), _esquema.val('origenDesde'), _esquema.val('origenHasta')).hasta(..._valoresRango);
            }
            else if (_valorDesde || _valorHasta)
                _valorDinamico.desde(_esquema.val('metodo'), _esquema.val('origenDesde'), _esquema.val('origenHasta')).hasta(_valorDesde, _valorHasta);
            else 
                _valorDinamico.desde(_esquema.val('metodo'), _esquema.val('origenDesde'), _esquema.val('origenHasta')).hasta(_valorEfecto);
        }

        // 2. PREPARACIÓN DEL CONTEXTO DE EJECUCIÓN Y CÁLCULO DINÁMICO
        // Se pone a disposición el contexto de ejecución y ser realiza la "Evaluación Dinámica"
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        _contextoEjecucion = _valorDinamico.contexto(S.O.S.clave());
        if (_contextoEjecucion.hasOwnProperty('nuevo')) {
            let _ruidoVelocidad = _esquema.val('ruidoVelocidad');
            _contextoEjecucion.aux       = undefined;
            _contextoEjecucion.modulador = _esquema.val('modulador');
            _contextoEjecucion.perlin    = S.O.S.ruido(0.0, 1.0, _contextoEjecucion.modulador ?? 0.016);
            _contextoEjecucion.ruido = _ruidoVelocidad ? S.O.S.ruido(0.0, 1.0, _ruidoVelocidad) : () => {return 1.0;};
            delete _contextoEjecucion.nuevo;
        }
        let _ruidoEscala = _esquema.def('ruidoEscala');
        S.O.S.PARAM = _contextoEjecucion;
        let _v = _valorDinamico.calcular(S);
        return _v.hasOwnProperty("mode") ? _v : _v + (_contextoEjecucion.ruido() * (_ruidoEscala ?? 1.0));
    }
    
    /**
     * _esUnRangoDeValores
     * Retorna "true" o "false" indicando si el argumento corresponde a un 
     * rango predefinido de valores en lugar de a un valor simple. Por ejemplo,
     * todos los "Gradientes" son rangos de colores, definidos bajo un nombre.
     */
    function _esUnRangoDeValores(argumento) {
        return typeof argumento === 'string';
    }
    
    /**
     * _esUnMetodoDeEvaluacion
     * Retorna "true" o "false" indicado si el argumento corresponde
     * a alguno de los "Métodos de Evaluación" existentes.
     */
    function _esUnMetodoDeEvaluacion(argumento) {
        return MetodosDeEvaluacion.hasOwnProperty(argumento);
    }
        
    // ===============================================================
    // ===> Se exponen únicamente las funciones públicas del figurante
    // ==> ("Revealing Module Pattern") y se implementa la herencia.
    // ===============================================================
    return S.O.S.revelar({map, val}, _inicializar());
}



/*
 * =============================================================================
 * 
 *                          V A L O R    D I N Á M I C O
 * 
 * =============================================================================
 */
  
/**
 * ValorDinamico
 * Objeto auxiliar usado internamente para llevar a cabo el cálculo dinámico del valor de
 * un "Efecto". Este objeto en particular admite tanto valores estáticos como valores dinámicos, 
 * que son interpolados en tiempo de ejecución, en el momento que sean requeridos.
 * Este objeto provee tres funciones básicas:
 *  - desde()   : Define la función de origen de mapeo y el rango de valores de dicha función. 
 *  - hasta()   : Define el valor o los valores de destino (como una lista o rangos ponderados).
 *  - calcular(): Realiza el cálculo o mapeo del rango origen con el rango destino.
 */
function ValorDinamico() {
    const _contexto = {};
    const _VAL = {
        valorSimple     : null,
        valoresEnRangos : [],
        funcionDinamica : null,
        rangoIni        : null,
        rangoFin        : null,
        desde           : null,
        hasta           : null,
        calcular        : null
    };

    /**
     * desde
     * Define, por un lado, la función para llevar a cabo el mapeo y, por otro, los dos valores 
     * que marcan el inicio y el final del rango de valores de origen para realizar dicho mapeo.
     */
    _VAL.desde = (funcionMapeo, rangoMapeoIni, rangoMapeoFin) => {
        _VAL.funcionDinamica = funcionMapeo;
        _VAL.rangoIni = rangoMapeoIni ?? 0.0;
        _VAL.rangoFin = rangoMapeoFin ?? 1.0;
        return _VAL;
    };
    
    /**
     * hasta
     * Define el valor/los valores admitidos del objeto (DESTINO). Este valor puede ser estático o, sino, 
     * se pueden definir los valores posibles como resultado del mapeo. Por lo tanto, los argumentos
     * de esta función pueden ser los siguientes:
     *   hasta(<valor>)                    : define un valor simple y estático (no se realizará mapeo al calcular).
     *   hasta(<val1>, <val2>, ... <valn>) : los valores indicados definen el listado posible de valores admitidos.
     *   hasta({pos: 0.0,  val: <val1>},   : cada argumento es un objeto JSON para construir el rango de valores
     *         {pos: <p>,  val: <val2>},     admitidos y ponderados ("pos"). Cada objeto contiene dos datos:
     *          ...                          - "pos" : la posición ponderada (valor entre "0" y "1").
     *         {pos: 1.0,  val: <valn>})     - "val" : el valor para esa posición (límite superior del rango)
     */
     _VAL.hasta = (...valores) => {
        if (valores.length == 1) {
          _VAL.valorSimple = valores[0];
        }
        for (let i = 0; i < valores.length; i++) {
            if (Object.prototype.toString.call(valores[i]) === '[object Object]' && valores[i].hasOwnProperty("pos")) {
                _VAL.valoresEnRangos.push(valores[i]);
                _VAL.valorSimple = null;
            }
            else {
                if (valores.length == 1) {
                  _VAL.valoresEnRangos.push({pos: 0.0, val: valores[i]});
                  _VAL.valoresEnRangos.push({pos: 1.0, val: valores[i]});  
                }
                else {
                  _VAL.valoresEnRangos.push({pos: 1.0 / (valores.length - 1) * i, val: valores[i]});
                }
            }
        }
        return _VAL;
    };

   /**
    * calcular
    * Aplica la configuración para realizar el cálculo del valor, llevando a cabo el mapeo
    * entre el "rango origen" y el "rango destino". Es decir, ejecuta la "Función de
    * Mapeo Dinámico" (si fue indicada) y mapea su resultado con el rango de valores
    * de destino.
    */
    _VAL.calcular = (S) => {
        if (_VAL.valorSimple !== null && _VAL.valorSimple !== undefined) {
          return _VAL.valorSimple;
        }
        if (_VAL.funcionDinamica) {
          let pos = MetodosDeEvaluacion[_VAL.funcionDinamica](S);
          let funcionInterpolacion = _interporlarColor;
          if (_VAL.rangoIni || _VAL.rangoFin) {
            pos = S.O.S.mapear(pos, _VAL.rangoIni, _VAL.rangoFin, 0.0, 1.0); // Normalización del dato origen
          }
          let ini = {pos: 0.0, val: null};
          let fin = {pos: 1.0, val: null};
          for (let i = _VAL.valoresEnRangos.length - 1; i >= 0; i--) {
            let _valorActual = _VAL.valoresEnRangos[i];
            if (!_valorActual.val.hasOwnProperty("mode")) {                 // Significa que el valor es un color
              funcionInterpolacion = _interpolarNumero;
            }
            if (_valorActual.pos == pos) {
              return _valorActual.val;
            }
            else {
              if (_valorActual.pos >= ini.pos && _valorActual.pos < pos) {
                ini = _valorActual;
              }
              if (_valorActual.pos <= fin.pos && _valorActual.pos > pos) {
                fin = _valorActual;
              }
            }
          }
          return funcionInterpolacion(S, pos, ini.pos, fin.pos, ini.val ?? fin.val, fin.val ?? ini.val);  
        }
        else {
          return _VAL.valoresEnRangos.length > 0 ? _VAL.valoresEnRangos[0].val : null;          
        }
    };

    /**
     * contexto
     * Retorna un objeto que almacena las variables dinámicas del contexto
     * de ejecución dinámico para la clave recibida como argumento.
     */
    _VAL.contexto = (clave) => {
        if (!_contexto.hasOwnProperty(clave)) {
            _contexto[clave] = {clave : clave,
                               nuevo : true};
        }
        return _contexto[clave];
    };
    
    /**
     * _interpolarNumero
     * Función privada que interpola dos valores numéricos teniendo en cuenta 
     * la posición "ponderada" de cada uno de ellos en el rango ("pos").
     */
    function _interpolarNumero(S, pos, ini1, fin1, ini2, fin2) {
        return S.O.S.mapear(pos, ini1, fin1, ini2, fin2); 
    }

    /**
     * _interporlarColor
     * Función privada que interpola dos colores de un gradiente, teniendo en cuenta las
     * "paradas" o posiciones "ponderadas" de cada color dentro del gradiente ()"pos").
     */
    function _interporlarColor(S, pos, paradaColorIni, paradaColorFin, colorIni, colorFin) {
        let posInterpolada = (pos - paradaColorIni) / (paradaColorFin - paradaColorIni);
        let colorIniR = S.O.S.P5.red  (colorIni);
        let colorIniG = S.O.S.P5.green(colorIni);
        let colorIniB = S.O.S.P5.blue (colorIni);
        let colorFinR = S.O.S.P5.red  (colorFin);
        let colorFinG = S.O.S.P5.green(colorFin);
        let colorFinB = S.O.S.P5.blue (colorFin);
        return S.O.S.P5.color(colorIniR * (1.0 - posInterpolada) + colorFinR * posInterpolada,
                             colorIniG * (1.0 - posInterpolada) + colorFinG * posInterpolada,
                             colorIniB * (1.0 - posInterpolada) + colorFinB * posInterpolada);        
    }
    
    return _VAL;
}



/*
 * =============================================================================
 * 
 *                 M É T O D O S    D E    E V A L U A C I Ó N
 * 
 * =============================================================================
 */


const MetodosDeEvaluacion = {};

// MÉTODO "FIJO" - Retorna nulo
MetodosDeEvaluacion[CONFIG.METODO_EVAL_FIJO] = 
    (S) => {return null;}; 

// MÉTODO "CICLO" - Usa la función "seno" para ciclos que van y vienen entre "0" y "1". El "modulador" permite acelerar o enlentecer
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_CICLO] = 
    (S) => {return Math.sin(S.O.S.tiempo() / S.O.S.PARAM.modulador) / 2 + 0.5;};

// MÉTODO "CONTRACICLO" - Usa la función "coseno" para ciclos que van y vienen entre "0" y "1". El "modulador" permite acelerar o enlentecer
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_CONTRACICLO] = 
    (S) => {return Math.cos(S.O.S.tiempo() / S.O.S.PARAM.modulador) / 2 + 0.5;};

// MÉTODO "LAPSO" - Usa la función "modulo" para repetir lapsos (que vuelven a iniciarse en "0"). El "modulador" permite acelerar o enlentecer
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_LAPSO] = 
    (S) => {return (S.O.S.tiempo() % S.O.S.PARAM.modulador) / S.O.S.PARAM.modulador;};

// MÉTODO "AZAR" - Usa la función "random" para generar valores. El "modulador" indica cada cuantos cuadros vuelve a generar otro valor aleatorio
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_AZAR] = 
    (S) => {if (S.O.S.PARAM.aux === undefined || S.O.S.cuadros() % S.O.S.PARAM.modulador == 0) S.O.S.PARAM.aux = S.O.S.aleatorio(); return S.O.S.PARAM.aux;};

// MÉTODO "RUIDO" - Genera ruido al azar con el algoritmo "perlin". El "modulador" indica el desplazamiento para la generación del ruido perlin
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_RUIDO] = 
    (S) => {return S.O.S.PARAM.perlin();};


MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_ORDEN]       = (S) => {return null;};
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_CANTIDAD]    = (S) => {return null;};
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_DISTANCIA]   = (S) => {return null;};
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_DISTANCIA_X] = (S) => {return null;};
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_DISTANCIA_Y] = (S) => {return null;};
MetodosDeEvaluacion[CONFIG.METODO_EVAL_X_DISTANCIA_Z] = (S) => {return null;};


// LEGACY METHODS
/*
  distanceToOrigin   : (stimulus) => {return stimulus.position.dist(stimulus.origin)},

  orderMod20         : (stimulus) => {return stimulus.order % 20},
  orderMod200        : (stimulus) => {return stimulus.order % 200},
  orderMod2000       : (stimulus) => {return stimulus.order % 2000},

  zPositionMod20     : (stimulus) => {return Math.abs(stimulus.position.z) % 20},
  zPositionMod200    : (stimulus) => {return Math.abs(stimulus.position.z) % 200},
  zPositionMod2000   : (stimulus) => {return Math.abs(stimulus.position.z) % 2000},
*/


export default Efecto;


