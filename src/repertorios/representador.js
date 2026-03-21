/*
 * =============================================================================
 * 
 *                   M Ó D U L O    R E P R E S E N T A D O R
 * 
 * =============================================================================
 */
import CONFIG from './../config';


/**
 * Representador
 * Colección de métodos "Representadores de Actores". 
 * Se trata de un objeto JavaScript donde cada clave es el nombre del "Representador"
 * y su valor es la función que se encarga de dibujar al "Actor" en el lienzo, es
 * decir, su representación visual. Las funciones de los "Representadores" esperan
 * recibir un objeto "Actor" como su único argumento.
 * 
 * Esta colección de "Representadores" forma parte de los "Repertorios" de la "Escena"
 * y, por lo tanto, se expone a través del socorrista designado bajo el nombre "REP". 
 * Ejemplos:
 * 
 *    S.O.S.REP.circulo  : método estándar de representación mediante círculos
 *    S.O.S.REP.linea    : método de representación a través de lineas
 *    S.O.S.REP.romboide : método de representación mediante rombos
 *    ...
 */
const Representador = (S) => { 
    
// ----------------------------------------------------
//  Nombres de los "Representadores" predefinidos
// ----------------------------------------------------
    const NINGUNO    = "ninguno";     // Actor invisible
    const CIRCULO    = "circulo";
    const CIRCULARIA = "circularia";
    const LINEA      = "linea";
    const ROMBOIDE   = "romboide";
    const INFLUJO    = "influjo";
    const ESTRELLA   = "estrella";
    const DANDELION  = "dandelion";
    const ESPINA     = "espina";
    const PLUMA      = "pluma";
// ----------------------------------------------------
    const _REP = {};
// -----------------------------------------------------


// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  CONFIGURACIÓN DEL REPRESENTADOR ESTÁNDAR
//  
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[CONFIG.ESTANDAR] = (actor) => {
    return _REP[CIRCULO](actor);
};

    

// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: circulo
//  Simplemente dibuja un círculo por cada actor.
//  
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[CIRCULO] = (actor) => {
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
//  REPRESENTADOR: circularia
//  Dibuja un círculo por cada actor pero, además, 
//  traza las conexiones con sus puntos de influencia.
// 
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[CIRCULARIA] = (actor) => {
    let _grosorDefinido = false;
    let _trazoDefinido  = false;

    // Función para trazar las líneas que conectan al "Actor" con sus puntos de influencia
    const _trazarConexiones = () => {
        if (actor.superior && actor.influencias) {
            S.O.S.P5.strokeWeight(1);
            if (!_trazoDefinido) {
                let _canal = actor.superior.clave * 71562373;
                S.O.S.P5.stroke('rgb(' + (_canal % 255) + ',' + (_canal % 241) + ',' + (_canal % 207) + ')');
            }
            for (let i = 0; i < actor.influencias.length; i++) {
                let _puntoI = actor.influencias[i];
                S.O.S.P5.line(S.O.S.escalar(actor.posicion.x), 
                              S.O.S.escalar(actor.posicion.y), 
                              S.O.S.escalar(actor.posicion.z), 
                              S.O.S.escalar(_puntoI.x),
                              S.O.S.escalar(_puntoI.y),
                              S.O.S.escalar(_puntoI.z));
            }
        }        
    };
    
    // Dibujo del "Actor" propiamente dicho (y sus conexiones por debajo)
    if (actor.estilo.grandor !== undefined && actor.estilo.grandor !== null) {
        if (actor.estilo.color !== undefined && actor.estilo.color !== null)
            S.O.S.P5.fill(actor.estilo.color);
        else
            S.O.S.P5.noFill();

        if (actor.estilo.trazo !== undefined && actor.estilo.trazo !== null) {
            S.O.S.P5.stroke(actor.estilo.trazo);
            _trazoDefinido = true;
        }
        else
            S.O.S.P5.noStroke();

        if (actor.estilo.grosor !== undefined && actor.estilo.grosor !== null) {
            S.O.S.P5.strokeWeight(S.O.S.escalar(actor.estilo.grosor));
            _grosorDefinido = true;
        }
        
        _trazarConexiones();
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
            S.O.S.P5.line(S.O.S.escalar(actor.posicion.x), 
                          S.O.S.escalar(actor.posicion.y), 
                          S.O.S.escalar(actor.posicion.z), 
                          S.O.S.escalar(actor.sig.posicion.x),
                          S.O.S.escalar(actor.sig.posicion.y),
                          S.O.S.escalar(actor.sig.posicion.z));
        }
        else if (actor.prev) {
            let superior = actor.superior ? actor.superior.entidad : undefined;
            if (superior && superior.primerActor) {
                // Se conecta el último "Actor" del "Reparto" con la posición origen
                // del primero (el último "Actor" es el más cercano al origen)
                S.O.S.P5.line(S.O.S.escalar(actor.posicion.x),
                              S.O.S.escalar(actor.posicion.y),
                              S.O.S.escalar(actor.posicion.z), 
                              S.O.S.escalar(superior.primerActor.origen.x),
                              S.O.S.escalar(superior.primerActor.origen.y),
                              S.O.S.escalar(superior.primerActor.origen.z));                
            }
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

        S.O.S.P5.translate((actor.posicion.x ? S.O.S.escalar(actor.posicion.x) : 0), 
                           (actor.posicion.y ? S.O.S.escalar(actor.posicion.y) : 0));
        S.O.S.P5.rotate(S.O.S.P5.PI/4);
        let _lado = S.O.S.escalar(actor.estilo.grandor);
        S.O.S.P5.rect(-(_lado / 2), -(_lado / 2), _lado, _lado);
        S.O.S.P5.pop();
    }
};
   
    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: influjo
//  Grafica, a través de líneas, las conexiones entre
//  el "Actor" y sun puntos de influencia.
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[INFLUJO] = (actor) => {
    if (actor.estilo.trazo  !== undefined && actor.estilo.trazo  !== null &&
        actor.estilo.grosor !== undefined && actor.estilo.grosor !== null) {
        S.O.S.P5.noFill();
        S.O.S.P5.stroke(actor.estilo.trazo);
        S.O.S.P5.strokeWeight(S.O.S.escalar(actor.estilo.grosor));
        for (let i = 0; i < actor.influencias.length; i++) {
            let _puntoI = actor.influencias[i];
            S.O.S.P5.line(S.O.S.escalar(actor.posicion.x), 
                          S.O.S.escalar(actor.posicion.y), 
                          S.O.S.escalar(actor.posicion.z), 
                          S.O.S.escalar(_puntoI.x),
                          S.O.S.escalar(_puntoI.y),
                          S.O.S.escalar(_puntoI.z));
        }
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
    
    
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
//  REPRESENTADOR: ninguno
//  No se dibuja absolutamente nada.
//  
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
_REP[NINGUNO] = (actor) => {
};

        
    return _REP;
};


export default Representador;