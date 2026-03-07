/*
 * =============================================================================
 * 
 *                   M Ó D U L O    C O R E O G R A F I A
 * 
 * =============================================================================
 */
import CONFIG from './../config';


/**
 * Coreografías
 * Colección de métodos para coreografiar el desplazamiento de "Actores" en "Escena". 
 * Se trata de un objeto JavaScript donde cada clave es el nombre de una "Coreogragía"
 * y su valor es la función responsable de definir la posición inicial del "Actor" en
 * el lienzo y su velocidad de desplazamiento.
 * 
 * Esta colección de "Coreografías" forma parte de los "Repertorios" de la "Escena"
 * y, por lo tanto, se expone a través del socorrista designado bajo el nombre "COREO". 
 * Ejemplos:
 * 
 *    S.O.S.COREO.EXPELENTE   : los "Actores" son impulsados desde el centro del "Reparto" hacia afuera
 *    S.O.S.COREO.CONCURRENTE : los "Actores" son atraídos desde afuera hacia el centro del "Reparto"
 * 
 */
const Coreografia = (S) => { 
    
// ----------------------------------------------------
//  Nombres de las "Coreografías" predefinidas
// ----------------------------------------------------
    const EXPELENTE   = "EXPELENTE";
    const CONCURRENTE = "CONCURRENTE";
// ----------------------------------------------------
    const _COREOS = {};
// -----------------------------------------------------

    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  CONFIGURACIÓN DE LA COREOGRAFÍA ESTÁNDAR
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 _COREOS[CONFIG.ESTANDAR] = (actor, cantidad, puestos, intensidad, desvio, separacion) => {
     return _COREOS[EXPELENTE](actor, cantidad, puestos, intensidad, desvio, separacion);
 };
    
    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: "EXPELENTE"
//  Los "Actores" ingresan a "Escena" desde el punto central 
//  del "Reparto" y son impulsados hacia afuera, hacia los 
//  bordes del lienzo de la "Escena".
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 _COREOS[EXPELENTE] = (actor, cantidad, puestos, intensidad, desvio, separacion) => {
    // Se calcula el ángulo en función de la cantidad de puestos
    const angulo = (puestos <= 1 ? 0 : 2 * Math.PI / puestos * actor.puesto) + desvio;
    
    // A partir del ángulo (dirección), se calcula el vector de separación
    const corrimiento = S.O.S.Vector(S.O.S.escalar(separacion), 0, 0);
    corrimiento.ang(angulo);
    
    // Luego, con el mismo ángulo (o dirección), se define el vector de velocidad
    const velocidad = S.O.S.Vector(intensidad, 0, 0);
    velocidad.ang(angulo);
    
    // Finalmente, a la posición origen (centro del lienzo) se le suma la separación
    const origen = S.O.S.Vector(0, 0, 0);
    origen.sumar(corrimiento);
    
    // Se actualiza el origen y la velocidad del "Actor" recibido como argumento
    actor.defOrigen(origen);
    actor.defVelocidad(velocidad);
};

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: "CONCURRENTE"
//  Los "Actores" ingresan a "Escena" desde afuera, desde los 
//  bordes exteriores del lienzo y son inducidos hacia el punto 
//  central del "Reparto".
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_COREOS[CONCURRENTE] = (actor, cantidad, puestos, intensidad, desvio, separacion) => {
};
    
    
    return _COREOS;
};


export default Coreografia;