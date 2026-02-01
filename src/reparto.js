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
 * Entidad responsable de la disposición, movimiento y orquestación de actores en "Escena".
 * El "Reparto" define conjuntos de actores que participan en la "Escena", para quienes se
 * determinan sus posiciones iniciales, sus desplazamientos (la dirección y la velocidad) 
 * y la manera de representarlos visualmente, a través del "Estilo" y del "Representador".
 * 
 * LOS RECORRIDOS EN LA ESCENA
 * Cada "Reparto" tiene un único punto de inicio en la "Escena" (coordenada <x,y,z>), que
 * puede ser desplazado en cualquier dirección a través del vector de "desplazamiento".
 * El primer argumento del "Reparto" en la función "coreografía", quien determina no sólo
 * las posiciones iniciales (o puestos) de los "Actores", sino también las direcciones
 * en las que cada uno de ellos se moverá. Los "Actores" pueden moverse de forma individual e 
 * independiente de los otros o sus posiciones iniciales (o "puestos") pueden ser compartidas
 * entre varios de ellos. El argumento "desvío" permite incorporar ruido o desviaciones 
 * aleatorias en las trayectorias preestablecidas de antemano por la "coreografía".
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
 * establecida por el argumento "velocidad". Si bien el "Reparto" tiene un único punto de origen,
 * se puede especificar una distancia (mediante el argumento "separación") que representa la
 * cantidad de píxeles que separan al "Actor" (su "puesto" de partida) del punto de inicio del
 * "Reparto" en sí. Tanto este último parámetro "separación", como los argumentos "velocidad" 
 * y "desvío" no necesariamente tiene que ser valores fijos, sino que pueden indicarse mediante
 * objetos "Variadores" para que produzcan valores aleatorios diferentes por cada "Actor".
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
 * dibujen formas más complejas o, incluso, que conecten la representación de un "Actor" con
 * la de algún otro "Actor" en el mismo "Reparto".
 * 
 * ARGUMENTOS:
 *  - coreografia    : nombre de la función "coreografía" (definido en la lista S.O.S.COREO).
 *  - cantidad       : cantidad de actores a ser introducidos en la "Escena" (a la frecuencia definida por "intervalo").
 *  - puestos        : cantidad de puestos o posiciones de partida (por defecto, hay un único puesto de inicio).
 *  - intervalo      : frecuencia (en fotogramas) para la introducción de un nuevo actor a la "Escena".
 *  - velocidad  (*) : Valor escalar indicando la intensidad del desplazamiento (la dirección la indica la coreografía).
 *  - desvío     (*) : Valor escalar indicando un ángulo de desvío respecto de la dirección indicada por la coreografía).
 *  - separación (*) : Valor escalar que especifica la separación de cada puesto respecto del origen del "Reparto".
 *  - recorrido      : distancia máxima (en píxeles) del recorrido de cada "Actor" (una vez alcanzada, finaliza).
 *  - tiempo         : tiempo máximo (en milisegundos) de participación de cada "Actor" (una vez alcanzado finaliza).
 * 
 *  (*): indica que el argumento puede ser un valor escalar simple o un objeto "Variador".
 * 
 * Adicionalmente, el "Reparto" dispone de otros métodos que permiten definir atributos opcionales:
 *  - defEstilo          : define el "Estilo" por defecto a aplicar a cada "Actor" del "Reparto".
 *  - defRepresentador   : define el método "Representador" a emplear para dibujar a cada "Actor" en "Escena".
 *                         La lista de métodos "Representadores" está disponible en S.O.S.REP.
 *  - defDesplazamiento  : define un vector <x,y,z> indicando el desplazamiento en el lienzo del punto de origen
 *                         del "Reparto" en sí. Por defecto, todos los repartos parten del centro.
 *  - defMaxDuracion     : define la duración máxima para la participación de los "Actores" en "Escena".
 *  - defMaxRecorrido    : define el recorrido máximo que cada "Actor" del "Reparto" tiene permitido realizar.
 *
 */
