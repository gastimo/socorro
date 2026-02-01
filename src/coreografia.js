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
radial : (actor) => {
},

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: axial
//  Disposición de los actores a lo largo de una línea
//  haciendo que se desplazen perpendicularmente respecto
//  de ella.
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
axial : (actor) => {
},

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  COREOGRAFÍA: ortogonal
//  Disposición de los actores sobre los borden del 
//  rectángulo que forma el lienzo y haciendo que se
//  desplacen hacia el centro.
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
orotogonal : (actor) => {
},

    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    };
    return _COREO;
};


export default Coreografia;