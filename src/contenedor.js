/*
 * =============================================================================
 * 
 *                       M Ó D U L O    C O N T E N E D O R
 * 
 * =============================================================================
 */
import CONFIG from './config';


/**
 * Contenedor
 * Objeto al que se le delegan las funciones vinculadas al acceso
 * y manipulación del elemento HTML contenedor de la escena.
 */
function Contenedor(elementoDOM, guardarProporciones = false, ancho = 0, alto = 0) {
    const _contenedorReal = document.body;
    const _contenedor = elementoDOM ?? _contenedorReal;
    const _esPrincipal = !elementoDOM;
    let   _lienzo;
    
    // Inicialización de la geometría del contenedor
    const geometria = {};
    _inicializar();
    
    
    /**
     * lienzo
     * Establece y devuelve el lienzo ("canvas") del contenedor, 
     * donde luego se realizará el "render" de la escena.
     * Si el parámetro "canvas" está definido, se almacena este
     * valor internamente en el contenedor.
     * Se devuelse siempre el valor actual almacenado del lienzo.
     */
    function lienzo(canvas) {
        if (canvas !== undefined) {
            _lienzo = canvas;
            _contenedorReal.appendChild(_lienzo);
            _actualizarLienzo();
        }
        return _lienzo;
    }
   
    
    /**
     * seguimientoMouse
     * Establece la acción a realizar cada vez que el mouse
     * se mueva sobre el contenedor (se deben actualizar las
     * variables "uniform" correspondientes al mouse).
     */
    function seguimientoMouse(accion) {
        if (_lienzo) {
            _lienzo.onmousemove = accion;
        }
    }
    
    
    /**
     * actualizar
     * Recalcula las dimensiones y la posición del contenedor teniendo en 
     * cuenta las dimensiones y posición actuales del elemento HTML real.
     */
    function actualizar() {
        let _g = _obtenerGeometria();
        const _redimensionar = _g.ancho != geometria.ancho || _g.alto != geometria.alto;
        const _reposicionar  = !_esPrincipal && (_g.x != geometria.x || _g.y != geometria.y);
        
        // Reposicionar el contenedor en la página
        if (_reposicionar) {
            geometria.x = _g.x;
            geometria.y = _g.y;
            _actualizarLienzo();
        }
        
        // Modificar las dimensiones del contenedor
        if (_redimensionar) {
            geometria.ancho = (ancho ? (ancho <= _g.ancho ? ancho : _g.ancho) : _g.ancho);
            geometria.alto  = (alto  ? (alto  <= _g.alto  ? alto  : _g.alto)  : _g.alto); 
            if (guardarProporciones) {
                if (geometria.ancho / geometria.alto > ancho / alto) {
                  geometria.ancho = geometria.alto  * ancho / alto;
                }
                else {
                  geometria.alto = geometria.ancho * alto / ancho;
                }
            }
            geometria.factorEscala = geometria.ancho / ancho;
        }
        
        return _redimensionar || _reposicionar;
    }

    /**
     * _obtenerGeometria
     * Función privada que retorna un objeto con la información
     * acerca de la geometría (dimensión y posición) del elemento
     * HTML contenedor en la página.
     */
    function _obtenerGeometria() {
        const _geometriaActual = {};
        if (_esPrincipal) {
            _geometriaActual.ancho = window.innerWidth;
            _geometriaActual.alto  = window.innerHeight;
            _geometriaActual.x = 0;
            _geometriaActual.y = 0;
        }
        else {
            let _rectangulo = _contenedor.getBoundingClientRect();
            _geometriaActual.ancho = _rectangulo.width;
            _geometriaActual.alto  = _rectangulo.height;
            _geometriaActual.x = _rectangulo.x + window.scrollX;
            _geometriaActual.y = _rectangulo.y + window.scrollY;
        }
        return _geometriaActual;
    }


    /**
     * _inicializar
     * Define los valores iniciales de la geometría del contenedor
     * y calcula el ancho y el alto en función de las dimensiones 
     * del elemento HTML que actúa como contenedor.
     */
    function _inicializar() {        
        let _rectanguloContenedor = _contenedor.getBoundingClientRect();
        geometria.ancho = ancho ?? (_esPrincipal ? windowWidth()  : _rectanguloContenedor.width);
        geometria.alto  = alto  ?? (_esPrincipal ? windowHeight() : _rectanguloContenedor.height);
        geometria.x = 0;
        geometria.y = 0;
        geometria.factorEscala = geometria.ancho / ancho;
    }
    
    /**
     * _actualizarLienzo
     * Todos aquellos lienzos que no estén directamente incluidos
     * debajo del <body> de la página son posicionados de manera
     * "absoluta" y, por lo tanto, deben ser reubicados cada vez
     * que el contenedor de referencia es reacomodado en la página por
     * el navegador (ej. cambio de tamaño de la ventana, scrolling, etc).
     */
    function _actualizarLienzo() {
        if (_lienzo) {
            _lienzo.style.display = "block";
            if (!_esPrincipal) {
                _lienzo.style.position = "absolute";
                _lienzo.style.left = geometria.x + "px";
                _lienzo.style.top = geometria.y + "px";
            } 
        }  
    }
    

    // =================================================================
    // ===> Se exponen únicamente las funciones públicas del contenedor 
    // ==> ("Revealing Module Pattern")
    // =================================================================
    return {geometria,
            actualizar,
            lienzo,
            seguimientoMouse
           };
}


export default Contenedor;