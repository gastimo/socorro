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
    if (S.O.S.esUnaVariable(a) || S.O.S.esUnaVariable(b) || S.O.S.esUnaVariable(c) ||
        S.O.S.esUnVariador(a)  || S.O.S.esUnVariador(b)  || S.O.S.esUnVariador(c))
        return VectorVar(S, a, b, c);

    const _VEC = {};
    let _vectorial = S.O.S.esUnVector(a);
    _VEC.x = _vectorial ? a.x : a;
    _VEC.y = _vectorial ? a.y : b;
    _VEC.z = _vectorial ? a.z : c;
    _VEC.nombre = CONFIG.SOS_VECTOR;
    
    /**
     * _convertirEnEsquema
     * Función privada que retorna la definición del "Vector" corriente
     * como un objeto de tipo "Esquema".
     */
    function _convertirEnEsquema() {
        let _esq = Esquema(S, CONFIG.SOS_VECTOR);
        if (_VEC.x !== null && _VEC.x !== undefined)
            _esq.def({x: _VEC.x});
        if (_VEC.y !== null && _VEC.y !== undefined)
            _esq.def({y: _VEC.y});
        if (_VEC.z !== null && _VEC.z !== undefined)
            _esq.def({z: _VEC.z});
        return _esq;
    }

    /**
     * def
     * Permite la definición de los componentes del "Vector", es decir,
     * las coordenadas <x, y, z>. Si en lugar de tres argumentos, se 
     * recibe otro "Vector", entonces esta función toma sus valores
     * de dicho objeto para definir sus componentes internos.
     */
    _VEC.def = (atributos) => {
        if (atributos) {
            let _defX, _defY, _defZ;
            if (atributos.hasOwnProperty('x')) {
                _defX = S.O.S.entidad(atributos.x);
                _VEC.x = _defX == S.O.S.Variable || _defX == S.O.S.Variador ? _VEC.x : atributos.x;
            }
            if (atributos.hasOwnProperty('y')) {
                _defY = S.O.S.entidad(atributos.y);
                _VEC.y = _defY == S.O.S.Variable || _defY == S.O.S.Variador ? _VEC.y : atributos.y;
            }
            if (atributos.hasOwnProperty('z')) {
                _defZ = S.O.S.entidad(atributos.z);
                _VEC.z = _defZ == S.O.S.Variable || _defZ == S.O.S.Variador ? _VEC.z : atributos.z;
            }
            if (_defX == S.O.S.Variable || _defY == S.O.S.Variable || _defZ == S.O.S.Variable ||
                _defX == S.O.S.Variador || _defY == S.O.S.Variador || _defZ == S.O.S.Variador) {
                return VectorVar(S).def(atributos);   
            }
        }        
        return _VEC;
    };
    
    /**
     * val
     * Esta función no hace nada en realidad. Se añade para mantener la compatibilidad
     * con los restantes objetos que extienden de "Esquema". La función retorna el 
     * mismo objeto "Vector" sin realizar ninguna modificación.
     */
    _VEC.val = () => {
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
     * Devuelve y/o define la magnitud del vector, o sea, su longitud o radio.
     * Si el argumento "magnitud" es especificado, entonces se actualiza el vector
     * para alterar su magnitud (radio) pero manteniendo la misma dirección (ángulo).
     */
    _VEC.mag = (magnitud) => {
        let _magActual = Math.sqrt(Math.pow(_VEC.x ?? 0, 2) + Math.pow(_VEC.y ?? 0, 2) + Math.pow(_VEC.z ?? 0, 2));
        if (magnitud !== null & magnitud !== undefined) {
            _VEC.multiplicar(magnitud / _magActual);
            return magnitud;
        }
        return _magActual;
    };
        
    /**
     * ang
     * Devuelve y/o define el ángulo que el vector forma con el lado positivo
     * del eje X de coordenadas. SOLO PARA VECTORES DE DOS DIMENSIONES.
     * Si su argumento es especificado, entonces el vector actual es modificado 
     * manteniendo su magnitud pero cambiando el ángulo de acuerdo al valor (en
     * radianes) recibido como argumento.
     */
    _VEC.ang = (angulo) => {
        if (angulo !== null && angulo !== undefined) {
            let magnitud = _VEC.mag();
            _VEC.x = magnitud * Math.cos(angulo);
            _VEC.y = magnitud * Math.sin(angulo);
            _VEC.z = 0;
            return angulo;
        }
        else {
            return Math.atan2(_VEC.x ?? 0, _VEC.y ?? 0);
        }
    };
    
    /**
     * rotar
     * Gira el vector según la cantidad de radianes indicada en al argumento "angulo".
     * Este método funciona de manera bastante similar al método "ang". La diferencia
     * es que, en lugar de establecer un nuevo ángulo, suma el ángulo recibido como
     * argumento al ángulo actual del "Vector".
     */
    _VEC.rotar = (angulo) => {
        let _anguloActual = _VEC.ang();
        if (angulo) {
            let magnitud = _VEC.mag();
            let _anguloNuevo = angulo + _anguloActual;
            _VEC.x = magnitud * Math.cos(_anguloNuevo);
            _VEC.y = magnitud * Math.sin(_anguloNuevo);
            _VEC.z = 0;
            return _anguloNuevo;
        }
        return _anguloActual;
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
        return _convertirEnEsquema().exportar(indentacion);
    };
       
    return _VEC;    
}



