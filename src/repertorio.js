/*
 * =============================================================================
 * 
 *                      M Ó D U L O    R E P E R T O R I O
 * 
 * =============================================================================
 */
import Evaluador from './repertorios/evaluador';
import Representador from './repertorios/representador';
import Coreografia from './repertorios/coreografia';
import Color from './repertorios/color';


/**
 * Repertorio
 * Un "Repertorio" es, básicamente, una enumeración de claves o nombres que mapean a algún
 * tipo de dato o función constante y que describen el espacio de valores de una variable.
 * Cada socorrista designado trae consigo la colección de repertorios predefinidos:
 * 
 *   S.O.S.EVAL  : Repertorio de "Métodos de evaluación" para variables dinámicas
 *   S.O.S.REP   : Repertorio de "Representadores"
 *   S.O.S.COREO : Repertorio de "Coreografías" para los "Repartos"
 *   S.O.S.COLOR : Repertorio de "Gradientes" de colores
 * 
 * No obstante, cualquiera de estos repertorios puede ser redefinido mediante la función S.O.S.Repertorio.
 *   S.O.S.Repertorio.def('REP',    <enumeracionDeRepresentadores>);
 *   S.O.S.Repertorio.def('COREO',  <enumeracionDeCoreografias>);
 *   S.O.S.Repertorio.def('COLOR',  <enumeracionDeGradientesDeColores>);
 */
function Repertorio(S) {
    const _REPE  = {};
    const _REPES = {};
    
    // -------------------------------------------
    // Repertorios preestablecidos
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _REPES.EVAL  = Evaluador(S);
    _REPES.REP   = Representador(S); 
    _REPES.COREO = Coreografia(S);
    _REPES.COLOR = S.O.S.hasOwnProperty('P5') ? Color(S).Gradientes : [];
    
    // -------------------------------------------
    // Métodos del "Repertorio" propiamente dicho
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    _REPE.funciones = () => {
        return {def: (nombre, enumeracion) => {
                       _REPES[nombre] = enumeracion;
                      }
               };  
    };
    
    _REPE.publicar = () => {
        return _REPES;  
    };
    
    return _REPE;
}

export default Repertorio;