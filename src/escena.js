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
    const _ESC = _ESQ.extender(_funcionActuaria());
    
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
    
    // Registro general de la "Escena"
    let _REG = {};


    
    /**
     * _inicializar
     * Función privada de inicialización de las propiedades públicas de la
     * "Escena". Estas propiedades son accesibles como variables públicas del
     * objeto y almacenan los valores evaluados de los atributos del "Esquema".
     */
    function _inicializar() {
        // Inicialización de las PROPIEDADES PÚBLICAS DE LA ESCENA
        _ESC.estilo          = undefined;
        _ESC.escalable       = undefined;
        _ESC.representador   = undefined;
        _ESC.interpretarGLSL = undefined;
        
        // Inicialización de los REGISTROS ("Actores", "Repartos" y "Metarepartos")
        _REG.actores      = {};
        _REG.repartos     = {};
        _REG.metarepartos = {};
        
        _REG.actoresFinalizados = [];
        _REG.repartosFinalizados = [];
        
        return _ESC;
    }
    
    

// =====================================================================
// 
//  DEFINICIÓN DE ATRIBUTOS DE LA ESCENA
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
     * Define los atributos básicos para la representación visual por defecto para los
     * "Actores" de la "Escena". El argumento recibido puede ser un objeto de tipo "Estilo"
     * u otro objeto Javascript que contenga su definición. Se trata de una función 
     * utilitaria que permite definir el valor del atributo "estilo" de forma simplificada
     * (lo mismo podría realizarse mediante la invocación al método "def"). Por ejemplo,
     * las cuatro siguientes instrucciones hacen todas exactamente lo mismo:
     * 
     *    defEstilo({color: 'rgb(255, 255, 255)', color$alfa: 127, grandor: 12, color$trazo: 100});
     *    defEstilo(S.O.S.Estilo('rgb(255, 255, 255)', 127, 12, 100));
     *    def({estilo: {color: 'rgb(255, 255, 255)', color$alfa: 127, grandor: 12, color$trazo: 100}});
     *    def({estilo: S.O.S.Estilo('rgb(255, 255, 255)', 127, 12, 100)});
     */
    _ESC.defEstilo = (estilo) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_ESTILO] = estilo;
        _ESQ.def(_definicion);
        return _ESC;
    };
    

    /**
     * defRepresentador
     * Función que permite definir el "representador" por defecto para dibujar a los 
     * los "Actores" de la "Escena". Se trata de una función utilitaria que permite 
     * definir el valor del atributo "representador" de una manera simplificada (lo 
     * mismo podría ser llevado a cabo mediante la función "def" del "Esquema"). 
     * Las siguientes dos instrucciones hacen exactamente lo mismo:
     * 
     *     defRepresentador(<nombre-representador>);
     *     def({representador: <nombre-representador>);
     */
    _ESC.defRepresentador = (representador) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_REPRESENTADOR] = representador;
        _ESQ.def(_definicion);
        return _ESC;
    };

    
    /**
     * defEscalable
     * Función para determinar si el contenido de la "Escena" debe ser escalado cuando
     * ocurre cualquier cambio de tamaño del lienzo HTML. Se trata de una función 
     * utilitaria que permite definir el valor del atributo "escalable" de una forma
     * simplificada (lo mismo podría realizarse mediante el método "def" del "Esquema").
     * Las siguientes dos instrucciones hacen exactamente lo mismo:
     * 
     *     defEscalable(true);
     *     def({escalable: true});
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
     * Se trata de una función utilitaria que permite definir el valor del atributo
     * "interpretarGLSL" (lo mismo podría realizarse mediante el método "def" del 
     * "Esquema"). Las siguientes dos instrucciones hacen exactamente lo mismo:
     * 
     *     defInterpretarGLSL(true);
     *     def({interpretarGLSL: true});
     */
    _ESC.defInterpretarGLSL = (mostrarShader) => {
        const _definicion = {};
        _definicion[CONFIG.ESC_INTERPRETAR_GLSL] = mostrarShader;
        _ESQ.def(_definicion);
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
            // -------------------------------------
            //  Representación de los SHADERS
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
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

            // -------------------------------------
            //  Representación de los ACTORES
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (mostrarActores) {
                _representarActores(_ESC.identificador);
                _representarRepartos(_ESC.identificador);
            }
        };
        
        return _FUNCION;
    }

    

