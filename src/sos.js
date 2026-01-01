/* =============================================================================
 * 
 *                   L A    O B R A    D E L    S O C O R R O 
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Contenedor from './contenedor.js';
import Orquestador from './orquestador.js';
import Escena from './escena.js';
import * as THREE from 'three';
import p5 from 'p5';


/**
 * La Obra del Socorro
 * Entidad privada, invisible para el contexto público,
 * responsable de ejecutar y controlarlo "todo".
 * La "Obra" es un "singleton", ente único a cargo de todo
 * el cuerpo de socorristas, de todas las escenas que puedan
 * llegar a crearse y, también, de la orquestación general 
 * del "Ciclo Eterno" de la representación.
 */
const Obra = (() => {
    const _socorristas = [];
    const _orquestadores = [];
    
    /**
     * darInicio
     * La obra entra en funciones.
     */
    function darInicio() {
        _cicloEterno();
    }
    
    /**
     * _cicloEterno
     * Bucle infinito de la obra que se ocupa de orquestar
     * el armado y presentación de cada una de las escenas.
     */
    function _cicloEterno() {
        requestAnimationFrame(_cicloEterno);
        for (let i = 0; i < _orquestadores.length; i++) {
            _orquestadores[i].orquestar();
        }
    }
    
    /**
     * orquestar
     * Coordina al grupo de orquestadores que serán convocados
     * en cada iteración del ciclo de la obra para ejecutar
     * los diferentes actos que la componen. Cada escena tiene su 
     * propio orquestador (asignado durante la creación) que 
     * determina cuándo/cómo cargarla, comenzarla y desplegarla.
     */
    function orquestar(orquestador) {
        // Simplemente se encola el orquestador para
        // convocarlo, luego, en cada iteración del bucle.
        _orquestadores.push(orquestador);
    }
    
    /**
     * seguidor
     * Procedimiento para reclutar un nuevo seguidor 
     * para la obra. Todo seguidor debe ser un siervo
     * convertido en socorrista para asistir en las
     * tareas de creación y reproducción de escenas.
     */
    function seguidor(siervo) {
        let _nuevoSeguidor = siervo;
        if (!siervo) {
            _nuevoSeguidor = {};
            _socorristas.push(_nuevoSeguidor);
        }
        return {O: {S: _nuevoSeguidor}};
    }

    
    return {darInicio, orquestar, seguidor};
})();




/* =============================================================================
 * 
 *       S I E R V O    D E    L  A    O B R A    D E L    S O C O R R O
 * 
 * =============================================================================
 */

/**
 * Siervo
 * El "siervo" es un seguidor de la Obra, reponsable de llevar adelante
 * todos los trabajos requeridos para el montaje de ésta y de asistir 
 * en cualquier tarea que sea necesaria para su representación.
 */
