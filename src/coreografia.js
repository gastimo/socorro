/*
 * =============================================================================
 * 
 *                   M Ó D U L O    C O R E O G R A F I A
 * 
 * =============================================================================
 */

/**
 * Coreografia
 * Colección de funciones "Coreografías" utilizadas para definir las posiciones
 * y desplazamientos de los "Actores" de un "Reparto".
 * Esta colección de coreografías se expone a través del socorrista designado 
 * para la "Escena" bajo el nombre "COREO". Ejemplos:
 * 
 *   S.O.S.COREO.radial    : Disposición de los actores en un círculo (desplaz. exterior)
 *   S.O.S.COREO.axial     : Disposición de los actores a lo largo de una línea (desplaz. perpendicular)
 *   S.O.S.COREO.ortogonal : Disposición de los actores en los bordes del lienzo (desplaz. interior)
 *   ...
 */
const Coreografia = (S) => { 

    const _COREO = {
        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: radial
//  Disposición de los actores en un círculo y 
//  estableciendo su dirección hacia afuera de éste.
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
radial : (actor, cantidad, puestos, intensidad, desvio, separacion) => {
    // Se calcula el ángulo en función de la cantidad de puestos
    const angulo = (puestos <= 1 ? 0 : 2 * Math.PI / puestos * actor.orden) + desvio;
    
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
},

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: axial
//  Disposición de los actores a lo largo de una línea
//  haciendo que se desplazen perpendicularmente respecto
//  de ella.
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
axial : (actor, cantidad, puestos, intensidad, desvio, separacion) => {
},

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: ortogonal
//  Disposición de los actores sobre los borden del 
//  rectángulo que forma el lienzo y haciendo que se
//  desplacen hacia el centro.
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
orotogonal : (actor, cantidad, puestos, intensidad, desvio, separacion) => {
},

    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    };
    return _COREO;
};


export default Coreografia;