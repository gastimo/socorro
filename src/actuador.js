/*
 * =============================================================================
 * 
 *                         M Ó D U L O    A C T U A D O R
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Esquema from './esquema';


/**
 * Actuador
 * Los "Actuadores" son los objetos participantes de la puesta en "Escena". 
 * Los "Actuadores" poseen propiedades que pueden ser modificadas, en tiempo
 * de ejecución (mediante "Variables"), para controlar lo siguiente:
 * 
 * - POSICIÓN             : coordenadas <x,y,z> dentro de la "Escena".
 * - DESPLAZAMIENTO       : vector de velocidad define su recorrido (<x,y,z>).
 * - REPRESENTACIÓN VISUAL: color, opacidad, tamaño (del relleno y el trazo).
 * 
 * Adicionalmente, el "Actuador" tiene asociado alguno de estos comportamientos:
 * - REPENTISTA : Es un actuador independiente que se mueve libre por la "Escena" 
 *                marcando su propio recorrido, sin ser influenciado o alterado 
 *                por ningún otro actuador de la "Obra".
 * - SEGUIDOR   : Es un actuador cuyo desplazamiento está condicionado por algún
 *                o algunos de los repentistas con los cuales comporte el espacio.
 *                El trayecto del "seguidor" busca imitar o seguir el recorrido
 *                propuesto por el/los repentista/s con los que se vincula.
 */
function Actuador(S) {
    const _ESQ = Esquema(S, CONFIG.NOMBRE_ACTUADOR);
    const _ACT = S.O.S.revelar({}, _ESQ);
    const _clave = _ESQ.clave();
    const _nacimiento = S.O.S.tiempo();
    const _orden = null;
    const _origen = null;
    const _posicion = null;
    const _velocidad = null;
    const _aceleracion = null;
    let   _trayecto = 0;
    let   _terminado = false;
    _inicializar();
    
    
    /**
     * _inicializar
     * Método privado de inicialización de las propiedades del "Actuador".
     */
    function _inicializar() {
        _ESQ.def({velocidad : null});
    }
    
    
    // -------------------------------------------------------------
    // 
    // EXPOSICIÓN DE PROPIEDADES ESTÁTICAS Y DINÁMICAS DEL ACTUADOR
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _ACT.clave       = _clave;        // Identificador único del actuador
    _ACT.orden       = _orden;        // Número de orden en la secuencia
    _ACT.origen      = _origen;       // Coordenadas del origen del trayecto
    _ACT.posicion    = _posicion;     // Posición actual (<x,y,z>)
    _ACT.velocidad   = _velocidad;    // Velocidad actual (<x,y,z>) 
    _ACT.aceleracion = _aceleracion;  // Aceleración actual (<x,y,z>) 
    _ACT.nacimiento  = _nacimiento;   // Tiempo (milisegundos) de su creación
    _ACT.trayecto    = _trayecto;     // Cantidad de píxeles recorridos
    _ACT.terminado   = _terminado;    // Indicador de expiración (true/false)
    
    
    
    // -------------------------------------------------------------
    // 
    // EXPOSICIÓN DE MÉTODOS DEL ACTUADOR
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    
    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien el
     * "Actuador" extiende. Se redefine simplemente para retornar, al final,
     * el objeto "Actuador" actual, que permite definiciones encadenadas.
     */
    _ACT.def = (atributos) => {
        _ESQ.def(atributos);
        return _ACT;
    };
    
    /**
     * Ejemplo: VarVector()
     * 
     *  act.def({
     *        forma    :  {color     : [color]   / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                     color$alfa: [alfa]    / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                     grandor   : [grandor] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>}
     *                    },
     *        trazo    :  {color     : [color]   / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                     color$alfa: [alfa]    / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                     grandor   : [grandor] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>}
     *                    },
     *        origen   : [x,y,z] / {x : [x] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                              y : [y] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                              z : [z] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>}
     *                             }
     *        velocidad: [x,y,z] / {x : [x] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                              y : [y] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>},
     *                              z : [z] / {metodo: <xxxx>, valor: <yyyy>, modulador: <zzzz>}
     *                             }
     *  });
     * 
     */
    _ACT.defForma = (color, alfa, grandor) => {
        return _ACT;
    };

    _ACT.defTrazo = (color, alfa, grandor) => {
        return _ACT;
    };
    
    _ACT.defOrigen = (x, y, z) => {
        return _ACT;
    };
    
    _ACT.defVelocidad = (x, y, z) => {
        return _ACT;
    };

    _ACT.defTrayecto = (...parametros) => {
        return _ACT;
    };
    
    return _ACT;
    
}

export default Actuador;