/*
 * =============================================================================
 * 
 *                           C O N F I G U R A C I Ó N
 * 
 * =============================================================================
 */

const Config = (() => {
    
    // DEFINICIÓN DE PARÁMETROS
    // Configuración general de las opciones de la aplicación
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    const _PARAM = {
        
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        // > ENTIDADES DEL SOCORRO
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Nombres de las entidades principales del socorro
        NOMBRE_SOS              : 'SOS',        // Singleton del Obsequioso Socorro (S.O.S)
        NOMBRE_ESCENA           : 'ESCENA',     // Entidad principal para representación de la obra
        NOMBRE_ESQUEMA          : 'ESQUEMA',    // Estructura de definición atributos y valores de una entidad
        NOMBRE_VARIABLE         : 'VARIABLE',   // Variables para cálculo dinámico de valores de atributos
        NOMBRE_VECTOR           : 'VECTOR',     // Objeto genérico para operar con vectores
        NOMBRE_ACTUADOR         : 'ACTUADOR',   // Objetos intérpretes de la "Escena"
        
        
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        // > ESQUEMAS
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Nombres de las entidades principales del socorro
        ATR_SINCRONIZADO        : 'sincronizado',
        ATR_VISIBLE             : 'visible',

        // Sufijo para cálculo de valores dinámicos de atributos
        ATR_VARIABLE_ALFA       : "$alfa",
        
        
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        // > ESCENAS
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Actos de la orquestación (funciones de la "Escena")
        ACTO_PREPARACION        : 'cargar',        // "preload" de Processing
        ACTO_INICIACION         : 'comenzar',      // "setup" de Processing
        ACTO_EJECUCION          : 'desplegar',     // "draw" de Processing

        // Nombres por defecto para las variables "uniform" estándares
        UNIFORM_VALOR           : "value",
        UNIFORM_TIEMPO          : "u_time",
        UNIFORM_RESOLUCION      : "u_resolution",
        UNIFORM_MOUSE           : "u_mouse",

        
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        // > VARIABLES
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Métodos de evalaución dinámica de las "Variables"
        EVAL_FIJO        : 'fijo',
        EVAL_CICLO       : 'ciclo',
        EVAL_CONTRACICLO : 'contraciclo',
        EVAL_LAPSO       : 'lapso',
        EVAL_AZAR        : 'azar',
        EVAL_RUIDO       : 'perlin',
        EVAL_ORDEN       : 'orden',
        EVAL_CANT        : 'cant',
        EVAL_DIST        : 'dist',
        EVAL_DIST_X      : 'distX',
        EVAL_DIST_Y      : 'distY',
        EVAL_DIST_Z      : 'distZ',
        
        // Métodos de evalaución dinámica de las "Variables"
        METODO_EVAL_FIJO            : 'fijo',
        METODO_EVAL_X_CICLO         : 'ciclo',
        METODO_EVAL_X_CONTRACICLO   : 'contraciclo',
        METODO_EVAL_X_LAPSO         : 'lapso',
        METODO_EVAL_X_AZAR          : 'azar',
        METODO_EVAL_X_RUIDO         : 'perlin',
        METODO_EVAL_X_ORDEN         : 'orden',
        METODO_EVAL_X_CANTIDAD      : 'cantidad',
        METODO_EVAL_X_DISTANCIA     : 'distancia',
        METODO_EVAL_X_DISTANCIA_X   : 'distanciaX',
        METODO_EVAL_X_DISTANCIA_Y   : 'distanciaY',
        METODO_EVAL_X_DISTANCIA_Z   : 'distanciaZ',
    };
    
    return _PARAM;
    
})();


// CÓDIGO POR DEFECTO PARA "VERTEX" SHADERS
// Código GLSL utilizado por defecto para definir un "vertex" shader
// básico, tanto para la librería de Three.js como para p5js.
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Config.VERTEX_SHADER_THREE = 'void main() { gl_Position = vec4( position, 1.0 ); }';
Config.VERTEX_SHADER_P5    = `
precision highp float;
attribute vec3 aPosition;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
varying vec3 vPosition;
void main() {
  vPosition = aPosition;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`;


export default Config;