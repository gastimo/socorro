/*
 * =============================================================================
 * 
 *                       M Ó D U L O    V A R I A B L E
 * 
 * =============================================================================
 */
import CONFIG from './config';
import COLOR  from './color';
import Esquema from './esquema';


/**
 * Variable
 * Una "Variable" es un objeto JavaScript utilitario para evaluar/calcular, en tiempo 
 * de ejecución, el valor de un atributo NUMÉRICO de un "Esquema". La "Variable" puede 
 * ser usada, entonces, para variar dinámicamente los valores de aquellos atributos 
 * cuya representación interna sea numérica como, por ejemplo, el color, la opacidad, 
 * el grosor, el tamaño o, incluso, las coordenadas <x, y> de un "Esquema".
 * 
 * Los "Métodos de Evaluación" para el cálculo dinámico del valor de la "Variable",  
 * junto con sus parámetros, se definen con la función "map" y pueder agruparse bajo las
 * siguientes categorías (por cada una hay más de un método):
 * 
 *  1. FIJO   : Retorna un valor estático (no hay variación en tiempo de ejecución).
 *  2. MAPA   : Mapea un rango de valores de origen a un rango de valores admitidos.
 *  3. TIEMPO : Mapea intervalos (cíclicos) de tiempo con un rango de valores admitidos.
 *  4. AZAR   : Mapea un rango de valores al azar (0..1) con un rango de valores admitidos.
 * 
 * Independientemente del método de cálculo configurado, también se le puede aplicar
 * ruido aleatorio adicional (perlin) al valor resultante calculado de la "Variable". 
 * 
 * Por último, vale aclarar que una "Variable" es también un "Esquema", por lo tanto,
 * hereda todas las funciones de éste, además de incorporar nuevas:
 *  - def()   - Definición de atributos y valores. Función heredada de "Esquema".
 *  - map()   - Configuración del "Método de Evaluación" para realizar el mapeo dinámico.
 *  - ruido() - Define el ruido aleatorio a incorporar al resultado final de la evaluación.
 *  - val()   - Obtención del valor. Redefine la función heredada de "Esquema" para hacer el mapeo.
 */