// -------------------------------------------------------------
//
//               V E C T O R    V A R I A B L E
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

/**
 * VectorVar
 * Objeto utilitario para operar con "Vectores Variables", en otras palabras,
 * se trata de vectores que admiten el uso de objetos "Variable" en cualquiera
 * de sus componentes (<x,y,z>).
 * A diferencia del objeto "Vector" simple, este objeto extiende del objeto 
 * "Esquema". La invocación al método "val()" es lo que permite evaluar 
 * dinámicamente la variables de cualquiera de sus componentes.
 */
function VectorVar(S, a, b, c) {
    const _ESQ = Esquema(S, CONFIG.SOS_VECTORVAR);
    const _VEV = _ESQ.extender();
    let _vectorial = S.O.S.esUnVector(a);
    _VEV$inicializar(a, b, c);

    
    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien el
     * "VectorVar" extiende. Se redefine simplemente para retornar, al final,
     * el objeto "VectorVar" actual, que permite definiciones encadenadas.
     */
    _VEV.def = (atributos) => {
        if (atributos) {
            const _definicion = {};
            for (const [atrNombre, atrValor] of Object.entries(atributos)) {
                if (atrNombre === 'x' || atrNombre === 'y' || atrNombre === 'z') {
                    _definicion[atrNombre] = atrValor;
                }
            }
            _ESQ.def(_definicion);
        }
        return _VEV;
    };

    /**
     * val
     * Función de evaluación del "VectorVar". Básicamente, este método es lo que 
     * diferencia al "Vector" del "VectorVar". Esta función evalúa cada uno de
     * los componentes del vector y retorna un objeto "Vector" (simple) con sus
     * tres componentes <x,y,z> evaluadas.
     */
    _VEV.val = (...atributos) => {
        if (atributos.length == 0) {
            return Vector(S, _ESQ.val('x'), _ESQ.val('y'), _ESQ.val('z'));
        }
        return _ESQ.val(...atributos);
    };
    
    /**
     * vacio
     * Retorna "true" o "false" para indicar si el vector ya ha sido
     * sido inicializado con algún valor o si todos sus componentes 
     * están vacíos. 
     */
    _VEV.vacio = () => {
       return (_VEV.x === undefined || _VEV.x === null) &&
              (_VEV.y === undefined || _VEV.y === null) &&
              (_VEV.z === undefined || _VEV.z === null);
    };
    
    /**
     * copiar
     * Copia el contenido del vector recibido como argumento
     * en el "VectorVar" corriente.
     */
    _VEV.copiar = (v) => {
        if (v) {
            if (S.O.S.esUnVectorVar(v))
                _ESQ.def(v.defincion());
            else
                _VEV$inicializar(v?.x, v?.y, v?.z);
        }
        return _VEV;
    };
    
    /**
     * definicion
     * Retorna la definición completa del "VectorVar". Esta función
     * es utilizada internamente para copiar el contenido de un 
     * "VectorVar" en otro "VectorVar".
     */
    _VEV.definicion = () => {
        return _ESQ.val();  
    };
    
    /**
     * _VEV$inicializar
     * Método privado de inicialización de las propiedades del "Vector".
     */
    function _VEV$inicializar(a, b, c) {
        const _definicion = {};
        if (a !== undefined && a !== null)
            _definicion.x = _vectorial ? a.x : a;
        if (b !== undefined && b !== null)
            _definicion.y = _vectorial ? a.y : b;
        if (c !== undefined && c !== null)
            _definicion.z = _vectorial ? a.z : c;
        _ESQ.def(_definicion);
    }

    return _VEV;
}


export default Vector;