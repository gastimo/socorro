/*
 * =============================================================================
 * 
 *                          M Ó D U L O    E S C E N A
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Esquema from './esquema';


/**
 * Escena
 * Entidad principal de la "Obra" que articula la representación de los contenidos visuales en el
 * lienzo del navegador (el "canvas"). La "Obra" puede estar compuesta por una o múltiples escenas.
 * A cada escena se le asigna un "orquestador" encargado de instrumentar ordenadamente los tres
 * actos en los que ésta se divide:
 * 
 * - ACTO 1 ("Preparación"): Cargar archivos que van a utilizarse (preload).
 * - ACTO 2 ("Iniciación") : Configuración y armado inicial de la escena (setup).
 * - ACTO 3 ("Ejecución")  : Representación (cuadro a cuadro) de la escena (draw).
 * 
 * OBSERVACIONES:
 * 1. Según los parámetros de creación de la "Escena" se utilizan las función de la librería "p5js" 
 *    o de "Three.js" (o ambas) para la generación de la gráfica.
 * 2. Al igual que la mayoría de los objetos del módulo, la "Escena" es un "Esquema".
 */
function Escena(S) {
    const _ESQ = Esquema(S, CONFIG.SOS_ESCENA);
    const _ESC = S.O.S.revelar({}, _funcionActuaria(), _ESQ);
    
    // Objeto "Contenedor" para gestionar el elemento HTML donde se alojará el "canvas"
    let _contenedor;

    // Shaders
    let _vertexShader, _fragmentShader;
    let _p5Shader;
    
    // Definición e inicialización de variables "uniform"
    const _uniforms = {};
    let _nombreUniformTiempo     = CONFIG.UNIFORM_TIEMPO;
    let _nombreUniformResolucion = CONFIG.UNIFORM_RESOLUCION;
    let _nombreUniformMouse      = CONFIG.UNIFORM_MOUSE;

    // Variables para la librería Three.js
    let camera, scene;
    let rendererTHREE;
    let rendererP5;
    
    /**
     * _inicializar
     * Función privada de inicialización de la "Escena"
     */
    function _inicializar() {
        // Inicialización de las propiedades del "Actor"
        _ESC.escalable       = undefined;
        _ESC.representador   = undefined;
        _ESC.interpretarGLSL = undefined;
        return _ESC;
    }
    
    

// =====================================================================
// 
//  DEFINICIÓN & ACTUALIZACIÓN DE ATRIBUTOS DE LA ESCENA
//  
// =====================================================================

    /**
     * def
     * Esta función es la misma que la del objeto "Esquema" de quien 
     * "Escena" extiende. Se redefine simplemente para retornar, al final,
     * el objeto "Escena" actual, que permite definiciones encadenadas.
     */
    _ESC.def = (atributos) => {
        _ESQ.def(atributos);
        return _ESC;
    };

    /**
     * defEstilo
     * Define los atributos para la representación visual por defecto para los "Actores" de
     * la "Escena". El argumento recibido puede ser un objeto de tipo "Estilo" u otro objeto 
     * Javascript que contenga su definición.
     */
    _ESC.defEstilo = (estilo) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_ESTILO] = estilo;
        _ESQ.def(_definicion);
        return _ESC;
    };

    /**
     * defRepresentador
     * Función que permite definir el "Representador" por defecto para mostror a los "Actores".
     * Este método hace exactamente lo mismo que la siguiente invocación:
     *     def({representador: <nombre-representador});
     */
    _ESC.defRepresentador = (representador) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_REPRESENTADOR] = representador;
        _ESQ.def(_definicion);
        return _ESC;
    };
    
    /**
     * defEscalable
     * Función para determinar si el contenido de la "Escena" es escalable (o no) ante
     * cualquier cambio cambio de tamaño del lienzo HTML.
     */
    _ESC.defEscalable = (esEscalable) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_ESCALABLE] = esEscalable;
        _ESQ.def(_definicion);
        return _ESC;
    };
        
    /**
     * defInterpretarGLSL
     * Función que permite determinar si al representar la "Escena" se debe incluir 
     * también la reproducción de los programas GLSL que hayan sido definidos ("shaders"). 
     */
    _ESC.defInterpretarGLSL = (mostrarShader) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_INTERPRETAR_GLSL] = mostrarShader;
        _ESQ.def(_definicion);
        return _ESC;
    };    
    
    /**
     * actualizar
     * Recalcula el valor de los atributos dinámicos de la escena.
     */
    _ESC.actualizar = () => {
        // Actualización del indicador "escalable"
        _ESC.escalable = _ESQ.val(CONFIG.ESC_ESCALABLE) ?? _ESC.escalable;

        // Actualización del "Representador" por defecto para la "Escena"
        _ESC.representador = _ESQ.val(CONFIG.ESC_REPRESENTADOR) ?? _ESC.representador;
        
        // Actualizar la variable que indica si se debe interpretar el código GLSL
        _ESC.interpretarGLSL = _ESQ.val(CONFIG.ESC_INTERPRETAR_GLSL) ?? _ESC.interpretarGLSL;

        // Actualización del "Estilo" por defecto
        _ESC.estilo = _ESQ.val(CONFIG.ESC_ESTILO);  // Devuelve el "Estilo" sin evaluar
        if (_ESC.estilo) {
            _ESC.estilo.actualizar();               // Acá recién se evalúa el "Estilo"
        }
    };

    /**
     * estilar
     * Aplica los estilos básicos de la "Escena". Esto es:
     *  - color   : color de fondo de la escena
     *  - grandor : n/a
     *  - trazo   : color del trazo alrededor de la escena
     *  - grosor  : grosor del trazo alrededor de la escena
     */
    _ESC.estilar = () => {
        if (_ESC.estilo) {
            if (_ESC.estilo.color !== undefined && _ESC.estilo.color !== null) {
                S.O.S.P5.background(_ESC.estilo.color);
            }
            if (_ESC.estilo.trazo  !== undefined && _ESC.estilo.trazo  !== null &&
                _ESC.estilo.grosor !== undefined && _ESC.estilo.grosor !== null) {
                S.O.S.P5.noFill();
                S.O.S.P5.stroke(_ESC.estilo.trazo);
                S.O.S.P5.strokeWeight(_ESC.escalar(_ESC.estilo.grosor));
                S.O.S.P5.rect(-_ESC.ancho() / 2, -_ESC.alto() / 2, _ESC.ancho(), _ESC.alto());
            }
        }
        return _ESC;
    };