function Variable(S) {
    let _ESQ = Esquema(S, CONFIG.NOMBRE_VARIABLE);
    let _calculadora = null;
    _inicializar();
    const _VAR = S.O.S.revelar({}, _ESQ);
    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades de la "Variable".
     */
    function _inicializar() {
        _ESQ.def({metodo         : CONFIG.METODO_EVAL_FIJO});
        _ESQ.def({valor          : null});
        _ESQ.def({modulador      : null});
        _ESQ.def({origenDesde    : null});
        _ESQ.def({origenHasta    : null});
        _ESQ.def({valorDesde     : null});
        _ESQ.def({valorHasta     : null});
        _ESQ.def({ruidoVelocidad : null});
        _ESQ.def({ruidoEscala    : null});
    }

    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" del quien la
     * "Variable" extiende. Se redefine acá simplemente para retornar, al final,
     * el objeto "Variable" actual para permitir definiciones encadenadas.
     */
    _VAR.def = (atributos) => {
        _ESQ.def(atributos);
        return _VAR;
    };
    
    /**
     * map
     * Define los parámetros de la "Variable" dinámica para realizar, en tiempo de ejecución, 
     * el mapeo o cálculo  del valor numérico del atributo del "Esquema", mediante los diferentes 
     * "Métodos de Evaluación" admitidos. El formato general de los argumentos es:
     * 
     *   var.map(<método>, <[rango-origen]>, <[rango-destino]>, <modulador>);
     * 
     * Para los "Métodos de Evaluación" de la categoría TIEMPO o AZAR, el [rango-origen] no se
     * utiliza. Por otro lado, el [rango-destino] puede indicarse mediante dos valores numéricos
     * (<valorDesde> y <ValorHasta>) o mediante un "array" de valores predefinido (<arrayValores>).
     * 
     * EJEMPLOS AGRUPADOS POR CATEGORÍAS:
     * 1. CATEGORÍA FIJO - Valores estáticos que no cambian en ejecución:
     *   var.map(<valor>); 
     *   var.map('fijo', <valor>);
     * 
     * 2. CATEGORÍA AZAR - Mapea rangos al azar. El "modulador" ajusta el ruido perlin:
     *   var.map('azar',   <valorDesde>,   <valorHasta>);
     *   var.map('perlin,  <valorDesde>,   <valorHasta>, <modulador>);
     *   var.map('azar',   <arrayValores>);
     *   var.map('perlin', <arrayValores>, <modulador>); 
     * 
     * 3. CATEGORÍA TIEMPO - Mapea intervalos de tiempo. El "modulador" permite acelerar o enlentecer:
     *   var.map('ciclo',  <valorDesde>,   <valorHasta>, <modulador>);
     *   var.map('lapso',  <valorDesde>,   <valorHasta>, <modulador>);
     *   var.map('ciclo',  <arrayValores>, <modulador>);
     *   var.map('lapso',  <arrayValores>, <modulador>);
     * 
     * 4. CATEGORÍA MAPA - Mapea propiedades de objetos. Requiere indicar el rango origen de valores a mapear:
     *   var.map('orden',  <origenDesde>, <origenHasta>, <valorDesde>,   <valorHasta>, <modulador>);
     *   var.map('dist',   <origenDesde>, <origenHasta>, <valorDesde>,   <valorHasta>, <modulador>);
     *   var.map('orden',  <origenDesde>, <origenHasta>, <arrayValores>, <modulador>);
     *   var.map('dist',   <origenDesde>, <origenHasta>, <arrayValores>, <modulador>);
     * 
     * NOTA: En todos los casos, para indicar el rango de valores finales, se pueden usar los argumentos
     *       <valorDesde> y <valorHasta> o, en su lugar, se puede especificar un nombre de rango predefinido
     *       (<arrayValores>). Por ejemplo, para trabajar con "Gradientes" de colores se usa esta opción.
     */
    _VAR.map = (...parametros) => {
        _inicializar();  // Primero, se inicializan TODOS los parámetros de la "Variable" en nulo
        _calculadora = null;
        let _metodoEvaluacion = _ESQ.val('metodo');
        if (parametros.length >= 1) {
            if (_esUnMetodoDeEvaluacion(parametros[0])) {
                _metodoEvaluacion = parametros[0];
                _ESQ.def({metodo : _metodoEvaluacion});            
            }
            else {
                _ESQ.def({valor : parametros[0]});
                return _VAR;
            } 
            // ---------------------------------------------------------------------------
            // ANÁLISIS DE LOS ARGUMENTOS DE LA INVOCACIÓN (2+ ARGUMENTOS)
            if (parametros.length >= 2) {
                if (_metodoEvaluacion == CONFIG.METODO_EVAL_FIJO) {
                    _ESQ.def({valor : parametros[1]});
                    return _VAR;
                }                
                // 2 ARGUMENTOS ---------------------------------------------------------
                if (_esUnRangoDeValores(parametros[1])) { 
                    _ESQ.def({valor : parametros[1]});
                    if (parametros.length > 2)
                        _ESQ.def({modulador : parametros[2]});
                }
                // ANÁLISIS DE LOS ARGUMENTOS DE LA INVOCACIÓN (3+ ARGUMENTOS)
                else if (parametros.length >= 3) {
                    // 3 ARGUMENTOS ----------------------------------------------------
                    if (parametros.length == 3) {
                        _ESQ.def({valorDesde : parametros[1]});
                        _ESQ.def({valorHasta : parametros[2]});  
                    }
                    // 4 ARGUMENTOS ----------------------------------------------------
                    else if (parametros.length == 4) {
                        if (_esUnRangoDeValores(parametros[3])) {
                            _ESQ.def({origenDesde : parametros[1]});
                            _ESQ.def({origenHasta : parametros[2]}); 
                            _ESQ.def({valor       : parametros[3]});
                        }
                        else {
                            _ESQ.def({valorDesde : parametros[1]});
                            _ESQ.def({valorHasta : parametros[2]}); 
                            _ESQ.def({modulador  : parametros[3]});
                        }
                    }
                    // 5 ARGUMENTOS ----------------------------------------------------
                    else if (parametros.length == 5) {
                        if (_esUnRangoDeValores(parametros[3])) {
                            _ESQ.def({origenDesde : parametros[1]});
                            _ESQ.def({origenHasta : parametros[2]}); 
                            _ESQ.def({valor       : parametros[3]});
                            _ESQ.def({modulador   : parametros[4]});
                        }
                        else {
                            _ESQ.def({origenDesde : parametros[1]});
                            _ESQ.def({origenHasta : parametros[2]}); 
                            _ESQ.def({valorDesde  : parametros[3]});
                            _ESQ.def({valorHasta  : parametros[4]});
                        }                            
                    }
                    // 6+ ARGUMENTOS ---------------------------------------------------
                    else if (parametros.length >= 6) {
                        _ESQ.def({origenDesde : parametros[1]});
                        _ESQ.def({origenHasta : parametros[2]}); 
                        _ESQ.def({valorDesde  : parametros[3]});
                        _ESQ.def({valorHasta  : parametros[4]});
                        _ESQ.def({modulador   : parametros[5]});
                    }
                }
                // EXCEPCIÓN: 2 argumentos, pero sin rango. Se asumen un rango desde "0".
                else {
                    _ESQ.def({valorDesde : 0});
                    _ESQ.def({valorHasta : parametros[1]});  
                }
            }
        }
        return _VAR;
    }; 
    
    /**
     * ruido
     * Mediante esta función se indica cuánto ruido (distorsión aleatoria) se 
     * debe añadir al valor calculado de la variable dinámica. Para esto, se 
     * utiliza la función de P5 que genera ruido "Perlin". 
     * - <velocidad> : indica que tan rápido el ruido generado varía entre invocación
     *                 e invocación (qué tan suavizado o pronunciado es). 
     * - <escala>    : indica la variacion máxima que puede llegar a distorsionarse
     *                 el valor calculado. Es decir, el ruido generado será siempre
     *                 un porcentaje de la "escala" que será adicionado.
     */
    _VAR.ruido = (velocidad = 0.012, escala = 1.0) => {
        _ESQ.def({ruidoVelocidad : velocidad});
        _ESQ.def({ruidoEscala    : escala});
        return _VAR;
    };
    
    /**
     * val
     * Función que se ocupa de calcular, en tiempo de ejecución, el valor de la 
     * "Variable" dinámica según el "Método de Evaluación" definido.
     */
    _VAR.val = (S) => {
        let _contextoEjecucion;

        // 1. CREACIÓN DE LA "CALCULADORA" (OBJETO AUXILIAR)
        // La primera vez que es invocado este método, se crea su "Calculadora"
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (!_calculadora) {
            _calculadora = _Calculadora();
            let _valorVar   = _ESQ.val('valor');
            let _valorDesde = _ESQ.val('valorDesde');
            let _valorHasta = _ESQ.val('valorHasta');
            if (_esUnRangoDeValores(_valorVar)) {
                let _valoresRango = []; 
                if (COLOR.GRADIENTES.hasOwnProperty(_valorVar))  // TODO: ¿Podrían ser otros rangos además de colores?
                    _valoresRango = COLOR.GRADIENTES[_valorVar](S);
                _calculadora.desde(_ESQ.val('metodo'), _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(..._valoresRango);
            }
            else if (_valorDesde || _valorHasta)
                _calculadora.desde(_ESQ.val('metodo'), _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(_valorDesde, _valorHasta);
            else 
                _calculadora.desde(_ESQ.val('metodo'), _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(_valorVar);
        }

        // 2. PREPARACIÓN DEL CONTEXTO DE EJECUCIÓN Y CÁLCULO DINÁMICO DE LA VARIABLE
        // Se pone a disposición el contexto de ejecución y se realiza el cálculo del valor dinámico.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        _contextoEjecucion = _calculadora.contexto(S.O.S.clave());
        if (_contextoEjecucion.hasOwnProperty('nuevo')) {
            let _ruidoVelocidad = _ESQ.val('ruidoVelocidad');
            _contextoEjecucion.aux       = undefined;
            _contextoEjecucion.modulador = _ESQ.val('modulador') ?? 1.0;
            _contextoEjecucion.perlin    = S.O.S.ruido(0.0, 1.0, _contextoEjecucion.modulador ?? 0.016);
            _contextoEjecucion.ruido = _ruidoVelocidad ? S.O.S.ruido(0.0, 1.0, _ruidoVelocidad) : () => {return 1.0;};
            delete _contextoEjecucion.nuevo;
        }
        let _ruidoEscala = _ESQ.val('ruidoEscala');
        S.O.S.PARAM = _contextoEjecucion;
        let _v = _calculadora.calc(S);
        return _VAR.esUnColor(_v) ? _v : _v + (_ruidoEscala ? _contextoEjecucion.ruido() * _ruidoEscala : 0);
    };
        
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
    return _VAR;
}



/*
 * =============================================================================
 * 
 *                           C A L C U L A D O R A
 * 
 * =============================================================================
 */
  
/**
 * _Calculadora
 * Objeto auxiliar usado sólo internamente dentro del módulo para llevar a cabo el cálculo 
 * del valor de una "Variable", en otras palabras, Este objeto en particular admite tanto 
 * valores estáticos como un rango de valores posibles, que son interpolados en tiempo de 
 * ejecución, en el momento que sean requeridos. Provee tres funciones básicas:
 *  - desde() : Define la función de origen de mapeo y el rango de valores de dicha función. 
 *  - hasta() : Define el valor o los valores de destino (como una lista o rangos ponderados).
 *  - calc()  : Realiza el cálculo o mapeo del rango origen con el rango destino.
 */
function _Calculadora() {
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
    * calc
    * Aplica la configuración para realizar el cálculo dinámico del valor. Para esto,
    * realiza el mapeo entre el "rango origen" y el "rango destino". Es decir, ejecuta  
    * la "Función de Mapeo Dinámico" (si fue indicada) y mapea su resultado contra el 
    * rango de valores de destino.
    */
    _VAL.calc = (S) => {
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
            if (!_esUnColor(_valorActual.val)) {
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
          return funcionInterpolacion(S, pos, ini.pos, fin.pos, ini.val, fin.val);  
        }
        else {
          return _VAL.valoresEnRangos.length > 0 ? _VAL.valoresEnRangos[0].val : null;          
        }
    };

    /**
     * contexto
     * Retorna un objeto que almacena las variables dinámicas del contexto
     * de ejecución para la clave recibida como argumento.
     */
    _VAL.contexto = (clave) => {
        if (!_contexto.hasOwnProperty(clave)) {
            _contexto[clave] = {clave : clave,
                               nuevo : true};
        }
        return _contexto[clave];
    };

    /**
     * esUnColor
     * Retorna "true" o "false" indicando si el argumento recibido es un
     * tipo de dato de p5js utilizado para almacenar un color.
     */        
    function _esUnColor(valor) {
        return valor && valor.hasOwnProperty("mode");
    }
    
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


export default Variable;


