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
 * Objeto utilitario para operar con vectores
 */
function Vector(S, a, b, c) {
    const _VEC = {
        x: a,
        y: b,
        z: c
    };

    // -------------------------------------------------------------
    // 
    // EXPOSICIÓN DE MÉTODOS DEL VECTOR
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    _VEC.nombre = () => {
        return CONFIG.NOMBRE_VECTOR;
    };
    
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
    
    _VEC.sumar = (sumando) => {
        if (_VEC.x !== null && _VEC.x !== undefined)
            _VEC.x += sumando;
        if (_VEC.y !== null && _VEC.y !== undefined)
            _VEC.y += sumando;
        if (_VEC.z !== null && _VEC.z !== undefined)
            _VEC.z += sumando;
    };
    
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