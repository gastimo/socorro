/*
 * =============================================================================
 * 
 *                        M Ó D U L O    V A R I A D O R 
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Variable from './variable';

/**
 * Variador
 * Un "Variador" es un tipo de dato que permite producir valores al azar dentro
 * de un rango determinado. Es una especie de "generador" aleatorio que utiliza
 * el algoritmo de "perlin" para devolver números al azar.
 * Un "Variador" no es más que un caso particular del objeto "Variable" (cuando
 * el método de evaluación es "perlin"). No obstante, este objeto no extiende de
 * "Variable", sino que contiene un objeto "Variable" internamente y redefine 
 * sólo los métodos que son necesarios.
 */
function Variador(S, valorDesde, valorHasta, modulador) {
    const _VAR = Variable(S, S.O.S.EVAL.Perlin, valorDesde, valorHasta, modulador);
    const _VRD = {};
    _VRD.nombre = CONFIG.SOS_VARIADOR;
    _VRD.clave  = S.O.S.obtenerClave(_VRD.nombre);
    _VRD.identificador = _VRD.nombre + CONFIG.ATR_SEPARADOR + _VRD.clave;
    

    /**
     * def
     * Redefinición del método "def" del objeto "Variable". Limita los nombres
     * de los atributos a definir a sólo aquellos del "Variador". Retorna el 
     * objeto "Variador" corriente.
     */
    _VRD.def = (atributos) => {
        if (atributos) {
            const _definicion = {};
            for (const [atrNombre, atrValor] of Object.entries(atributos)) {
                if (atrNombre === CONFIG.VAR_VALOR_DESDE ||
                    atrNombre === CONFIG.VAR_VALOR_HASTA ||
                    atrNombre === CONFIG.VAR_MODULADOR) {
                    _definicion[atrNombre] = atrValor;                   
                }
            }
            _VAR.def(_definicion);
        }
        return _VRD;
    };
    
    /**
     * val
     * Redefinición del método "val" del objeto "Variable".
     */
    _VRD.val = () => {
        return _VAR.val();
      };

    /**
     * mod
     * Redefinición del método "mod" del objeto "Variable". En este caso, 
     * el modulador sólo es utilizado para controlar la intensidad/escala 
     * del ruido "perlin" a generar.
     */
    _VRD.mod = (modulador) => {
        _VAR.mod(modulador);
        return _VRD;
    };    
        
    /**
     * exportar
     * Devuelve una cadena de caracteres con la definición del "Variador".
     */
    _VRD.exportar = (indentacion = "") => {
      return _VAR.exportar(indentacion);
    };

    return _VRD;
}


export default Variador;