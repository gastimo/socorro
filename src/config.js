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
    // > LISTADO DE LAS "ENTIDADES DEL SOCORRO"
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Singleton del Obsequioso Socorro (S.O.S)
        SOS                     : '_SOS',

        // Entidades que internamente son "Esquema"
        SOS_ESQUEMA             : '_ESQ',   // Estructura de definición atributos/valores de las entidades del "socorro"
        SOS_ESCENA              : '_ESC',   // Entidad principal para las representaciones de la "Obra"
        SOS_REPARTO             : '_RPT',   // Conjunto de "Actores" con dispociones y movimients coordinados entre sí
        SOS_ACTOR               : '_ACT',   // Intérpretes principales de la "Escena"
        SOS_ESTILO              : '_EST',   // Conjunto de variables para la represención visual de objetos de la escena
        SOS_VARIABLE            : '_VAR',   // Variables para cálculo dinámico de los valores de los atributos
        SOS_VARIADOR            : '_VRD',   // Generador de valores numéricos aleatorios dentro rangos preestablecidos
        SOS_VECTOR              : '_VEC',   // Objeto genérico para realizar operaciones con vectores
        SOS_VECTORVAR           : '_VEV',   // Objeto "Vector" que admite "Variables" en sus componentes x, y, z.
        
        // Constantes de uso general
        ESTANDAR                : 'estandar', // Constante utilizada para acceder a "Repertorios" estándar
        
        
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
    // > NOMBRES DE ATRIBUTOS DE ESQUEMAS (SEGÚN ENTIDAD)
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
        // Constantes usadas para la nomenclatura los "Atributos" de un "Esquema"
        ATR_SEPARADOR           : "$",
        ATR_VARIABLE_ALFA       : "$alfa",           // Sufijo para cálculo dinámico (ej. 'color$alfa')
        ATR_VARIABLE_TRAZO      : "$trazo",          // Sufijo para cálculo dinámico (ej. 'color$trazo')
        ATR_NOMBRE_DINAMICO     : "$claveDinamica$", // Clave para nombres de atributos dinámicos (no se almacenan)
        ATR_ARRAY_CLAVE_AUX     : '$claveAuxiliar$', // Clave interna usada durante la conversión a texto de un "Esquema"

        // Nombres de los atributos de la entidad "Variable"
        VAR_METODO              : 'metodo',
        VAR_VALOR               : 'valor',
        VAR_VALOR_DESDE         : 'valorDesde',   // Usado también por el "Variador"
        VAR_VALOR_HASTA         : 'valorHasta',   // Usado también por el "Variador"
        VAR_MODULADOR           : 'modulador',    // Usado también por el "Variador"
        VAR_ORIGEN_DESDE        : 'origenDesde',
        VAR_ORIGEN_HASTA        : 'origenHasta',
        VAR_RUIDO_VELOCIDAD     : 'ruidoVelocidad',
        VAR_RUIDO_ESCALA        : 'ruidoEscala',
        
        // Nombres de los atributos básicos de la entidad "Esquema"
        ESQ_NOMBRE              : 'nombre',
        ESQ_CLAVE               : 'clave',
        ESQ_IDENTIFICADOR       : 'identificador',
        ESQ_SUPERIOR            : 'superior',
        ESQ_CONTENEDOR          : 'contenedor',
        ESQ_AGRUPACION          : 'agrupacion',
        ESQ_ALIAS               : 'alias',
        
        // Nombres de los atributos de la entidad "Estilo"
        // Sólo hay dos, los restantes se forman añadiendo los sufijos "$alfa" y "$trazo"
        EST_COLOR               : 'color',
        EST_GRANDOR             : 'grandor',
        EST_TRAZO               : 'trazo',
        EST_GROSOR              : 'grosor',
            
        // Nombres de los atributos de la entidad "Escena"
        ESC_ANCHO               : 'ancho',
        ESC_ALTO                : 'alto',
        ESC_ESCALABLE           : 'escalable',
        ESC_ESTILO              : 'estilo',
        ESC_REPRESENTADOR       : 'representador',
        ESC_GUARDAR_PROPORCION  : 'guardarProporciones',
        ESC_INTERPRETAR_GLSL    : 'interpretarGLSL',

        // Nombres de los atributos de la entidad "Reparto"
        RPT_COREOGRAFIA         : 'coreografia', 
        RPT_CANTIDAD            : 'cantidad', 
        RPT_PUESTOS             : 'puestos',
        RPT_INTERVALO           : 'intervalo', 
        RPT_INTENSIDAD          : 'intensidad',
        RPT_DESVIO              : 'desvio',
        RPT_SEPARACION          : 'separacion',
        RPT_ESTILO              : 'estilo',
        RPT_REPRESENTADOR       : 'representador',
        RPT_DESPLAZAMIENTO      : 'desplazamiento',
        RPT_ROTACION            : 'rotacion',
        RPT_MAX_DURACION        : 'duracionMaxima',
        RPT_MAX_RECORRIDO       : 'recorridoMaximo',
        
        // Nombres de los atributos de la entidad "Actor"
        ACT_ORIGEN              : 'origen',
        ACT_VELOCIDAD           : 'velocidad',
        ACT_ACELERACION         : 'aceleracion',
        ACT_ESTILO              : 'estilo',
        ACT_REPRESENTADOR       : 'representador',
        ACT_MAX_DURACION        : 'duracionMaxima',
        ACT_MAX_RECORRIDO       : 'recorridoMaximo',
    };
    
    return _PARAM;
    
})();

