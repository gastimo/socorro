/*
 * =============================================================================
 * 
 *                         M Ó D U L O    V E C T O R 
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Esquema from './esquema';


/**
 * Vector
 * Objeto utilitario para operar con vectores. El "Vector" permite
 * definir coordenadas en la "Escena" correspondientes al eje X, al
 * eje Y y al eje Z. Si bien el objeto "Vector" no extiende de "Esquema", 
 * implementa la gran mayoría de sus métodos (ej. "nombre", "exportar", 
 * "def, etc.), pero incorpora funciones propias del manejo de vectores
 * (ej. "sumar", "mult", "mag", "dist", etc).
 */
function Vector(S, a, b, c) {
    const _VEC = {};
    let _vectorial = S.O.S.esUnVector(a);
    _VEC.x = _vectorial ? a.x : a;
    _VEC.y = _vectorial ? a.y : b;
    _VEC.z = _vectorial ? a.z : c;

    
    // -------------------------------------------------------------
    // 
    // EXPOSICIÓN DE MÉTODOS DEL VECTOR
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    /**
     * nombre
     * Devuelve el nombre que identifica al tipo de objeto "Vector".
     */
    _VEC.nombre = () => {
        return CONFIG.NOMBRE_VECTOR;
    };
   
    /**
     * def
     * Permite la definición de los componentes del "Vector", es decir,
     * las coordenadas <x, y, z>. Si en lugar de tres argumentos, se 
     * recibe otro "Vector", entonces esta función toma sus valores
     * de dicho objeto para definir sus componentes internos.
     */
    _VEC.def = (atributos) => {
        if (atributos) {
            if (atributos.hasOwnProperty('x'))
                _VEC.x = atributos.x;
            if (atributos.hasOwnProperty('y'))
                _VEC.y = atributos.y;
            if (atributos.hasOwnProperty('z'))
                _VEC.z = atributos.z;        
        }
        return _VEC;
    };
    
    /**
     * sumar
     * Suma el vector recibido como argumento al vector actual.
     * Si el argumento es un valor escalar, entonces, suma dicho
     * valor escalar a cada una de los componentes del vector.
     */
    _VEC.sumar = (sumando) => {
        let _vectorial = S.O.S.esUnVector(sumando);
        if (_VEC.x !== null && _VEC.x !== undefined)
            _VEC.x += _vectorial ? sumando.x?? 0 : sumando;
        if (_VEC.y !== null && _VEC.y !== undefined)
            _VEC.y += _vectorial ? sumando.y?? 0 : sumando;
        if (_VEC.z !== null && _VEC.z !== undefined)
            _VEC.z += _vectorial ? sumando.z?? 0 : sumando;
        return _VEC;
    };

    /**
     * restar
     * Resta el vector recibido como argumento del vector actual.
     * Si el argumento es un valor escalar, entonces, resta dicho
     * valor escalar de cada uno de los componentes del vector.
     */
    _VEC.restar = (sustraendo) => {
        let _vectorial = S.O.S.esUnVector(sustraendo);
        if (_VEC.x !== null && _VEC.x !== undefined)
            _VEC.x -= _vectorial ? sustraendo.x?? 0 : sustraendo;
        if (_VEC.y !== null && _VEC.y !== undefined)
            _VEC.y -= _vectorial ? sustraendo.y?? 0 : sustraendo;
        if (_VEC.z !== null && _VEC.z !== undefined)
            _VEC.z -= _vectorial ? sustraendo.z?? 0 : sustraendo;
        return _VEC;
    };
    
    /**
     * multiplicar
     * Multiplica el valor escalar recibido como argumento por cada
     * uno de los componentes del vector.
     */
    _VEC.multiplicar = (multiplicando) => {
        if (_VEC.x !== null && _VEC.x !== undefined)
            _VEC.x *= multiplicando;
        if (_VEC.y !== null && _VEC.y !== undefined)
            _VEC.y *= multiplicando;
        if (_VEC.z !== null && _VEC.z !== undefined)
            _VEC.z *= multiplicando;
        return _VEC;        
    };
    
    /**
     * mag
     * Devuelve la magnitud del vector, o sea, su longitud.
     */
    _VEC.mag = () => {
        return Math.sqrt(Math.pow(_VEC.x ?? 0, 2) + Math.pow(_VEC.y ?? 0, 2) + Math.pow(_VEC.z ?? 0, 2));
    };
    
    /**
     * copiar
     * Copia el contenido del vector recibido como argumento
     * en el vector corriente.
     */
    _VEC.copiar = (v) => {
        if (v) {
            _VEC.x = v?.x;
            _VEC.y = v?.y;
            _VEC.z = v?.z;
        }
        return _VEC;
    };
    
    /**
     * vacio
     * Retorna "true" o "false" para indicar si el vector ya ha sido
     * sido inicializado con algún valor o si todos sus componentes 
     * están vacíos. 
     */
    _VEC.vacio = () => {
       return (_VEC.x === undefined || _VEC.x === null) &&
              (_VEC.y === undefined || _VEC.y === null) &&
              (_VEC.z === undefined || _VEC.z === null);
    };
    
    /**
     * exportar
     * Devuelve un texto con la representación JSON del vector.
     */
    _VEC.exportar = (indentacion = "") => {
        let _esq = Esquema(S, CONFIG.NOMBRE_VECTOR);
        if (_VEC.x !== null && _VEC.x !== undefined)
            _esq.def({x: _VEC.x});
        if (_VEC.y !== null && _VEC.y !== undefined)
            _esq.def({y: _VEC.y});
        if (_VEC.z !== null && _VEC.z !== undefined)
            _esq.def({z: _VEC.z});
        return _esq.exportar(indentacion);
    };
   
    return _VEC;    
}


export default Vector;