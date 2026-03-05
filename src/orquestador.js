/*
 * =============================================================================
 * 
 *                      M Ó D U L O    O R Q U E S T A D O R
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Repertorio from './repertorio';
import Auxiliadora from './auxiliadora';


/**
 * Orquestador
 * Se encarga de ir ejecutando, en el orden adecuado y sin producir superposiciones, 
 * cada uno de los actos de la función. La "Función Actuaria" es simplemente una 
 * función JavaScript que especifica las funciones (actos) que se deben llevar a 
 * cabo. El orquestador está preparado para coordinar tres actos:
 * - ACTO 1 ("Preparación"): Cargar archivos que van a utilizarse.
 * - ACTO 2 ("Iniciación"): Configuración y armado inicial de la escena.
 * - ACTO 3 ("Ejecución"): Despliegue (cuadro a cuadro) de la escena.
 * 
 * El orquestador debe garantizar que cada acto haya concluido efectivamente antes 
 * de comenzar con el siguiente. Esto es importante, principalmente con el "Acto 1", 
 * ya que todos los archivos deben estar cargados antes de iniciar el "Acto 2".
 * 
 * Si se indica el uso de la librería de "Processing" (p5js) se le delega, entonces, 
 * la orquestación a esta librería.
 */
function Orquestador(sos, contenedor) {
    const S = sos.socorrista();
    let   _utilizaP5 = false;

    // Variables para la "Escena"
    let   _escena;
    let   _escenaImportada;
    let   _funcionActuaria;
    let   _contenedor = contenedor;
    
    // Variables para el procesamiento del ciclo de representación
    let   _cuadros = 0;
    let   _reloj;
    
    // Variables para los actos (funciones) a ser orquestados
    let   _funcionPreparacion;
    let   _funcionIniciacion;
    let   _funcionEjecucion;
    let   _actoPreparacionIniciado = false;
    let   _actoPreparacionFinalizado = false;
    let   _actoIniciacionIniciado = false;
    let   _actoEjecucionIniciado = false;
    let   _acto$3Diferido = false;
    
    // Valores de los "uniforms" estándares
    let   _valorUniformTiempo;
    let   _valorUniformResolucion;
    let   _valorUniformMouse;

    
    
// =====================================================================
// 
//  DEFINICIÓN DEL OBJETO PARA ALMACENAR ARCHIVOS DE TEXTO
//  
// =====================================================================

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

    
// =====================================================================
// 
//  DEFINICIÓN DEL GESTOR PARA LA CARGA DE ARCHIVOS ("CARGADOR")
//  
// =====================================================================

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
            return cargarArchivo(archivo);
        }

        function cargarArchivo(archivo) {
            let _archivo = Archivo(archivo);
            _archivos.push(_archivo);
            _leerArchivo(archivo, _archivo);
            return _archivo;
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
        
        return {cargarArchivo, cargarShader, cargarTextura2D, cargarFuente, cargaCompletada};
    }
        
    
// =====================================================================
// 
//  ORQUESTADOR
//  Definición de los métodos propios del objeto "Orquestador"
//  
// =====================================================================
    
    /**
     * processing
     * Indica si se debe utilizar la librería "p5js" para la orquestación.
     */
    function processing() {
        return _utilizaP5;
    }
  
    /**
     * vincular
     * Mediante esta función se actualiza la estructra del socorrista designado por el "Orquestador" para 
     * vincularlo con la "Escena" que debe orquestar, es decir, a través del mecanismo de "herencia por 
     * prototipos" de JS, toda la información y métodos de la "Escena" queda accesible directamente desde 
     * el propio socorrista. En otras palabras, el socorrista designado se convierte en la propia "Escena".
     * 
     * También se ponen a disposición del usuario los "Repertorios" necesarios:
     * - S.O.S.REP       : Colección de "Representadores" (funciones para representación de "Actores")
     * - S.O.S.COREO     : Colección de "Coreografías" (disposición y desplazamiento de "Actores" de un "Reparto")
     * - S.O.S.COLOR     : Listado de gradientes de colores preestablecidos 
     * 
     * Por último, se inyectan funciones de asistencia adicionales para la "Escena":
     * - Cargador        : Se habilitan los métodos de ayuda para la carga de archivos de la "Escena".
     * - Auxiliadora     : Se publica la colección de funciones de asistencia general para las "entidades del socorro".
     */
    function vincular(escena) {
        _escena = escena;
        const _repertorios = Repertorio(S);
        asociar('Repertorio', _repertorios.funciones());   // Para la personalización de repertorios
        S.O.S.revelar(S.O.S, _repertorios.publicar(), Auxiliadora(S, _utilizaP5), Cargador(), escena);
    }  
    
    /**
     * asociar
     * Asocia componentes como parte del socorrista designado. Básicamente, permite asociar
     * la instancia de la librería P5 y de Three.js que le corresponden a la "Escena".
     */
    function asociar(nombre, componente) {
        if (nombre == 'THREE') {
            S.O.S.THREE = componente;
            _reloj = new S.O.S.THREE.Clock();
        }
        else if (nombre == 'P5') {
            S.O.S.P5 = componente;
            _utilizaP5 = true;
        }
        else {
            S.O.S[nombre] = componente;
        }
    }    
    
    /**
     * socorrista
     * Devuelve el socorrista designado para atender los menesteres 
     * de la orquestación de la escena.
     */
    function socorrista() {
        return S;
    }
    
    /**
     * _conteoDeCuadros
     * Función privada del orquestador que devuelve el número del fotograma actual.
     * En caso de utilizar la librería "p5js" esta tarea es realizada por "frameCount".
     */
    function _conteoDeCuadros() {
        return _cuadros;
    }


    
