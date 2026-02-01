/*
 * =============================================================================
 * 
 *                       M Ó D U L O     D E S G L O S E
 * 
 * =============================================================================
 */
import CONFIG from './config';


/**
 * Desglose
 * Listado del elenco de "Actores" participantes de la "Escena", organizado en 
 * la forma de fichas que detallan la información de cada "Actor" y los "Repartos" 
 * que componen la "Escena". Las fichas de los "Repartos" tienen una estructura
 * jerárquica donde la "Escena" figura siempre en el primer nivel y, a partir de
 * ésta, se desglosan los diferentes "Repartos" o "Actores" intervinientes.
 */
function Desglose(S, escena) {
    const _DES      = {};
    const _repartos = {};   // Organización jeráquica de "Repartos" y "Actores"
    const _registro = {};   // Registro -plano- de todos los objetos Escena/Reparto/Actor
    
    // La "Escena" encabeza siempre las fichas de los repartos
    _registro[escena.identificador] = escena;  
    
    
    /**
     * fichar
     * Actualiza las fichas del "Desglose" para almacenar la información del actuante
     * recibido como argumento (un "Actor" o un "Reparto") y su relación con el objeto 
     * "encabezador" al que pertenece (el "encabezador" es el actuante que encabeza el
     * "Reparto" y puede ser un "Actor" u otro "Reparto").
     * Los "Repartos" se organizan de forma jerárquica. En el nivel superior del desglose
     * se ubica siempre la "Escena". Dentro de ésta, se pueden incorporar "Actores" 
     * individuales o "Repartos" (haciendo referencia a ambos objetos como "actuantes").
     * Cualquiera de estos actuantes pueden, a su vez, contener a otros "Actores" o, 
     * incluso, "Repartos" convirtiéndose, así, en una jerarquía de "Subrepartos".
     * 
     * ARGUMENTOS:
     *  - claveEncabezador  : identificador del actuante que hace de cabeza del
     *                        elenco: la escena, un reparto u otro actor.
     *  - actuante          : Actor o reparto para el que que se quiere añadir una ficha
     *                        en el desglose (debajo del actuante que es cabeza de reparto).
     *  - esquema           : Esquema (o subesquema) del objeto encabezador (escena, 
     *                        reparto o actor) que contiene al actuante del argumento anterior.
     *  - nombreAtributo    : Nombre del atributo dentro del esquema del argumento 
     *                        anterior (encabezador) que contiene al actuante.
     *  - compania          : (opcional) nombre del atributo que contiene al arreglo
     *                        donde se encuentra alojado el actuante a ser fichado.
     * 
     * NOTA: Los argumentos "esquema" y "nombreAtributo" son los localizadores que
     *       permiten ubicar al actuante a fichar dentro del actuante "encabezador".
     */
    _DES.fichar = (claveEncabezador, actuante, esquema, nombreAtributo, compania) => {
        
        // Si el actuante no es un "Actor" o un "Reparto", no se hace nada
        if (S.O.S.esUnActor(actuante) || S.O.S.esUnReparto(actuante)) {
            let _fichaReparto, _fichaActuante, _ordenActuante;
            
            // ------------------------------------------------------------------------------
            //  FICHA DEL REPARTO
            //  Se crea (o actualiza) la ficha del "Reparto", o sea, la ficha que define el
            //  conjunto de "Actores" y "Subrepartos" que componen un determinado "Reparto".
            //  La ficha es indexada por la clave del "encabezador", es decir, se crea una
            //  ficha por cada cabeza de reparto (ya sea un "Actor" o un "Reparto").
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (!_repartos.hasOwnProperty(claveEncabezador)) {
                _repartos[claveEncabezador] = {
                    orden    : Object.keys(_repartos).length,  // Orden = cantidad de repartos creados
                    actores  : [],    // Actores del reparto encabezado por el actuante "Encabezador"
                    repartos : []     // Subrepartos del reparto encabezado por el actuante "Encabezador"
                   };
            }
            _fichaReparto = _repartos[claveEncabezador];
            if (S.O.S.esUnActor(actuante)) {
                _fichaReparto.actores.push(actuante);
                _ordenActuante = _fichaReparto.actores.length - 1;
            }
            else if (S.O.S.esUnReparto(actuante)) {
                _fichaReparto.repartos.push(actuante);
                _ordenActuante = _fichaReparto.repartos.length - 1;
            }

            // ---------------------------------------------------------------------------------
            // FICHA DEL ACTOR / FICHA DEL REPARTO
            // Un actuante es cualquier "Actor" o "Reparto" que forma parte de una "Escena".
            // Además, un "Actor" o un "Reparto" pueden, a su vez, contener a otros "Actores"
            // y "Repartos", convirtiéndose, de esta manera, en "subrepartos" (jerarquía).
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _fichaActuante = {encabezador : claveEncabezador,
                              reparto     : _fichaReparto,
                              orden       : _ordenActuante,
                              subesquema  : esquema,
                              atributo    : nombreAtributo,
                              compania    : compania};
            if (S.O.S.esUnActor(actuante)) {
                _fichaActuante.puesto    = undefined; // Número de puesto del "Actor" en el "Reparto"
                _fichaActuante.anterior  = undefined; // Actor anterior del reparto/subreparto
                _fichaActuante.siguiente = undefined; // Actor siguiente del reparto/subreparto
            }

            // ---------------------------------------------
            //  Finalmente, se asigna la ficha al actuante
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            _registro[actuante.identificador] = actuante;
            actuante.INFO = _fichaActuante;
        }
    };

    _DES.actualizar = () => {
        for (const [identificador, ficha] of Object.entries(_repartos)) {
            for (let i = 0; i < ficha.actores.length; i++) {
                ficha.actores[i].actualizar();
            }
        }
    };

    _DES.representar = () => {
        for (const [identificador, ficha] of Object.entries(_repartos)) {
            for (let i = 0; i < ficha.actores.length; i++) {
                ficha.actores[i].representar();
            }
        }            
    };

    return _DES;
}


export default Desglose;