const Siervo = () => {
    const _escenas  = [];
    const _claves   = {};
    let   _contador = 0;
    
    /**
     * socorrista
     * Un socorrista es un siervo dedicado exclusivamente para
     * atender a algún integrante constituyente de la Obra (ej. 
     * una escena, un esquema, etc). El socorrista es heredero
     * del S.O.S original (recibido como argumento), es decir, 
     * extiende todos las funciones que éste ofrece y puede, 
     * eventualmente, brindar nuevas prestaciones específicas.
     */
    function socorrista(sketch) {
        const _S = Obra.seguidor(Siervo());
        if (sketch) {
            _S.O.S.p5js = sketch;
        }
        return _S;
    }


    /**
     * obtenerClave
     * Función que asigna claves unívocas y secuenciales
     * para un nombre dado.
     */
    function obtenerClave(nombre) {
        let _nombre = nombre ?? CONFIG.NOMBRE_SOS;
        if (!_claves.hasOwnProperty(_nombre)) {
            _claves[_nombre] = 0.0;
        }
        return _claves[_nombre]++;
    }

    /**
     * revelar
     * Revelación de los atributos ("Revealing Module Pattern").
     * Esta función expone en el primero de los objetos recibido 
     * como argumento las propiedades (variables y métodos) de 
     * los restantes objetos de la lista de argumentos. 
     * Básicamente, define el "prototype" del primer objeto para
     * implementar una suerte de "herencia" entre los objetos.
     * En el caso de tratarse de más de 2 argumentos, realiza
     * una especie de "cadena de herencias": el primer objeto
     * heredará del segundo quien, a su vez, heredará del tercero
     * y así sucesivamente, vinculándolos a través de "prototype".
     */
    function revelar (...atributos) {
      if (atributos.length >= 1) {
            for (let i = atributos.length - 1; i > 0; i--) {
                Object.setPrototypeOf(atributos[i - 1], atributos[i]);
            }
            return atributos[0];
        }
        else {
            return {};
        }
    }
    
   
// =====================================================================
// 
//  FUNCIONES AUXILIADORAS DE USO GENERAL
//  
// =====================================================================
    
    /**
     * mapear
     * Función de ayuda para remapear el valor de un número
     * (parámetro "valor") perteneciente al rango inicial 
     * [ini1-fin1] hacia el rango destino [ini2-fin2].
     */
    function mapear(valor, ini1, fin1, ini2, fin2) {
        return (valor - ini1) / (fin1 - ini1) * (fin2 - ini2) + ini2;
    }
    
    /**
     * aleatorio
     * Devuelve un número al azar (float) mayor o igual al mínimo 
     * especificado y menor que el máximo. Si estos parámetros no 
     * son definidos, retorna un número aleatorio entre 0 y 1.
     * El tercer parámetro indica, además, si el signo del número
     * resultante también debe ser aleatorio.
     */
    function aleatorio(minimo, maximo, signoAleatorio = false) {
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
    }
    
    
// =====================================================================
// 
//  FUNCIONES PARA LA MANIPULACIÓN DE LAS ESCENAS DE LA OBRA
//  
// =====================================================================
    
    /**
     * crearEscena
     * Realiza una puesta en escena desde cero para la Obra utilizando Three.js.
     * En lugar de retornar una "escena", esta función devuelve un "escenificador"
     * que es un objeto intermediario para configurar y manipular la escena.
     */
    function crearEscena(contenedor, guardarProporciones = false, ancho = 0, alto = 0) {
        return _crearEscena(contenedor, guardarProporciones, ancho, alto, false);
    }

    /**
     * crearEscenaP5
     * Realiza una puesta en escena desde cero para la Obra utilizando p5js.
     * En lugar de retornar una "escena", esta función devuelve un "escenificador"
     * que es un objeto intermediario para configurar y manipular la escena.
     */
    function crearEscenaP5(contenedor, guardarProporciones = false, ancho = 0, alto = 0) {
        return _crearEscena(contenedor, guardarProporciones, ancho, alto, true);
    }
    
    /**
     * _crearEscena
     * Función privada que se ocupa de la creación de la escena ya sea mediante
     * el uso de la librería Three.js o de p5js. El objeto retornado por la función
     * es un "escenificador" desde el cual se puede manipular la escena creada.
     */
    function _crearEscena(contenedor, guardarProporciones = false, ancho = 0, alto = 0, usarP5 = false) {
        let _indice = _contador++;
        const _contenedor = Contenedor(contenedor, guardarProporciones, ancho, alto);
        
        // ESCENIFICADOR
        // Intermediario retornado luego de la creación de la escena
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let _escenificadorCarga      = null;
        let _escenificadorComienzo   = null;
        let _escenificadorDespliegue = null;
        let _escenificador = (() => {
            function alCargar(funcionCarga) {
                _escenificadorCarga = funcionCarga;
            }
            function alComenzar(funcionComienzo) {
                _escenificadorComienzo = funcionComienzo;
            }
            function alDesplegar(funcionDespliegue) {
                _escenificadorDespliegue = funcionDespliegue;
            }
            return {alCargar, alComenzar, alDesplegar};
        })();
        
        
        // ORQUESTACION Y EJECUCIÓN DE LA OBRA
        // La orquestación define los pasos (o "actos") y las funciones que son
        // requeridas para cargar la escena, iniciarla y reproducirla en bucle
        // (el "Ciclo Eterno de la Representación").
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        const _orquestador = Orquestador(S.O.S, _contenedor);
        _orquestador.asociar('THREE', THREE);
        _orquestador.funcionActuaria(
          (FUNCION) => {
            
            // 1. ACTO DE PREPARACIÓN (o método "preload" de p5js)
            // La escena es creada (o importada) en este acto.
            // Cualquier imagen o archivo es cargado también en
            // este momento. El "canvas" aún no es creado.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            FUNCION[CONFIG.ACTO_PREPARACION] = () => {
                _escenas[_indice] = Escena(S.O.S);
                _orquestador.vincular(_escenas[_indice]);
                const _ACTO1 = _escenificadorCarga ? _escenificadorCarga(_orquestador.socorrista()): 
                                                   _escenas[_indice][CONFIG.ACTO_PREPARACION]();
            };
            
            // 2. ACTO DE INICIACIÓN (o método "setup" de p5js)
            // La escena es configurada y montada en este acto.
            // El "canvas" es creado e inicializado en este momento.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            FUNCION[CONFIG.ACTO_INICIACION] = () => {
                if (_orquestador.acto2ListoParaIniciar()) { 
                    const _ACTO2 = _escenificadorComienzo ? _escenificadorComienzo(_orquestador.socorrista()) : 
                                                          _escenas[_indice][CONFIG.ACTO_INICIACION]();
                    _escenas[_indice].emplazar(_contenedor);
                    _orquestador.verificacionPosActo2();
                    _orquestador.diferido(false);
                }
                else {
                    _orquestador.diferido(true);
                }
            };
            // Redefinición de funciones para el SETUP de psjs
            FUNCION.setup = () => {   
                FUNCION[CONFIG.ACTO_PREPARACION]();  // El "preload" se eliminó en la v2.0
                FUNCION[CONFIG.ACTO_INICIACION]();
            };  
            
            // 3. ACTO DE EJECUCIÓN (o método "draw" de p5js)
            // Se trata de una función recurrente que dibuja la
            // escena. Este método es invocado por el navegador
            // varias veces por segundo en un bucle infinito.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            FUNCION[CONFIG.ACTO_EJECUCION] = () => {
                if (_orquestador.acto3ListoParaIniciar()) {                    
                    _orquestador.verificacionPreActo3();
                    const _ACTO3 = _escenificadorDespliegue ? _escenificadorDespliegue(_orquestador.socorrista()) : 
                                                            _escenas[_indice][CONFIG.ACTO_EJECUCION]();
                }
            };
            // Redefinición de funciones para el DRAW de p5js
            FUNCION.draw = () => {
                if (_orquestador.diferido())
                    FUNCION[CONFIG.ACTO_INICIACION]();
                FUNCION[CONFIG.ACTO_EJECUCION](); 
            };
        });
            
        // INICIO DE LA ORQUESTACIÓN
        // Se añade el orquestador a "La Obra" para dar inicio a la función
        // Se inicia también la instancia de p5js en caso de ser necesario.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (usarP5) {
            _orquestador.asociar('P5', new p5(_orquestador.funcionActuaria()));
        }
        Obra.orquestar(_orquestador);        
        return _escenificador;
    }
    
    
    // ===============================================================
    // ==> Se exponen únicamente las funciones públicas del siervo
    // ==> ("Revealing Module Pattern")
    // ===============================================================
    return {socorrista,
            obtenerClave,
            revelar,
            mapear,
            aleatorio,
            crearEscena,
            crearEscenaP5
           };
};



/* =============================================================================
 * 
 *      S I N G L E T O N    D E L    O B S E Q U I O S O    S O C O R R O
 * 
 * =============================================================================
 */

/**
 * Singleton del Obsequioso Socorro (S.O.S)
 * Ujier único y singular (singleton) del divino portal (site) y 
 * obsequioso socorrista (helper) para el tecnoartista en apuros.
 */
const S = (() => {
    Obra.darInicio();
    return Obra.seguidor(Siervo());
})();


export default S;