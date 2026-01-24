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
 * el grosor, el tamaño o, incluso, las coordenadas <x, y> de un "Esquema". También
 * puede ser utilizada para hacer variar valores de tipo "Vector".
 * 
 * Los "Métodos de Evaluación" para el cálculo dinámico del valor de la "Variable",  
 * junto con sus parámetros, se definen con la función "map" y pueder¿n agruparse bajo
 * las siguientes categorías (por cada una hay más de un método):
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
 *  - mod()   - Definición del valor "modulador" utilizado en las funciones de mapeo dinámico.
 *  - ruido() - Define el ruido aleatorio a incorporar al resultado final de la evaluación.
 *  - val()   - Obtención del valor. Redefine la función heredada de "Esquema" para hacer el mapeo.
 */
function Variable(S, ...parametros) {
    const _ESQ = Esquema(S, CONFIG.NOMBRE_VARIABLE);
    const _VAR = S.O.S.revelar({}, _ESQ);
    let _calculadora = null;
    _inicializar();

    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades de la "Variable".
     */
    function _inicializar() {
        _ESQ.def({metodo         : CONFIG.METODO_EVAL_FIJO});
        _ESQ.def({valor          : null});
        _ESQ.def({origenDesde    : null});
        _ESQ.def({origenHasta    : null});
        _ESQ.def({valorDesde     : null});
        _ESQ.def({valorHasta     : null});
        _ESQ.def({modulador      : null});
        _ESQ.def({ruidoVelocidad : null});
        _ESQ.def({ruidoEscala    : null});
    }

    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien la
     * "Variable" extiende. Se redefine simplemente para retornar, al final,
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
     * Las "Variables" también admite "Vectores", por lo tanto, el [rango-destino] también puede
     * indicarse como un par de objetos de tipo "Vector" en lugar de simples valores numéricos.
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
     * NOTA 1: Cada vez que se hace referencia a un "valor", "valorDesde" o "valorHasta" puede usarse
     *         tanto un valor numérico simple como un objeto de tipo "Vector".
     * NOTA 2: En todos los casos, para indicar el rango de valores finales, se pueden usar los argumentos
     *         <valorDesde> y <valorHasta> o, en su lugar, se puede especificar un nombre de rango predefinido
     *        (<arrayValores>). Por ejemplo, para trabajar con "Gradientes" de colores se usa esta opción.
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
                // CASO DE EXCEPCIÓN: La invocación tiene 2 argumentos. El primero es un
                // método de evaluación válido. Sólo hay un argumento adicional y no se  
                // trata de un array de valores predefinido (un "gradiente", por ejemplo).
                else {
                    _ESQ.def({valorDesde : 0});
                    _ESQ.def({valorHasta : parametros[1]});  
                }
            }
        }
        return _VAR;
    };
    if (parametros) {
        _VAR.map(...parametros);
    }

    
    /**
     * mod
     * Define el valor del "modulador" a aplicar durante la función de mapeo.
     * El "modulador" es un valor numérico utilizado para alterar (modular) el
     * rango de valores de origen para el mapeo. Su valor está vinculado con
     * tipo de "Método de Evalución". Por ejemplo:
     * 
     * - CICLO      : Valor para acelerar o enlentecer el ciclo de tiempo (función "sin")
     * - CONTRACICLO: Valor para acelerar o enlentecer el ciclo de tiempo (función "coseno")
     * - PERLIN     : Representa la escala para la generación de ruido perlin ("offset")
     * - LAPSO      : Indica cada cuantos milisegundos se reinicia el lapso (operador "módulo" o "%")
     * - AZAR       : Indica cada cuantos milisegundos se genera un nuevo valor aleatorio
     */
    _VAR.mod = (modulador) => {
        _ESQ.def({modulador : modulador});
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
    _VAR.val = () => {
        let _contextoEjecucion;
        let _metodo = _ESQ.val('metodo');

        // 1. CREACIÓN DE LA "CALCULADORA" (OBJETO AUXILIAR)
        // La primera vez que es invocado este método, se crea su "Calculadora"
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (!_calculadora) {
            _calculadora = _Calculadora(S);
            let _valorVar   = _ESQ.val('valor');
            let _valorDesde = _ESQ.val('valorDesde');
            let _valorHasta = _ESQ.val('valorHasta');
            if (_esUnRangoDeValores(_valorVar)) {
                let _valoresRango = []; 
                if (COLOR.GRADIENTES.hasOwnProperty(_valorVar))  // TODO: ¿Podrían ser otros rangos además de colores?
                    _valoresRango = COLOR.GRADIENTES[_valorVar](S);
                _calculadora.desde(_metodo, _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(..._valoresRango);
            }
            else if (_valorDesde || _valorHasta)
                _calculadora.desde(_metodo, _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(_valorDesde, _valorHasta);
            else 
                _calculadora.desde(_metodo, _ESQ.val('origenDesde'), _ESQ.val('origenHasta')).hasta(_valorVar);
        }

        // 2. PREPARACIÓN DEL CONTEXTO DE EJECUCIÓN Y CÁLCULO DINÁMICO DE LA VARIABLE
        // Se pone a disposición el contexto de ejecución y se realiza el cálculo del valor dinámico.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        _contextoEjecucion = _calculadora.contexto(_ESQ.clave, _ESQ.val('modulador') ?? EVAL[_metodo]?.mod, _ESQ.val('ruidoVelocidad'));
        let _v = _calculadora.calc(_contextoEjecucion);
        
        // 3. ADICIÓN DEL RUIDO
        // En caso de haber definido un ruido, se adiciona éste al valor resultante
        // tanto para números simples como para vectores
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let _ruido = _contextoEjecucion.ruido?.();
        if (!S.O.S.esUnColor(_v) && _ruido) {
            if (S.O.S.esUnVector(_v))
                _v.sumar(_ruido * _ESQ.val('ruidoEscala') ?? 1);
            else 
                _v += _ruido * _ESQ.val('ruidoEscala') ?? 1;
        }
        return _v;
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
        return EVAL.hasOwnProperty(argumento);
    }
        
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
function _Calculadora(S) {
    const _contexto = {};
    const _VAL = {
        valorSimple     : null,
        valoresEnRangos : [],
        funcionDinamica : null,
        rangoIni        : null,
        rangoFin        : null,
        desde           : null,
        hasta           : null,
        esVector        : false
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
     * Define el valor/los valores admitidos del objeto (DESTINO). Este valor puede ser estático 
     * (ya sea numérico o un objeto "Vector") o, sino, se puede definir un array con los valores 
     * posibles como resultado del mapeo. Los argumentos de esta función, por lo tanto, pueden 
     * ser los siguientes:
     *   hasta(<valor>)                    : Define un valor simple y estático (numérico o "Vector").
     *   hasta(<val1>, <val2>, ... <valn>) : Listado posible de valores admitidos (numéricos o "Vector").
     *   hasta({pos: 0.0,  val: <val1>},   : Cada argumento es un objeto JSON para construir el rango de valores
     *         {pos: <p>,  val: <val2>},     admitidos y ponderados ("pos"). Cada objeto contiene dos datos:
     *          ...                          - "pos" : la posición ponderada (valor entre "0" y "1").
     *         {pos: 1.0,  val: <valn>})     - "val" : valor límite superior del rango (numérico o "Vector").
     */
     _VAL.hasta = (...valores) => {
        if (valores.length == 1) {
          _VAL.valorSimple = valores[0];
        }
        for (let i = 0; i < valores.length; i++) {
            if (Object.prototype.toString.call(valores[i]) === '[object Object]' && valores[i].hasOwnProperty("pos")) {
                _VAL.valoresEnRangos.push(valores[i]);
                _VAL.valorSimple = null;
                _VAL.esVector = S.O.S.esUnVector(valores[i].val) ? true : _VAL.esVector;
            }
            else {
                _VAL.esVector = S.O.S.esUnVector(valores[i]) ? true : _VAL.esVector;
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
    _VAL.calc = (ctx) => {
        if (_VAL.valorSimple !== null && _VAL.valorSimple !== undefined) {
          return _VAL.valorSimple;
        }
        
        if (_VAL.funcionDinamica) {        
            if (!_VAL.esVector) {
                S.O.S.VAR = ctx.PUBX;
                return _mapear(EVAL[_VAL.funcionDinamica].met(S));
            }
            else {
                let _vecFinal = S.O.S.Vector();
                S.O.S.VAR = ctx.PUBX;
                _vecFinal.x = _mapear(EVAL[_VAL.funcionDinamica].met(S), 'x');
                S.O.S.VAR = ctx.PUBY;
                _vecFinal.y = _mapear(EVAL[_VAL.funcionDinamica].met(S), 'y');
                S.O.S.VAR = ctx.PUBZ;
                _vecFinal.z = _mapear(EVAL[_VAL.funcionDinamica].met(S), 'z');
                return _vecFinal;
            }
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
    _VAL.contexto = (clave, modulador, ruidoVelocidad) => {
        if (!_contexto.hasOwnProperty(clave)) {
            let _contextoEjecucion = {};

            // CONTEXTO DE EJECUCION (RUNTIME)
            // Estructura con variables públicas y privadas para ser usadas en tiempo de
            // ejecución. Se crea un contexto diferente (un "scope") por cada combinación
            // de "Variable" y objeto para el que su atributo está siendo evaluado.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (ruidoVelocidad) {  // Generador de ruido "perlin" interno de la variable
                _contextoEjecucion.ruido = S.O.S.ruido(0.0, 1.0, ruidoVelocidad);
            }
            
            // CONTEXTO PÚBLICO
            // Armado del contexto con las variables públicas que pueden ser accedidas
            // por los "Métodos de Evaluación" dinámicos en tiempo de ejecución.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            let _pub = {};
            _pub.clave = clave;
            _pub.mod = modulador;
            let _pubX = {};
            if (_VAL.funcionDinamica === CONFIG.EVAL_RUIDO)
                _pubX.perlin = S.O.S.ruido(0.0, 1.0, _pub.mod); 
            _contextoEjecucion.PUBX = S.O.S.revelar(_pubX, _pub);
            if (_VAL.esVector) {
                let _pubY = {};
                if (_VAL.funcionDinamica === CONFIG.EVAL_RUIDO)
                    _pubY.perlin = S.O.S.ruido(0.0, 1.0, _pub.mod);
                _contextoEjecucion.PUBY = S.O.S.revelar(_pubY, _pub);
                let _pubZ = {};
                if (_VAL.funcionDinamica === CONFIG.EVAL_RUIDO)
                    _pubZ.perlin = S.O.S.ruido(0.0, 1.0, _pub.mod);
                _contextoEjecucion.PUBZ = S.O.S.revelar(_pubZ, _pub);
            }
            
            // ALMACENAMIENTO DEL CONTEXTO
            // Finalmente, el contexto construido es guardado internamente, 
            // asociado al objeto invocante para ser recuperado cada vez que 
            // sea necesario calcular un valor dinámico de dicho objeto.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _contexto[clave] = _contextoEjecucion;
        }
        return _contexto[clave];
    };

    /**
     * _mapear
     * Función privada utilizada internamente por el método "calc" que se ocupa de
     * hacer el mapeo e interpolación de los valores configurados en la "Variable",
     * es decir, la ejecución de la función dinámica para obtener un valor normalizado
     * para, luego, interpolar dicho valor en el "array" con los rangos de destino.
     * Esta función permite interpolar tanto valores numéricos simples, como objetos
     * de tipo "color" de p5js y, también, objetos de tipo "Vector".
     */
    function _mapear(pos, coord) {
        // 1. OBTENER VALOR ORIGEN NORMALIZADO
        // En primer lugar, se ejecuta la función de mapeo dinámico (el "Método de Evalución")
        // y se lo termina convirtiendo en un valor normalizado (entre "0" y "1").
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (_VAL.rangoIni || _VAL.rangoFin) {
            pos = S.O.S.mapear(pos, _VAL.rangoIni, _VAL.rangoFin, 0.0, 1.0); // Normalización del dato origen
        }        

        // 2. MAPEAR (INTERPOLAR) EL VALOR CON EL RANGO "DESTINO"
        // El valor normalizado obtenido en el primer paso, se utiliza para interpolar el valor
        // en el rango de valores de "destino" (teniendo en cuenta la ponderación "pos").
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let ini = {pos: 0.0, val: undefined};
        let fin = {pos: 1.0, val: undefined};
        let funcionInterpolacion = _interporlarColor;
        for (let i = _VAL.valoresEnRangos.length - 1; i >= 0; i--) {
            let _valorActual = _VAL.valoresEnRangos[i];

            // Definir la función de interpolación según el tipo de valor (numérico simple, color o "Vector")
            if (!S.O.S.esUnColor(_valorActual.val)) {
              funcionInterpolacion = _interpolarNumero;
            }
            // Se recorre el "array" de valores de destino para encontrar el valor interpolado
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
        
        // 3. INTERPOLACIÓN
        // Una vez encontrado el rango dentro del "array" que corresponde a los 
        // valores a interpolar, se invoca a la función correspondiente.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (!coord)
            return funcionInterpolacion(pos, ini.pos, fin.pos, ini.val, fin.val); 
        else {
            if (ini.val.hasOwnProperty(coord) || fin.val.hasOwnProperty(coord)) {
                return funcionInterpolacion(pos, ini.pos, fin.pos, ini.val?.[coord], fin.val?.[coord]);
            }
            else
                return undefined;
        }
    }

    /**
     * _interpolarNumero
     * Función privada que interpola dos valores numéricos teniendo en cuenta 
     * la posición "ponderada" de cada uno de ellos en el rango ("pos").
     */
    function _interpolarNumero(pos, ini1, fin1, ini2, fin2) {
        if (ini1 === undefined && fin1 === undefined)
            return undefined;
        else if (ini2 === undefined && fin2 === undefined)
            return undefined;
        else if (ini1 == fin1)
            return ini1 == 1 ? ini1 : fin1;
        return S.O.S.mapear(pos, ini1, fin1, ini2, fin2); 
    }

    /**
     * _interporlarColor
     * Función privada que interpola dos colores de un gradiente, teniendo en cuenta las
     * "paradas" o posiciones "ponderadas" de cada color dentro del gradiente ("pos").
     */
    function _interporlarColor(pos, paradaColorIni, paradaColorFin, colorIni, colorFin) {
        if (paradaColorIni == paradaColorFin) {
            return paradaColorIni == 1 ? colorIni : colorFin;
        }
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

// -----------------------------------------------
//  Inicialización de los "Métodos de Evaluación"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
const EVAL = {};
    EVAL[CONFIG.EVAL_FIJO]        = {}; 
    EVAL[CONFIG.EVAL_CICLO]       = {};
    EVAL[CONFIG.EVAL_CONTRACICLO] = {};
    EVAL[CONFIG.EVAL_LAPSO]       = {};
    EVAL[CONFIG.EVAL_AZAR]        = {};
    EVAL[CONFIG.EVAL_RUIDO]       = {};
    EVAL[CONFIG.EVAL_ORDEN]       = {};
    EVAL[CONFIG.EVAL_DISTANCIA]   = {};
    EVAL[CONFIG.EVAL_RECORRIDO]   = {};



// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "CICLO" Y "CONTRACICLO"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Estos métodos utilizan las funciones trigonométricas de "seno" y "coseno" aplicadas al tiempo
// (la cantidad de milisegundos transcurridos) para devolver valores cíclicos entre "0" y "1".
// El modulador es un coeficiente que permite acelerar o enlentecer los valores calculados. 
EVAL[CONFIG.EVAL_CICLO].mod = 1800; 
EVAL[CONFIG.EVAL_CICLO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                         S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                       return Math.sin((S.O.S.tiempo() + S.O.S.VAR.aux) / S.O.S.VAR.mod) / 2 + 0.5;
                                     };
EVAL[CONFIG.EVAL_CONTRACICLO].mod = 1800; 
EVAL[CONFIG.EVAL_CONTRACICLO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                               S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                             return Math.cos((S.O.S.tiempo() + S.O.S.VAR.aux) / S.O.S.VAR.mod) / 2 + 0.5;
                                           };

// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "LAPSO"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Utiliza el operador de "módulo" sobre el tiempo (la cantidad de milisegundos transcurridos) para
// producir ciclos repetitivos de valores entre "0" y "1" (que vuelven a iniciarse en "0" cada vez).
// El modulador es un coeficiente que permite acelerar o enlentecer los valores calculados (el "módulo"). 
EVAL[CONFIG.EVAL_LAPSO].mod = 777; 
EVAL[CONFIG.EVAL_LAPSO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                         S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                       return ((S.O.S.tiempo() + S.O.S.VAR.aux) % S.O.S.VAR.mod) / S.O.S.VAR.mod;
                                     };


// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "AZAR"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Utiliza la función "random" para generar valores entre "0" y "1". El "modulador" indica  
// cada cuantos milisengundos se vuelve a generar un nuevo valor aleatorio.
EVAL[CONFIG.EVAL_AZAR].mod = 1200; 
EVAL[CONFIG.EVAL_AZAR].met = (S) => {if (!S.O.S.VAR.hasOwnProperty('aux') || S.O.S.VAR.aux + S.O.S.VAR.mod < S.O.S.tiempo()) {
                                        S.O.S.VAR.aux = S.O.S.tiempo();
                                        S.O.S.VAR.azar = S.O.S.aleatorio();
                                     }
                                     return S.O.S.VAR.azar;
                                    };


// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "RUIDO"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Genera ruido al azar con el algoritmo "perlin". El resultado es siempre un número entre "0" y "1".
// El "modulador" indica el desplazamiento para la generación del ruido perlin, es decir, es un 
// coeficiente para incrementar la intensidad o velocidad del desplazamiento en la generación.
EVAL[CONFIG.EVAL_RUIDO].mod = 0.016; 
EVAL[CONFIG.EVAL_RUIDO].met = (S) => {return S.O.S.VAR.perlin();};


// -----------------------------------------------
//  OTROS MÉTODOS DE EVALUACIÓN
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
EVAL[CONFIG.EVAL_ORDEN].mod = 1;
EVAL[CONFIG.EVAL_ORDEN].met = (S) => {return null;};

EVAL[CONFIG.EVAL_DISTANCIA].mod = 1;
EVAL[CONFIG.EVAL_DISTANCIA].met = (S) => {return S.O.S.ACTOR.distancia * S.O.S.VAR.mod;};

EVAL[CONFIG.EVAL_RECORRIDO].mod = 1;
EVAL[CONFIG.EVAL_RECORRIDO].met = (S) => {return S.O.S.ACTOR.recorrido * S.O.S.VAR.mod;};


// LEGACY METHODS
/*
  distanceToOrigin   : (stimulus) => {return stimulus.position.dist(stimulus.origin)},
  orderMod200        : (stimulus) => {return stimulus.order % 200},
  zPositionMod200    : (stimulus) => {return Math.abs(stimulus.position.z) % 200},
*/


export default Variable;


