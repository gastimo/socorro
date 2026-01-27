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
 * Entidad principal de la "Obra" que articula la representación de los
 * contenidos visuales en el lienzo del navegador (el "canvas").
 * La "Obra" puede estar compuesta por una o múltiples escenas.
 * 
 * A cada escena se le asigna un "orquestador" encargado de instrumentar
 * ordenadamente los tres actos en los que ésta se divide:
 * 
 * - ACTO 1 ("Preparación"): Cargar archivos que van a utilizarse (preload).
 * - ACTO 2 ("Iniciación") : Configuración y armado inicial de la escena (setup).
 * - ACTO 3 ("Ejecución")  : Representación (cuadro a cuadro) de la escena (draw).
 * 
 * NOTA 1: La escena es la entidad que permite encapsular el uso de las 
 *         librerías para la generación de gráficos (p5js o Three.js).
 * NOTA 2: La escena hace uso del objeto esquema (es un esquema).
 * 
 */
function Escena(S) {
    const _ESQ = Esquema(S, CONFIG.NOMBRE_ESCENA);
    const _estilo = {color: undefined, grandor: undefined, trazo: undefined, grosor: undefined};
    let _contenedor;
    let _esEscalable = false;
    let _reproducirCodigoGLSL = false;

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
    

// =====================================================================
// 
//  DEFINICIÓN DE LOS ATRIBUTOS DE "ESTILO" DE LA ESCENA
//  
// =====================================================================
    
    /**
     * defEstilo
     * Define los atributos básicos para la representación visual de la "Escena".
     * El argumento recibido puede ser un objeto de tipo "Estilo" u otro objeto Javascript
     * que contenga su definición.
     */
    function defEstilo(estilo) {
        const _definicion = {};
        if (estilo !== undefined && estilo !== null)
            _definicion[CONFIG.ACT_ESTILO] = estilo;
        _ESQ.def(_definicion);
    }
    
    /**
     * estilar
     * Aplica los estilos básicos de la "Escena". Esto es:
     *  - color   : color de fondo de la escena
     *  - grandor : na
     *  - trazo   : color del trazo alrededor de la escena
     *  - grosor  : grosor del trazo alrededor de la escena
     */
    function estilar() {
        let _e = _ESQ.val(CONFIG.ACT_ESTILO);
        if (_e) {
            _e.actualizar();
            _estilo.color   = _e.color();
            _estilo.trazo   = _e.color(true);
            _estilo.grandor = _e.grandor();
            _estilo.grosor  = _e.grandor(true);

            if (_estilo.color !== undefined && _estilo.color !== null) {
                S.O.S.P5.background(_estilo.color);
            }
            if (_estilo.trazo !== undefined && _estilo.trazo !== null &&
                _estilo.grosor !== undefined && _estilo.grosor !== null) {
                S.O.S.P5.push();
                S.O.S.P5.noFill();
                S.O.S.P5.stroke(_estilo.trazo);
                S.O.S.P5.strokeWeight(escalar(_estilo.grosor));
                S.O.S.P5.rect(-ancho() / 2, -alto() / 2, ancho(), alto());
                S.O.S.P5.pop();
            }
        }
    }
    

// =====================================================================
// 
//  DEFINICIÓN DE LA "FUNCION ACTUARIA" (LOS TRES ACTOS DE LA ESCENA)
//  
// =====================================================================
    
    /**
     * functionActuaria
     * Definición dinámica de las funciones a ser invocadas 
     * para cada uno de los tres actos de la escena.
     */
    function functionActuaria() {  
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
            if (_reproducirCodigoGLSL) {
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
                S.O.S.representarReparto();
            }
        };
        
        return _FUNCION;
    }

    
    
// =====================================================================
// 
//  FUNCIONES PARA EL MANEJO DE LOS "SHADERS" DE LA OBRA
//  
// =====================================================================

    function vertexShader(shader) {
        if (shader !== undefined) {
            _vertexShader = shader;     
        }
        return _vertexShader;
    }
    
    function fragmentShader(shader) {
        if (shader !== undefined) {
            _fragmentShader = shader;
        }
        return _fragmentShader;
    }

    
    