// ==============================================================
// 
//  FUNCIÓN ACTUARIA
//  Define la "Función Actuaria" que contiene los "Actos" de la
//  "Escena". En caso de utilizar "p5js", la "Función Actuaria"
//  devuelta es justamente el parámetro requerido al crear la
//  instancia de "p5".
//  
// ==============================================================
    
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
    

    
// -----------------------------------------------------------------
//
//  ORQUESTACIÓN DE LA ESCENA
//  Rutina principal invocada por el socorrista (S.O.S) que se ocupa
//  de determinar qué acto de la "Escena" debe ser iniciado.
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    
    /**
     * orquestar
     * Encargada de ir ejecutando, paso a paso y en orden, cada uno de los actos
     * indicados por la "Función Actuaria". Debe asegurarse que la "Preparación"
     * concluya (la carga de archivos de manera asincrónica) antes de avanzar con 
     * el siguiente acto. Sólo una vez que el acto de "Preparación" y el acto de
     * "Iniciación" hubieran finalizado, dará inicio al bucle de la "Ejecución".
     */
    function orquestar() {
        if (_actoEjecucionIniciado && _funcionEjecucion) {
            _orquestarACTO$3();
            _cuadros++;
        }
        else {
            if (_funcionPreparacion && !_actoPreparacionIniciado) {
                _orquestarACTO$1();
                _actoPreparacionIniciado = true;
                return;
            }
            else if (_funcionPreparacion && _actoPreparacionIniciado && !_actoPreparacionFinalizado) {
                _actoPreparacionFinalizado = _escena && S.O.S.cargaCompletada();
                return;
            }
            if (_funcionIniciacion && !_actoIniciacionIniciado) {
                if (!_funcionPreparacion || _actoPreparacionFinalizado) {
                    _orquestarACTO$2();
                    _actoIniciacionIniciado = true;
                    return;
                }
            }
            if (_funcionEjecucion && !_actoEjecucionIniciado) {
                if ((!_funcionPreparacion && !_funcionIniciacion) || 
                    (_funcionPreparacion && _actoPreparacionFinalizado && !_funcionIniciacion) ||
                    _actoIniciacionIniciado) {
                    _orquestarACTO$3();
                    _actoEjecucionIniciado = true;
                    _cuadros++;  // Se incrementa el contador de cuadros/fotogramas
                    return;
                }
            }            
        }
    }
    
    /**
     * _orquestarACTO$1
     * Función orquestadora del acto #1: "Preparación"
     */
    function _orquestarACTO$1() {
        if (!_utilizaP5)
            _funcionPreparacion();
    }
    
    /**
     * _orquestarACTO$2
     * Función orquestadora del acto #2: "Iniciación"
     */
    function _orquestarACTO$2() {
        if (!_utilizaP5)
            _funcionIniciacion();
    }
    
    /**
     * _orquestarACTO$3
     * Función orquestadora del acto #3: "Ejecución"
     */
    function _orquestarACTO$3() {
        if (!_utilizaP5)
            _funcionEjecucion();
    }
        

    
// -----------------------------------------------------------------
//
//  FUNCIONES "SEMÁFORO" Y DE "APLAZAMIENTO"
//  Dan "luz verde" para el inicio del siguiente "Acto" una vez
//  concluidas todas las acciones del acto anterior. Son invocadas
//  externamente por el socorrista (S.O.S) y no por el orquestador.
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    /**
     * semaforoACTO$2
     * Indica si el acto 2 está en condiciones de ser iniciado,
     * por ejemplo, porque ya se cargaron los archivos.
     */
    function semaforoACTO$2() {
        return !_funcionPreparacion || _actoPreparacionFinalizado;
    }
    
    /**
     * semaforoACTO$3
     * Indica si se puede dar comienzo al bucle eterno del acto 3.
     */
    function semaforoACTO$3() {
        return _actoEjecucionIniciado;
    }

    /**
     * aplazarACTO$3
     * Permite gestionar el valor de un indicador de aplazamiento para diferir 
     * el inicio del "Acto 3". Esta función es utilizada por el socorrista
     * (S.O.S) para instruir al "Orquestador" que el "Acto 3" debe ser diferido
     * hasta que se indique lo contrario. 
     */
    function aplazarACTO$3(diferir) {
        if (diferir !== undefined) {
            _acto$3Diferido = diferir;
        }
        return _acto$3Diferido;
    }


