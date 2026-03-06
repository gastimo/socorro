/*
 * =============================================================================
 * 
 *                          M Ó D U L O    C O L O R
 * 
 * =============================================================================
 */

const Color = (S) => { 
    
    const _COLOR = {  
        
        // ----------------------------------------
        //  Nombres de los gradientes predefinidos
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        CORALIA      : 'coralia',
        ESMERALDA    : 'esmeralda',
        UNIVERSAL    : 'universal',
        TIZADO       : 'tizado',
        LUCINTI      : 'lucinti',
        FLAMINGO     : 'flamingo',
        CADETE       : 'cadete',

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
               [{pos: 0.0,  val: S.O.S.P5.color('rgb(253,127,128)')},   // coral 
                {pos: 0.14, val: S.O.S.P5.color('rgb(254,129,173)')},  // rosa
                {pos: 0.34, val: S.O.S.P5.color('rgb(94,154,232)')},   // azul 
                {pos: 0.5,  val: S.O.S.P5.color('rgb(253,127,128)')},  // coral
                {pos: 0.58, val: S.O.S.P5.color('rgb(0,0,0)')},
                {pos: 0.61, val: S.O.S.P5.color('rgb(193,217,243)')},  // gris frio
                {pos: 0.8,  val: S.O.S.P5.color('rgb(94,154,232)')},   // azul 
                {pos: 0.95, val: S.O.S.P5.color('rgb(0,104,200)')},    // azul oscuro
                {pos: 1.0,  val: S.O.S.P5.color('rgb(0,0,0)')}];

    // GRADIENTE: esmeralda
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.ESMERALDA] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#333')},     // gris   
                {pos: 0.14, val: S.O.S.P5.color('#f3d3bd')},  // durazno
                {pos: 0.34, val: S.O.S.P5.color('#5e5e5e')},  // azul 
                {pos: 0.5,  val: S.O.S.P5.color('#48e5c2')},  // verde
                {pos: 0.58, val: S.O.S.P5.color('#333')},     // gris
                {pos: 0.61, val: S.O.S.P5.color('#fcfaf9')},  // blanco
                {pos: 0.95, val: S.O.S.P5.color('#5e5e5e')},  // azul oscuro
                {pos: 1.0,  val: S.O.S.P5.color('#333')}];    // gris

    // GRADIENTE: universal
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.UNIVERSAL] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#c0bda5')},  // pistachio
                {pos: 0.15, val: S.O.S.P5.color('#f39c6b')},  // naranja
                {pos: 0.30, val: S.O.S.P5.color('#ff3864')},  // rojo
                {pos: 0.45, val: S.O.S.P5.color('#261447')},  // violet
                {pos: 0.60, val: S.O.S.P5.color('#cc978e')},  // rosa
                {pos: 0.75, val: S.O.S.P5.color('#f39c6b')},  // naranja
                {pos: 0.90, val: S.O.S.P5.color('#c0bda5')},  // pictachio
                {pos: 1.0,  val: S.O.S.P5.color('#261447')}]; // violet

    // GRADIENTE: tizado
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.TIZADO] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#efeee9')},  // chalk
                {pos: 0.15, val: S.O.S.P5.color('#c5c4c1')},  // light gray
                {pos: 0.30, val: S.O.S.P5.color('#efeee9')},  // chalk
                {pos: 0.45, val: S.O.S.P5.color('#7d7d7d')},  // medium gray
                {pos: 0.60, val: S.O.S.P5.color('#efeee9')},  // chalk
                {pos: 0.75, val: S.O.S.P5.color('#d7d6d2')},  // lighter gray
                {pos: 0.90, val: S.O.S.P5.color('#efeee9')},  // chalk
                {pos: 1.0,  val: S.O.S.P5.color('#efeee9')}]; // gray

    // GRADIENTE: lucinti
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.LUCINTI] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
                {pos: 0.15, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
                {pos: 0.30, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
                {pos: 0.45, val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
                {pos: 0.60, val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
                {pos: 0.75, val: S.O.S.P5.color('#978A82')},  // MEDIUM GRAY
                {pos: 0.90, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
                {pos: 1.0, val:  S.O.S.P5.color('#F1CE01')}]; // AMARILLO

    // GRADIENTE: flamingo
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _COLOR.Gradientes[_COLOR.FLAMINGO] = 
               [{pos: 0.0,  val: S.O.S.P5.color('#BEFFF3')},  // LIGHT TEAL
                {pos: 0.15, val: S.O.S.P5.color('#57F1D6')},  // TEAL
                {pos: 0.30, val: S.O.S.P5.color('#19E8C2')},  // MEDIUM TEAL
                {pos: 0.45, val: S.O.S.P5.color('#006f5a')},  // DARK TEAL
                {pos: 0.75, val: S.O.S.P5.color('#57F1D6')},  // TEAL
                {pos: 0.90, val: S.O.S.P5.color('#ffaff6')},  // PINK
                {pos: 1.0, val:  S.O.S.P5.color('#BEFFF3')}]; // LIGHT TEAL

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
                {pos: 1.0,  val: S.O.S.P5.color('#1A1B41')}]; // Espaci oscuro
    
    return _COLOR;
};

export default Color;