// =====================================================================
// 
//  DEFINICIÓN DE LA "FUNCION ACTUARIA" (LOS TRES ACTOS DE LA ESCENA)
//  
// =====================================================================
    
    /**
     * _funcionActuaria
     * Definición dinámica de las funciones a ser invocadas 
     * para cada uno de los tres actos de la escena.
     */
    function _funcionActuaria() {  
        const _FUNCION = {};
        
        /**
         * ACTO DE PREPARACIÓN (método "preload" de p5js)
         * Función estándar que se ejecuta una vez, al inicio, y se
         * utiliza para cargar archivos como shaders, imágenes, etc.
         */            
        _FUNCION[CONFIG.ACTO_PREPARACION] = () => {
        };

        /**
         * ACTO DE INICIACIÓN (método "setup" de p5js)
         * Función estándar que se ejecuta una vez, al inicio y justo
         * después de que haya finalizado el "Acto de Preparación".
         * Se utiliza para configurar la escena (por ejemplo, sus
         * dimensiones) y para definir las variables "uniform".
         */
        _FUNCION[CONFIG.ACTO_INICIACION] = () => {
        };

        /**
         * ACTO DE EJECUCIÓN (método "draw" de p5js)
         * Función estándar que se ejecuta indefinidamente "en bucle"
         * y se encarga de representar la escena (cuadro a cuadro).
         */
        _FUNCION[CONFIG.ACTO_EJECUCION] = (mostrarActores = true) => {
            if (_ESC.interpretarGLSL) {
                if (rendererTHREE) {
                    rendererTHREE.render(scene, camera);
                }
                if (rendererP5) {
                    if (_p5Shader) {
                        S.O.S.P5.push();
                        S.O.S.P5.noStroke();
                        S.O.S.P5.shader(_p5Shader);
                        S.O.S.P5.plane(_contenedor.geometria.ancho, _contenedor.geometria.alto);
                        S.O.S.P5.pop();  
                    }
                }
            }
            if (mostrarActores) {
                S.O.S.Reparto.representar();
            }
        };
        
        return _FUNCION;
    }

    
    
// =====================================================================
// 
//  FUNCIONES PARA EL MANEJO DE LOS "SHADERS" DE LA OBRA
//  
// =====================================================================

    _ESC.vertexShader = (shader) => {
        if (shader !== undefined) {
            _vertexShader = shader;     
        }
        return _vertexShader;
    };
    
    _ESC.fragmentShader = (shader) => {
        if (shader !== undefined) {
            _fragmentShader = shader;
        }
        return _fragmentShader;
    };

    
    
