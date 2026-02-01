/*
 * =============================================================================
 * 
 *                             A U X I L I A D O R A 
 * 
 * =============================================================================
 */
import CONFIG from './config';
import VariableInterna from './variable';
import VariadorInterno from './variador';
import VectorInterno from './vector';
import EstiloInterno from './estilo';
import ActorInterno from './actor';
import RepartoInterno from './reparto';
import TransicionadorInterno from './transicionador';


/**
 * Auxiliadora
 * Rutinas de asistencia general de los socorristas.
 */
const Auxiliadora = (S, utilizaP5) => {

// --------------------------------------------------------------------------------
//  F U N C I O N E S    P R I V A D A S
// --------------------------------------------------------------------------------
    
    /**
     * _cumplimentaDef
     * Retorna "true" o "false" indicando si el objeto recibido como primer argumento 
     * cumplimenta con los atributos indicados por la lista del segundo argumento. 
     * Es decir, cualquier atributo del objeto debe estar definido en la lista de atributos
     * indicada. No debe necesariamente incluirlos todos, pero no puede tampoco tener 
     * atributos que no estén indicados en dicha lista.
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

    const _AUX = {
    
// --------------------------------------------------------------------------------
//  F U N C I O N E S    P Ú B L I C A S
// --------------------------------------------------------------------------------
            
    // --------------------------------------------------------------------------------
    // 
    //  FUNCIONES DE ASISTENCIA GENERAL
    //  En esta sección se definen los métodos de auxilia generales que no dependen 
    //  del contexto de ninguna otra librería (ni de p5js, ni de Three.js). Son 
    //  ofrecidas al programador a través del socorrista designado (S.O.S).
    //  
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        

        /**
         * mapear
         * Función de ayuda para remapear el valor de un número
         * (parámetro "valor") perteneciente al rango inicial 
         * [ini1-fin1] hacia el rango destino [ini2-fin2].
         */
        mapear: (valor, ini1, fin1, ini2, fin2) => {
            return (valor - ini1) / (fin1 - ini1) * (fin2 - ini2) + ini2;
        },

        /**
         * repetidor
         * Método que retorna una función "repetidora" que, aunque sea invocada
         * en cada iteración del bucle de la "Obra", sólo ejecutará la función
         * indicada como argumento, una vez por cada intervalo indicado.
         */
         repetidor: (argumentoRepeticion, intervaloEspera) => {
            let c = 0;
            let f = (funcionRepeticion) => {
              if (c <= 0) {
                c = intervaloEspera ?? 1;
                funcionRepeticion(argumentoRepeticion);
              }
              c--;
            };
            return f;
        },

        /**
         * aleatorio
         * Devuelve un número al azar (float) mayor o igual al mínimo 
         * especificado y menor que el máximo. Si estos parámetros no 
         * son definidos, retorna un número aleatorio entre 0 y 1.
         * El tercer parámetro indica, además, si el signo del número
         * resultante también debe ser aleatorio.
         */
        aleatorio: (minimo, maximo, signoAleatorio = false) => {
            let numero = 0;
            if (minimo === undefined || maximo === undefined) {
                numero = Math.random();
            }
            else {
                numero = Math.random() * (maximo - minimo) + minimo;
            }
            if (signoAleatorio) {
                numero *= Math.sign(_AUX.aleatorio(-1, 1, false)) ?? 1;
            }
            return numero;
        },
    
        
        
    // --------------------------------------------------------------------------------
    // 
    //  FUNCIONES DE ASISTENCIA PARA ESCENAS QUE USAN "P5"
    //  En esta sección se definen los métodos de auxiliar que también son puestos a
    //  disponibilidad del programador a través del socorrista designado (S.O.S), pero
    //  que necesitan que el objeto "P5" ya haya creado para la "Escena" en curso.
    //  
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        /**
         * tiempo
         * Retorna el tiempo transcurrido en milisegundos.
         */
        tiempo: () => {
            return utilizaP5 ? S.O.S.P5.millis() : _reloj.getElapsedTime();
        },

        /**
         * cuadros
         * Retorna el número de fotograma actual que se está reproduciendo o,
         * lo que es lo mismo, la cantidad de fotogramas reproducidos desde
         * el inicio de la ejecución ("frameCount").
         */
        cuadros: () => {
            return utilizaP5 ? S.O.S.P5.frameCount : _conteoDeCuadros();
        },
        
        /**
         * ruido
         * Retorna una función generadora de ruido "perlin" (no devuelve el ruido en sí).
         * La función retornada puede, luego, ser usada sin argumentos para producir ruido.
         */
        ruido: (min = 0.0, max = 1.0, variacion = 0.1) => {
            let desplazamiento = S.O.S.aleatorio(0, 100000);
            let f = () => {
              let valorRuido = (S.O.S.P5.noise(desplazamiento) * (max - min) + min);
              desplazamiento += variacion;
              return valorRuido;
            };
            return f;
        },
        
        
        
    // --------------------------------------------------------------------------------
    // 
    //  VERIFICADOR DE TIPOS DE ENTIDADES DEL "SOCORRO"
    //  Funciones que analizan los argumentos recibidos para indicar si dichos datos
    //  corresponden a la definición de alguna de las entidades del "socorro".
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        
        /**
         * entidad
         * Verifica si el objeto recibido como argumento corresponde a alguna de las definiciones
         * de entidades del módulo del "socorro": una "Variable", un "Variador", un "Vector", un 
         * "Estilo" o un "Actor". En ese caso, retorna la función del socorrista que corresponda 
         * para crear dicha entidad. En caso contrario, devuelve "undefined".
         */
        entidad: (objeto) => {
          // --------------------------------------
          // Se verifica si es una "VARIABLE"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          if (objeto.hasOwnProperty(CONFIG.VAR_METODO) &&
             (objeto.hasOwnProperty(CONFIG.VAR_VALOR) || objeto.hasOwnProperty(CONFIG.VAR_VALOR_DESDE) || objeto.hasOwnProperty(CONFIG.VAR_VALOR_HASTA))) {
            return S.O.S.Variable;
          }
          // --------------------------------------
          // Se verifica si es un "VECTOR"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          else if (_cumplimentaDef(objeto, 'x', 'y', 'z')) {
            return S.O.S.Vector;
          }
          // --------------------------------------
          // Se verifica si es un "VARIADOR"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          else if (_cumplimentaDef(objeto, CONFIG.VAR_VALOR_DESDE, CONFIG.VAR_VALOR_HASTA, CONFIG.VAR_MODULADOR)) {
            return S.O.S.Variador;
          }
          // --------------------------------------
          // Se verifica si es un "ESTILO"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          else if (_cumplimentaDef(objeto, CONFIG.EST_COLOR, CONFIG.EST_GRANDOR, 
                                           CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO, CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO,
                                           CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_ALFA, CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO + CONFIG.ATR_VARIABLE_ALFA)) {
              return S.O.S.Estilo;
          }
          // --------------------------------------
          // Se verifica si es un "ACTOR"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          else if (_cumplimentaDef(objeto, CONFIG.ACT_ORIGEN, CONFIG.ACT_VELOCIDAD, CONFIG.ACT_ESTILO, CONFIG.ACT_REPRESENTADOR)) {
              return S.O.S.Actor;
          }
          // --------------------------------------
          // Se verifica si es un "REPARTO"
          // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
          else if (_cumplimentaDef(objeto, CONFIG.RPT_COREOGRAFIA, CONFIG.RPT_CANTIDAD, CONFIG.RPT_PUESTOS, CONFIG.RPT_INTERVALO, 
                                           CONFIG.RPT_VELOCIDAD, CONFIG.RPT_DESVIO, CONFIG.RPT_SEPARACION, CONFIG.RPT_RECORRIDO,
                                           CONFIG.RPT_DURACION, CONFIG.RPT_ESTILO, CONFIG.RPT_REPRESENTADOR, CONFIG.RPT_DESPLAZAMIENTO)) {
              return S.O.S.Reparto;
          }

          // Si no corresponde a ningún objeto, se retorna "undefined"
          return undefined;
        },

        
        /**
         * esUnColor
         * Retorna "true" o "false" indicando si el argumento recibido es un
         * tipo de dato de p5js utilizado para almacenar un color.
         */        
        esUnColor: (valor) => {
            return valor && valor.hasOwnProperty("mode");
        },

        /**
         * esUnaVariable
         * Función para indicar si el objeto recibido como argumento es una "Variable".
         */
        esUnaVariable: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_VARIABLE;
        },

        /**
         * esUnVariador
         * Función para indicar si el objeto recibido como argumento es un "Variador".
         */
        esUnVariador: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_VARIADOR;
        },

        /**
         * esUnVector
         * Función para indicar si el objeto recibido como argumento es un "Vector".
         */
        esUnVector: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_VECTOR;
        },

        /**
         * esUnVectorVar
         * Función para indicar si el objeto recibido como argumento es un "VectorVar".
         */
        esUnVectorVar: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_VECTORVAR;
        },

        /**
         * esUnEstilo
         * Función para indicar si el objeto recibido como argumento es un "Estilo".
         */
        esUnEstilo: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_ESTILO;
        },
        
        /**
         * esUnActor
         * Función para indicar si el objeto recibido como argumento es un "Actor".
         */
        esUnActor: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_ACTOR;
        },
        
        /**
         * esUnReparto
         * Función para indicar si el objeto recibido como argumento es un "Reparto".
         */
        esUnReparto: (objeto) => {
          let _aux = objeto ? objeto?.nombre : undefined;
          return _aux !== undefined && _aux === CONFIG.SOS_REPARTO;
        },

        
        
    // --------------------------------------------------------------------------------
    // 
    //  REVELACIÓN DE ENTIDADES DEL "SOCORRO"
    //  Cualquier entidad del módulo del socorro sólo puede ser accedida a través de un
    //  socorrista designado (S.O.S). Esta sección incluye las entidades disponibles.
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        Variable: (...parametros) => {
            return VariableInterna(S, ...parametros);
        },

        Variador: (...parametros) => {
            return VariadorInterno(S, ...parametros);
        },
                
        Vector: (x, y, z) => {
            return VectorInterno(S, x, y, z);
        },
        
        Estilo: (color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo) => {
            return EstiloInterno(S, color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo);
        },
        
        Actor: (origen, velocidad, estilo) => {
            return ActorInterno(S, origen, velocidad, estilo);  
        },
          
        Reparto: (coreografia, cantidad, puestos, intervalo, velocidad, desvío, separacion) => {
            return RepartoInterno(S, coreografia, cantidad, puestos, intervalo, velocidad, desvío, separacion);  
        },

        Transicionador: (valorIni, valorFin, cuadrosDuracion, cuadrosRetardo) => {
            return TransicionadorInterno(S, valorIni, valorFin, cuadrosDuracion, cuadrosRetardo, cuadros);
        }
    
    };
    
    return _AUX;
};


export default Auxiliadora;