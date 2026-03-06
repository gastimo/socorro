/*
 * =============================================================================
 * 
 *                   M Ó D U L O    R E P R E S E N T A D O R
 * 
 * =============================================================================
 */

/**
 * Representador
 * Colección de métodos "Representadores de Actores". Se trata de un objeto JS
 * donde cada clave es el nombre de un método representador y su valor es la
 * función encargada de llevar adelante la representación visual del "Actor" o 
 * su dibujo en la "Escena". Todas funciones esperan recibir un "Actor" como 
 * único argumento. Esta colección de representadores se expone a través del
 * socorrista designado para la "Escena" bajo el nombre "REP". 
 * Ejemplos:
 * 
 *    S.O.S.REP.estandar  : método estándar de representación de "Actores" (círculos)
 *    S.O.S.REP.linea     : método de representación a través de lineas
 *    S.O.S.REP.romboide  : método de representación mediante rombos
 *    ...
 */
const Representador = (S) => { 

    const _REP = {};
    
    const ESTANDAR  = "estandar";
    const LINEA     = "linea";
    const ROMBOIDE  = "romboide";
    const ESTRELLA  = "estrella";
    const DANDELION = "dandelion";
    const ESPINA    = "espina";
    const PLUMA     = "pluma";

    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: estandar
//  Simplemente dibuja un círculo por cada actor.
//  
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[ESTANDAR] = (actor) => {
    if (actor.estilo.grandor !== undefined && actor.estilo.grandor !== null) {
        if (actor.estilo.color !== undefined && actor.estilo.color !== null)
            S.O.S.P5.fill(actor.estilo.color);
        else
            S.O.S.P5.noFill();

        if (actor.estilo.trazo !== undefined && actor.estilo.trazo !== null)
            S.O.S.P5.stroke(actor.estilo.trazo);
        else
            S.O.S.P5.noStroke();

        if (actor.estilo.grosor !== undefined && actor.estilo.grosor !== null)
            S.O.S.P5.strokeWeight(S.O.S.escalar(actor.estilo.grosor));

        S.O.S.P5.circle(actor.posicion.x ? S.O.S.escalar(actor.posicion.x) : 0, 
                        actor.posicion.y ? S.O.S.escalar(actor.posicion.y) : 0, 
                        S.O.S.escalar(actor.estilo.grandor));
    }
};

    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: linea
//  Conectar un actor con el siguiente mediante líneas
//  rectas, sin dibujar ninguna otra figura.
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[LINEA] = (actor) => {
    S.O.S.P5.noFill();
    if (actor.estilo.trazo  !== undefined && actor.estilo.trazo  !== null &&
        actor.estilo.grosor !== undefined && actor.estilo.grosor !== null) {
        S.O.S.P5.stroke(actor.estilo.trazo);
        S.O.S.P5.strokeWeight(S.O.S.escalar(actor.estilo.grosor));
        if (actor.sig) {
            S.O.S.P5.line(actor.posicion.x, actor.posicion.y, actor.posicion.z, 
                          actor.sig.posicion.x, actor.sig.posicion.y, actor.sig.posicion.z);
        }
    }
};
    
    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: romboide
//  Dibuja un cuadrado (rotado) por cada actor.
//  
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[ROMBOIDE] = (actor) => {
    if (actor.estilo.grandor !== undefined && actor.estilo.grandor !== null) {
        S.O.S.P5.push();
        if (actor.estilo.color !== undefined && actor.estilo.color !== null)
            S.O.S.P5.fill(actor.estilo.color);
        else
            S.O.S.P5.noFill();

        if (actor.estilo.trazo !== undefined && actor.estilo.trazo !== null)
            S.O.S.P5.stroke(actor.estilo.trazo);
        else
            S.O.S.P5.noStroke();

        if (actor.estilo.grosor !== undefined && actor.estilo.grosor !== null)
            S.O.S.P5.strokeWeight(S.O.S.escalar(actor.estilo.grosor));

        S.O.S.P5.rotate(S.O.S.P5.PI/4);
        let _lado = S.O.S.escalar(actor.estilo.grandor);
        S.O.S.P5.rect((actor.posicion.x ? S.O.S.escalar(actor.posicion.x) : 0) - (_lado / 2), 
                      (actor.posicion.y ? S.O.S.escalar(actor.posicion.y) : 0) - (_lado / 2), 
                       _lado, _lado);
        S.O.S.P5.pop();
    }
};
   

// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: estrella
//  
//  
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[ESTRELLA] = (actor) => {
};

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: dandelion
//  
//  
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[DANDELION] = (actor) => {
};

        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: espina
//  
//  
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[ESPINA] = (actor) => {
};
        
        
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: pluma
//  
//  
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[PLUMA] = (actor) => {
};

        

    return _REP;
};


export default Representador;