// =====================================================================
// 
//  FUNCIONES PARA LA MANIPULACIÓN DE LAS VARIABLES "UNIFORM"
//  
// =====================================================================
    
    _ESC.uniformP5 = (nombre, valor) => {
        if (valor !== null && _p5Shader) {
            if (typeof valor === 'object' && !Array.isArray(valor)) {
                if (valor.hasOwnProperty('x') && valor.hasOwnProperty('y') && valor.hasOwnProperty('z')) {
                    _p5Shader.setUniform(nombre, [valor.x, valor.y, valor.z]);
                }
                else if (valor.hasOwnProperty('x') && valor.hasOwnProperty('y')) {
                    _p5Shader.setUniform(nombre, [valor.x, valor.y]);
                }
                else if (valor.hasOwnProperty('contenido')) {
                    _p5Shader.setUniform(nombre, valor.contenido());
                }
                else {
                    _p5Shader.setUniform(nombre, valor);
                }
            }
            else {
                _p5Shader.setUniform(nombre, valor);
            }
        }
    };
    
    _ESC.uniformTiempoP5 = (valor) => {
        _ESC.uniformP5(_nombreUniformTiempo, valor);
    };
    
    _ESC.uniformResolucionP5 = (valor) => {
        _ESC.uniformP5(_nombreUniformResolucion, valor);
    };
    
    _ESC.uniformMouseP5 = (valor) => {
        _ESC.uniformP5(_nombreUniformMouse, valor);
    };

    _ESC.uniform = (nombre, valor, valor2) => {
        if (valor2 !== undefined) {
            let v = new S.O.S.THREE.Vector2(valor, valor2);
            return _ESC.uniform(nombre, v);
        }
        if (valor !== undefined) {
            if (!_uniforms.hasOwnProperty(nombre))
                _uniforms[nombre] = {};
            _uniforms[nombre][CONFIG.UNIFORM_VALOR] = valor;
            _ESC.uniformP5(nombre, valor);
        }
        else {
            if (!_uniforms.hasOwnProperty(nombre) || !_uniforms[nombre].hasOwnProperty(CONFIG.UNIFORM_VALOR)) {
                return undefined;
            }
        }
        return _uniforms[nombre];
    };

    _ESC.uniformTiempo = (nombre) => {
        if (nombre !== undefined) {
            _nombreUniformTiempo = nombre;
            _ESC.uniform(nombre, 1.0);        
        }
        return _ESC.uniform(nombre);
    };
    
    _ESC.uniformResolucion = (nombre) => {
        if (nombre !== undefined) {
            _nombreUniformResolucion = nombre;
            _ESC.uniform(nombre, new S.O.S.THREE.Vector2());
        }
        return _ESC.uniform(nombre);
    };
    
    _ESC.uniformMouse = (nombre) => {
        if (nombre !== undefined) {
            _nombreUniformMouse = nombre;
            _ESC.uniform(nombre, new S.O.S.THREE.Vector2());
        }
        return _ESC.uniform(nombre);
    };
        

