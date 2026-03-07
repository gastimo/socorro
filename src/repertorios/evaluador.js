/*
 * =============================================================================
 * 
 *                        M Ó D U L O    E V A L U A D O R
 * 
 * =============================================================================
 */

/**
 * Evaluador
 * Definición de los "Métodos de Evaluación" (cálculo dinámico) del valor de los 
 * atributos de las "entidades del socorro" (ver la definición de "Esquemas").
 * 
 * Los "Métodos de Evaluación" pueden ser agrupados bajo las siguientes categorías:
 * 
 *  1. FIJO   : Retorna un valor estático (no hay variación en tiempo de ejecución).
 *  2. TIEMPO : Mapea intervalos (cíclicos) de tiempo con un rango de valores admitidos.
 *  3. AZAR   : Mapea un rango de valores al azar (0..1) con un rango de valores admitidos.
 *  4. ACTOR  : Mapea el valor de un atributo del "Actor" con un rango de valores admitidos.
 * 
 * En todos los casos (excepto el método "FIJO") se realiza un mapeo entre un rango de 
 * valores de origen y otro rango de valores de destino admitidos. Para el caso de los
 * métodos de tipo "TIEMPO" o "AZAR" no se requiere indicar un rango de valores de origen,
 * pero sí es obligatorio hacerlo para utilizar los métodos de la categoría "ACTOR".
 * 
 * La invocación a estos métodos para el cálculo de los atributos dinámicos es realizada
 * por el objeto "Variable" (y su caso particular de "Variador").
 * 
 */
const Evaluador = (S) => {
    
// -----------------------------------------------------
//  Nombres de los "Métodos de Evaluación" predefinidos
// -----------------------------------------------------
    const FIJO        = 'fijo';
    const CICLO       = 'ciclo';          // TIEMPO
    const CONTRACICLO = 'contraciclo';    // TIEMPO
    const LAPSO       = 'lapso';          // TIEMPO
    const AZAR        = 'azar';           // AZAR
    const RUIDO       = 'perlin';         // AZAR
    const ORDEN       = 'orden';          // ACTOR
    const PUESTO      = 'puesto';         // ACTOR
    const DISTANCIA   = 'dist';           // ACTOR
    const RECORRIDO   = 'recorrido';      // ACTOR
// -----------------------------------------------------
    const _EVAL = {};
// -----------------------------------------------------

    // Funciones utilitarias
    _EVAL.Estatico   = FIJO;
    _EVAL.Perlin     = RUIDO;
    _EVAL.esEstatico = (metodo) => {return metodo === FIJO;};
    _EVAL.esPerlin   = (metodo) => {return metodo === RUIDO;};

    
// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "CICLO" Y "CONTRACICLO"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Estos métodos utilizan las funciones trigonométricas de "seno" y "coseno" aplicadas al tiempo
// (la cantidad de milisegundos transcurridos) para devolver valores cíclicos entre "0" y "1".
// El modulador es un coeficiente que permite acelerar o enlentecer los valores calculados. 
_EVAL[CICLO] = {};
_EVAL[CICLO].mod = 1800; 
_EVAL[CICLO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                         S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                       return Math.sin((S.O.S.tiempo() + S.O.S.VAR.aux) / S.O.S.VAR.mod) / 2 + 0.5;
                                     };
_EVAL[CONTRACICLO] = {};
_EVAL[CONTRACICLO].mod = 1800; 
_EVAL[CONTRACICLO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                               S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                             return Math.cos((S.O.S.tiempo() + S.O.S.VAR.aux) / S.O.S.VAR.mod) / 2 + 0.5;
                                           };

// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "LAPSO"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Utiliza el operador de "módulo" sobre el tiempo (la cantidad de milisegundos transcurridos) para
// producir ciclos repetitivos de valores entre "0" y "1" (que vuelven a iniciarse en "0" cada vez).
// El modulador es un coeficiente que permite acelerar o enlentecer los valores calculados (el "módulo"). 
_EVAL[LAPSO] = {};
_EVAL[LAPSO].mod = 777; 
_EVAL[LAPSO].met = (S) => { if (!S.O.S.VAR.hasOwnProperty('aux'))
                                         S.O.S.VAR.aux = S.O.S.aleatorio(16000, 200000);
                                       return ((S.O.S.tiempo() + S.O.S.VAR.aux) % S.O.S.VAR.mod) / S.O.S.VAR.mod;
                                     };


// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN: "AZAR"
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Utiliza la función "random" para generar valores entre "0" y "1". El "modulador" indica  
// cada cuantos milisengundos se vuelve a generar un nuevo valor aleatorio.
_EVAL[AZAR] = {};
_EVAL[AZAR].mod = 1200; 
_EVAL[AZAR].met = (S) => {if (!S.O.S.VAR.hasOwnProperty('aux') || S.O.S.VAR.aux + S.O.S.VAR.mod < S.O.S.tiempo()) {
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
_EVAL[RUIDO] = {};
_EVAL[RUIDO].mod = 0.016; 
_EVAL[RUIDO].met = (S) => {return S.O.S.VAR.perlin();};


// -----------------------------------------------
//  MÉTODOS DE EVALUACIÓN POR ATRIBUTOS DEL ACTOR
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Estos métodos utilizan alguno de los atributos dinámicos del "Actor" para el cálculo.
// El "modulador", en estos casos, puede ser usado para escalar el valor del atributo.
_EVAL[ORDEN] = {};
_EVAL[ORDEN].mod = 1;
_EVAL[ORDEN].met = (S) => {return S.O.S.ACTOR.orden * S.O.S.VAR.mod;};

_EVAL[PUESTO] = {};
_EVAL[PUESTO].mod = 1;
_EVAL[PUESTO].met = (S) => {return S.O.S.ACTOR.puesto * S.O.S.VAR.mod;};
    
_EVAL[DISTANCIA] = {};
_EVAL[DISTANCIA].mod = 1;
_EVAL[DISTANCIA].met = (S) => {return S.O.S.ACTOR.distancia * S.O.S.VAR.mod;};

_EVAL[RECORRIDO] = {};
_EVAL[RECORRIDO].mod = 1;
_EVAL[RECORRIDO].met = (S) => {return S.O.S.ACTOR.recorrido * S.O.S.VAR.mod;};


    return _EVAL;
};

export default Evaluador;