// =====================================================================
// 
//  RUTINAS DE ACTUALIZACIÓN & REPRESENTACIÓN DE LA ESCENA
//  
// =====================================================================
    
    /**
     * actualizar
     * Recalcula el valor de los atributos dinámicos de la escena y luego
     * se ocupa de actualizar, de forma ordenada, los atributos dinámicos 
     * de todos los "Repartos" y de todos sus "Actores".
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
            _ESC.estilo.actualizar(); // Recién acá se evalúa. Se aplica luego con el método "estilar"
        }
        
        // -------------------------------------------------------------------------
        // ACTUALIZACIÓN DE LOS REPARTOS
        // La "Escena" mantiene un registro actualizado de todos sus "Repartos"
        // estructurado de forma jerárquica. En este punto, se recorre el registro
        // y se invoca a sus respectivas funciones de actualización.
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        for (const [identificador, repartos] of Object.entries(_REG.repartos)) {
            for (let i = 0; i < repartos.length; i++) {
                repartos[i].actualizar();
            }
        }
        
        // -----------------------------------------------------------------------------------
        // ACTUALIZACIÓN DE LOS ACTORES
        // La "Escena", además, lleva un registro interno actualizado de todos sus "Actores"
        // organizado, también, de forma jerárquica. En este punto, se recorre el registro
        // y se invoca a sus respectivas funciones de actualización. Como resultado de este
        // proceso, algunos "Actores" pueden finalizar su participación en la "Escena", por
        // eso, es necesario que, luego de la actualización, se haga una depuración de todos
        // aquellos "Actores" finalizados, incluyendo los "Subrepartos" que éstos encabecen. 
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        for (const [identificador, actores] of Object.entries(_REG.actores)) {
            let _actorPrevio, _actorPrimero, _actorUltimo;
            let _actoresActivosDelReparto = [];
            let _superior = actores.length > 0 ? actores[0].superior.entidad : undefined;
            for (let i = 0; i < actores.length; i++) {
                if (!actores[i].finalizado()) {
                    actores[i].actualizar();
                    if (!actores[i].finalizado()) {
                        actores[i].prev = _actorPrevio;
                        if (_actorPrevio) 
                            _actorPrevio.sig = actores[i];
                        if (!_actorPrimero)
                            _actorPrimero = actores[i];
                        _actorPrevio = actores[i];
                        _actorUltimo = actores[i];
                        _actoresActivosDelReparto.push(actores[i]);
                    }
                    else {
                        _REG.actoresFinalizados.push(actores[i].identificador);
                        _finalizarSubrepartosDelActor(actores[i]);
                    }
                }
            }
            if (_superior) {
                _superior.primerActor = _actorPrimero;
                _superior.ultimoActor = _actorUltimo;
            }
            _REG.actores[identificador] = _actoresActivosDelReparto;
        }
        
        // Depuración del registro para eliminar "finalizados"
        _depurarRegistro();
    };
    
    /**
     * estilar
     * Aplica los estilos básicos de la "Escena". Este método es ejecutado
     * por el "Orquestador" inmediatamente después de actualizar la "Escena".
     * Los atributos del "Estilo" usados para la "Escena" son:
     *  - color   : color de fondo de la escena
     *  - grandor : n/a
     *  - trazo   : color del trazo alrededor de la escena
     *  - grosor  : grosor del trazo alrededor de la escena
     * El más importante de ellos es "color" dado que estblece el color de 
     * fondo. En caso de no definirse, la "Escena" se sobredibujará sobre
     * sí misma en cada iteración del ciclo de representación.
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
//  MÉTODOS PARA EL MANTENIMIENTO DEL REGISTRO INTERNO
//  
// ===================================================================== 
    
    /**
     * registrar
     * Actualiza el registro interno de la "Escena" para incorporar al "Actor", 
     * "Reparto" o "Metareparto" recibido como argumento. El registro almacena 
     * automáticamente todas aquellas entidades que hayan sido añadidas a la 
     * "Escena" (o algún "Reparto") a través del método "def" (del "Esquema"). 
     * Cualquier "Actor" o "Reparto" independiente no queda registrado.
     * Este registro es, luego, utilizado para la actualización automática de
     * los "Actores"/"Repartos" de la "Escena" y para su representación.
     */
    _ESC.registrar = (entidad) => {
        
        // ------------------------------------------------------------
        //  REGISTRO DE ACTORES
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        if (S.O.S.esUnActor(entidad)) {
            if (entidad.superior) {
                let identificador = entidad.superior.identificador;
                if (!_REG.actores.hasOwnProperty(identificador)) {
                    _REG.actores[identificador] = [];
                }
                _REG.actores[identificador].push(entidad);
            }
        }

        // ------------------------------------------------------------
        //  REGISTRO DE REPARTOS Y METAREPARTOS
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        
        else if (S.O.S.esUnReparto(entidad)) {
            if (entidad.superior) {
                let identificador = entidad.superior.identificador;

                // Se identifican aquellos "Repartos" que forman parte de la definición de
                // algún otro "Reparto". Estos se marcan como "Metarepartos" dado que su
                // instanciación tiene lugar, posteriormente, por cada "Actor" del "Reparto"
                // superor. Luego, se registra el "Reparto" o el "Metareparto" en la "Escena".
                if (S.O.S.esUnReparto(entidad.superior.entidad)) { 
                    entidad.metareparto = true;
                   if (!_REG.metarepartos.hasOwnProperty(identificador))
                        _REG.metarepartos[identificador] = [];
                    _REG.metarepartos[identificador].push(entidad);
                }
                else {
                   if (!_REG.repartos.hasOwnProperty(identificador))
                        _REG.repartos[identificador] = [];
                    _REG.repartos[identificador].push(entidad);
                }
            }
        }
    };
    
    /**
     * actores
     * Retorna la lista de "Actores" registrados bajo el identificador recibido
     * como argumento (puede ser el identificador de la "Escena", de un "Reparto"
     * o, incluso, de un "Actor"). En caso de no encontrarlo, retorna "undefined".
     * Si no se indica identificador, se devuelve el registro completo de "Actores".
     */
    _ESC.actores = (identificador) => {
        if (identificador) {
            if (_REG.actores.hasOwnProperty(identificador))
                return _REG.actores[identificador];
            else
                return undefined;
        }
        else 
            return _REG.actores;
    };
    
    /**
     * repartos
     * Retorna la lista de "Repartos" registrados bajo el identificador recibido
     * como argumento (puede ser el identificador de la "Escena", de un "Reparto"
     * o, incluso, de un "Actor"). En caso de no encontrarlo, retorna "undefined".
     * Si no se indica identificador, se devuelve el registro completo de "Repartos".
     */
    _ESC.repartos = (identificador) => {
        if (identificador) {
            if (_REG.repartos.hasOwnProperty(identificador))
                return _REG.repartos[identificador];
            else
                return undefined;
        }
        else 
            return _REG.repartos;
    };
    

    /**
     * metarepartos
     * Retorna la lista de "Metaepartos" registrados bajo el identificador recibido
     * como argumento (puede ser el identificador de la "Escena", de un "Reparto"
     * o, incluso, de un "Actor"). En caso de no encontrarlo, retorna "undefined".
     * Si no se indica identificador, se devuelven todos los "Metarepartos".
     */
    _ESC.metarepartos = (identificador) => {
        if (identificador) {
            if (_REG.metarepartos.hasOwnProperty(identificador))
                return _REG.metarepartos[identificador];
            else
                return undefined;
        }
        else 
            return _REG.metarepartos;
    };
    
    
