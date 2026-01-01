/*
 * =============================================================================
 * 
 *                         M Ó D U L O    E S Q U E M A
 * 
 * =============================================================================
 */
import CONFIG from './config';

const ESQUEMA_VAL = "__ESQUEMA__";
const ESQUEMA_DEF = "__ESQUEMA_DEF__";


/**
 * Esquema
 * Un esquema es un objeto genérico para almacenar datos junto con sus metadatos.
 * Cualquier objeto que extienda de un esquema, puede ser inicializado mediante
 * sus valores por defecto, importado y exportado en formato JSON. Al almacenar
 * su metadata (la "Definición" del propio esquema) se vuelve un objeto útil para 
 * construir la GUI del "Panel Controlador" que permita visualizar y modificar los 
 * valores de sus atributos en tiempo real.
 * 
 * Internamente el esquema almacena:
 * - Definición: la metadata que especifica la lista de atributos 
 *                que lo conforman y sus valores por defecto.
 * - Contenido : los valores de cada uno de los atributos que lo 
 *               componen (como una colección de pares atributo-valor).
 */
const Esquema = (sos, nombre) => {
    const S = sos.socorrista();
    const _nombre = nombre ?? CONFIG.NOMBRE_ESQUEMA;
    const _clave = S.O.S.obtenerClave(_nombre);
    let _visible = true;

    // Estructuras para almacenar la "Definición" del esquema
    // y sus valores (la colección de pares "Atributo-Valor").
    const _esquema = [];
    _esquema[ESQUEMA_DEF] = {};
    _esquema[ESQUEMA_VAL] = {};
    _esquema[ESQUEMA_VAL].sincronizado = true;


    /**
     * inicializar
     * Función que crea la "Definición" del esquema asociado a la escena.
     * Los atributos que se inicialicen en este punto podrán ser importados,
     * exportados y/o manipulados desde la GUI del "Panel Conrolador".
     */
    function inicializar() {
    }
  
    /**
     * sincronizar
     * Marca internamente al esquema para indicar que sus contenidos ya 
     * fueron sincronizados. Esto quiere decir que los valores del objeto 
     * esquema concuerdan con los contenidos almacenados en la colección de
     * pares "atributo-valor" que se mantiene dentro del propio esquema.
     */
    function sincronizar() {
      _esquema[ESQUEMA_VAL].sincronizado = true;
    }

    /**
     * estaSincronizado
     * Indica si los contenidos del esquema están sincronizados.
     */
    function estaSincronizado() {
      return _esquema[ESQUEMA_VAL].sincronizado;
    }
  
    /**
     * esVisible
     * Indica si los contenidos del esquema pueden ser
     * ser visualizados (desplegados en pantalla).
     */
    function esVisible() {
      return _visible;
    }


    // ===============================================================
    // ===> Se exponen únicamente las funciones públicas del esquema 
    // ==> ("Revealing Module Pattern")
    // ===============================================================
    return {inicializar,
           sincronizar,
           estaSincronizado,
           esVisible,
           };
};


export default Esquema;