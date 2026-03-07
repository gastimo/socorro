/*
 * =============================================================================
 * 
 *                     M Ó D U L O    R E P A R T O
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Esquema from './esquema';


/**
 * Reparto
 * Entidad responsable de la disposición, movimiento y orquestación de actores en la "Escena".
 * El "Reparto" define conjuntos de actores que participan de la "Escena" para quienes se
 * determinan sus posiciones iniciales, sus desplazamientos (la dirección y la velocidad) 
 * y la manera de representarlos visualmente, a través del "Estilo" y del "Representador".
 * 
 * LOS RECORRIDOS EN LA ESCENA
 * Cada "Reparto" tiene un único punto de inicio en la "Escena" (coordenada <x,y,z>), que
 * puede ser desplazado en cualquier dirección (a través del vector de desplazamiento) y,
 * adicionalmente, puede ser girado según el ángulo especificado en "rotación".
 * El primer argumento del "Reparto" es la función "coreografía", que determina no sólo
 * las posiciones iniciales (o puestos) de los "Actores", sino también las direcciones
 * en las que cada uno de ellos se moverá. Los "Actores" pueden moverse de forma individual e 
 * independiente de los otros o sus posiciones iniciales (o "puestos") pueden ser compartidas
 * entre varios de ellos. El argumento "desvío" permite incorporar ruido o desviaciones 
 * aleatorias en las trayectorias preestablecidas de antemano por la coreografía.
 * 
 * ALCANCE Y LÍMITES DEL REPARTO
 * La participación de los "Actores" en el "Reparto" puede limitarse o condicionarse al
 * tiempo (el "Actor" finaliza su participación luego de un período de tiempo) o a la
 * distancia (el "Actor" sale de "Escena" luego de haber recorrido determinada distancia).
 *
 * SINCRONIZACIÓN DE ACTORES
 * El argumento "intervalo" indica cada cuántos fotogramas debe introducirse un nuevo "Actor" 
 * en la "Escena". El "Reparto" continúa sumando actores hasta que se alcance la cantidad
 * máxima indicada (argumento "cantidad"). Los "Actores" que ya hayan abandonado la "Escena",
 * por superar las limitaciones de tiempo o recorrido, se descuentan de esta cantidad máxima.
 * Cada "Actor" se desplaza en la dirección indicada por la función "coreografía" a la velocidad
 * establecida por el argumento "intensidad". Si bien el "Reparto" tiene un único punto de origen,
 * se puede especificar una distancia (mediante el argumento "separación") que representa la
 * cantidad de píxeles que separan al "Actor" (su "puesto" de partida) del punto de inicio del
 * "Reparto" en sí.
 * 
 * REPRESENTACIÓN VISUAL
 * La representación visual se lleva a cabo siguiendo las definiciones del "Estilo" y del objeto 
 * "Representador" asociados. El "Estilo" establece los atributos visuales básicos (color, opacidad,
 * tamaño y grosor) y, si bien es el mismo para todos los "Actores", es posible generar valores
 * diferentes para cada uno de ellos haciendo uso de "Variables" en su definición. Por ejemplo, 
 * los valores calculados dinámicamente pueden estar sujetos al azar, a la distancia recorrida, 
 * al tiempo transcurrido desde su incorporación a la "Escena", a su número de orden dentro del
 * "Reparto", a su distancia al punto de inicio, etc.
 * Por otro lado, el "Representador" es una función que contiene el código que determina la 
 * forma de la representación del "Actor". El "Representador" por defecto simplemente dibuja
 * un círculo por cada "Actor", pero pueden emplease "Representadores" más sofisticados que
 * dibujen formas complejas o, incluso, que conecten la representación de un "Actor" con la
 * de algún otro "Actor" en el mismo "Reparto".
 * 
 * ARGUMENTOS:
 *  - coreografia : nombre de la función "coreografía" (definido en la lista S.O.S.COREO).
 *  - cantidad    : cantidad de actores a ser introducidos en la "Escena" (a la frecuencia definida por "intervalo").
 *  - puestos     : cantidad de puestos o posiciones de partida (por defecto, hay un único puesto de inicio).
 *  - intervalo   : frecuencia (en fotogramas) para la introducción de un nuevo actor a la "Escena".
 *  - intensidad  : Valor escalar indicando la intensidad del desplazamiento (la dirección la indica la coreografía).
 *  - desvío      : Valor escalar indicando un ángulo de desvío respecto de la dirección indicada por la coreografía).
 *  - separación  : Valor escalar que especifica la distancia de cada puesto respecto del origen del "Reparto".
 * 
 * Adicionalmente, el "Reparto" dispone de otros métodos que permiten definir atributos opcionales:
 *  - defEstilo          : define el "Estilo" por defecto a aplicar a cada "Actor" del "Reparto".
 *  - defRepresentador   : define el método "Representador" a emplear para dibujar a cada "Actor" en "Escena".
 *                         La lista de métodos "Representadores" está disponible en S.O.S.REP.
 *  - defDesplazamiento  : define un vector <x,y,z> indicando el desplazamiento en el lienzo del punto de origen
 *                         del "Reparto" en sí. Por defecto, todos los repartos parten del centro.
 *  - defRotacion        : define el ángulo (en radianes) a tener en cuenta para girar al reparto completo.
 *  - defMaxDuracion     : define la duración máxima para la participación de los "Actores" en "Escena".
 *  - defMaxRecorrido    : define el recorrido máximo que cada "Actor" del "Reparto" tiene permitido realizar.
 *
 */
