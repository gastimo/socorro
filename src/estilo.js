/*
 * =============================================================================
 * 
 *                          M Ó D U L O    E S T I L O
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Esquema from './esquema';


/**
 * Estilo
 * Objeto para almacenar la definición de una representación visual. Básicamente, 
 * este objeto permite definir el color, opacidad y tamaño de cualquier objeto que
 * deba ser mostrado en la "Escena", así también como el color, opacidad y grosor
 * de su trazo o contorno (si aplica).
 */
function Estilo(S, color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo) {
    const _ESQ = Esquema(S, CONFIG.SOS_ESTILO);
    const _EST = _ESQ.extender();

    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Estilo".
     */
    function _inicializar(color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo) {
        
        // 1. DEFINICIÓN DE ATRIBUTOS DINÁMICOS (DEL "ESTILO")
        // Se inicializa el "Esquema" con las definiciones (dinámicas) de  
        // los atributos del "Estilo", recibidas como argumento.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        let _definicion = {};
        
        // >>> TRIADA DE ATRIBUTOS DE LA FORMA <color, opacidad, grandor>
        if (color !== undefined && color !== null)
            _definicion[CONFIG.EST_COLOR] = color;
        if (opacidad !== undefined && opacidad !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_ALFA] = opacidad;
        if (grandor !== undefined && grandor !== null)
            _definicion[CONFIG.EST_GRANDOR] = grandor;

        // >>> TRIADA DE ATRIBUTOS DEL TRAZO <color, opacidad, grosor>
        if (colorTrazo !== undefined && colorTrazo !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO] = colorTrazo;
        if (opacidadTrazo !== undefined && opacidadTrazo !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO + CONFIG.ATR_VARIABLE_ALFA] = opacidadTrazo;
        if (grosorTrazo !== undefined && grosorTrazo !== null)
            _definicion[CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO] = grosorTrazo;
    
        _ESQ.def(_definicion);
        
        // 2. INICIALIZACIÓN DE PROPIEDADES PÚBLICAS (DEL "ESTILO")
        // Las propiedades públicas son las variables del "Estilo" donde 
        // se colocan los valores evaluados de los atributos dinámicos.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        for (let i = 0; i < CONFIG.Estilo.length; i++) {
            _EST[CONFIG.Estilo[i]] = undefined;
        }        
        
        return _EST;
    }
    
    /**
     * def
     * Permite definir el conjunto de atributos básicos vinculados con la representación 
     * visual de un objeto de la "Escena". Básicamente, permite definir la tríada de 
     * valores "<color, opacidad, grandor>" a utilizar para representar al objeto y, 
     * opcionalmente, la misma tríada "<color, opacidad, grosor>" para definir su trazo
     * o contorno. Cada uno de los elementos de ambas tríadas puede ser un valor escalar
     * simple (numérico o "color") o, incluso, una "Variable". 
     * 
     * EJEMPLO #1: Definición de un "Estilo" con valores estáticos:
     * 
     *    estilo.def({color            : <color>,
     *                color$alfa       : <opacidad>,
     *                grandor          : <grandor>,
     *                color$trazo      : <color>,
     *                color$trazo$alfa : <opacidad>,
     *                grandor$trazo    : <grandor>
     *               });
     * 
     * 
     * EJEMPLO #2: Definición de un "Estilo" con variables dinámicas, ya sea mediante
     *             objetos de tipo "Variable" o, en su defecto, con su definición:
     * 
     *    estilo.def({color         : S.O.S.Variable().map('perlin', 'flamingo'),
     *                grandor       : {metodo      : 'perlin',
     *                                 modulador   : 0.009,
     *                                 valorDesde  : 400,
     *                                 valorHasta  : 700},
     *                color$trazo   : S.O.S.Variable().map('ciclo', 'cadete').mod(1000),
     *                grandor$trazo : S.O.S.Variable().map(30).ruido(0.02, 120).
     *               });
     */
    _EST.def = (atributos) => {
        if (atributos) {
            const _definicion = {};
            for (const [atrNombre, atrValor] of Object.entries(atributos)) {
                if (atrNombre === CONFIG.EST_COLOR ||
                    atrNombre === CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_ALFA ||
                    atrNombre === CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO ||
                    atrNombre === CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO + CONFIG.ATR_VARIABLE_ALFA ||
                    atrNombre === CONFIG.EST_GRANDOR ||
                    atrNombre === CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO) {
                    _definicion[atrNombre] = atrValor;
                }
            }
            _ESQ.def(_definicion);
        }
        return _EST;
    };
    
    /**
     * actualizar
     * Actualiza todas las variables dinámicas del "Estilo". Esta función debe invocarse
     * una vez por cada iteración del ciclo de reproducción de la "Escena", antes de 
     * hacer uso de los valores del "Estilo"
     * 
     * ACTUALIZACIÓN DEL COLOR (color & color$trazo)
     * En caso de haber definido el valor del atributo "opacidad", entonces, el color devuelto
     * incluye también el canal "alfa" (aplica tanto a "color" como "color$trazo").
     */
    _EST.actualizar = () => {
        _EST.color   = _ESQ.val(CONFIG.EST_COLOR);
        _EST.trazo   = _ESQ.val(CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO);
        _EST.grandor = _ESQ.val(CONFIG.EST_GRANDOR);
        _EST.grosor  = _ESQ.val(CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO);
        return _EST;
    };
    
    /**
     * replicar
     * Retorna un objeto con los atributos públicos del "Estilo"
     * con sus valores ya evaluads.
     */
    _EST.replicar = () => {
        let _estilo = {};
        _estilo.color   = _EST.color;
        _estilo.trazo   = _EST.trazo;
        _estilo.grandor = _EST.grandor;
        _estilo.grosor  = _EST.grosor;
        return _estilo;
    };
    
    
    return _inicializar(color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo);
}


export default Estilo;