function Reparto(S, coreografia, cantidad, puestos, intervalo, velocidad, desvío, separacion) {
    const _ESQ = Esquema(S, CONFIG.SOS_REPARTO);
    const _RPT = S.O.S.revelar({}, _ESQ);
    _inicializar(coreografia, cantidad, puestos, intervalo, velocidad, desvío, separacion);

        
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Reparto".
     */
    function _inicializar(coreografia, cantidad, puestos, intervalo, velocidad, desvío, separacion) {
        const _definicion = {};        
        if (coreografia !== undefined && coreografia !== null)
            _definicion[CONFIG.RPT_COREOGRAFIA] = coreografia;
        if (cantidad !== undefined && cantidad !== null)
            _definicion[CONFIG.RPT_CANTIDAD] = cantidad;
        if (puestos !== undefined && puestos !== null)
            _definicion[CONFIG.RPT_PUESTOS] = puestos;
        if (intervalo !== undefined && intervalo !== null)
            _definicion[CONFIG.RPT_INTERVALO] = intervalo;
        if (velocidad !== undefined && velocidad !== null)
            _definicion[CONFIG.RPT_VELOCIDAD] = velocidad;
        if (desvío !== undefined && desvío !== null)
            _definicion[CONFIG.RPT_DESVIO] = desvío;
        if (separacion !== undefined && separacion !== null)
            _definicion[CONFIG.RPT_SEPARACION] = separacion;

        // Inicialización de las definiciones de los atributos on los valores provistos
        _ESQ.def(_definicion);
        
        // Inicialización de las propiedades del "Reparto"
        _RPT.estilo = {color: undefined, grandor: undefined, trazo: undefined, grosor: undefined};
        _RPT.representador = undefined;
        _RPT.alcance = {recorrido: undefined, tiempo: undefined};
        _RPT.desplazamiento = S.O.S.Vector(); 
    }
        
    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien el "Reparto"
     * extiende. Se redefine simplemente para retornar, al final, el objeto "Reparto"
     * actual, que permite definiciones encadenadas.
     */
    _RPT.def = (atributos) => {
        if (atributos) {
            const _definicion = {};
            for (const [atrNombre, atrValor] of Object.entries(atributos)) {
                if (atrNombre === CONFIG.RPT_COREOGRAFIA   || atrNombre === CONFIG.RPT_CANTIDAD || 
                    atrNombre === CONFIG.RPT_PUESTOS       || atrNombre === CONFIG.RPT_INTERVALO ||
                    atrNombre === CONFIG.RPT_VELOCIDAD     || atrNombre === CONFIG.RPT_DESVIO ||
                    atrNombre === CONFIG.RPT_SEPARACION    || atrNombre === CONFIG.RPT_RECORRIDO ||
                    atrNombre === CONFIG.RPT_DURACION      || atrNombre === CONFIG.RPT_ESTILO ||
                    atrNombre === CONFIG.RPT_REPRESENTADOR || atrNombre === CONFIG.RPT_DESPLAZAMIENTO) {
                    _definicion[atrNombre] = atrValor;
                }
            }
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defEstilo
     * Define los atributos básicos para la representación visual de los actores del
     * "Reparto". El argumento recibido puede ser un objeto de tipo "Estilo" u otro
     * objeto Javascript que contenga su definición. Por ejemplo, las dos declaraciones 
     * de abajo hacen exactamente lo mismo:
     * 
     *    defEstilo({color: 'rgb(255, 255, 255)', color$alfa: 127, grandor: 12, color$trazo: 100});
     *    defEstilo(S.O.S.Estilo('rgb(255, 255, 255)', 127, 12, 100));
     */
    _RPT.defEstilo = (estilo) => {
        if (estilo !== undefined && estilo !== null) {
            const _definicion = {};
            _definicion[CONFIG.RPT_ESTILO] = estilo;
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defRepresentador
     * Función que permite definir el nombre del "Representador" por defecto
     * asociado al "Reparto". Por ejemplo:
     *  
     *    defRepresentador(S.O.S.REP.romboide);
     */
    _RPT.defRepresentador = (representador) => {
        if (representador !== undefined && representador !== null) {
            const _definicion = {};
            _definicion[CONFIG.RPT_REPRESENTADOR] = representador;
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defDesplazamiento
     * Función que permite definir un "Vector" con el desplazamiento a aplicar al
     * origen del "Reparto". El argumento puede ser tanto un objeto de tipo
     * "Vector" como su definición. Por ejemplo, ambas instrucciones hacen lo mismo:
     * 
     *    defDesplazamiento({x: 10, y: -100, z: 0});
     *    defDesplazamiento(S.O.S.Vector(10, -100, 0));
     */
    _RPT.defDesplazamiento = (vector) => {
        if (vector !== undefined && vector !== null) {
            const _definicion = {};
            _definicion[CONFIG.RPT_DESPLAZAMIENTO] = vector;
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defMaxDuracion
     * Función que permite definir el tiempo máximo de duración de los "Actores"
     * del "Reparto" (en milisegundos). 
     * Por ejemplo:
     *    defMaxDuracion(20000);  // El "Actor" culmina su participación en 20 segundos
     */
    _RPT.defMaxDuracion = (tiempoMaximo) => {
        if (tiempoMaximo !== undefined && tiempoMaximo !== null) {
            const _definicion = {};
            _definicion[CONFIG.RPT_DURACION] = tiempoMaximo;
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
    
    /**
     * defMaxRecorrido
     * Función que permite definir el recorrido máximo que los "Actores" pueden
     * realizar dentro de la "Escena" (en píxeles). 
     * Por ejemplo:
     *    defMaxRecorrido(50000);  // El "Actor" termina después de recorrer una distancia de 50.000 píxeles
     */
    _RPT.defMaxRecorrido = (distanciaMaxima) => {
        if (distanciaMaxima !== undefined && distanciaMaxima !== null) {
            const _definicion = {};
            _definicion[CONFIG.RPT_RECORRIDO] = distanciaMaxima;
            _ESQ.def(_definicion);
        }
        return _RPT;
    };
        
    
    /**
     * actualizar
     */
    _RPT.actualizar = () => {
    };
        
    return _RPT;
}


export default Reparto;