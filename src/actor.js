/*
 * =============================================================================
 *
 *                          M Ó D U L O    A C T O R
 *
 * =============================================================================
 */
import CONFIG from "./config";
import Esquema from "./esquema";

/**
 * Actor
 * Los "Actores" son los objetos participantes de la puesta en "Escena".
 * Poseen atributos que pueden ser modificadas en tiempo de ejecución (mediante
 * "Variables") y que pueden agruparse bajo las siguientes categorías:
 * 
 * - POSICIÓN             : coordenadas <x,y,z> de su origen y posición actual.
 * - DESPLAZAMIENTO       : vector (<x,y,z>) de velocidad y vector de aceleración.
 * - REPRESENTACIÓN VISUAL: objeto de tipo "Estilo" con los atributos visuales.
 *
 */
function Actor(S, origen, velocidad, estilo) {
    const _ESQ = Esquema(S, CONFIG.NOMBRE_ACTOR);
    const _ACT = S.O.S.revelar({}, _ESQ);
    const _origen = S.O.S.Vector();
    const _posicion = S.O.S.Vector();
    const _velocidad = S.O.S.Vector();
    const _aceleracion = S.O.S.Vector(0, 0, 0);
    const _estilo = {color: undefined, grandor: undefined, trazo: undefined, grosor: undefined};
    const _nacimiento = S.O.S.tiempo();
    const _duracionMaxima  = CONFIG.ACTOR_TIEMPO_DE_VIDA;     // Tiempo de vida máximo 
    const _recorridoMaximo = CONFIG.ACTOR_RECORRIDO_MAXIMO;   // Distancia máxima a recorrer
    let _finalizado = false;
    let _representador;
    _inicializar(origen, velocidad, estilo);

    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Actor".
     */
    function _inicializar(origen, velocidad, estilo) {
        const _definicion = {};

        // Definición del "Vector" con las coordenadas origen
        if (origen !== undefined && origen !== null)
            _definicion[CONFIG.ACT_ORIGEN] = origen;
        
        // Definición del "Vector" de velocidad
        if (velocidad !== undefined && velocidad !== null)
            _definicion[CONFIG.ACT_VELOCIDAD] = velocidad;
        
        // Definición del "Estilo" para la representación visual del "Actor"
        if (estilo !== undefined && estilo !== null)
            _definicion[CONFIG.ACT_ESTILO] = estilo;
        
        _ESQ.def(_definicion);
    }
    
    
    // -------------------------------------------------------------
    //
    // EXPOSICIÓN DE PROPIEDADES DEL ACTOR
    //
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _ACT.origen    = _origen;
    _ACT.posicion  = _posicion;
    _ACT.velocidad = _velocidad;
    _ACT.estilo    = _estilo;
    _ACT.distancia = 0;
    _ACT.recorrido = 0;

    
    // -------------------------------------------------------------
    //
    // EXPOSICIÓN DE MÉTODOS DEL ACTOR
    //
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien el
     * "Actor" extiende. Se redefine simplemente para retornar, al final,
     * el objeto "Actor" actual, que permite definiciones encadenadas.
     */
    _ACT.def = (atributos) => {
        _ESQ.def(atributos);
        return _ACT;
    };

    /**
     * defOrigen
     * Define las coordenadas del origen del "Actor". El argumento recibido
     * puede ser un vector o un objeto conteniendo su definición (<x,y,z>).
     */
    _ACT.defOrigen = (origen) => {
        _inicializar(origen);
        return _ACT;
    };

    /**
     * defVelocidad
     * Define los componentes del vector de velocidad del "Actor". El argumento
     * recibido puede ser un vector o un objeto conteniendo su definición (<x,y,z>).
     */
    _ACT.defVelocidad = (velocidad) => {
        _inicializar(null, velocidad);
        return _ACT;
    };

    /**
     * defEstilo
     * Define los atributos para la representación visual del "Actor" (su "Estilo").
     * El argumento recibido puede ser un objeto de tipo "Estilo" u otro objeto Javascript
     * que contenga su definición.
     */
    _ACT.defEstilo = (estilo) => {
        _inicializar(null, null, estilo);
        return _ACT;
    };

    /**
     * defRepresentador
     * Función que permite definir el "Representador" por defecto asociado al "Actor".
     * Este método hace exactamente lo mismo que la siguiente invocación:
     *     def({representador: <nombre-representador});
     */
    _ACT.defRepresentador = (representador) => {
        if (representador !== undefined && representador !== null) {
            const _definicion = {};
            _definicion[CONFIG.ACT_REPRESENTADOR] = representador;
            _ESQ.def(_definicion);
        }
        return _ACT;
    };
    
    /**
     * representador
     * Devuelve el nombre del "Representador" por defecto a emplear para el "Actor".
     * El argumento de la función, además, permite definir un nuevo "Representador" 
     * a utilizar en adelante para este "Actor" en particular.
     */
    _ACT.representador = (rep) => {
        if (rep !== undefined && rep !== null) {
            const _definicion = {};
            _definicion[CONFIG.ACT_REPRESENTADOR] = rep;
            _ESQ.def(_definicion);
        }
        return _representador;
    };

    /**
     * actualizar
     * Actualiza todas las variables dinámicas del "Actor". Esta función debe invocarse
     * una vez por cada iteración del ciclo de reproducción de la "Escena", antes de
     * hacer uso de los valores del "Actor".
     */
    _ACT.actualizar = () => {
        
        if (!_finalizado) {
            // 1. CONTEXTO DE EJECUCIÓN DEL ACTOR
            // Se pone a disposición el "Actor" actual en el contexto de
            // ejecución del socorrista para poder ser usado dinámicamente 
            // para el cálculo dinámico de los valores de sus variables.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            S.O.S.ACTOR = _ACT;
            
            // 2. Actualización del "Representador" específico del "Actor"
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _representador = _ESQ.val(CONFIG.ACT_REPRESENTADOR) ?? _representador;

            // 3. ACTUALIZACIÓN DEL DESPLAZAMIENTO
            // Actualización de la posición y velocidad del "Actor" en la "Escena".
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (_origen.vacio()) {
                _origen.copiar(_ESQ.val(CONFIG.ACT_ORIGEN));
                _posicion.copiar(_origen);
            }
            if (_velocidad.vacio()) {
                _velocidad.copiar(_ESQ.val(CONFIG.ACT_VELOCIDAD));
            }
            _ACT.recorrido += _velocidad.mag() ?? 0;
            _posicion.sumar(_velocidad);
            _velocidad.sumar(_aceleracion);
            _ACT.distancia = S.O.S.Vector(_origen).restar(_posicion).mag() ?? 0;

            // 4. VERIFICACIÓN DE LA VIGENCIA DEL ACTOR
            // Se verifica, en este punto, si el "Actor" debería ser finalizado, ya
            // sea porque sobrepasó la duración máxima permitida (tiempo de vida) o 
            // porque su recorrido superó la distancia máxima establecida.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (_ACT.recorrido > _recorridoMaximo || S.O.S.tiempo() - _nacimiento > _duracionMaxima) {
                _ACT.finalizar();
            }
            else {
                // 5. ACTUALIZACIÓN DE LOS ATRIBUTOS VISUALES
                // Actualización del "Estilo" del "Actor".
                // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                let _e = _ESQ.val(CONFIG.ACT_ESTILO);
                if (_e) {
                    _e.actualizar();
                    _estilo.color   = _e.color();
                    _estilo.trazo   = _e.color(true);
                    _estilo.grandor = _e.grandor();
                    _estilo.grosor  = _e.grandor(true);
                }
            }

            // 6. REESTABLECIMIENTO DEL CONTEXTO
            // Se remueve el "Actor" actual del contexto de ejecución.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            delete S.O.S.ACTOR;
        }
        
        return _ACT;
    };
    
    /**
     * representar
     * Función que se ocupa de la representación visual del objeto "Actor" en la "Escena".
     * Para la representación es necesario que previamente se haya invocado a la función
     * "actualizar" del "Actor" que recalcula todas sus variables dinámicas. Esto es 
     * realizado desde el "Orquestador" mediante el método "preACTO#3".
     * La representación visual en sí del "Actor", o sea, el dibujo en el "canvas") es 
     * realizada por la función del "Representador", configurada en el "Actor" o, en su
     * defecto, por la configurada a nivel de la "Escena".
     */
    _ACT.representar = () => {
        if (!_finalizado) {
            S.O.S.REP[_representador ?? S.O.S.representador()](_ACT);
        }
    };
    
    /**
     * finalizar
     * Marca al "Actor" corriente como finalizado
     */
    _ACT.finalizar = () => {
      _finalizado = true; 
    };

    /**
     * finalizado
     * Indica si al "Actor" ha finalizado se participación en la "Escena"
     */
    _ACT.finalizado = () => {
      return _finalizado; 
    };
    
    
    return _ACT;
}


export default Actor;