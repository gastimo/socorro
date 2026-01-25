/*
 * =============================================================================
 * 
 *                           C O N F I G U R A C I Ó N
 * 
 * =============================================================================
 */

const Config = (() => {
    
    // -----------------------------------------------------------
    // 
    // DEFINICIÓN DE PARÁMETROS
    // Configuración general de las opciones de la aplicación
    // 
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    const _PARAM = {
        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > NOMBRES DE LAS ENTIDADES DEL SOCORRO
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        NOMBRE_SOS              : 'SOS',        // Singleton del Obsequioso Socorro (S.O.S)
        NOMBRE_ESCENA           : 'ESCENA',     // Entidad principal para representación de la "Obra"
        NOMBRE_ESQUEMA          : 'ESQUEMA',    // Estructura de definición atributos/valores de entidades el socorro
        NOMBRE_VARIABLE         : 'VARIABLE',   // Variables para cálculo dinámico de valores de atributos
        NOMBRE_VECTOR           : 'VECTOR',     // Objeto genérico para realizar operaciones con vectores
        NOMBRE_ESTILO           : 'ESTILO',     // Definición de las variables para la represención visual de un objeto
        NOMBRE_ACTOR            : 'ACTOR',      // Objetos intérpretes principales de la "Escena"
        
        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > ESCENAS
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        // Actos de la orquestación (funciones de la "Escena")
        ACTO_PREPARACION        : 'cargar',        // "preload" de Processing
        ACTO_INICIACION         : 'comenzar',      // "setup" de Processing
        ACTO_EJECUCION          : 'representar',   // "draw" de Processing

        // Nombres por defecto para las variables "uniform" estándares
        UNIFORM_VALOR           : "value",
        UNIFORM_TIEMPO          : "u_time",
        UNIFORM_RESOLUCION      : "u_resolution",
        UNIFORM_MOUSE           : "u_mouse",
        
        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > NOMBRES DE ATRIBUTOS DE ESQUEMAS
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Separador
        ATR_SEPARADOR           : "$",
        
        // Atributos generales del "Esquema"
        ATR_ELEMENTO            : '$elemento$',

        // Sufijos para atributos de "Variables" dinámicas
        ATR_VARIABLE_ALFA       : "$alfa",
        ATR_VARIABLE_TRAZO      : "$trazo",

        // Nombres de los atributos básicos del "Estilo"
        EST_COLOR               : 'color',
        EST_GRANDOR             : 'grandor',

        // Nombres de los atributos básicos del "Actor"
        ACT_ORIGEN              : 'origen',
        ACT_VELOCIDAD           : 'velocidad',
        ACT_ESTILO              : 'estilo',
        
        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > VARIABLES DINÁMICAS
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Métodos de evalaución dinámica de las "Variables"
        EVAL_FIJO        : 'fijo',
        EVAL_CICLO       : 'ciclo',          // TIEMPO
        EVAL_CONTRACICLO : 'contraciclo',    // TIEMPO
        EVAL_LAPSO       : 'lapso',          // TIEMPO
        EVAL_AZAR        : 'azar',           // AZAR
        EVAL_RUIDO       : 'perlin',         // AZAR
        EVAL_ORDEN       : 'orden',          // ACTOR
        EVAL_DISTANCIA   : 'dist',           // ACTOR
        EVAL_RECORRIDO   : 'recorrido',      // ACTOR

        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > ACTORES
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        ACTOR_TIEMPO_DE_VIDA   : 1000 * 60 * 15,  // En milisegundos
        ACTOR_RECORRIDO_MAXIMO : 15000,           // En píxeles
    
    };
    
    return _PARAM;
    
})();


// --------------------------------------------------------------------
// 
// CÓDIGO POR DEFECTO PARA "VERTEX" SHADERS
// Código GLSL utilizado por defecto para definir un "vertex" shader
// básico, tanto para la librería de Three.js como para p5js.
// 
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