function Reparto(S, coreografia, cantidad, puestos, intervalo, intensidad, desvío, separacion) {
    const _ESQ = Esquema(S, CONFIG.SOS_REPARTO);
    const _RPT = _ESQ.extender();
    let   _prevIntervalo;
    let   _rutinaIniciadora;
    let   _actoresIntroducidos = 0;
    let   _finalizado = false;

            
    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien el "Reparto"
     * extiende. Se redefine simplemente para retornar, al final, el objeto "Reparto"
     * actual, que permite definiciones encadenadas.
     */
    _RPT.def = (atributos) => {
        if (atributos) {
            // Actualización de la definición de los atributos
            const _definicion = {};
            for (const [atrNombre, atrValor] of Object.entries(atributos)) {
                _definicion[atrNombre] = atrValor;
            }
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defEstilo
     * Define los atributos básicos para la representación visual de los actores del
     * "Reparto". El argumento recibido puede ser un objeto de tipo "Estilo" u otro
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
    _RPT.defEstilo = (estilo) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_ESTILO] = estilo;
        _ESQ.def(_definicion);
        return _RPT;
    };

    /**
     * defRepresentador
     * Función que permite definir el "representador" por defecto para dibujar a  
     * los "Actores". Se trata de una función utilitaria que permite definir el  
     * valor del atributo "representador" de una manera simplificada (lo mismo 
     * podría ser llevado a cabo mediante la función "def" del "Esquema"). 
     * Las siguientes dos instrucciones hacen exactamente lo mismo:
     * 
     *     defRepresentador(<nombre-representador>);
     *     def({representador: <nombre-representador>);
     */
    _RPT.defRepresentador = (representador) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_REPRESENTADOR] = representador;
        _ESQ.def(_definicion);
        return _RPT;
    };
    
    /**
     * defDesplazamiento
     * Función que permite definir un "Vector" con el desplazamiento a aplicar al
     * origen del "Reparto". El argumento puede ser tanto un objeto de tipo
     * "Vector" como su definición en JSON. Se trata de una función utilitaria que
     * permite definir el valor del atributo "desplazamiento" de forma simplificada
     * (lo mismo podría realizarse con el método "def" del "Esquema"). 
     * Las siguientes cuatro instrucciones hacen todas exactamente lo mismo: 
     * 
     *    defDesplazamiento({x: 10, y: -100, z: 0});
     *    defDesplazamiento(S.O.S.Vector(10, -100, 0));
     *    def({desplazamiento: {x: 10, y: -100, z: 0}});
     *    def({desplazamiento: S.O.S.Vector(10, -100, 0)}); 
     */
    _RPT.defDesplazamiento = (vector) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_DESPLAZAMIENTO] = vector;
        _ESQ.def(_definicion);
        return _RPT;
    };
    
    /**
     * defRotacion
     * Función que permite definir un ángulo para rotar las posiciones de todos
     * los actores del "Reparto" que son dibujados. Se trata de una función 
     * utilitaria que permite definir el valor del atributo "rotacion" de una
     * manera simplificada (lo mismo podría ser realizado mediante la función
     * "def" del "Esquema"). Por ejemplo, ambas instrucciones hacen lo mismo:
     * 
     *    defRotacion(Math.PI / 2);
     *    def({rotacion: Math.PI / 2});
     */
    _RPT.defRotacion = (angulo) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_ROTACION] = angulo;
        _ESQ.def(_definicion);
        return _RPT;
    };
    
    /**
     * defMaxDuracion
     * Función que permite definir el tiempo máximo para la participación de 
     * los "Actores" del "Reparto" (en milisegundos). Se trata de una función
     * utilitaria que permite definir el valor del atributo "duracionMaxima"
     * de manera simplificada (lo mismo puede realizarse con la función "def").
     * Por ejemplo, ambas instrucciones hacen exactamente lo mismo, es decir,
     * los "Actores" culminarán su participacion luego de 20 segundos.
     * 
     *    defMaxDuracion(20000); 
     *    def({duracionMaxima: 20000});
     */
    _RPT.defMaxDuracion = (tiempoMaximo) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_MAX_DURACION] = tiempoMaximo;
        _ESQ.def(_definicion);
        return _RPT;
    };
    
    /**
     * defMaxRecorrido
     * Función que permite definir el recorrido máximo que los "Actores" pueden
     * realizar dentro de la "Escena" (en píxeles). Se trata de una función
     * utilitaria que permite definir el valor del atributo "recorridoMaximo"
     * de manera simplificada (lo mismo puede realizarse con la función "def").
     * Por ejemplo, ambas instrucciones hacen exactamente lo mismo, es decir,
     * los "Actores" terminan su actuación luego de recorrer 50.000 píxeles.
     * 
     *    defMaxRecorrido(50000);
     *    def({recorridoMaximo: 50000});
     */
    _RPT.defMaxRecorrido = (distanciaMaxima) => {
        const _definicion = {};
        _definicion[CONFIG.RPT_MAX_RECORRIDO] = distanciaMaxima;
        _ESQ.def(_definicion);
        return _RPT;
    };
    
    /**
     * actualizar
     * Actualiza, en primer lugar, todas las variables dinámicas del "Reparto".
     * Luego, se ocupa de actualizar a cada uno de los "Actores" del "Reparto".
     */
    _RPT.actualizar = (nombreAtr) => {
        if (!_finalizado && !_RPT.metareparto) {
            
            // 1. ACTUALIZACIÓN DE LAS VARIABLES PÚBLICAS DEL REPARTO
            // En cada iteración del ciclo de ejecución se obtienen los valores
            // actualizados (evaluados) de las variables públicas del "Reparto".
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            for (let i = 0; i < CONFIG.Reparto.length; i++) {
                if (!nombreAtr || nombreAtr == CONFIG.Reparto[i]) {
                    let _valor = _ESQ.val(CONFIG.Reparto[i]) ?? _ESQ.heredar(CONFIG.Reparto[i]);

                    // En caso de tratarse del "intervalo", se verifica que siempre
                    // tenga un valor. Un intervalor de cero significa que todos los 
                    // "Actores" se generarán al mismo tiempo.
                    if (CONFIG.Reparto[i] == CONFIG.RPT_INTERVALO) {
                        _RPT[CONFIG.RPT_INTERVALO] = _valor ?? 0;
                    }
                    // En caso de tratarse del vector de "desplazamiento", debe
                    // actualizarse primero para calcular sus coordenadas <x,y,z>
                    if (CONFIG.Reparto[i] == CONFIG.RPT_DESPLAZAMIENTO) {
                        _RPT[CONFIG.RPT_DESPLAZAMIENTO] = _valor ? _valor.val() : _RPT[CONFIG.RPT_DESPLAZAMIENTO];
                    }
                    else 
                        _RPT[CONFIG.Reparto[i]] = _valor;                

                    // ----------------------------------------------------------------------
                    //  NOTA: Si bien el "Estilo" (si es que fue definido en el "Reparto")
                    //  se obtiene en este punto, no es actualizado. La actualización del
                    //  "Estilo" siempre la hace el "Actor", ya que puede requerir atributos
                    //  de éste durante su evaluación (ej. orden, puesto, distancia, etc).
                    // ----------------------------------------------------------------------
                }
            }
            
            // 2. DECLARACIÓN DE LA RUTINA INICIALIZADORA
            // Se trata de la rutina encargada de introducir los "Actores" del "Reparto"
            // a la "Escena". Se posterga su inicialización hasta este punto para asegurarse
            // de contar con los valores actualizados de los atributos del "Reparto" (por 
            // ejemplo, "intervalo", "cantidad", "puestos", "etc").
            // La rutina debería ser reinicializada cada vez que el valor del "intervalo"
            // haya sido modificado.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (!_rutinaIniciadora || _prevIntervalo != _RPT[CONFIG.RPT_INTERVALO]) {
                _RPT.iniciadorDelReparto();
                _prevIntervalo = _RPT[CONFIG.RPT_INTERVALO];
            }

            // 3. ENTRADA DE ACTORES A ESCENA
            // Se invoca a la "Rutina Iniciadora" para dar entrada a los "Actores" a 
            // la "Escena". Esta rutina es un método configurado para sumar un nuevo
            // "Actor" cada vez que transcurra el intervalo de espera indicado.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (!nombreAtr)
                _rutinaIniciadora(_RPT);
        }
    };
    
    
    /**
     * iniciadorDelReparto
     * Función interna que define la "Rutina Iniciadora", es decir, el método que se 
     * ocupa de darle la entrada a "Escena" a los "Actores" en el momento que les 
     * corresponde (según lo indicado por el argumento "intervalo").
     */
    _RPT.iniciadorDelReparto = () => {
        let _intervalo = _RPT[CONFIG.RPT_INTERVALO] <= 0 ? 1 : _RPT[CONFIG.RPT_INTERVALO];
        _rutinaIniciadora = S.O.S.accionador(_intervalo, () => {
            let _nroActores = S.O.S.actores(_ESQ.identificador)?.length ?? 0;
            let _cantidad = _RPT[CONFIG.RPT_CANTIDAD] ?? 1;
            let _puestos  = _RPT[CONFIG.RPT_PUESTOS] ? (_RPT[CONFIG.RPT_PUESTOS] > 1 ? _RPT[CONFIG.RPT_PUESTOS] : 1) : 1;
            
            for (let i = _nroActores; i < _cantidad; i++) {
                let _nuevoActor = S.O.S.Actor();
                _nuevoActor.numero = _actoresIntroducidos;
                _nuevoActor.orden  = _actoresIntroducidos % _cantidad;
                _nuevoActor.puesto = _actoresIntroducidos % _puestos;
                _actoresIntroducidos++;
                
                // Se coreografía el movimiento del "Actor" en la "Escena"
                S.O.S.COREO[_RPT[CONFIG.RPT_COREOGRAFIA] ?? S.O.S.COREO[CONFIG.ESTANDAR]]
                                (_nuevoActor,
                                 _cantidad,                         // Cantidad máxima de actores en "Escena"
                                 _puestos,                          // Cantidad total de posiciones de partida
                                 _RPT[CONFIG.RPT_INTENSIDAD] ?? 0,  // Intensidad (magnitud para la velocidad)
                                 _RPT[CONFIG.RPT_DESVIO]     ?? 0,  // Desvío (angulo en radianes)
                                 _RPT[CONFIG.RPT_SEPARACION] ?? 0); // Separación (desde el punto de origen)

                // Se incorpora el "Actor" al "Reparto". Al añadirlo bajo un
                // "nombre de atributo de dinámico", el "Esquema" no lo guarda
                // internamente (y por lo tanto, tampoco se incluye en futuras 
                // exportaciones), pero sí se incorpora al "Reparto" general.
                const _definicionActor = {};
                _definicionActor[CONFIG.ATR_NOMBRE_DINAMICO] = _nuevoActor;
                _ESQ.def(_definicionActor);
                
                // Si existen "Subrepartos", se crean nuevas instancias colocando
                // a "Actor" creado como cabeza de dichos "Repartos"
                _iniciarSubrepartos(_nuevoActor);
                
                // Cuando el intervalo se define en "cero", se genera la cantidad
                // completa de "Actores" en la iteración actual. En caso contrario
                // se van generando espaciadamente, de acuerdo a lo indicado en el
                // parámetro "intervalo" (que especifica cantidad de fotogramas).
                if (_RPT[CONFIG.RPT_INTERVALO] != 0 || i >= _cantidad - 1)
                    break;
                else {
                    // Se actualizan los parámetros del "Reparto" para el siguiente "Actor"
                    _RPT.actualizar(CONFIG.RPT_PUESTOS);
                    _RPT.actualizar(CONFIG.RPT_INTENSIDAD);
                    _RPT.actualizar(CONFIG.RPT_DESVIO);
                    _RPT.actualizar(CONFIG.RPT_SEPARACION);                
                }
            }
        });
    };
    
    /**
     * posicionar
     * Esta función se invoca justo antes de la representación de los "Actores" del
     * "Reparto" en la Escena". 
     * Si bien el "Reparto" en sí no tiene representación visual (sólo los "Actores"
     * la tienen), esta función realiza las tareas de preparación para la representación
     * posterior de los "Actores" que conforman el "Reparto". Por ejemplo, esta función
     * se ocupa de ubicar las coordenadas de origen del "Reparto" en el lienzo.
     */
    _RPT.posicionar = () => {
        if (_RPT.desplazamiento) {
            S.O.S.P5.translate((_RPT.desplazamiento.x ?? 0) * S.O.S.ancho() / 2, 
                               (_RPT.desplazamiento.y ?? 0) * S.O.S.alto()  / 2, 
                               (_RPT.desplazamiento.z ?? 0) * (S.O.S.ancho() + S.O.S.alto()) / 4) ;
        }
        if (_RPT.rotacion) {
            S.O.S.P5.rotate(_RPT.rotacion);
        }
    };
    
    /**
     * subreparto
     * Crea un nuevo "Reparto" como una copia del "Reparto" actual.
     */
    _RPT.subreparto = () => {
        const _sr = Reparto(S);
        _sr.replicarDef(_ESQ);
        _sr.metadef = _RPT;
        return _sr;
    };
    

    /**
     * finalizar
     * Marca al "Reparto" corriente como finalizado
     */
    _RPT.finalizar = () => {
      _finalizado = true; 
    };

    /**
     * finalizado
     * Indica si al "Reparto" ha finalizado su participación en la "Escena"
     */
    _RPT.finalizado = () => {
      return _finalizado; 
    };
    
    
