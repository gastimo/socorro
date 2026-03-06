/*
 * =============================================================================
 * 
 *                   M Ó D U L O    C O R E O G R A F I A
 * 
 * =============================================================================
 */

const Coreografia = (S) => { 
    
    const EXPELENTE   = "EXPELENTE";
    const CONCURRENTE = "CONCURRENTE";
    
    const _COREOS = {};
    _COREOS.estandar = () => {return EXPELENTE;};
    
        
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
    const corrimiento = S.O.S.Vector(separacion, 0, 0);
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