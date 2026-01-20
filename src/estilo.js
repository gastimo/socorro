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
    const _ESQ = Esquema(S, CONFIG.NOMBRE_ESTILO);
    const _EST = S.O.S.revelar({}, _ESQ);
    let   _color, _colorTrazo, _grandor, _grandorTrazo;
    _inicializar(color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo);
    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Estilo".
     */
    function _inicializar(color, opacidad, grandor, colorTrazo, opacidadTrazo, grosorTrazo) {
        const _definicion = {};
        
        // Definición de la tríada básica de atributos del "Estilo" (color, opacidad, grandor)
        if (color !== undefined && color !== null)
            _definicion[CONFIG.EST_COLOR] = color;
        if (opacidad !== undefined && opacidad !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_ALFA] = opacidad;
        if (grandor !== undefined && grandor !== null)
            _definicion[CONFIG.EST_GRANDOR] = grandor;

        // Definición de la tríada de atributos del trazo (color, opacidad, grosor)
        if (colorTrazo !== undefined && colorTrazo !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO] = colorTrazo;
        if (opacidadTrazo !== undefined && opacidadTrazo !== null)
            _definicion[CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO + CONFIG.ATR_VARIABLE_ALFA] = opacidadTrazo;
        if (grosorTrazo !== undefined && grosorTrazo !== null)
            _definicion[CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO] = grosorTrazo;
    
        _ESQ.def(_definicion);
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
     */
    _EST.actualizar = () => {
        _color        = _ESQ.val(CONFIG.EST_COLOR);
        _colorTrazo   = _ESQ.val(CONFIG.EST_COLOR + CONFIG.ATR_VARIABLE_TRAZO);
        _grandor      = _ESQ.val(CONFIG.EST_GRANDOR);
        _grandorTrazo = _ESQ.val(CONFIG.EST_GRANDOR + CONFIG.ATR_VARIABLE_TRAZO);
        return _EST;
    };
    
    /**
     * color
     * Devuelve el valor del atributo "color" del "Estilo". En caso de haber definido el valor
     * del atributo "opacidad", entonces, el color devuelto incluye también el canal "alfa".
     * Si se indica un valor verdadero para el argumento "trazo" la función retorna, entonces,
     * el color del trazo (si es que está definido) junto con su opacidad.
     */
    _EST.color = (trazo = false) => {
        return trazo ? _colorTrazo : _color;
    };
    
    /**
     * grandor
     * Devuelve el valor del atributo "grandor" del "Estilo". El grandor es un atributo que
     * puede ser utilizado para definir un tamaño (ancho/alto) o el grosor de un trazo.
     * Si se indica un valor verdadero para el argumento "trazo" la función retorna, entonces,
     * el grandor (grosor) del trazo (si es que está definido).
     */
    _EST.grandor = (trazo = false) => {
        return trazo ? _grandorTrazo : _grandor;
    };
        
    return _EST;
}


export default Estilo;