// --------------------------------------------------------------------------------------------------
//
//   F U N C I O N E S     P R I V A D A S
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Reparto".
     */
    function _inicializar(coreografia, cantidad, puestos, intervalo, intensidad, desvío, separacion) {
        
        // 1. DEFINICIÓN DE ATRIBUTOS DINÁMICOS (DEL "ESQUEMA")
        // Se inicializa el "Esquema" con las definiciones (dinámicas) de  
        // los atributos del "Reparto", recibidas como argumento.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let _definicion = {};        
        if (coreografia !== undefined && coreografia !== null)
            _definicion[CONFIG.RPT_COREOGRAFIA] = coreografia;
        if (cantidad !== undefined && cantidad !== null)
            _definicion[CONFIG.RPT_CANTIDAD] = cantidad;
        if (puestos !== undefined && puestos !== null)
            _definicion[CONFIG.RPT_PUESTOS] = puestos;
        if (intervalo !== undefined && intervalo !== null)
            _definicion[CONFIG.RPT_INTERVALO] = intervalo;
        if (intensidad !== undefined && intensidad !== null)
            _definicion[CONFIG.RPT_INTENSIDAD] = intensidad;
        if (desvío !== undefined && desvío !== null)
            _definicion[CONFIG.RPT_DESVIO] = desvío;
        if (separacion !== undefined && separacion !== null)
            _definicion[CONFIG.RPT_SEPARACION] = separacion;
        _ESQ.def(_definicion);
        
        // 2. INICIALIZACIÓN DE PROPIEDADES PÚBLICAS (DEL "REPARTO")
        // Las propiedades públicas son las variables del "Reparto" donde 
        // se colocan los valores evaluados de los atributos dinámicos.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        for (let i = 0; i < CONFIG.Reparto.length; i++) {
            _RPT[CONFIG.Reparto[i]] = undefined;
        }        
        
        // 3. INICIALIZACIÓN DE PROPIEDADES ADICIONALES 
        // Estas propiedades no forman parte de la definición de los atributos
        // dinámicos del "Esquema". Son propiedades públicas, accesibles a 
        // través de variables del "Reparto" y actualizadas dinámicamente.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        _RPT.metareparto = false;  // Definición de un "Reparto" dentro de otro "Reparto"
        _RPT.metadef = undefined;  // Puntero al metareparto con la definición del "Subreparto" actual
        
        return _RPT;
    }
        
    /**
     * _iniciarSubrepartos
     * Crear e inicializa los "Subrepartos" por cada "Actor" del "Reparto" superior.
     * NOTA: Los "Subrepartos" siempre terminan siendo registrados bajo un "Actor" y nunca
     * bajo el "Reparto" superior. La definición de un "Subreparto" dentro de un "Reparto"
     * principal es interpretado como un "metareparto", es decir, es una plantilla que se
     * emplea a la hora de crear las instancias de dicho "Subreparto" por cada uno de los
     * "Actores" introducidos en el "Reparto" principal. Existirán tantas instancias del
     * "Subreparto" como "Actores" hayan sido introducidos en el "Reparto" superior.
     */
    function _iniciarSubrepartos(actor) {
        let _repartoSuperior = actor.superior.entidad.metadef ?? actor.superior.entidad; 
        let _subrepartos = S.O.S.metarepartos(_repartoSuperior.identificador);
        if (_subrepartos) {
            for (let i = 0; i < _subrepartos.length; i++) {
                let _subreparto = _subrepartos[i].subreparto();
                const _definicionActor = {};
                _definicionActor[CONFIG.ATR_NOMBRE_DINAMICO] = _subreparto;
                actor.def(_definicionActor);
            }
        }
    }

    
    return  _inicializar(coreografia, cantidad, puestos, intervalo, intensidad, desvío, separacion);
}


export default Reparto;