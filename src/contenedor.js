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
 * Objeto al que se le delegan las funciones vinculadas al acceso y manipulación
 * del elemento HTML de la página contenedor del lienzo ("canvas") de la escena.
 */
function Contenedor(elementoDOM, guardarProporciones = false, ancho = 0, alto = 0) {
    const _contenedorReal = document.body;
    const _contenedor = elementoDOM ?? _contenedorReal;
    const _esPrincipal = !elementoDOM;
    let   _guardarProporciones = guardarProporciones;
    let   _ancho = ancho;
    let   _alto = alto;
    let   _lienzo;

    
// ------------------------------------------------------------------------------------------------
// 
// INICIALIZACIÓN Y RECÁLCULO DE LA GEOMETRÍA
// 
// La "geometría" es un objeto del "Contenedor" que almacena las dimensiones y posición actuales
// del elemento HTML que aloja al lienzo de la "Escena" y las dimensiones reales del lienzo en sí. 
// NOTA: el tamaño del lienzo ("canvas") no necesariamente coincide con el de su contenedor.
// 
// La información guardada en la "geometría" es la que permite detectar si ocurrieron cambios en 
// el elemento HTML de la página que deban ser reflejados en el lienzo. Vale aclarar que el canvas
// de la "Escena" siempre responde a las variaciones de su contenedor HTML y no al revés). 
// 
// Dentro del objeto "geometría" se almacenan 7 valores diferentes:
// 
//   - anchoDOM / altoDOM : anchura y altura (en píxeles) del elemento HTML que contiene al "canvas".
//   - ancho / alto       : anchura y altura del lienzo ("canvas") de la escena.
//   - x / y              : coordenadas x e y (absolutas) del lienzo ("canvas") en la página.
//   - factorEscala       : coeficiente que representa la variación en escala entre las dimensiones
//                          actuales del contenedor y sus dimensiones iniciales (o las especificadas
//                          mediante los argumentos "ancho" y "alto" en la creación).
//                    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    const geometria = {};
    _inicializar();
    
    /**
     * _inicializar
     * Define los valores iniciales de la geometría del contenedor
     * y calcula el ancho y el alto en función de las dimensiones 
     * del elemento HTML que actúa como contenedor.
     */
    function _inicializar() {        
        let _rectanguloContenedor = _contenedor.getBoundingClientRect();
        geometria.anchoDOM = (_esPrincipal ? window.innerWidth  : _rectanguloContenedor.width);
        geometria.altoDOM  = (_esPrincipal ? window.innerHeight : _rectanguloContenedor.height);
        geometria.ancho    = _ancho && _ancho < geometria.anchoDOM ? _ancho : geometria.anchoDOM;
        geometria.alto     = _alto  && _alto  < geometria.altoDOM  ? _alto  : geometria.altoDOM;
        geometria.x        = 0;
        geometria.y        = 0;
        
        // Si no se especificó ancho o alto al momento de instanciar el "Contenedor",  
        // se asumen las dimensiones actuales del elemento DOM como valores de referencia.
        if (!_ancho || !_alto) {
            _ancho = geometria.ancho;
            _alto  = geometria.alto;
        }
        
        // Valor inicial para el coeficiente de escalamiento
        geometria.factorEscala = geometria.ancho / _ancho;
        geometria.referencia = _ancho ?? 1024;
    }
    
    /**
     * _obtenerGeometriaDOM
     * Función privada que retorna un objeto con la información
     * acerca de la geometría (dimensión y posición) del elemento
     * HTML contenedor en la página.
     */
    function _obtenerGeometriaDOM() {
        const _geometriaActual = {};
        if (_esPrincipal) {
            _geometriaActual.anchoDOM = window.innerWidth;
            _geometriaActual.altoDOM  = window.innerHeight;
            _geometriaActual.x = 0;
            _geometriaActual.y = 0;
        }
        else {
            let _rectangulo = _contenedor.getBoundingClientRect();
            _geometriaActual.anchoDOM = _rectangulo.width;
            _geometriaActual.altoDOM  = _rectangulo.height;
            _geometriaActual.x = _rectangulo.x + window.scrollX;
            _geometriaActual.y = _rectangulo.y + window.scrollY;
        }
        return _geometriaActual;
    }    
    

    
// ==============================================================
// 
//  FUNCIONES PARA EL MANEJO DEL LIENZO ("CANVAS")
//  
// ==============================================================
    
    /**
     * lienzo
     * Establece y devuelve el lienzo ("canvas") del contenedor, donde luego se realizará 
     * el "render" de la escena. Si el parámetro "canvas" está definido, se almacena este
     * valor internamente en el contenedor. Se devuelse el valor actual almacenado del lienzo.
     */
    function lienzo(canvas) {
        if (canvas !== undefined) {
            _lienzo = canvas;
            _contenedorReal.appendChild(_lienzo);
            _actualizarPosicionLienzo();
        }
        return _lienzo;
    }
       
    /**
     * _actualizarPosicionLienzo
     * Todos aquellos lienzos que no estén directamente incluidos debajo del <body> de la 
     * página son posicionados de manera "absoluta" y, por lo tanto, deben ser reubicados 
     * cada vez que el contenedor de referencia es reacomodado en la página por el navegador 
     * (por ejemplo, ante el cambio de tamaño de la ventana, el "scrolling", etc).
     */
    function _actualizarPosicionLienzo() {
        if (_lienzo) {
            _lienzo.style.display = "block";
            if (!_esPrincipal) {
                _lienzo.style.position = "absolute";
                _lienzo.style.left = geometria.x + "px";
                _lienzo.style.top = geometria.y + "px";
            } 
        }  
    }

    
// ==============================================================
// 
//  VERIFICACIÓN, ACTUALIZACIÓN Y AJUSTE
//  La función "actualizar" verifica en cada iteración si hubo
//  cambios en el tamaño del contenedor HTML para redimensionar
//  el lienzo ("responsive"). La función "ajustar" fuerza nuevos
//  valores para "ancho", "alto" y "guardarProporciones".
//  
// ==============================================================

    /**
     * actualizar
     * Función que asegura que la "geometría" esté en sincroncía con el elemento HTML.
     * Recalcula las dimensiones y la posición del objeto "Contenedor" actual, teniendo 
     * en cuenta las dimensiones y posición corrientes del elemento HTML real. 
     * Es decir, actualiza los valores internos del objeto "geometría" del "Contenedor" 
     * en caso que el elemento HTML de la página haya cambiado (de tamaño o posición). 
     * Si no hubiera ningún cambio, esta función no hace nada. El valor retornado al 
     * final por la función es "true" o "false" indicando si hubo algún cambio.
     */
    function actualizar(forzar = false) {
        let _g = _obtenerGeometriaDOM();   // Objeto "auxiliar" con la geometría del elemento DOM
        
        // Determina si se debe hacer un "redimensionamiento" o "reposicionamiento" (o ambos)
        const _redimensionar = _g.anchoDOM != geometria.anchoDOM || _g.altoDOM != geometria.altoDOM;
        const _reposicionar  = !_esPrincipal && (_g.x != geometria.x || _g.y != geometria.y);
        
        // REPOSICIONAMIENTO
        // Se actualiza la "geometría" con la posición actual del contenedor. Las "Escenas" que
        // no son principales (incluidas en el <body>) siempre son posicionadas de forma "absoluta",
        // por esa razón, el lienzo ("canvas"), también tiene que actualizarse para reposicionarse.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (_reposicionar || forzar) {
            geometria.x = _g.x;
            geometria.y = _g.y;
            _actualizarPosicionLienzo();
        }
        
        // REDIMENSIONAMIENTO
        // Modificar las dimensiones del contenedor
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (_redimensionar || forzar) {
            geometria.anchoDOM = _g.anchoDOM;
            geometria.altoDOM  = _g.altoDOM;

            // Para el lienzo, se limita el redimensionamiento a los tamaños máximos de ancho y 
            // alto indicados. Si el elemento HTML fuera actualmente más grande, las dimensiones 
            // del lienzo se restrigen, como máximo. al "ancho" y "alto" preestablecidos.
            geometria.ancho = (_ancho ? (_ancho <= _g.anchoDOM ? _ancho : _g.anchoDOM) : _g.anchoDOM);
            geometria.alto  = (_alto  ? (_alto  <= _g.altoDOM  ? _alto  : _g.altoDOM)  : _g.altoDOM);
                    
            // Se verifica si se deben mantener las proporciones, tomando como referencia
            // el ancho/alto especificados en la creación o, en su defecto, el ancho/alto
            // de referencia (el del contenedor o la dimensión estándar predefinida).
            if (_guardarProporciones) {
                if (geometria.ancho / geometria.alto > _ancho / _alto)
                  geometria.ancho = geometria.alto  * _ancho / _alto;
                else
                  geometria.alto = geometria.ancho * _alto / _ancho;
            }
            
            // Finalmente, se recalcula el factor de escala
            geometria.factorEscala = geometria.ancho / _ancho > geometria.alto / _alto ? 
                                     geometria.ancho / _ancho : geometria.alto / _alto;
        }
        
        return _redimensionar || _reposicionar;
    }
    
    /**
     * ajustar
     * Modifica los parámetros originales de "ancho", "falso" y "guardarProporciones".
     * Esta función es usada cuando, por ejemplo, el ancho o alto (valores máximo de
     * referencia) de la "Escena" quieran ser modificados.
     */
    function ajustar(guardarProporciones, ancho, alto) {
        _guardarProporciones = guardarProporciones ?? _guardarProporciones;
        _ancho = ancho ?? _ancho;
        _alto = alto ?? _alto;
        actualizar(true);
    }


    
// ==============================================================
// 
//  FUNCIONES MISCELÁNEAS DEL CONTENEDOR
//  
// ==============================================================    
    
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

    
    
    // =================================================================
    // ===> Se exponen únicamente las funciones públicas del contenedor 
    // ==> ("Revealing Module Pattern")
    // =================================================================
    return {geometria,
            lienzo,
            actualizar,
            ajustar,
            seguimientoMouse
           };
}


export default Contenedor;