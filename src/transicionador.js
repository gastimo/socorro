/*
 * =============================================================================
 * 
 *                  M Ó D U L O    T R A N S I C I O N A D O R
 * 
 * =============================================================================
 */

/**
 * Transicionador
 * Objeto utilitario que permite realizar una "transición animada", haciendo 
 * variar un valor numérico desde un valor inicial ("valorIni") hasta un valor 
 * final ("valorFin"), a lo largo de un período de tiempo estipulado por el 
 * argumento "cuadrosDuracion". En otras palabras, se encarga de interpolar 
 * el valor de un atributo numérico de cualquier entidad, en un lapso de tiempo, 
 * desde un estado inicial hasta un estado final.
 * Si el parámetro "cuadrosRetardo" es especificado, la función esperará esa 
 * cantidad de cuadros antes de dar inicio a la transición. 
 * NOTA: por el momento, la interpolación es únicamente "lineal".
 */
function Transicionador(S, valorIni, valorFin, cuadrosDuracion, cuadrosRetardo, contadorDeCuadros) {
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


export default Transicionador;