// =====================================================================
//  RUTINAS PRIVADAS DEL REGISTRO INTERNO
// =====================================================================    
    
    /**
     * _representarActores
     * Función privada que, a través del registro, identifica a todos los "Actores"
     * vinculados al identificador recibido como argumento para representarlos.
     * 
     * REGISTRO DE ACTORES:
     * En este registro, los "Actores" pueden estar estar vinculados con:
     * - UNA ESCENA : actores independientes creados directamente en la "Escena"
     * - UN REPARTO : actores que forman parte de un "Reparto" o ("Subreparto")
     * - OTRO ACTOR : actores dirigidos por otro "Actor"
     */
    function _representarActores(identificador) {        
        if (_REG.actores.hasOwnProperty(identificador)) {
            S.O.S.P5.push();
            let _actores = _REG.actores[identificador];
            if (_actores.length > 0) {
                // El "Actor" podría depender directamente de la "Escena", de otro 
                // "Actor" o formar parte de un "Reparto". Si se trata de este último
                // caso, es necesario posicionar al "Reparto" (desplazarlo y/o rotarlo)
                let _superior = _actores[0].superior.entidad;
                if (S.O.S.esUnReparto(_superior)) {
                    _superior.posicionar();
                }
                
                // Luego, se lleva a cabo la representación de los "Actores" y, de forma
                // recursiva, de cualquier otro "Actor" dependiente o "Subreparto"
                for (let i = 0; i < _actores.length; i++) {
                    _actores[i].representar();
                    _representarActores(_actores[i].identificador);  // Actores dirigidos por el "Actor" 
                    _representarRepartos(_actores[i].identificador); // Subrepartos encabezados por el "Actor"
                }
            }            
            S.O.S.P5.pop();
        }        
    }
    
    /**
     * _representarRepartos
     * Dado el identificador de la "Escena" o de un "Actor", la función
     * identifica a todos los "Repartos" asociados para invocar, de forma
     * recursiva, a la función para representar a sus "Actores".
     * 
     * REGISTRO DE REPARTOS:
     * En este registro, los "Repartos" pueden estar vinculados con:
     * - UNA ESCENA : son los repartos principales creados directamente en la "Escena"
     * - UN ACTOR   : son los repartos creados, ya sea como parte de la definición de
     *                un "Actor" como la de algún otro "Reparto".
     * 
     * Nunca podría haber un "Reparto" debajo de otro "Reparto". En los casos en que
     * un "Reparto" contenga "Subrepartos" en su definición, éstos últimos cuentan
     * como "metarepartos", ya que las instancias de dichos "Subrepartos" se crearán
     * por cada "Actor" del "Reparto" principal y en la medida en que éstos vayan siendo
     * introducidos. El "metareparto", entonces, funciona como la plantilla para crear
     * las instancias de los "Subrepartos" encabezados por cada "Actor".
     */
    function _representarRepartos(identificador) {
        if (_REG.repartos.hasOwnProperty(identificador)) {
            S.O.S.P5.push();
            let _repartos = _REG.repartos[identificador];
            if (_repartos.length > 0) {
                let _superior = _repartos[0].superior.entidad;
                if (S.O.S.esUnActor(_superior)) {
                    _superior.posicionar();
                }            
                for (let i = 0; i < _repartos.length; i++) {
                    _representarActores(_repartos[i].identificador);
                }
            }
            S.O.S.P5.pop();
        }
    }

    /**
     * _finalizarSubrepartosDelActor
     * Si el "Actor" recibido como argumento encabeza "Subrepartos", entonces
     * se los finaliza y se invoca a la función para finalizar, recursivamente,
     * a todos los "Actores" de dichos "Subrepartos". Se trata de un borrado 
     * lógico (sólo se les coloca la marca de "finalizado").
     */
    function _finalizarSubrepartosDelActor(actor) {
        for (const [identificadorRep, repartos] of Object.entries(_REG.repartos)) {
            if (identificadorRep == actor.identificador) {
                for (let r = 0; r < repartos.length; r++) {
                    repartos[r].finalizar();
                    _REG.repartosFinalizados.push(repartos[r].identificador);
                    _finalizarActoresDelReparto(repartos[r]);
                }
            }
        }
    }

    /**
     * _finalizarActoresDelReparto
     * Si el "Reparto" recibido como argumento contiene "Actores", entonces se
     * los finaliza y se invoca a la función para finalizar, recursivamente, a
     * todos sus posibles "Subrepartos". Se trata de un borrado lógico (sólo se) 
     * les coloca la marca de "finalizado").
     */
    function _finalizarActoresDelReparto(reparto) {
        for (const [identificadorAct, actores] of Object.entries(_REG.actores)) {
            if (identificadorAct == reparto.identificador) {
                for (let a = 0; a < actores.length; a++) {
                    actores[a].finalizar();
                    _REG.actoresFinalizados.push(actores[a].identificador);
                    _finalizarSubrepartosDelActor(actores[a]);
                }
            }
        }
    }
    
    /**
     * _depurarRegistro
     * Functión interna que se encarga efectivamente del borrado real de los
     * registos (de "Actores" o "Repartos") que hayan sido finalizados durante
     * el proceso de actualización.
     */
    function _depurarRegistro() {
        // Depuración de los actores identificados como "finalizados"
        let _regActores = Object.entries(_REG.actores);
        let _registroActoresActivos = {};
        for (const [identificador, actores] of _regActores) {
            if (!_REG.repartosFinalizados.includes(identificador) &&
                !_REG.actoresFinalizados.includes(identificador)) {
                _registroActoresActivos[identificador] = actores;
            }
        }
        _REG.actores = _registroActoresActivos;
        
        // Depuración de los repartos identificados como "finalizados"
        let _regRepartos = Object.entries(_REG.repartos);
        let _registroRepartosActivos = {};
        for (const [identificador, repartos] of _regRepartos) {
            if (!_REG.repartosFinalizados.includes(identificador) &&
                !_REG.actoresFinalizados.includes(identificador)) {
                _registroRepartosActivos[identificador] = repartos;
            }
        }
        _REG.repartos = _registroRepartosActivos;
        
        // Reinicialización del registro de "finalizados"
        _REG.actoresFinalizados = [];
        _REG.repartosFinalizados = [];
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