// =====================================================================
// 
//  FUNCIONES PARA LA MANIPULACIÓN DE LAS VARIABLES "UNIFORM"
//  
// =====================================================================
    
    function uniformTiempo(nombre) {
        if (nombre !== undefined) {
            _nombreUniformTiempo = nombre;
            uniform(nombre, 1.0);        
        }
        return uniform(nombre);
    }
    
    function uniformResolucion(nombre) {
        if (nombre !== undefined) {
            _nombreUniformResolucion = nombre;
            uniform(nombre, new S.O.S.THREE.Vector2());
        }
        return uniform(nombre);
    }
    
    function uniformMouse(nombre) {
        if (nombre !== undefined) {
            _nombreUniformMouse = nombre;
            uniform(nombre, new S.O.S.THREE.Vector2());
        }
        return uniform(nombre);
    }
    
    function uniform(nombre, valor, valor2) {
        if (valor2 !== undefined) {
            let v = new S.O.S.THREE.Vector2(valor, valor2);
            return uniform(nombre, v);
        }
        if (valor !== undefined) {
            if (!_uniforms.hasOwnProperty(nombre))
                _uniforms[nombre] = {};
            _uniforms[nombre][CONFIG.UNIFORM_VALOR] = valor;
            uniformP5(nombre, valor);
        }
        else {
            if (!_uniforms.hasOwnProperty(nombre) || !_uniforms[nombre].hasOwnProperty(CONFIG.UNIFORM_VALOR)) {
                return undefined;
            }
        }
        return _uniforms[nombre];
    }

    function uniformP5(nombre, valor) {
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
    }
    
    function uniformTiempoP5(valor) {
        uniformP5(_nombreUniformTiempo, valor);
    }
    
    function uniformResolucionP5(valor) {
        uniformP5(_nombreUniformResolucion, valor);
    }
    
    function uniformMouseP5(valor) {
        uniformP5(_nombreUniformMouse, valor);
    }
    

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
    function ancho() {
        if (_contenedor) {
            return _contenedor.geometria.ancho;
        }
        return 0;
    }
    
    /**
     * alto
     * Devuelve el alto de la escena, o sea, la altura
     * del lienzo donde se realiza el "render".
     */
    function alto() {
        if (_contenedor) {
            return _contenedor.geometria.alto;
        }
        return 0;
    }
    
    /**
     * escala
     * Retorna el coeficiente que representa la variación en escala entre el tamaño
     * actual de la "Escena" y las dimensiones de referencia iniciales.
     */
    function escala() {
        return _contenedor.geometria.factorEscala;
    }
    
    /**
     * escalar
     * Escala el valor recibido como argumento, en caso que aplique.
     */
    function escalar(valor) {
        return !(_esEscalable && valor) ? valor : 
                  (S.O.S.esUnVector(valor) ? valor.multiplicar(_contenedor.geometria.factorEscala)  :
                                                       valor * _contenedor.geometria.factorEscala);
    }
    
    /**
     * escalable
     * Indica si el contenido de la "Escena" es escalable o no ante cualquier cambio
     * de tamaño del lienzo HTML. El argumento de la función permite definir si la 
     * "Escena" debe ser escalable en adelante.
     */
    function escalable(esEscalable) {
        if (esEscalable !== undefined && esEscalable !== null) {
            _esEscalable = esEscalable;
        }
        return _esEscalable;
    }
    
    /**
     * dimensionar
     * Establece el ancho y alto del lienzo donde se
     * representa la escena (el canvas del renderer).
     */
    function dimensionar(ancho, alto) {
        if (rendererTHREE) {
            rendererTHREE.setSize(ancho, alto); 
        }
        if (rendererP5) {
            S.O.S.P5.resizeCanvas(ancho, alto);
            S.O.S.P5.ortho(-ancho / 2, ancho / 2, -alto / 2, alto / 2);             
        }
    }

    /**
     * lienzo
     * Devuelve el lienzo (el "canvas" HTML) que se utiliza
     * para llevar a cabo el "render" de la escena.
     */
    function lienzo() {
        _contenedor.lienzo();  
    }
    
    /**
     * reproducirGLSL
     * Indica si al representar la "Escena" se debe incluir también la reproducción
     * de los programas GLSL que hayan sido definidos ("shaders"). El argumento de 
     * la función permite definir si la ejecuión del código GLSL debe ser incluida
     * en adelante en cada representación de la "Escena".
     */
    function reproducirGLSL(mostrarShader) {
        if (mostrarShader !== undefined) {
            _reproducirCodigoGLSL = mostrarShader;
        }
        return _reproducirCodigoGLSL;
    }
    
    /**
     * emplazar
     * Función principal que encapsula los llamados a las librerías necesarias
     * para construir el "canvas" de la escena en la página HTML. El emplazamiento
     * del lienzo de la escena tiene lugar justo antes del inicio del segundo acto.
     */
    function emplazar(contenedor) {
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
        dimensionar(_contenedor.geometria.ancho, _contenedor.geometria.alto);
    }
            
    /**
     * iniciarGLSL
     * Inicializa los objtos necesarios de las librerías p5js y Three.js para
     * poder utilizar "shaders". Esta función se invoca una vez que los dos 
     * primeros actos finalizaron y justo antes del tercer acto.
     */
    function iniciarGLSL() {
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
                        uniformP5(uNombre, uValor[CONFIG.UNIFORM_VALOR]);
                    }
                }
            }
        }       
    }
    

    // ===============================================================
    // ===> Se exponen únicamente las funciones públicas de la escena
    // ==> ("Revealing Module Pattern") y se implementa la herencia.
    // ===============================================================
    return S.O.S.revelar({
                         ancho,
                         alto,
                         dimensionar,
                         escalar,
                         escalable,
                         emplazar,
                         lienzo,
                         defEstilo,
                         estilar,
                         reproducirGLSL,
                         iniciarGLSL,
                         vertexShader,
                         fragmentShader,
                         uniformTiempo,
                         uniformResolucion,
                         uniformMouse,
                         uniform,
                         uniformP5,
                         uniformTiempoP5,
                         uniformResolucionP5,
                         uniformMouseP5,
                         }, 
                         functionActuaria(),   // Se adicionan los métodos de la "Función Actuaria"
                         _ESQ);                // Se heredan las funciones públicas del "Esquema"
}


export default Escena;