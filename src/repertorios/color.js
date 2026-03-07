/*
 * =============================================================================
 * 
 *                          M Ó D U L O    C O L O R
 * 
 * =============================================================================
 */

/**
 * Color
 * Este modulo contiene la definición de los gradientes de colores que se utilizan
 * durante el cálculo dinámico de los atributos de "Estilo" de los "Actores" de la
 * "Escena". Estos gradientes pueden emplearse tanto para la definición del color
 * de la figura a dibujar como de su trazo. Los "Gradientes" son simplemente arreglos
 * de objetos que contienen un color (atributo "val") y un valor entre 0 y 1 que 
 * representa la posición (o "parada") de dicho color en el gradiente. 
 * 
 *  GRADIENTE = [ {val: <color1>, pos: <parada1>},
 *                {val: <color2>, pos: <parada2>},
 *                 ...
 *                {val: <colorN>, pos: <paradaN>},
 *               ];
 * 
 * Esta colección de "Gradientes" forma parte de los "Repertorios" de la "Escena"
 * y, por lo tanto, se expone a través del socorrista designado bajo el nombre "COLOR". 
 * 
 *    S.O.S.COLOR.universal : definición de las "paradas" del gradiente denominado "universal"
 *    S.O.S.COLOR.flamingo  : definición de las "paradas" del gradiente denominado "flamingo"
 * 
 */
const Color = (S) => { 
    
    const _COLOR = {  
        
    // ----------------------------------------------------
    //  Nombres de los "Gradientes" predefinidos
    // ----------------------------------------------------
        CORALIA      : 'coralia',
        ESMERALDA    : 'esmeralda',
        UNIVERSAL    : 'universal',
        TIZADO       : 'tizado',
        LUCINTI      : 'lucinti',
        FLAMINGO     : 'flamingo',
        CADETE       : 'cadete',
    // ----------------------------------------------------

    };

    
    // -------------------------------------------------------------
    //
    //  DEFINICIÓN DE LOS GRADIENTES DE COLORES
    //
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes = {};
    
    
    // GRADIENTE: coralia
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.CORALIA] = 
               [{pos: 0.0,  val: S.O.S.P5.color('rgb(253,127,128)')},   // Coral 
                {pos: 0.14, val: S.O.S.P5.color('rgb(254,129,173)')},   // Rosa
                {pos: 0.34, val: S.O.S.P5.color('rgb(94,154,232)')},    // Azul 
                {pos: 0.5,  val: S.O.S.P5.color('rgb(253,127,128)')},   // Coral
                {pos: 0.58, val: S.O.S.P5.color('rgb(0,0,0)')},         // Negro
                {pos: 0.61, val: S.O.S.P5.color('rgb(193,217,243)')},   // Gris frio
                {pos: 0.8,  val: S.O.S.P5.color('rgb(94,154,232)')},    // Azul 
                {pos: 0.95, val: S.O.S.P5.color('rgb(0,104,200)')},     // Azul oscuro
                {pos: 1.0,  val: S.O.S.P5.color('rgb(0,0,0)')}];        // Negro

    // GRADIENTE: esmeralda
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.ESMERALDA] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#333')},     // Gris   
                {pos: 0.14, val: S.O.S.P5.color('#f3d3bd')},  // Durazno
                {pos: 0.34, val: S.O.S.P5.color('#5e5e5e')},  // Azul 
                {pos: 0.5,  val: S.O.S.P5.color('#48e5c2')},  // Verde
                {pos: 0.58, val: S.O.S.P5.color('#333')},     // Gris
                {pos: 0.61, val: S.O.S.P5.color('#fcfaf9')},  // Blanco
                {pos: 0.95, val: S.O.S.P5.color('#5e5e5e')},  // Azul oscuro
                {pos: 1.0,  val: S.O.S.P5.color('#333')}];    // Gris

    // GRADIENTE: universal
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.UNIVERSAL] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#c0bda5')},  // Pistacho
                {pos: 0.15, val: S.O.S.P5.color('#f39c6b')},  // Naranja
                {pos: 0.30, val: S.O.S.P5.color('#ff3864')},  // Rojo
                {pos: 0.45, val: S.O.S.P5.color('#261447')},  // Violeta
                {pos: 0.60, val: S.O.S.P5.color('#cc978e')},  // Rosa
                {pos: 0.75, val: S.O.S.P5.color('#f39c6b')},  // Naranja
                {pos: 0.90, val: S.O.S.P5.color('#c0bda5')},  // Pictacho
                {pos: 1.0,  val: S.O.S.P5.color('#261447')}]; // Violeta

    // GRADIENTE: tizado
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.TIZADO] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#efeee9')},  // Tiza
                {pos: 0.15, val: S.O.S.P5.color('#c5c4c1')},  // Gris claro
                {pos: 0.30, val: S.O.S.P5.color('#efeee9')},  // Tiza
                {pos: 0.45, val: S.O.S.P5.color('#7d7d7d')},  // Gris medio
                {pos: 0.60, val: S.O.S.P5.color('#efeee9')},  // Tizq
                {pos: 0.75, val: S.O.S.P5.color('#d7d6d2')},  // Gris más claro
                {pos: 0.90, val: S.O.S.P5.color('#efeee9')},  // Tiza
                {pos: 1.0,  val: S.O.S.P5.color('#efeee9')}]; // Gris

    // GRADIENTE: lucinti
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.LUCINTI] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#0C0B0B')},  // Gris oscuro
                {pos: 0.15, val: S.O.S.P5.color('#F1CE01')},  // Amarillo
                {pos: 0.60, val: S.O.S.P5.color('#0C0B0B')},  // Gris oscuro
                {pos: 0.75, val: S.O.S.P5.color('#978A82')},  // Gris medio
                {pos: 0.90, val: S.O.S.P5.color('#F1CE01')}, // Amarillo
                {pos: 1.0,  val: S.O.S.P5.color('#F1CE01')}]; // Amarillo


    // GRADIENTE: flamingo
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.FLAMINGO] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#BEFFF3')},  // Cian claro
                {pos: 0.15, val: S.O.S.P5.color('#57F1D6')},  // Cian
                {pos: 0.30, val: S.O.S.P5.color('#19E8C2')},  // Cian/turquesa
                {pos: 0.45, val: S.O.S.P5.color('#006f5a')},  // Verde oscuro
                {pos: 0.75, val: S.O.S.P5.color('#57F1D6')},  // Cian
                {pos: 0.90, val: S.O.S.P5.color('#ffaff6')},  // Rosa/magenta
                {pos: 1.0, val:  S.O.S.P5.color('#BEFFF3')}]; // Cian claro

    // GRADIENTE: cadete
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.CADETE] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#BAFF29')},  // Lima 
                {pos: 0.14, val: S.O.S.P5.color('#C2E7DA')},  // Menta
                {pos: 0.34, val: S.O.S.P5.color('#6290C3')},  // Azul plata
                {pos: 0.45, val: S.O.S.P5.color('#F1FFE7')},  // Lima claro
                {pos: 0.5,  val: S.O.S.P5.color('#BAFF29')},  // Lima
                {pos: 0.58, val: S.O.S.P5.color('#1A1B41')},  // Espacio oscuro
                {pos: 0.8,  val: S.O.S.P5.color('#6290C3')},  // Azul plata
                {pos: 0.88, val: S.O.S.P5.color('#C2E7DA')},  // Menta
                {pos: 0.95, val: S.O.S.P5.color('#F1FFE7')},  // Lima claro
                {pos: 1.0,  val: S.O.S.P5.color('#1A1B41')}]; // Espacio oscuro
    
    return _COLOR;
};

export default Color;