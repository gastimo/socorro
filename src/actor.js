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
 * El "Actor" es la entidad participante de la puesta en "Escena". Es la única
 * de las "entidades del socorro" que tiene representación visual en el lienzo.
 * 
 * Los "Actores" pueden ser incorporados a la "Escena" de forma individual o a 
 * través de los "Repartos" (objetos que coordinan conjunto de "Actores").
 * Como muchas de las "entidades del socorro" el "Actor" también es un "Esquema", 
 * esto quiere decir que sus atributos pueden ser especificados/importados de forma
 * estática o pueden ser definidos a través de objetos "Variables" para que su valor
 * sea calculado dinámicamente en tiempo de ejecución.
 * 
 * Otra característica de los "Actores" es su desplazamiento. Se mueven de forma
 * similar a los sistemas de partículas, esto es, cada "Actor" tiene una ubicación
 * de origen en la "Escena" y su desplazamiento es definido asignando un "Vector" 
 * de velocidad y, opcionalmente, otro "Vector" de aceleración.
 * 
 * Finalmente, otro rasgo clave de los "Actores" es que, algunos de sus atributos
 * pueden ser heredados en el momento de ser evaluados. Esto quiere decir que si
 * el valor del atributo no está definido para el "Actor", se busca el valor de
 * dicho atributo en la entidad inmediata superior, por ejemplo, en el "Reparto"
 * al que pertenece o, en última instancia, en la "Escena". Los atributos que
 * admiten esta lógica de herencia son aquellos vinculados con la reprsentación
 * visual del "Actor" (el "Estilo" y el "Representador"), así también como los
 * atributos que definen su vigencia (duración y recorrido máximo).
 */
