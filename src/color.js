/*
 * =============================================================================
 * 
 *                          M Ó D U L O    C O L O R
 * 
 * =============================================================================
 */

const Color = (() => {
    
    const _esquemaDeColores = {  
        GRADIENTES        : {},
        
        // Nombres de los gradientes predefinidos
        GRAD_DEFAULT      : 'default',
        GRAD_CORALIA      : 'coralia',
        GRAD_ESMERALDA    : 'esmeralda',
        GRAD_UNIVERSAL    : 'universal',
        GRAD_TIZADO       : 'tizado',
        GRAD_LUCINTI      : 'lucinti',
        GRAD_FLAMINGO     : 'flamingo',
        GRAD_CADET        : 'cadete',
    };
    
    return _esquemaDeColores;

})();




Color.GRADIENTES[Color.GRAD_DEFAULT] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('rgb(255,255,255)')}];
  };

Color.GRADIENTES[Color.GRAD_CORALIA] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('rgb(253,127,128)')},  // coral 
            {pos: 0.14, val: S.O.S.P5.color('rgb(254,129,173)')},  // rosa
            {pos: 0.34, val: S.O.S.P5.color('rgb(94,154,232)')},   // azul BG
            {pos: 0.5,  val: S.O.S.P5.color('rgb(253,127,128)')},  // coral
            {pos: 0.58, val: S.O.S.P5.color('rgb(0,0,0)')},
            {pos: 0.61, val: S.O.S.P5.color('rgb(193,217,243)')},  // gris frio
            {pos: 0.8,  val: S.O.S.P5.color('rgb(94,154,232)')},   // azul BG
            {pos: 0.95, val: S.O.S.P5.color('rgb(0,104,200)')},    // azul oscuro
            {pos: 1.0,  val: S.O.S.P5.color('rgb(0,0,0)')}];
  };

Color.GRADIENTES[Color.GRAD_ESMERALDA] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#333')},  //  
            {pos: 0.14, val: S.O.S.P5.color('#f3d3bd')},  // durazno
            {pos: 0.34, val: S.O.S.P5.color('#5e5e5e')},  // azul BG
            {pos: 0.5,  val: S.O.S.P5.color('#48e5c2')},  // verde
            {pos: 0.58, val: S.O.S.P5.color('#333')},
            {pos: 0.61, val: S.O.S.P5.color('#fcfaf9')},  // blanco
            {pos: 0.95, val: S.O.S.P5.color('#5e5e5e')},  // azul oscuro
            {pos: 1.0,  val: S.O.S.P5.color('#333')}];
  };

Color.GRADIENTES[Color.GRAD_UNIVERSAL] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#c0bda5')},  // pistachio
            {pos: 0.15, val: S.O.S.P5.color('#f39c6b')},  // naranja BG
            {pos: 0.30, val: S.O.S.P5.color('#ff3864')},  // rojo
            {pos: 0.45, val: S.O.S.P5.color('#261447')},  // russian violet
            {pos: 0.60, val: S.O.S.P5.color('#cc978e')},  // rosa
            {pos: 0.75, val: S.O.S.P5.color('#f39c6b')},  // naranja BG
            {pos: 0.90, val: S.O.S.P5.color('#c0bda5')},  // pictachio
            {pos: 1.0,  val: S.O.S.P5.color('#261447')}]; // russian violet
  };

Color.GRADIENTES[Color.GRAD_TIZADO] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#efeee9')},  // base chalk
            {pos: 0.15, val: S.O.S.P5.color('#c5c4c1')},  // light gray
            {pos: 0.30, val: S.O.S.P5.color('#efeee9')},  // base chalk
            {pos: 0.45, val: S.O.S.P5.color('#7d7d7d')},  // medium gray
            {pos: 0.60, val: S.O.S.P5.color('#efeee9')},  // base chalk
            {pos: 0.75, val: S.O.S.P5.color('#d7d6d2')},  // lighter gray
            {pos: 0.90, val: S.O.S.P5.color('#efeee9')},  // base chalk
            {pos: 1.0,  val: S.O.S.P5.color('#efeee9')}]; // gray
  };

Color.GRADIENTES[Color.GRAD_LUCINTI] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
            {pos: 0.15, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
            {pos: 0.30, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
            {pos: 0.45, val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
            {pos: 0.60, val: S.O.S.P5.color('#0C0B0B')},  // DARKER GRAY
            {pos: 0.75, val: S.O.S.P5.color('#978A82')},  // MEDIUM GRAY
            {pos: 0.90, val: S.O.S.P5.color('#F1CE01')},  // AMARILLO
            {pos: 1.0, val:  S.O.S.P5.color('#F1CE01')}]; // AMARILLO
  };  

Color.GRADIENTES[Color.GRAD_FLAMINGO] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#BEFFF3')},  // LIGHT TURCO
            {pos: 0.15, val: S.O.S.P5.color('#57F1D6')},  // TURCO
            {pos: 0.30, val: S.O.S.P5.color('#19E8C2')},  // MEDIUM TURCO
            {pos: 0.45, val: S.O.S.P5.color('#006f5a')},  // DARK TURCO
            {pos: 0.75, val: S.O.S.P5.color('#57F1D6')},  // TURCO
            {pos: 0.90, val: S.O.S.P5.color('#ffaff6')},  // PINK
            {pos: 1.0, val:  S.O.S.P5.color('#BEFFF3')}]; // LIGHT TURCO
  };

Color.GRADIENTES[Color.GRAD_CADET] = 
  (S) => {
    return [{pos: 0.0,  val: S.O.S.P5.color('#BAFF29')},  // Lime 
            {pos: 0.14, val: S.O.S.P5.color('#C2E7DA')},  // Mint green
            {pos: 0.34, val: S.O.S.P5.color('#6290C3')},  // Silver lake blue
            {pos: 0.45, val: S.O.S.P5.color('#F1FFE7')},  // Honey dew
            {pos: 0.5,  val: S.O.S.P5.color('#BAFF29')},  // Lime
            {pos: 0.58, val: S.O.S.P5.color('#1A1B41')},  // Space cadet (darkest)
            {pos: 0.8,  val: S.O.S.P5.color('#6290C3')},  // Silver lake blue
            {pos: 0.88, val: S.O.S.P5.color('#C2E7DA')},  // Mint green
            {pos: 0.95, val: S.O.S.P5.color('#F1FFE7')},  // Honey dew
            {pos: 1.0,  val: S.O.S.P5.color('#1A1B41')}]; // Space cadet (darkest)
  };


export default Color;