// --------------------------------------------------------------------
// 
// LISTADO DE ATRIBUTOS DINÁMICOS DE "ENTIDADES DEL SOCORRO"
// Enumeraciones de nombres de atributos para la definición de los
// "Esquemas" de cada una de las "entidades del socorro".
// 
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Config.Esquema  = [Config.ESQ_NOMBRE,
                   Config.ESQ_CLAVE,
                   Config.ESQ_IDENTIFICADOR,
                   Config.ESQ_SUPERIOR,
                   Config.ESQ_CONTENEDOR,
                   Config.ESQ_AGRUPACION,
                   Config.ESQ_ALIAS];

Config.Escena   = [Config.ESC_ANCHO,
                   Config.ESC_ALTO,
                   Config.ESC_ESCALABLE,
                   Config.ESC_ESTILO,
                   Config.ESC_REPRESENTADOR,
                   Config.ESC_GUARDAR_PROPORCION,
                   Config.ESC_INTERPRETAR_GLSL];

Config.Estilo   = [Config.EST_COLOR,
                   Config.EST_GRANDOR, 
                   Config.EST_TRAZO,
                   Config.EST_GROSOR];

Config.DesgloseEstilo = 
                  [Config.EST_COLOR,                                                           // Color de la forma
                   Config.EST_GRANDOR,                                                         // Tamaño de la forma
                   Config.EST_COLOR   + Config.ATR_VARIABLE_TRAZO,                             // Color del trazo
                   Config.EST_GRANDOR + Config.ATR_VARIABLE_TRAZO,                             // Grosor del trazo
                   Config.EST_COLOR   + Config.ATR_VARIABLE_ALFA,                              // Opacidad de la forma
                   Config.EST_COLOR   + Config.ATR_VARIABLE_TRAZO + Config.ATR_VARIABLE_ALFA]; // Opacidad del trazo

Config.Actor    = [Config.ACT_ORIGEN, 
                   Config.ACT_VELOCIDAD, 
                   Config.ACT_ACELERACION, 
                   Config.ACT_ESTILO,
                   Config.ACT_REPRESENTADOR,
                   Config.ACT_MAX_DURACION,
                   Config.ACT_MAX_RECORRIDO];

Config.Reparto   = [Config.RPT_COREOGRAFIA, 
                    Config.RPT_CANTIDAD, 
                    Config.RPT_PUESTOS,
                    Config.RPT_INTERVALO, 
                    Config.RPT_INTENSIDAD,
                    Config.RPT_DESVIO,
                    Config.RPT_SEPARACION,
                    Config.RPT_ESTILO,
                    Config.RPT_REPRESENTADOR,
                    Config.RPT_DESPLAZAMIENTO,
                    Config.RPT_ROTACION,
                    Config.RPT_MAX_DURACION,
                    Config.RPT_MAX_RECORRIDO];

Config.Variable  = [Config.VAR_METODO,
                    Config.VAR_VALOR,
                    Config.VAR_VALOR_DESDE,
                    Config.VAR_VALOR_HASTA,
                    Config.VAR_MODULADOR,
                    Config.VAR_ORIGEN_DESDE,
                    Config.VAR_ORIGEN_HASTA,
                    Config.VAR_RUIDO_VELOCIDAD,
                    Config.VAR_RUIDO_ESCALA];

Config.Variador  = [Config.VAR_VALOR_DESDE, 
                    Config.VAR_VALOR_HASTA,
                    Config.VAR_MODULADOR];

Config.Vector    = ['x', 'y', 'z'];

Config.EstiloBase = {};
Config.EstiloBase[Config.EST_COLOR]   = 0;
Config.EstiloBase[Config.EST_GRANDOR] = 2; 
Config.EstiloBase[Config.EST_TRAZO]   = 0;
Config.EstiloBase[Config.EST_GROSOR]  = 1;


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