function Actor(S, origen, velocidad, estilo) {
    const _ESQ = Esquema(S, CONFIG.SOS_ACTOR);
    const _ACT = _ESQ.extender();
    
    // Variables internas del "Actor"
    const _originado = S.O.S.tiempo();
    let   _finalizado = false;

    
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
     * Se trata de una función utilitaria que permite definir el valor del atributo
     * "origen" de forma simplificada (lo mismo podria realizarse mediante el
     * método "def" del "Esquema"). Por ejemplo, las siguientes cuatro instrucciones
     * hacen todas exactamente lo mismo:
     * 
     *    defOrigen({x: 0, y: 0, z: 0});
     *    defOrigen(S.O.S.Vector(0, 0, 0));
     *    def({origen: {x: 0, y: 0, z: 0}});
     *    def({origen: S.O.S.Vector(0, 0, 0)}); 
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
     * Se trata de una función utilitaria que permite definir el valor del atributo
     * "velocidad" de forma simplificada (lo mismo podria realizarse mediante el
     * método "def" del "Esquema"). Por ejemplo, las siguientes cuatro instrucciones
     * hacen todas exactamente lo mismo:
     * 
     *    defVelocidad({x: 3, y: -0.41});
     *    defVelocidad(S.O.S.Vector(3, -0.41));
     *    def({velocidad: {x: 3, y: -0.41}});
     *    def({velocidad: S.O.S.Vector(3, -0.41)}); 
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
     * Se trata de una función utilitaria que permite definir el valor del atributo
     * "aceleracion" de forma simplificada (lo mismo podria realizarse mediante el
     * método "def" del "Esquema"). Por ejemplo, las siguientes cuatro instrucciones
     * hacen todas exactamente lo mismo:
     * 
     *    defAceleracion({x: -1, y: -1.2, z: 0});
     *    defAceleracion(S.O.S.Vector(-1, 1.2, 0));
     *    def({aceleracion: {x: -1, y: 1.2, z: 0}});
     *    def({aceleracion: S.O.S.Vector(-1, 1.2, 0)}); 
     */
    _ACT.defAceleracion = (aceleracion) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_ACELERACION] = aceleracion;
        _ESQ.def(_definicion);
        return _ACT;
    };
 
    /**
     * defEstilo
     * Define los atributos básicos para la representación visual del "Actor" en la
     * "Escena". El argumento recibido puede ser un objeto de tipo "Estilo" u otro
     * objeto Javascript que contenga su definición. Se trata de una función utilitaria
     * que permite definir el valor del atributo "estilo" de forma simplificada (lo
     * mismo podría realizarse mediante la invocación al método "def"). Por ejemplo,
     * las cuatro siguientes instrucciones hacen todas exactamente lo mismo:
     * 
     *    defEstilo({color: 'rgb(255, 255, 255)', color$alfa: 127, grandor: 12, color$trazo: 100});
     *    defEstilo(S.O.S.Estilo('rgb(255, 255, 255)', 127, 12, 100));
     *    def({estilo: {color: 'rgb(255, 255, 255)', color$alfa: 127, grandor: 12, color$trazo: 100}});
     *    def({estilo: S.O.S.Estilo('rgb(255, 255, 255)', 127, 12, 100)});
     */
    _ACT.defEstilo = (estilo) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_ESTILO] = estilo;
        _ESQ.def(_definicion);
        return _ACT;
    };

    /**
     * defRepresentador
     * Función que permite definir el "representador" por defecto para dibujar  
     * al "Actor". Se trata de una función utilitaria que permite definir el  
     * valor del atributo "representador" de una manera simplificada (lo mismo 
     * podría ser llevado a cabo mediante la función "def" del "Esquema"). 
     * Las siguientes dos instrucciones hacen exactamente lo mismo:
     * 
     *     defRepresentador(<nombre-representador>);
     *     def({representador: <nombre-representador>);
     */
    _ACT.defRepresentador = (representador) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_REPRESENTADOR] = representador;
        _ESQ.def(_definicion);
        return _ACT;
    };
    
    /**
     * defMaxDuracion
     * Función que permite definir el tiempo máximo para la participación del 
     * "Actores" en la "Escena" (en milisegundos). Se trata de una función
     * utilitaria que permite definir el valor del atributo "duracionMaxima"
     * de manera simplificada (lo mismo puede realizarse con la función "def").
     * Por ejemplo, ambas instrucciones hacen exactamente lo mismo, es decir,
     * el "Actor" culminará su participacion luego de 20 segundos.
     * 
     *    defMaxDuracion(20000); 
     *    def({duracionMaxima: 20000});
     */
    _ACT.defMaxDuracion = (tiempoMaximo) => {
        const _definicion = {};
        _definicion[CONFIG.ACT_MAX_DURACION] = tiempoMaximo;
        _ESQ.def(_definicion);
        return _ACT;
    };
    
    /**
     * defMaxRecorrido
     * Función que permite definir el recorrido máximo que el "Actor" puede
     * realizar dentro de la "Escena" (en píxeles). Se trata de una función
     * utilitaria que permite definir el valor del atributo "recorridoMaximo"
     * de manera simplificada (lo mismo puede realizarse con la función "def").
     * Por ejemplo, ambas instrucciones hacen exactamente lo mismo, es decir,
     * el "Actor" terminan su actuación luego de recorrer 50.000 píxeles.
     * 
     *    defMaxRecorrido(50000);
     *    def({recorridoMaximo: 50000});
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
     * una vez por cada iteración del ciclo de reproducción de la "Escena" (antes de
     * intentar hacer los atributs del "Actor"). 
     * La actualización invoca al método "val" del esquema para calcular el valor 
     * dinámico de sus atributos. En caso de no encontrar los valores se recurre a la
     * herencia, es decir, buscar el valor del atributo en la jerarquía del "Esquema"
     */
    _ACT.actualizar = (influenciadores) => {
        
        if (!_finalizado) {
            // 1. CONTEXTO DE EJECUCIÓN DEL ACTOR
            // Se pone a disposición el "Actor" actual en el contexto de
            // ejecución del socorrista para poder ser usado dinámicamente 
            // para el cálculo dinámico de los valores de sus variables.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            S.O.S.ACTOR = _ACT;
            
            // 2. ACTUALIZACIÓN DE LAS VARIABLES PÚBLICAS DEL ACTOR
            // En cada iteración del ciclo de ejecución se obtienen los valores
            // actualizados (evaluados) de las variables públicas del "Actor".
            // Los atributos vinculados al desplazamiento ("origen" y "velocidad")
            // no se actualizan en este punto, sólo son calculados la primera vez.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            for (let i = 0; i < CONFIG.Actor.length; i++) {
                if (CONFIG.Actor[i] != CONFIG.ACT_ORIGEN && CONFIG.Actor[i] != CONFIG.ACT_VELOCIDAD) {
                    let _valor = _ESQ.val(CONFIG.Actor[i]) ?? _ESQ.heredar(CONFIG.Actor[i]);
                    
                    // En caso de tratarse del "estilo", luego de realizar el cálculo dinámico,
                    // en necesario hacer una copia de los valores obtenidos. De lo contrario,
                    // en caso de haber sido heredado, la "actualización" estaría modificando 
                    // el mismo objeto "estilo" para todos los "Actores" que lo comparten.
                    if (CONFIG.Actor[i] == CONFIG.ACT_ESTILO) {
                        _ACT[CONFIG.ACT_ESTILO] = _valor ? (S.O.S.esUnEstilo(_valor) ? _valor.actualizar().replicar() : _valor) : CONFIG.EstiloBase;
                    }
                    else {
                        _ACT[CONFIG.Actor[i]] = _valor;
                    }
                    
                    // En caso de no haber podido encontrar (ni heredar) el "representador",
                    // se utiliza el "representador" por defecto definido para la "Escena".
                    if (CONFIG.Actor[i] == CONFIG.ACT_REPRESENTADOR && !_valor) {
                        _ACT[CONFIG.ACT_REPRESENTADOR] = S.O.S.representador;
                    }
                }
            }            

            // 3. ACTUALIZACIÓN DEL DESPLAZAMIENTO DEL ACTOR
            // Actualización de la posición y velocidad del "Actor" en la "Escena".
            // Los vectores de "Origen" y "Velocidad" se evalúan sólo la primera vez.
            // En caso de haber "Influenciadores" en el "Reparto", sus posiciones
            // alteran el cálculo de la posición del "Actor" actual.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (_ACT.origen === undefined) {
                _ACT.origen = _ESQ.val(CONFIG.ACT_ORIGEN);
                _ACT.posicion = S.O.S.Vector();
                _ACT.posicion.copiar(_ACT.origen);
            }
            if (_ACT.velocidad === undefined) {
                _ACT.velocidad = _ESQ.val(CONFIG.ACT_VELOCIDAD);
            }
            if (!_ACT.influenciador && influenciadores) {
                _ACT.influencias = [];
                _ACT.aceleracion = S.O.S.Vector(0, 0, 0);
                for (let j = 0; j < influenciadores.length; j++) {
                    if (influenciadores[j].puntoInfluencia) {
                        // Ajustar el punto de influencia con base en el desplazamiento/rotación del "Actor"
                        let _puntoInfluencia = S.O.S.Vector(influenciadores[j].puntoInfluencia);
                        _actualizarPuntoInfluencia(_puntoInfluencia, -1); 
                        _ACT.influencias.push(_puntoInfluencia);

                        // Calcular la fuerza (atracción/repulsión) del "Actor" al punto de influencia
                        let _fuerza = S.O.S.Vector(_puntoInfluencia).restar(_ACT.posicion);
                        _fuerza.multiplicar(influenciadores[j].influencia * CONFIG.RPD_FACTOR_INFLUENCIA);
                        _ACT.aceleracion.sumar(_fuerza);
                    }
                }
            }
            else if (_ACT.aceleracion === undefined) {
                _ACT.aceleracion = S.O.S.Vector(0, 0, 0);
            }
            if (_ACT.velocidad) {
                _ACT.recorrido += _ACT.velocidad.mag() ?? 0;
                _ACT.posicion.sumar(_ACT.velocidad);
                _ACT.velocidad.sumar(_ACT.aceleracion);
                _ACT.distancia = S.O.S.Vector(_ACT.origen).restar(_ACT.posicion).mag() ?? 0;
            }
            
            // 4. ACTUALIZACIÓN DEL "PUNTO DE INFLUENCIA" (SÓLO PARA INFLUENCIADORES)
            // En caso de tratarse de un "Influenciador", es necesario calcular 
            // su "Punto de Influencia". Este vector no es más que la posición ya
            // calculada a la que se le aplica el desplazamiento y la rotación
            // definida al nivel de su "Repartidor".
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (_ACT.influenciador) {
                _ACT.puntoInfluencia = S.O.S.Vector(_ACT.posicion);
                _actualizarPuntoInfluencia(_ACT.puntoInfluencia);
            }

            // 5. ACTUALIZACIÓN DEL ALCANCE & VERIFICACIÓN DE LA VIGENCIA DEL ACTOR
            // Se verifica, en este punto, si el "Actor" debería ser finalizado, ya
            // sea porque sobrepasó la duración máxima permitida (tiempo de vida) o 
            // porque su recorrido superó la distancia máxima establecida.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            let _maxDuracion  = _ACT[CONFIG.ACT_MAX_DURACION];
            let _maxRecorrido = _ACT[CONFIG.ACT_MAX_RECORRIDO];
            if ((_maxRecorrido !== null && _maxRecorrido !== undefined && _ACT.recorrido > _maxRecorrido) || 
                (_maxDuracion  !== null && _maxDuracion  !== undefined && S.O.S.tiempo() - _originado > _maxDuracion)) {
                _ACT.finalizar();
            }
            
            // 6. BLANQUEO DE LA SECUENCIA DE ACTORES
            // Se blanquean las variables que apuntan al "Actor" previo 
            // y al "Actor" siguiente. Éstas son completadas automáticamente
            // al procesar cada uno de los "Actores" activos del "Reparto"
            // (ver función "actualizar" de la "Escena").
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _ACT.prev = undefined;
            _ACT.sig  = undefined;
            
            
            // 6. REESTABLECIMIENTO DEL CONTEXTO
            // Se remueve el "Actor" actual del contexto de ejecución.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            delete S.O.S.ACTOR;
        }
        
        return _ACT;
    };
    
    /**
     * _actualizarPuntoInfluencia
     * Actualiza las coordenadas del "Punto de Influencia" (vector) recibido como argumento
     * para añadir el "desplazamiento" y la "rotación" definidos en cada uno de los "Repartos"
     * superiores del "Actor" (también recibido como parámetro). El "Punto de Influencia" es 
     * la posición del "Influenciador", pero a la que se le aplican las transformaciones
     * (desplazamientos y rotaciones) de los todos los "Repartos" de nivel superior.
     */
    function _actualizarPuntoInfluencia(punto, signo = 1) {
        for (let _superior = _ACT.superior.entidad; ; _superior = _superior.superior.entidad) {
            if (S.O.S.esUnReparto(_superior)) {
                if (signo > 0) {
                    if (_superior.rotacion) {
                        punto.rotar(Math.PI / 2 + (_superior.rotacion * signo));
                    }
                    punto.sumar(_superior.vectorDesplazamiento().multiplicar(signo));
                }
                else if (signo < 0) {
                    punto.sumar(_superior.vectorDesplazamiento().multiplicar(signo));
                    if (_superior.rotacion) {
                        punto.rotar((Math.PI / 2) - (_superior.rotacion * signo));
                        punto.rotar(Math.PI/2);
                    }
                }
            }  
            if (!_superior.superior)
                break;
        }
    }
    
    /**
     * representar
     * Función que se ocupa de la representación visual del objeto "Actor" en la "Escena".
     * Para la representación es necesario que previamente se haya invocado a la función
     * "actualizar" del "Actor" que recalcula todas sus variables dinámicas (ver método
     * "actualizar" de la "Escena"). En caso que el "Actor" no tenga ningún "representador"
     * asociado, el mecanismo de herencia aplicado durante la actualización se encarga de
     * buscar un "representador" por defecto en el "Reparto" o, en todo caso, en la "Escena".
     */
    _ACT.representar = () => {
        if (!_finalizado) {
            S.O.S.REP[_ACT[CONFIG.ACT_REPRESENTADOR] ?? CONFIG.ESTANDAR](_ACT);
        }
    };
    
    /**
     * posicionar
     * Esta función se invoca justo antes de la representación de los "Actores" de un
     * "Subreparto", es decir, "Actores" pertenecientes a un "Reparto" encabezado por
     * por el "Actor" actual. En estos casos, la posición de origen de dichos "Actores"
     * es alterada por la posición actual del "Actor" que encabeza el "Subreparto".
     * El origen del "Actor" del "Subreparto" debe coincidir con la posición actual en
     * el lienzo del "Actor" cabeza de reparto (actor actual). De la misma forma, se 
     * modifica su dirección o sentido para hacerlo coincidir con la dirección de la 
     * velocidad actual del "Actor" cabeza de reparto (actor actual).
     */
    _ACT.posicionar = () => {
        // Se calculan las coordenadas y dirección (de la velocidad) del "Actor"
        // actual, para aplicar esas transformaciones sobre el lienzo.
        let _posX = _ACT.posicion.x ?? 0;
        let _posY = _ACT.posicion.y ?? 0;
        let _posZ = _ACT.posicion.z ?? 0;
        
        let _angulo = _ACT.velocidad.ang();
        if (_posX >= 0 && _posY >= 0) 
            _angulo = -(Math.sign(_angulo) * Math.PI / 2 * 3) - _angulo;  // Cuadrante: INFERIOR-DERECHO
        else if (_posX >= 0 && _posY < 0) 
            _angulo = -(Math.sign(_angulo) * Math.PI / 2 * 3) - _angulo;  // Cuadrante: SUPERIOR-DERECHO
        else if (_posX < 0 && _posY >= 0) 
            _angulo = (Math.sign(_angulo) * Math.PI / 2 * 3) - _angulo;  // Cuadrante: INFERIOR-IZQUIEDO
        else if (_posX < 0 && _posY < 0) 
            _angulo = (Math.sign(_angulo) * Math.PI / 2 * 3) - _angulo;   // Cuadrante: SUPERIOR-IZQUIERDO

        // Operaciones de desplazamiento y rotación del lienzo
        S.O.S.P5.translate(S.O.S.escalar(_posX), S.O.S.escalar(_posY), S.O.S.escalar(_posZ));
        S.O.S.P5.rotate(_angulo);
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
     * Indica si al "Actor" ha finalizado su participación en la "Escena"
     */
    _ACT.finalizado = () => {
      return _finalizado; 
    };

    
// --------------------------------------------------------------------------------------------------
//
//   F U N C I O N E S     P R I V A D A S
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    /**
     * _inicializar
     * Función privada de inicialización del "Actor"
     */
    function _inicializar(origen, velocidad, estilo) {
        
        // 1. DEFINICIÓN DE ATRIBUTOS DINÁMICOS (DEL "ESQUEMA")
        // Se inicializa el "Esquema" con las definiciones (dinámicas) de  
        // los atributos del "Actor", recibidas como argumento.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let _definicion = {};
        if (origen)
            _definicion[CONFIG.ACT_ORIGEN] = origen;
        if (velocidad)
            _definicion[CONFIG.ACT_VELOCIDAD] = velocidad;
        if (estilo)
            _definicion[CONFIG.ACT_ESTILO] = estilo;
        _ESQ.def(_definicion);
        
        // 2. INICIALIZACIÓN DE PROPIEDADES PÚBLICAS (DEL "ACTOR")
        // Las propiedades públicas son las variables del "Actor" donde 
        // se colocan los valores evaluados de los atributos dinámicos.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        for (let i = 0; i < CONFIG.Actor.length; i++) {
            _ACT[CONFIG.Actor[i]] = undefined;
        }        
        
        // 3. INICIALIZACIÓN DE PROPIEDADES ADICIONALES 
        // Estas propiedades no forman parte de la definición de los atributos
        // dinámicos del "Esquema". Son propiedades públicas, accesibles a 
        // través de variables del "Actor" y actualizadas dinámicamente.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        _ACT.numero        = 0;         // Actualizado por el "Reparto" (si aplica)
        _ACT.orden         = 0;         // Actualizado por el "Reparto" (si aplica)
        _ACT.puesto        = 0;         // Actualizado por el "Reparto" (si aplica)
        _ACT.distancia     = 0;         // Distancia actual del "Actor" a su posición de origen
        _ACT.recorrido     = 0;         // Cantidad de píxeles recorridos desde el inicio de su desplazamiento
        _ACT.influenciador = undefined; // Boolean para indicar si el "Actor" influye en los demás actores del "Reparto"
        _ACT.influencias   = [];        // Listado de los "influenciadores" que afectan la trayectoria del "Actor"
        _ACT.posicion      = undefined; // Coordenadas <x,y,z> de su posición actual en el lienzo
        _ACT.prev          = undefined; // Actor previo dentro del "Reparto"
        _ACT.sig           = undefined; // Actor siguiente dentro del "Reparto"

        return _ACT;
    }

    
    return _inicializar(origen, velocidad, estilo);
}


export default Actor;