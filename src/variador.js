/*
 * =============================================================================
 * 
 *                         M Ó D U L O    V A R I A D O R
 * 
 * =============================================================================
 */

/**
 * Variador
 * Función que permite variar un número desde un valor inicial ("valorIni") 
 * hasta un valor final ("valorFin") en el tiempo estipulado por el parámetro
 * "cuadrosDuracion". Además, si el parámetro "cuadrosRetardo" es especificado,
 * la función esperará esa cantidad de cuadros antes de comenzar la variación.
 * Por el momento, la variación es únicamente "lineal".
 */
function Variador(S, valorIni, valorFin, cuadrosDuracion, cuadrosRetardo, contadorDeCuadros) {
    let _recuentoDeCuadros = contadorDeCuadros;
    let _valorIni = valorIni;
    let _valorFin = valorFin;
    let _cuadros = cuadrosDuracion === undefined ? 0 : cuadrosDuracion;
    let _cuadroIni = _recuentoDeCuadros() + (cuadrosRetardo === undefined ? 0 : cuadrosRetardo);
    let _cuadroFin = _cuadroIni + _cuadros;
    let _completado = false;
    let _previo = null;
    
    function valor() {
        if (_previo !== null) {
            if (!_previo.completado()) {
                _completado = false;
                return _valorIni;
            }
            else {
                _previo = null;
            }
        }
        let _cuadroActual = _recuentoDeCuadros();
        if (_cuadroActual >= _cuadroIni && _cuadroActual <= _cuadroFin) {
            _completado = false;
            return !_cuadros ? _valorFin : _valorIni + (_valorFin - _valorIni) / _cuadros * (_cuadroActual - _cuadroIni);
        }
        else if (_cuadroActual < _cuadroIni) {
            _completado = false;
            return _valorIni;   
        }
        else {
            _completado = true;
            return _valorFin;
        }
    }
    
    function reiniciar(valorIni, valorFin, cuadrosDuracion, cuadrosRetardo) {
        _valorIni = _completado ? valorIni : valor();
        _valorFin = valorFin;
        _cuadros = cuadrosDuracion === undefined ? _cuadros : cuadrosDuracion;
        _cuadroIni = _recuentoDeCuadros() + (cuadrosRetardo === undefined ? 0 : cuadrosRetardo);
        _cuadroFin = _cuadroIni + _cuadros;  
        _completado = false;
    }
    
    function completado() {
        valor(); // Es necesario chequear el valor para ver si se completó
        return _completado;
    }
    
    function vincular(transmutadorPrevio) {
        _previo = transmutadorPrevio;
    }
    
    function desvincular() {
        _previo = null;
    }
    
    function vinculoPrevio() {
        return _previo;
    }
    
    function valorInicial() {
        return _valorIni;
    }
    
    function valorFinal() {
        return _valorFin;
    }
    
    function recuentoDeCuadros(funcion) {
        if (funcion !== undefined) {
            _recuentoDeCuadros = funcion;
        }
        return _recuentoDeCuadros();
    }
    
    return {
        valor,
        reiniciar,
        completado,
        vincular,
        desvincular,
        vinculoPrevio,
        valorInicial,
        valorFinal,
        recuentoDeCuadros
    };    
}


export default Variador;