// =====================================================================
// 
//  FUNCIONES PARA EMPLAZAR y MANIPULAR EL "LIENZO" DE LA ESCENA
//  
// =====================================================================
    
    /**
     * ancho
     * Devuelve el ancho de la escena, o sea, la anchura
     * del lienzo donde se realiza el "render".
     */
    _ESC.ancho = () => {
        if (_contenedor) {
            return _contenedor.geometria.ancho;
        }
        return 0;
    };
    
    /**
     * alto
     * Devuelve el alto de la escena, o sea, la altura
     * del lienzo donde se realiza el "render".
     */
    _ESC.alto = () => {
        if (_contenedor) {
            return _contenedor.geometria.alto;
        }
        return 0;
    };
    
    /**
     * escala
     * Retorna el coeficiente que representa la variación en escala entre el tamaño
     * actual de la "Escena" y las dimensiones de referencia iniciales.
     */
    _ESC.escala = () => {
        return _contenedor.geometria.factorEscala;
    };
    
    /**
     * escalar
     * Escala el valor recibido como argumento, en caso que aplique.
     */
    _ESC.escalar = (valor) => {
        return !(_ESC.escalable && valor) ? valor : 
                  (S.O.S.esUnVector(valor) ? valor.multiplicar(_contenedor.geometria.factorEscala)  :
                                                       valor * _contenedor.geometria.factorEscala);
    };
    
    /**
     * dimensionar
     * Establece el ancho y alto del lienzo donde se
     * representa la escena (el canvas del renderer).
     */
    _ESC.dimensionar = (ancho, alto) => {
        if (rendererTHREE) {
            rendererTHREE.setSize(ancho, alto); 
        }
        if (rendererP5) {
            S.O.S.P5.resizeCanvas(ancho, alto);
            S.O.S.P5.ortho(-ancho / 2, ancho / 2, -alto / 2, alto / 2);             
        }
    };

    /**
     * lienzo
     * Devuelve el lienzo (el "canvas" HTML) que se utiliza
     * para llevar a cabo el "render" de la escena.
     */
    _ESC.lienzo = () => {
        return _contenedor.lienzo();  
    };
    
    /**
     * emplazar
     * Función principal que encapsula los llamados a las librerías necesarias
     * para construir el "canvas" de la escena en la página HTML. El emplazamiento
     * del lienzo de la escena tiene lugar justo antes del inicio del segundo acto.
     */
    _ESC.emplazar = (contenedor) => {
        _contenedor = contenedor;
        if (!S.O.S.P5) {
            // Se crea el lienzo ("canvas") en el contenedor HTML de la página
            rendererTHREE = new S.O.S.THREE.WebGLRenderer();
            rendererTHREE.setPixelRatio(window.devicePixelRatio);
            _contenedor.lienzo(rendererTHREE.domElement);

            // Se incializan los objetos de Three.js para la escena. El armado concluye, 
            // luego, en la función "iniciarGLSL", al añadir la malla y los shaders.
            scene = new S.O.S.THREE.Scene();
            camera = new S.O.S.THREE.Camera();
            camera.position.z = 1;
        }
        else {
            // Se crea el lienzo ("canvas") en el contenedor HTML de la página
            rendererP5 = S.O.S.P5.createCanvas(_contenedor.geometria.ancho, _contenedor.geometria.alto, S.O.S.P5.WEBGL);
            _contenedor.lienzo(rendererP5.canvas);  
        }
        
        // Una vez emplazado el "canvas" en la página, se actualizan las dimensiones de la "Escena"
        // para reflejar las dimensiones actuales del lienzo. El "canvas" de la escena siempre asume
        // las medidas del contenedor de la página HTML y no al revés.
        _contenedor.actualizar();
        _ESC.dimensionar(_contenedor.geometria.ancho, _contenedor.geometria.alto);
    };
            
    /**
     * iniciarGLSL
     * Inicializa los objtos necesarios de las librerías p5js y Three.js para
     * poder utilizar "shaders". Esta función se invoca una vez que los dos 
     * primeros actos finalizaron y justo antes del tercer acto.
     */
    _ESC.iniciarGLSL = () => {
        if (!S.O.S.P5) {
            // LIBRERIA "THREE.js"
            // Se especifican los "shaders" a emplear para la escena, se definen sus
            // variables "uniform" y se invocan las funciones de la librería Three.js.
            let _vshader = _vertexShader && _vertexShader.contenido() ? _vertexShader.contenido() : CONFIG.VERTEX_SHADER_THREE;
            let atributos = {uniforms        : _uniforms,
                            vertexShader    : _vshader,
                            fragmentShader  : _fragmentShader.contenido()};
            let material = new S.O.S.THREE.ShaderMaterial(atributos);
            let geometry = new S.O.S.THREE.PlaneGeometry(2, 2);
            let mesh = new S.O.S.THREE.Mesh(geometry, material);
            scene.add(mesh);
        }
        else {
            // LIBRERÍA "P5.js"
            // Se verifica si se indicó algún "shader" para la escena, se definen sus
            // variables "uniform" y se invocan a las funciones de la libreria p5js.
            if ((_vertexShader && _vertexShader.contenido()) ||
                (_fragmentShader && _fragmentShader.contenido())) {
                let _vshader = _vertexShader && _vertexShader.contenido() ? _vertexShader.contenido() : CONFIG.VERTEX_SHADER_P5;
                _p5Shader = S.O.S.P5.createShader(_vshader, _fragmentShader.contenido());
                for (const [uNombre, uValor] of Object.entries(_uniforms)) {
                    if (uValor.hasOwnProperty(CONFIG.UNIFORM_VALOR)) {
                        _ESC.uniformP5(uNombre, uValor[CONFIG.UNIFORM_VALOR]);
                    }
                }
            }
        }       
    };
    
    return _inicializar();
}


export default Escena;