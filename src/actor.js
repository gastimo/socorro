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
    const _ESQ = Esquema(S, CONFIG.SOS_ACTOR);
    const _ACT = S.O.S.revelar({}, _ESQ);
    
    // Variables internas del "Actor"
    const _originado = S.O.S.tiempo();
    let   _finalizado = false;

    
    /**
     * _inicializar
     * Función privada de inicialización del "Actor"
     */
    function _inicializar(origen, velocidad, estilo) {
        
        // Definición de las entidades subordinadas (Vectores, Estilos, etc)
        const _definicion = {};
        if (origen)
            _definicion[CONFIG.ACT_ORIGEN] = origen;
        if (velocidad)
            _definicion[CONFIG.ACT_VELOCIDAD] = velocidad;
        if (estilo)
            _definicion[CONFIG.ACT_ESTILO] = estilo;
        _ESQ.def(_definicion);

        // Inicialización de las propiedades públicas del "Actor"
        _ACT.origen         = undefined;
        _ACT.posicion       = undefined;
        _ACT.velocidad      = undefined;
        _ACT.aceleracion    = undefined;
        _ACT.estilo         = undefined;
        _ACT.representador  = undefined; 
        _ACT.maxDuracion    = undefined;
        _ACT.maxRecorrido   = undefined;
        _ACT.distancia      = 0;
        _ACT.recorrido      = 0;
        
        return _ACT;
    }

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
        const _definicion = {};
        _definicion[CONFIG.ACT_ORIGEN] = origen;
        _ESQ.def(_definicion);
        return _ACT;
    };

    /**
     * defVelocidad
     * Define los componentes del vector de velocidad del "Actor". El argumento
     * recibido puede ser un vector o un objeto conteniendo su definición (<x,y,z>).
     */
    _ACT.defVelocidad = (velocidad) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_VELOCIDAD] = velocidad;
        _ESQ.def(_definicion);
        return _ACT;
    };

    /**
     * defAceleracion
     * Define los componentes del vector de aceleración del "Actor". El argumento
     * recibido puede ser un vector o un objeto conteniendo su definición (<x,y,z>).
     */
    _ACT.defAceleracion = (aceleracion) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_ACELERACION] = aceleracion;
        _ESQ.def(_definicion);
        return _ACT;
    };

    /**
     * defEstilo
     * Define los atributos para la representación visual del "Actor" (su "Estilo").
     * El argumento recibido puede ser un objeto de tipo "Estilo" u otro objeto Javascript
     * que contenga su definición.
     */
    _ACT.defEstilo = (estilo) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_ESTILO] = estilo;
        _ESQ.def(_definicion);
        return _ACT;
    };

    /**
     * defRepresentador
     * Función que permite definir el "Representador" por defecto asociado al "Actor".
     * Este método hace exactamente lo mismo que la siguiente invocación:
     *     def({representador: <nombre-representador});
     */
    _ACT.defRepresentador = (representador) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_REPRESENTADOR] = representador;
        _ESQ.def(_definicion);
        return _ACT;
    };
    
    /**
     * defMaxDuracion
     * Función que permite definir el tiempo máximo de duración de la participación del
     * "Actor" en la "Escena" (en milisegundos). 
     * Por ejemplo:
     *    defMaxDuracion(20000);  // El "Actor" culmina su participación en 20 segundos
     */
    _ACT.defMaxDuracion = (tiempoMaximo) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_MAX_DURACION] = tiempoMaximo;
        _ESQ.def(_definicion);
        return _ACT;
    };
    
    /**
     * defMaxRecorrido
     * Función que permite definir el recorrido máximo que el "Actor" puede realizar
     * dentro de la "Escena" (en píxeles). 
     * Por ejemplo:
     *    defMaxRecorrido(50000);  // El "Actor" termina después de recorrer una distancia de 50.000 píxeles
     */
    _ACT.defMaxRecorrido = (distanciaMaxima) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_MAX_RECORRIDO] = distanciaMaxima;
        _ESQ.def(_definicion);
        return _ACT;
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
            _ACT.representador = _ESQ.val(CONFIG.ACT_REPRESENTADOR) ?? _ACT.representador;

            // 3. ACTUALIZACIÓN DEL DESPLAZAMIENTO
            // Actualización de la posición y velocidad del "Actor" en la "Escena".
            // Los vectores de "Origen" y "Velocidad" se evalúan sólo la primera vez.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (_ACT.origen === undefined) {
                _ACT.origen = _ESQ.val(CONFIG.ACT_ORIGEN);
                _ACT.posicion = S.O.S.Vector();
                _ACT.posicion.copiar(_ACT.origen);
            }
            if (_ACT.velocidad === undefined) {
                _ACT.velocidad = _ESQ.val(CONFIG.ACT_VELOCIDAD);
            }
            if (_ACT.aceleracion === undefined) {
                _ACT.aceleracion = _ESQ.val(CONFIG.ACT_ACELERACION) ?? S.O.S.Vector(0, 0, 0);
            }
            if (_ACT.velocidad) {
                _ACT.recorrido += _ACT.velocidad.mag() ?? 0;
                _ACT.posicion.sumar(_ACT.velocidad);
                _ACT.velocidad.sumar(_ACT.aceleracion);
                _ACT.distancia = S.O.S.Vector(_ACT.origen).restar(_ACT.posicion).mag() ?? 0;
            }

            // 4. ACTUALIZACIÓN DEL ALCANCE & VERIFICACIÓN DE LA VIGENCIA DEL ACTOR
            // Se verifica, en este punto, si el "Actor" debería ser finalizado, ya
            // sea porque sobrepasó la duración máxima permitida (tiempo de vida) o 
            // porque su recorrido superó la distancia máxima establecida.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _ACT.maxDuracion  = _ESQ.val(CONFIG.ACT_MAX_DURACION)  ?? _ACT.maxDuracion;
            _ACT.maxRecorrido = _ESQ.val(CONFIG.ACT_MAX_RECORRIDO) ?? _ACT.maxRecorrido;
            if (_ACT.recorrido > _ACT.maxRecorrido || S.O.S.tiempo() - _originado > _ACT.maxDuracion) {
                _ACT.finalizar();
            }
            else {
                // 5. ACTUALIZACIÓN DE LOS ATRIBUTOS VISUALES
                // Actualización del "Estilo" del "Actor".
                // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                _ACT.estilo = _ESQ.val(CONFIG.ACT_ESTILO);  // Devuelve el "Estilo" sin evaluar
                if (_ACT.estilo) {
                    _ACT.estilo.actualizar();               // Acá recién se evalúa el "Estilo"
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
            S.O.S.REP[_ACT.representador ?? S.O.S.representador](_ACT);
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
    
    
    return _inicializar(origen, velocidad, estilo);
}


export default Actor;