// -----------------------------------------------------------------
//
//  FUNCIONES "PRE" Y "POS" ACTOS
//  Ejecutan las tareas requeridas luego de la finalización de 
//  un acto (POS) o previo a su ejecución (PRE). Son invocadas
//  externamente por el socorrista (S.O.S) y no por el orquestador.
// 
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    /**
     * posACTO$2
     * Función ejecutar las verificaciones y configuraciones
     * finales antes de dar inicio al bucle de reproducción.
     */
    function posACTO$2() {
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
    
        // Actualizar las variables "uniform" de la resolución
        _actualizarUniformResolucion();

        // Definición de la función para seguimiento del movimiento del mouse
        const _movimientoMouse = (evt) => {
            _valorUniformMouse[CONFIG.UNIFORM_VALOR].x = evt.offsetX / _valorUniformResolucion[CONFIG.UNIFORM_VALOR].x;
            _valorUniformMouse[CONFIG.UNIFORM_VALOR].y = evt.offsetY / _valorUniformResolucion[CONFIG.UNIFORM_VALOR].y;
            if (_utilizaP5) {
                _escena.uniformMouseP5(_valorUniformMouse[CONFIG.UNIFORM_VALOR]);
            }
        };
        _contenedor.seguimientoMouse(_movimientoMouse);
        
        // Inicializar los shaders (ya sea de p5js o de Three.js)
        _escena.iniciarGLSL();
    }

    /**
     * preACTO$3
     * Función que actualiza el contexto de ejecución en cada iteración
     * del bucle, justo antes de cada ejecuación del "Acto 3".
     */
    function preACTO$3() {
        if (_contenedor && _escena) {            
            // Se verifica si cambiaron las dimensiones del contenedor
            if (_contenedor.actualizar()) {
                // Actualización de las dimensiones de la "Escena" y las variables "uniform" de resolución
                _escena.dimensionar(_contenedor.geometria.ancho, _contenedor.geometria.alto);
                _actualizarUniformResolucion();
            }

            // Se actualiza el "uniform" para el tiempo
            _actualizarUniformTiempo();
         
            // Actualizar la "Escena" y aplicar sus atributos de "Estilo" (si corresponde)
            _escena.actualizar();
            _escena.estilar();
        }
    }

    
    
// -----------------------------------------------------------------
//
//  VARIABLES UNIFORM DE GLSL
//  Métodos para la actualización de los valores de las variables 
//  "uniform" (shaders), en cada iteración del ciclo de "Ejecución".
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        
    /**
     * _actualizarUniformResolucion
     * Función interna que se ocupa de actualizar los valores de las variables
     * "uniform" que almacenan la resolución del lienzo.
     */
    function _actualizarUniformResolucion() {
        if (_valorUniformResolucion) {
            _valorUniformResolucion[CONFIG.UNIFORM_VALOR].x = _contenedor.geometria.ancho;
            _valorUniformResolucion[CONFIG.UNIFORM_VALOR].y = _contenedor.geometria.alto;
            if (_utilizaP5) {
                _escena.uniformResolucionP5(_valorUniformResolucion[CONFIG.UNIFORM_VALOR]);
            }
        }
    }

    /**
     * _actualizarUniformTiempo
     * Función interna que se ocupa de actualizar el valor del "uniform" del tiempo
     */
    function _actualizarUniformTiempo() {
        if (_valorUniformTiempo) {
            _valorUniformTiempo[CONFIG.UNIFORM_VALOR] += _reloj.getDelta();
            if (_utilizaP5) {
                _escena.uniformTiempoP5(_valorUniformTiempo[CONFIG.UNIFORM_VALOR]);
            }
        }
    }
    
    
    // ==================================================================
    // ===> Se exponen únicamente las funciones públicas del orquestador 
    // ==> ("Revealing Module Pattern")
    // ==================================================================
    return {
            processing,
            socorrista,
            vincular,
            asociar,
            funcionActuaria, 
            orquestar,
            aplazarACTO$3,
            semaforoACTO$2,
            semaforoACTO$3,
            posACTO$2,
            preACTO$3
           };
}


export default Orquestador;