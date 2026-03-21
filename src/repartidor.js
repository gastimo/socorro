/*
 * =============================================================================
 * 
 *                      M Ó D U L O    R E P A R T I D O R
 * 
 * =============================================================================
 */
import CONFIG from './config';
import Reparto from './reparto';


/**
 * Repartidor
 * Un "Repartidor" es un caso particular de "Reparto" con un único "Actor", es
 * decir es un objeto "Reparto" donde la cantidad de actores es igual a uno. 
 * A este "Actor" se lo denomina "Influenciador" ya que es capaz de alterar las
 * trayectorias de los restantes actores del "Reparto". Para conseguir este 
 * objetivo, el "Repartidor" incorpora el argumento "influencia" que indica la
 * fuerza de atracción o repulsión ejercida por el "Influenciador":
 * 
 * - INFLUENCIA > 0: es la magnitud de la fuerza con la que atrae a los otros "Actores".
 * - INFLUENCIA < 0: es la magnitud de la fuerza con la que aleja a los otros "Actores".
 *  
 * Por otro lado, al haber un único "Actor" ("Influenciador"), el valor del 
 * argumento "intervalo" del "Reparto" no es utilizado en absoluto, ya que el
 * "Influenciador" es creado la primera vez que el "Repartidor" es actualizado.
 */
function Repartidor(S, coreografia, intensidad, influencia, desvío, separacion) {
    const _RPD = Reparto(S, coreografia, 
                            1,            // cantidad   => 1 único actor ("influeciador") 
                            1,            // puestos    => 1 única posición de salida para el "influenciador"
                            intensidad,   // intensidad => Valor escalar que representa la magnitud de la velocidad
                            0,            // intervalo  => Como cantidad=1, no se requiere intervalo
                            desvío,       // desvío     => Ángulo de desvío en la dirección preestablecida por la coreo
                            separacion);  // separación => Distancia que separa al puesto de partida de la posición origen

    // Definición inicial de la "influencia" del "Repartidor"
    // (este valor es recalculado en cada iteración del ciclo)
    let _definicion = {};
    _definicion[CONFIG.RPT_INFLUENCIA] = influencia;
    _RPD.def(_definicion);

    // Se marca al "Reparto" como la entidad generadora del "Influenciador"
    _RPD[CONFIG.RPD_INFLUENCIADOR] = true;
    
    return _RPD;
}

export default Repartidor;