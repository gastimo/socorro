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
    // > LISTADO DE ENTIDADES DEL SOCORRO Y CÓDIGOS
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        // Singleton del Obsequioso Socorro (S.O.S)
        SOS                     : '_SOS',   

        // Entidades generales de administración del módulo
        SOS_GUION               : '_GUI',   // Conjunto de descripciones de las entidades actuantes de la "Escena"
        SOS_DESGLOSE            : '_DES',   // Conjunto de fichas donde se desglosan los participantes de la "Escena"
        
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
        
        // Entidades para definición de "Repertorios"
        SOS_REPERTORIO          : 'REPE',
        SOS_REPRESENTADOR       : 'REP',
        SOS_COREOGRAFIA         : 'COREO',
        SOS_COLOR               : 'COLOR',
        SOS_METODO_EVALUACION   : 'EVAL',
        
        
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
        
        // Constantes para "Atributos" de "Esquemas"
        ATR_SEPARADOR           : "$",
        ATR_ELEMENTO            : '$elemento$',
        ATR_VARIABLE_ALFA       : "$alfa",       // Sufijo para cálculo dinámico (ej. 'color$alfa')
        ATR_VARIABLE_TRAZO      : "$trazo",      // Sufijo para cálculo dinámico (ej. 'color$trazo')

        // Nombres de los atributos de las "Variables"
        VAR_METODO              : 'metodo',
        VAR_VALOR               : 'valor',
        VAR_VALOR_DESDE         : 'valorDesde',   // Usado también por el "Variador"
        VAR_VALOR_HASTA         : 'valorHasta',   // Usado también por el "Variador"
        VAR_MODULADOR           : 'modulador',    // Usado también por el "Variador"
        VAR_ORIGEN_DESDE        : 'origenDesde',
        VAR_ORIGEN_HASTA        : 'origenHasta',
        VAR_RUIDO_VELOCIDAD     : 'ruidoVelocidad',
        VAR_RUIDO_ESCALA        : 'ruidoEscala',

        // Nombres de los atributos básicos del "Estilo"
        // Sólo hay 2. Los restantes se forman añadiendo los sufijos "$alfa" y "$trazo"
        EST_COLOR               : 'color',
        EST_GRANDOR             : 'grandor',
    
        // Nombres de los atributos básicos de la "Escena" (ACTUANTE PRINCIPAL)
        ESC_ANCHO               : 'ancho',
        ESC_ALTO                : 'alto',
        ESC_ESCALABLE           : 'escalable',
        ESC_ESTILO              : 'estilo',
        ESC_REPRESENTADOR       : 'representador',
        ESC_GUARDAR_PROPORCION  : 'guardarProporciones',
        ESC_INTERPRETAR_GLSL    : 'interpretarGLSL',

        // Nombres de los atributos básicos del "Reparto"
        RPT_COREOGRAFIA         : 'coreografia', 
        RPT_CANTIDAD            : 'cantidad', 
        RPT_PUESTOS             : 'puestos',
        RPT_INTERVALO           : 'intervalo', 
        RPT_VELOCIDAD           : 'velocidad',
        RPT_DESVIO              : 'desvío',
        RPT_SEPARACION          : 'separacion',
        RPT_ESTILO              : 'estilo',
        RPT_REPRESENTADOR       : 'representador',
        RPT_DESPLAZAMIENTO      : 'desplazamiento',
        RPT_MAX_DURACION        : 'duracion',
        RPT_MAX_RECORRIDO       : 'recorrido',
        
        // Nombres de los atributos básicos del "Actor"
        ACT_ORIGEN              : 'origen',
        ACT_VELOCIDAD           : 'velocidad',
        ACT_ACELERACION         : 'aceleracion',
        ACT_ESTILO              : 'estilo',
        ACT_REPRESENTADOR       : 'representador',
        ACT_MAX_DURACION        : 'duracion',
        ACT_MAX_RECORRIDO       : 'recorrido',

        
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
    // > COREOGRAFÍAS
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        COREO_RADIAL        : 'radial',
        COREO_AXIAL         : 'axial',
        COREO_RECTANGULAR   : 'rectangular',

    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > REPRESENTADORES
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        REP_ESTANDAR        : 'estandar',
        REP_LINEAL          : 'lineal',
        REP_ESTRELLA        : 'estrella',
        REP_DANDELION       : 'dandelion',
        REP_ESPINAL         : 'espinal',

        
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
    // > GUION
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        GUI_NOMBRE          : 'nombre',
        GUI_VALOR_DEFECTO   : 'valorPorDefecto',
        GUI_VALOR_MINIMO    : 'valorMinimo',
        GUI_VALOR_MAXIMO    : 'valorMaximo',
        GUI_INCREMENTO      : 'incremento',
        GUI_REPERTORIO      : 'repertorio',
        GUI_HEREDAR         : 'heredar',
        GUI_ETIQUETA        : 'etiqueta',
        GUI_ATRIBUTO        : 'atributo'
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