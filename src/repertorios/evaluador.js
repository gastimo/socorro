/*
 * =============================================================================
 * 
 *                        M Ó D U L O    E V A L U A D O R
 * 
 * =============================================================================
 */

const Evaluador = (S) => {
    
    const _EVAL = {};
    
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
