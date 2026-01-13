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



/**
 * Auxiliadora
 * Rutinas de asistencia general de los socorristas.
 */
const Auxiliadora = (S, utilizaP5) => {
    
    const _AUX = {
        
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
                numero *= Math.sign(aleatorio(-1, 1, false)) ?? 1;
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
    //  REVELACIÓN DE ENTIDADES DEL "SOCORRO"
    //  Cualquier entidad del módulo del socorro sólo puede ser accedida a través de un
    //  socorrista designado (S.O.S). Esta sección incluye las entidades disponibles.
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        Variable: () => {
            return VariableInterna(S);
        },
        
        Variador: (valorIni, valorFin, cuadrosDuracion, cuadrosRetardo) => {
            return VariadorInterno(S, valorIni, valorFin, cuadrosDuracion, cuadrosRetardo, cuadros);
        },
        
    };
    
    return _AUX;
};

export default Auxiliadora;
    