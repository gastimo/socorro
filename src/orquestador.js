/*
 * =============================================================================
 * 
 *                       M Ó D U L O    O R Q U E S T A D O R
 * 
 * =============================================================================
 */
import CONFIG from './config';
import VariadorDeValores from './variador.js';


/**
 * Orquestador
 * Se encarga de ir ejecutando, en el orden adecuado y sin
 * producir superposiciones, cada uno de los actos de la 
 * función. La "Función Actuaria" es simplemente una función
 * JavaScript que especifica las funciones (actos) que se 
 * deben llevar a cabo. El orquestador está preparado para 
 * coordinar tres actos:
 * - ACTO 1 ("Preparación"): Cargar archivos que van a utilizarse.
 * - ACTO 2 ("Iniciación"): Configuración y armado inicial de la escena.
 * - ACTO 3 ("Ejecución"): Despliegue (cuadro a cuadro) de la escena.
 * 
 * El orquestador debe garantizar que cada acto haya concluido 
 * efectivamente antes de comenzar con el siguiente. Esto es
 * importante, principalmente con el "Acto 1", ya que todos los
 * archivos deben estar cargados antes de iniciar el "Acto 2".
 * 
 * Si se indica el uso de la librería de "Processing" (p5js)
 * se le delega, entonces, la orquestación a ésta.
 */
function Orquestador(sos, contenedor) {
    const S = sos.socorrista();
    let   _utilizaP5 = false;
    let   _reloj;
    let   _cuadros = 0;
    let   _funcionActuaria;
    let   _contenedor = contenedor;
    let   _escena;
    let   _diferido = false;
    
    // Variables para los actos (funciones) a ser orquestados
    let _funcionPreparacion;
    let _funcionIniciacion;
    let _funcionEjecucion;
    let _actoPreparacionIniciado = false;
    let _actoPreparacionFinalizado = false;
    let _actoIniciacionIniciado = false;
    let _actoEjecucionIniciado = false;
    
    // Valores de los "uniforms" estándares
    let _valorUniformTiempo;
    let _valorUniformResolucion;
    let _valorUniformMouse;
    
    
    // ==========================================================
    // 
    //  DEFINICIÓN DEL OBJETO PARA ALMACENAR ARCHIVOS DE TEXTO
    //  
    // ==========================================================

    /**
     * Archivo
     * Objeto simple para almacenar el contenido de un archivo
     */
    function Archivo(nombre, datos) {
        let _contenido = datos;
        function contenido(datos) {
            if (datos !== undefined)
                _contenido = datos;
            return _contenido;
        }
        function cargado() {
            return _contenido !== undefined ? true : false;
        }
        return {contenido, cargado};
    }

    
    // ==========================================================
    // 
    //  DEFINICIÓN DEL GESTOR PARA LA CARGA DE ARCHIVOS
    //  
    // ==========================================================

    /**
     * Cargador
     * Gestor para la carga asincrónica de archivos.
     */
    function Cargador() {
        const _archivos = [];
        const _texturas = [];
        let   _gestorTHREE, _cargadorTHREE;
        let   _texturasCargadas = false;

        function cargarShader(archivo) {
            let _shader = Archivo(archivo);
            _archivos.push(_shader);
            _leerArchivo(archivo, _shader);
            return _shader;
        }

        function cargarTextura2D(archivo) {
            if (!_utilizaP5) {
                _inicializarGestorTHREE();
                let _textura = _cargadorTHREE.load(archivo);
                _texturas.push(_textura);
                return _textura;
            }
            else {
                let _imagen = Archivo(archivo);
                _archivos.push(_imagen);
                _cargarImagenP5(archivo, _imagen);
                return _imagen;
            }
        }
        
        function cargarFuente(archivo) {
            if (!_utilizaP5) {
                // No soportado por el momento
                return Archivo(archivo, "");
            }
            else {
                let _fuente = Archivo(archivo);
                _archivos.push(_fuente);
                _cargarFuenteP5(archivo, _fuente);
                return _fuente;
            }
        }

        function cargaCompletada() {
            for (let i = 0; i < _archivos.length; i++) {
                if (!_archivos[i].cargado())
                    return false;
            }
            if (_texturas.length > 0 && !_texturasCargadas)
                return false;
            return true;
        }

        async function _leerArchivo(nombre, archivo) {
            let objeto = await fetch(nombre);
            archivo.contenido(await objeto.text());
        }
        
        async function _cargarImagenP5(nombre, archivo) {
            let imagen = await S.O.S.P5.loadImage(nombre, (img) => {
                archivo.contenido(img);
            });
        }
        
        async function _cargarFuenteP5(nombre, archivo) {
            let fuente = await S.O.S.P5.loadFont(nombre, (font) => {
                archivo.contenido(font);
            });
        }
        
        function _inicializarGestorTHREE() {
            if (_gestorTHREE === undefined) {
                _gestorTHREE = new S.O.S.THREE.LoadingManager();
                _cargadorTHREE = new S.O.S.THREE.TextureLoader(_gestorTHREE);
                _texturasCargadas = false;
                _gestorTHREE.onLoad = () => {
                    _texturasCargadas = true;
                };
            }
        }
        
        return {cargarShader, cargarTextura2D, cargarFuente, cargaCompletada};
    }
    
    
    // ==========================================================
    // 
    //  DEFINICIÓN DE LA FUNCIÓN AUXILIADORA
    //  
    // ==========================================================
    
    /**
     * Auxiliadora
     * Función con rutinas de auxilio de uso general.
     */
    function Auxiliadora() {

        function recuentoDeCuadros() {
            return _utilizaP5 ? S.O.S.P5.frameCount : _conteoDeCuadros();
        }

        function Variador(valorIni, valorFin, cuadrosDuracion, cuadrosRetardo) {
            return VariadorDeValores(S, valorIni, valorFin, cuadrosDuracion, cuadrosRetardo, recuentoDeCuadros);
        }

        return {recuentoDeCuadros,
                Variador};
    }
    
    
// ==============================================================
// 
//  DEFINICIÓN DE LOS MÉTODOS DEL PROPIO ORQUESTADOR
//  
// ==============================================================
  
    /**
     * vincular
     * Se estalece el vínculo entre el orquestador, la escena y
     * el cargador a usar durante el acto de "Preparación".
     * Esto se lleva a cabo concediéndole al siervo convocado
     * al momento de la creación del orquestador, la información
     * necesaria para convertirlo en el socorrista designado.
     */
    function vincular(escena) {
        _escena = escena;
        if (S.O.S.hasOwnProperty('THREE')) {
            _escena.asociar('THREE', S.O.S.THREE);
        }
        if (S.O.S.hasOwnProperty('P5')) {
            _escena.asociar('P5', S.O.S.P5);
        }
        S.O.S.revelar(S.O.S, Auxiliadora(), Cargador(), escena);
    }  
    
    /**
     * asociar
     * Asocia componentes como parte del socorrista designado.
     */
    function asociar(nombre, componente) {
        if (nombre == 'THREE') {
            S.O.S.THREE = componente;
            _reloj = new S.O.S.THREE.Clock();
            if (_escena)
                _escena.asociar(nombre, componente);
        }
        else if (nombre == 'P5') {
            S.O.S.P5 = componente;
            _utilizaP5 = true;
            if (_escena)
                _escena.asociar(nombre, componente);
        }
        else {
            S.O.S[nombre] = componente;
        }
    }    
    
    /**
     * socorrista
     * Devuelve el socorrista designado para atender los 
     * menesteres de la orquestación de la escena.
     */
    function socorrista() {
        return S;
    }

    /**
     * funcionActuaria
     * Devuelve y/o define la "Función Actuaria", es decir, 
     * el método que especifica cada una de los actos a ejecutar.
     */
    function funcionActuaria(funcion) {
        if (funcion) {
            _funcionActuaria = funcion;
            if (!_utilizaP5) {
                const _funcion = {};
                _funcionActuaria(_funcion); 
                if (_funcion.hasOwnProperty(CONFIG.ACTO_PREPARACION)) {
                    _funcionPreparacion = _funcion[CONFIG.ACTO_PREPARACION];
                }
                if (_funcion.hasOwnProperty(CONFIG.ACTO_INICIACION)) {
                    _funcionIniciacion = _funcion[CONFIG.ACTO_INICIACION];
                }
                if (_funcion.hasOwnProperty(CONFIG.ACTO_EJECUCION)) {
                    _funcionEjecucion = _funcion[CONFIG.ACTO_EJECUCION];
                }
            }
        }
        return _funcionActuaria;
    }
    
    
    /**
     * orquestar
     * Encargada de ir ejecutando, paso a paso y en orden, cada
     * uno de los actos indicados por la "Función Actuaria".
     * Debe asegurarse que la "Preparación" concluya (la carga 
     * de archivos de manera asincrónica) antes de avanzar con 
     * el siguiente acto.
     * Una vez que los actos de "Preparación" y la "Iniciación" 
     * hayan finalizado, sólo realizará el bucle de "Ejecución".
     */
    function orquestar() {
        if (_actoEjecucionIniciado && _funcionEjecucion) {
            _orquestarActo3();
            _cuadros++;
        }
        else {
            if (_funcionPreparacion && !_actoPreparacionIniciado) {
                _orquestarActo1();
                _actoPreparacionIniciado = true;
                return;
            }
            else if (_funcionPreparacion && _actoPreparacionIniciado && !_actoPreparacionFinalizado) {
                _actoPreparacionFinalizado = _escena && S.O.S.cargaCompletada();
                return;
            }
            if (_funcionIniciacion && !_actoIniciacionIniciado) {
                if (!_funcionPreparacion || _actoPreparacionFinalizado) {
                    _orquestarActo2();
                    _actoIniciacionIniciado = true;
                    return;
                }
            }
            if (_funcionEjecucion && !_actoEjecucionIniciado) {
                if ((!_funcionPreparacion && !_funcionIniciacion) || 
                    (_funcionPreparacion && _actoPreparacionFinalizado && !_funcionIniciacion) ||
                    _actoIniciacionIniciado) {
                    _orquestarActo3();
                    _cuadros++;
                    _actoEjecucionIniciado = true;
                    return;
                }
            }            
        }
    }
    
    /**
     * _conteoDeCuadros
     * Función privada del orquestador que devuelve
     * el número del fotograma actual.
     */
    function _conteoDeCuadros() {
        return _cuadros;
    }
    
    /**
     * _orquestarActo1
     * Función orquestadora del acto #1: "Preparación"
     */
    function _orquestarActo1() {
        if (!_utilizaP5) {
            _funcionPreparacion();
        }
    }
    
    /**
     * _orquestarActo2
     * Función orquestadora del acto #2: "Iniciación"
     */
    function _orquestarActo2() {
        if (!_utilizaP5) {
            _funcionIniciacion();
        }
    }
    
    /**
     * _orquestarActo3
     * Función orquestadora del acto #3: "Ejecución"
     */
    function _orquestarActo3() {
        if (!_utilizaP5) {
            _funcionEjecucion();
        }
    }
        

    /**
     * verificacionPosActo2
     * Función ejecutar las verificaciones y configuraciones
     * finales antes de dar inicio al bucle de reproducción.
     */
    function verificacionPosActo2() {
        // Verificación de "uniform" para el tiempo
        _valorUniformTiempo = _escena.uniformTiempo();
        if (_valorUniformTiempo === undefined) {
            _valorUniformTiempo = _escena.uniformTiempo(CONFIG.UNIFORM_TIEMPO);
        }
        
        // Verificación del "uniform" para la resolución 
        _valorUniformResolucion = _escena.uniformResolucion();
        if (_valorUniformResolucion === undefined) {
            _valorUniformResolucion = _escena.uniformResolucion(CONFIG.UNIFORM_RESOLUCION);
        }
        
        // Verificación del "uniform" para el mouse
        _valorUniformMouse = _escena.uniformMouse();
        if (_valorUniformMouse === undefined) {
            _valorUniformMouse = _escena.uniformMouse(CONFIG.UNIFORM_MOUSE);
        }
        
        // Definición de la función para seguimiento del movimiento del mouse
        const _movimientoMouse = (evt) => {
            _valorUniformMouse[CONFIG.UNIFORM_VALOR].x = evt.offsetX / _valorUniformResolucion[CONFIG.UNIFORM_VALOR].x;
            _valorUniformMouse[CONFIG.UNIFORM_VALOR].y = evt.offsetY / _valorUniformResolucion[CONFIG.UNIFORM_VALOR].y;
            if (_utilizaP5) {
                _escena.uniformMouseP5(_valorUniformMouse[CONFIG.UNIFORM_VALOR]);
            }
        };
        _contenedor.seguimientoMouse(_movimientoMouse);
    }

    /**
     * verificacionPreActo3
     * Función actualiza el contexto de ejecución en cada iteración
     * del bucle, justo antes de ejecutar el "Acto 3".
     */
    function verificacionPreActo3() {
        if (_contenedor && _escena) {
            // Primero, se verifica si cambiaron las dimensiones del contenedor
            if (_contenedor.actualizar()) {
                // Se actualizan las dimensiones de la escena
                _escena.dimensionar(_contenedor.geometria.ancho, _contenedor.geometria.alto);

                // Actualización del "uniform" para la resolución
                if (_valorUniformResolucion) {
                    _valorUniformResolucion[CONFIG.UNIFORM_VALOR].x = _contenedor.geometria.ancho;
                    _valorUniformResolucion[CONFIG.UNIFORM_VALOR].y = _contenedor.geometria.alto;
                    if (_utilizaP5) {
                        _escena.uniformResolucionP5(_valorUniformResolucion[CONFIG.UNIFORM_VALOR]);
                    }
                }
            }
            // Se actualiza el "uniform" para el tiempo
            if (_valorUniformTiempo) {
                _valorUniformTiempo[CONFIG.UNIFORM_VALOR] += _reloj.getDelta();
                if (_utilizaP5) {
                    _escena.uniformTiempoP5(_valorUniformTiempo[CONFIG.UNIFORM_VALOR]);
                }
            }
        }
    }
   
    
    /**
     * acto2ListoParaIniciar
     * Indica si el acto 2 está en condiciones de ser iniciado,
     * por ejempo, porque ya se cargaron los archivos.
     */
    function acto2ListoParaIniciar() {
        return !_funcionPreparacion || _actoPreparacionFinalizado;
    }
    
    
    /**
     * acto3ListoParaIniciar
     * Indica si se puede dar comienzo al bucle eterno del acto 3.
     */
    function acto3ListoParaIniciar() {
        return _actoEjecucionIniciado;
    }
    
    /**
     * processing
     * Indica si se debe utilizar la librería de "Processing"
     * (p5js) para la orquestación.
     */
    function processing() {
        return _utilizaP5;
    }
    
    /**
     * diferido
     * Permite gestionar el valor de un indicador que informa
     * si algunos de los actos ha sido diferido.
     */
    function diferido(diferir) {
        if (diferir !== undefined) {
            _diferido = diferir;
        }
        return _diferido;
    }
    
    
    // ==================================================================
    // ===> Se exponen únicamente las funciones públicas del orquestador 
    // ==> ("Revealing Module Pattern")
    // ==================================================================
    return {
            vincular,
            asociar,
            socorrista,
            funcionActuaria, 
            orquestar,
            verificacionPosActo2,
            verificacionPreActo3,
            acto2ListoParaIniciar,
            acto3ListoParaIniciar,
            processing,
            diferido
           };
}


export default Orquestador;