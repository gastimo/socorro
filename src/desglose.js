/*
 * =============================================================================
 * 
 *                        M Ó D U L O    D E S G L O S E
 * 
 * =============================================================================
 */
import CONFIG from './config';


/**
 * Desglose
 * El "Desglose" es el documento fundamental para la especificación de las "Entidades
 * del Socorro", ya que permite la definición de éstas no como objetos estáticos, sino
 * como colecciones de atributos dinámicos cuyos valores pueden ser recalculados durante  
 * el ciclo de ejecución de la "Obra". En otras palabras, la mayoría de las "Entidades 
 * del Socorro" son desglosadas en listados de atributos que se evalúan en tiempo de
 * ejecución permitiendo, de esta manera, la implementación de lógica generativa.
 * 
 * DEFINICIÓN DESGLOSADA DE LOS PROTAGONISTAS DE LA OBRA
 * Existen tres "Entidades del Socorro"(*) con un rol protagónico en la representación de
 * la "Obra": la "Escena", el "Actor" y el "Reparto". Todas ellas hacen uso del objeto 
 * "Desglose" (lo extienden) para almacenar las definiciones de sus atributos dinámicos.
 * 
 *  - La "Escena"  : representación de contenidos visuales en el espacio (lienzo HTML) 
 *                   y en en el tiempo. Una "Obra" puede incluir múltiples "Escenas". 
 *  - El "Actor"   : es la única entidad con representación visual en el lienzo de la 
 *                   "Escena" (en otras palabras, se dibuja). Puede pertenecer a un 
 *                   "Reparto" o actuar independientemente. Posee atributos que definen
 *                   su desplazamiento en la "Escena" (ej, posición, velocidad, etc). 
 *  - El "Reparto" : definición de conjuntos de actores con posiciones y desplazamientos 
 *                   predeterminados dentro de la "Escena". El "Reparto" dirige a los
 *                   "Actores", determina sus posiciones en la "Escena", controla sus
 *                   entradas y salidas de cuadro y, también, puede coreografiar a otros
 *                   "Repartos" (subrepartos) dentro de éste.
 * 
 * (*) Existe una cuarta entidad importante que es el "Repartidor". Éste no es más que un 
 * caso particular de "Reparto" conformado por un único "Actor", denominado "Influenciador",
 * y que tiene injerencia en las trayectorias de los restantes "Actores" del "Reparto".
 * 
 * DEFINICIONES DINÁMICAS DESGLOSADAS
 * Una de las funciones principales del "Desglose" es la definición de los atributos de las
 * "Entidades del Socorro", pero su relevancia radica en el hecho que, en lugar de definir
 * valores estáticos para los atributos, posibilita detallar la manera en que sus valores serán
 * calculados (evaluados) dinámicamente durante la representación de la "Obra". El "Desglose"
 * especifica la manera de calcular el valor de estos atributos en tiempo de ejecución. Para 
 * esto, hay dos "Entidades del Socorro" que representan el motor para el cálculo dinámico y 
 * para la implementación de la la lógica generativa (rasgo fundamental del módulo "S.O.S").
 * Estas entidades son la "Variable" y el "Variador", ambas definidas, también, como "Desgloses".
 * 
 * - La "Variable" : representación de un método de cálculo dinámico de un atributo del
 *                   "Desglose". En general, definen un mapeo entre un rango de valores 
 *                   de origen y un rango de valores de destino, donde es posible añadir
 *                   variaciones aleatorias o ruido sobre el cálculo del resultado.
 * - El "Variador" : es simplemente un caso particular de una "Variable", donde el método
 *                   de cálculo es aleatorio (por ruido "perlin"). Es decir, se trata de
 *                   una "Variable" que mapea ruido al azar entre 0 y 1 a un rango.
 * 
 * Cada vez que se solicita el valor de un atributo del "Desglose" —que haya sido definido 
 * como una "Variable" o un "Variador"— su valor es calculado en ese preciso instante, 
 * facilitando, justamente, el mutación a lo largo del tiempo de ejecución de la "Escena".
 * 
 * DESGLOSES PARA LA REPRESENTACIÓN VISUAL
 * La única "Entidad del Socorro" que tiene representación visual en la "Escena" es el "Actor". 
 * Para esto, existe otro tipo de entidad (el "Estilo") que posibilita, a través del "Desglose", 
 * la definición de sus atributos visuales mediante "Variables" evaluadas en tiempo de ejecución.
 * 
 * - El "Estilo"   : colección de defniciones de atributos vinculados con la representación
 *                   visual de un "Actor". Básicamente, el "Estilo" reúne dos triadas de
 *                   valores: por un lado, <color-opacidad-grandor> (para la figura del 
 *                   "Actor") y, por otro lado, la triada <color-opacidad-grosor> (del trazo
 *                   a utilizar). Cualquiera de los componentes de ambas triadas puede ser 
 *                   definido mediante objetos "Variables" para su evaluación dinámica.
 * 
 * DESGLOSES AUXILIARES PARA LA DEFINICIÓN DE ATRIBUTOS
 * Adicionalmente, existen "Entidades del Socorro" con fines utilitarios a la hora de la
 * definición de los atributos. 
 * 
 *  - El "Vector"    : estructura de datos simple que permite operar con vectores de hasta
 *                     tres componentes <x,y,z>. Muchos de los atributos de los desgloses son,
 *                     en verdad, "Vectores". Ejemplos: origen, velocidad, aceleración, etc. 
 *  - El "VectorVar" : es un tipo de "Vector" utilizado internamente cuando algunas de las
 *                     componentes <x,y,z> es definida mediante objetos "Variable". Es una 
 *                     entidad de uso interno del módulo. Desde el punto de vista de la interfaz
 *                     siempre se crean "Vectores". Si el módulo detecta el uso de "Variables"
 *                     en la definición del "Vector" automáticamente crea un "VectorVar" en
 *                     lugar del "Vector" para evaluar sus componentes dinámicamente.
 */
function Desglose(S, nombreDesglose) {
    const _DES = {};   // Objeto principal que alberga al "Desglose" actual.
    const _VAL = {};   // Objeto donde se alojan las definiciones de los valores de los atributos dinámicos.
    const _ALI = {};   // Objeto para definir "alias" o equivalencias entre nombres de atributos

    // Inicialización del "Desglose" con sus atributos identificatorios
    _DES[CONFIG.DES_NOMBRE]        = nombreDesglose ?? CONFIG.SOS_DESGLOSE;
    _DES[CONFIG.DES_CLAVE]         = S.O.S.obtenerClave(_DES[CONFIG.DES_NOMBRE]);
    _DES[CONFIG.DES_IDENTIFICADOR] = _DES[CONFIG.DES_NOMBRE] + CONFIG.ATR_SEPARADOR + _DES[CONFIG.DES_CLAVE];
    
    // Información relacional del "Desglose"
    _DES[CONFIG.DES_ENTIDAD]    = undefined;  // "Entidad del Socorro" real definida a través de este "Desglose" (lo extiende)
    _DES[CONFIG.DES_SUPERIOR]   = undefined;  // "Desglose" superior (o maestro). Por ejemplo, el "Reparto" para un "Actor"
    _DES[CONFIG.DES_CONTENEDOR] = undefined;  // Entrada del "Desglose" superior que aloja la definición del este "Desglose"
    _DES[CONFIG.DES_AGRUPACION] = undefined;  // Nombre del arreglo —dentro del "Desglose" superior— al cual pertenece este "Desglose"
    _DES[CONFIG.DES_ATRIBUTO]   = undefined;  // Nombre —del atributo— bajo el cual este "Desglose" está definido en el "Desglose" superior
    
    
    /**
     * def
     * Función para definir el valor de un atributo del "Desglose". Lo que es importante
     * remarcar de esta función es que, si bien permite definir los valores individuales
     * de los atributos, en la mayoría de los casos, lo que se almacena es la definición
     * acerca de cómo calcular el valor del atributo dinámicamente en tiempo de ejecución.
     * Esto se consigue asociando objetos de tipo "Variable" o "Variador" en la definición
     * desglosada del atributo.
     * 
     * Adicionalmente, la función "def" permite asociar otras "Entidades del Socorro" en 
     * el "Desglose" de un atributo, estableciendo de esta forma jerarquías de entidades. 
     * Por ejemplo, la entidad "Escena" puede contener atributos que sean "Actores" o 
     * "Repartos". Estos últimos, a su vez, pueden tener a otros "Actores" asociados o, 
     * incluso, a "Subrepartos".
     * 
     * ARGUMENTOS DE LA FUNCIÓN
     * La función recibe un único argumento en la forma de un objeto JavaScript con la 
     * colección de pares <atributo, valor> a ser definidos. Por ejemplo:
     * 
     *   def({atributo1 : valor1, 
     *        atributo2 : valor2,
     *        ...
     *        atributoN : valorN});
     * 
     * Mediante esta función es posible definir jerarquías dentro del "Desglose". En decir,
     * además de poder definir valores simples para los atributos, es posible definir otro
     * "Desglose" como valor de un atributo. En este caso, el valor del atributo pasa a ser
     * otro objeto JavaScript con la definición desglosada de segundo nivel ("Subdesglose").
     * 
     *   def({atributo: {subatributo1 : valor1,   // El valor de "atributo" es otro desglose 
     *                   subatributo2 : valor2,
     *                   ...
     *                   subatributoN : valorN}
     *       });
     * 
     * Finalmente, esta misma función puede ser usada para crear el "Desglose" a partir
     * de los datos importados desde un archivo JSON.
     */  
    _DES.def = (atributos) => {
        if (atributos) {
            _DEF$atributos(_VAL, atributos);
        }
        return _DES;
    };    

    /**
     * defval
     * Retorna el detalle completo de los atributos del "Desglose" con sus definiciones,
     * es decir, retorna un objeto JavaScript con la estructura jerárquica desglosada,
     * detatallando los atributos y sus definiciones. Vale aclarar que esta función no 
     * "evalúa" los valores, simplemente retorna sus definiciones o "Desglose".
     */
    _DES.defval = () => {
        return _VAL;    
    };
    
    /**
     * replicarDef
     * Copia todas definiciones del "Desglose" recibido como argumento en el "Desglose"
     * actual. Vale aclarar que sólo realiza una copia superficial, es decir, se copian
     * los punteros a los mismos objetos del "Desglose" recibido como parámetro.
     * NOTA: esta función se utiliza cuando se quiere transferir la definición de un 
     * "Desglose" a otro (ejemplo: la creación de un "Subreparto" desde un "Metareparto"). 
     */
    _DES.replicarDef = (desglose) => {
        let _definicion = desglose.defval();
        for (const [atrNombre, atrValor] of Object.entries(_definicion)) {
            _VAL[atrNombre] = atrValor;
        }
    };
    
    /**
     * val
     * Función para obtener el valor de un atributo del "Desglose". Esta función es la
     * responsable de la "Evaluación Dinámica" de aquellos atributos definidos a través
     * de "Variables" o "Variadores", es decir, cuyo valor no es estático y se calcula
     * en tiempo de ejecuión mediante la invocación de funciones (ver la definición de
     * los objetos "Variable" y "Variador").
     * 
     * La función puede recibir un único argumento (el nombre del atributo del "Desglose"
     * del que se quiere obtener su valor) o más de un argumento (en caso que se desee
     * obtener el valor de un atributo de un subnivel del "Desglose"). 
     * EJEMPLOS:
     * 
     *  val(<nombre>)            : Devuelve el valor (evaluado) del atributo indicado 
     *                             en el argumento (o "null" si no existe).
     *  val(<nombre1>, <nombre2>): Se asume que el valor del atributo <nombre1> es
     *                             un "Subdesglose". Se retorna, entonces, el valor
     *                             del atributo <nombre2> del subdesglose <nombre1>.
     * 
     * EVALUACIÓN DINÁMICA
     * Como se mencionó arriba, esta función se ocupa de la evaluación de los valores de
     * los atributos, pero sólo si éstos fueron definidos mediante "Variables" o "Variadores"
     * (sino, se retorna el objeto o "Entidad del Socorro" almacenado sin evaluar).
     * Por ejemplo, el código a continuación muestra dos formas diferentes de definir un mismo
     * "Actor" cuyo "Estilo" utiliza "Variables" para la definición de sus atributos:
     * 
     *  DESGLOSE DE UN "ACTOR" (CON SU ESTILO) MEDIANTE JSON
     *   esc.def({actor: {velocidad: {x:2, y:2},
     *                    estilo   : {color     : {metodo:'ciclo',  valor:'tizado'},
     *                                color$alfa: {metodo:'perlin', valorDesde: 0, valorHasta: 1}},
     *                   }  
     *           });
     * 
     *  DESGLOSE DE UN "ACTOR" (CON SU ESTILO) USANDO "ENTIDADES DEL SOCORRO"
     *   esc.def({actor: S.O.S.Actor(null, S.O.S.Vector(2, 2),
     *                               S.O.S.Estilo(S.O.S.Variable('ciclo', 'tizado'), 
     *                                            S.O.S.Variable('perlin', 0, 1)))
     *           });
     *
     * Los dos ejemplos anteriores hacen exactamente lo mismo. Independientemente de la forma en
     * que se detalle, el "Desglose" termina almacenando internamente las "Entidades del Socorro"
     * referenciadas, es decir, a partir de las definciones desglosadas se instancian las "Entidades
     * del Socorro" correspondientes para ser almacenadas. Luego, al momento se solicitar el valor
     * de estos atributos, la evaluación sólo tendrá lugar al tratarse de una "Variable" o "Variador".
     * En cualquier otro caso, se retorna el objeto o enttidad que se haya definido en el "Desglose".
     * 
     *   esc.val('actor')                    => Retorna el objeto de tipo "Actor" almacenado (sin evaluar)
     *   esc.val('actor', 'estilo')          => Retorna el objeto de tipo "Estilo" almacenado (sin evaluar)
     *   esc.val('actor', 'estilo', 'color') => Retorna el valor del "color" EVALUADO (incluyendo la opacidad)
     * 
     * En otras palabras, si el valor pedido fue definido como una "Variable" o un "Variador", entonces se
     * realiza la evaluación dinámica, sino se retorna el objeto tal como está almacenado. La función "val"
     * nunca retorna un objeto "Variable" o "Variador", sino que lo evalúa al momento de su invocación.
     *   
     */
    _DES.val = (...atributos) => {
        return atributos.length > 0 ? _VAL$obtener(_VAL, ...atributos) : null;
    };
  
    /**
     * heredar
     * Busca el valor del atributo con el nombre indicado en el argumento, 
     * en la jerarquía de "Desgloses" (busca recursivamente el valor en 
     * los "Desgloses" superiores).
     */
    _DES.heredar = (nombreAtr, incluirEscena = false) => {
        let _entidadSuperior = _DES[CONFIG.DES_SUPERIOR];
        if (!_entidadSuperior) {
            return undefined;
        }
        else if (!incluirEscena && _entidadSuperior.identificador === S.O.S.identificador) {
            return undefined;
        }
        let _sup = _entidadSuperior.entidad ?? _entidadSuperior;
        return _sup.hasOwnProperty(nombreAtr) ? (_sup[nombreAtr] ?? _entidadSuperior.heredar(nombreAtr, incluirEscena)) : undefined; 
    };
    
    /**
     * extender
     * Devuelve un nuevo objeto (vacío) que extiende del "Desglose" actual para 
     * albergar las definiciones de una "Entidad del Socorro". Toda "Entidad del 
     * Socorro" extiende de un objeto "Desglose" que aloja sus definiciones.
     * El argumento "subentidad" es opcional. En caso de ser indicado, se incluye
     * a ésta en el medio de la cadena de herencia. En otras palabras, la entidad
     * extenderá de la subentidad quien, a su vez, extenderá del "Desglose". 
     */
    _DES.extender = (subentidad) => {
        _DES[CONFIG.DES_ENTIDAD] = subentidad ? S.O.S.revelar({}, subentidad, _DES) : S.O.S.revelar({}, _DES);
        return _DES[CONFIG.DES_ENTIDAD];
    };
    
    /**
     * exportar
     * Devuelve una cadena de caracteres con el "Desglose"
     * convertido a texto (en formato JSON).
     */
    _DES.exportar = (indentacion = "") => {
      return _EXPORT$convertirATexto(_VAL, indentacion);
    };
    
    /**
     * alias
     * Método para definir equivalencias entre nombres de atributos, es decir,
     * "alias" del "Desglose". Un alias es una forma alternativa de acceder al
     * valor de un atributo del "Desglose". La definición del alias no se almacena 
     * realmente en el "Desglose", es simplemente un nombre que establece una 
     * equivalencia entre identificadores, y es el nombre bajo el cual se realiza
     * la exportación de la definición de dicho atributo.
     */
    _DES.alias = (nombreAlias, nombreAtr) => {
        if (_ALI.hasOwnProperty(nombreAlias)) {
            if (nombreAtr) {
                _ALI[nombreAlias] = nombreAtr;
            }
            return _ALI[nombreAlias];
        }
        else if (nombreAlias && nombreAtr) {
            _ALI[nombreAlias] = nombreAtr;
            return _ALI[nombreAlias];           
        }
        return nombreAlias;
    };
    
    
        
// --------------------------------------------------------------------------------------------------
//
//   F U N C I O N E S     P R I V A D A S
//
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    
    /**
     * _DEF$atributos
     * Función privada, utilizada internamente por el método "def" para definir los valores de los
     * atributos del "Desglose" (de manera recursiva). Lo relevante de la definición de los atributos 
     * de un "Desglose" es que posibilitan no sólo la asociación de valores simples a los atributos, 
     * sino la definición de la manera en que dicho valor debe ser calculado. En otras palabras: 
     * 
     *            LA DEFINICIÓN DESGLOSADA DE UN ATRIBUTO DETALLA LA MANERA  
     *            DE CALCULAR SU VALOR DINÁMICAMENTE, EN TIEMPO DE EJECUCIÓN.
     * 
     * En el "Desglose", cada atributo puede albergar:
     *  - Un valor escalar simple (cualquier tipo de dato JavaScript).
     *  - Otro "Desglose" o definición desglosada de atributos (objeto JSON con pares <nombreAtributo: valor>).
     *  - Cualquier otra "Entidad del Socorro" que extienda de un "Desglose" (Vector, Variable, Estilo, Actor, Reparto).
     *  - Un arreglo (array) de valores simples o, también, un arreglo de cualquier "Entidad del Socorro".
     * 
     * Este mecanismo vuelve al "Desglose" un instrumento extremadamente flexible. Por un lado, el "Desglose" 
     * posibilita establecer una jerarquía de entidades, por ejemplo, permite definir a los "Actores" de una 
     * "Escena" o a los "Actores" de un "Reparto" (incluso subrepartos dentro de un "Reparto"). Por otro lado, 
     * permite definir "Variables" o "Variadores" asociados a sus atributos para que sus valores sean calculados
     * dinámicamente, en tiempo de ejecución (implementación de la lógica generativa de la "Obra").
     * 
     * En el caso de las "Entidades del Socorro", esta función admite que sean definidas, ya sea mediante
     * un objeto JSON conteniendo una colección de pares <nombreAtributo: valor> o mediante la instanciación
     * de las entidades propiamente dichas. Por ejemplo:
     * 
     *   esc.def({actor: {origen   : {x:10, y:-50, z:0},         // Definición de un "Actor" de la "Escena" a 
     *                    velocidad: {x:2, y:1}                  // través de un objeto JSON. Esta definición 
     *                    estilo   : {color:189, color$trazo:8}  // incluye 2 "Vectores" y 1 "Estilo".   
     *                   }
     *            });
     *          
     *   esc.def({actor: S.O.S.Actor(S.O.S.Vector(10, -50, 0),   // La misma definición pero con "Entidades SOS"
     *                               S.O.S.Vector(2, 1),
     *                               S.O.S.Estilo(189, null, null, 8))
     *           });
     * 
     * Esta función es capaz de reconocer la definición desglosada (objeto JSON) de una "Entidad del Socorro"
     * pasada como argumento y crear su correspondiente objeto. Internamente, los dos ejemplos anteriores
     * terminan almacenando exactamente lo mismo, es decir, la definición del "Desglose" con las "Entidades 
     * del Socorro" referenciadas. Por ejemplo, al solicitar el valor del atributo "actor" lo que se retorna
     * es el objeto "Actor" instanciado.
     * 
     *   esc.val('actor')  =>  Retorna la entidad "Actor", indpendientemente como haya sido definida.
     * 
     * Los mismo ocurre al solicitar el valor de un atributo del "Actor" representado como una "Entidad SOS".
     * Por ejemplo, al pedir el "origen" o el "estilo" del "Actor" se retorna la entidad correspondiente:
     * 
     *   esc.val('actor', 'origen')  =>  Retorna un objeto "Vector" con las coordenadas del punto origen
     *   esc.val('actor', 'estilo')  =>  Retorna un objeto "Estilo" con los atributos de su representación visual 
     *  
     */
    function _DEF$atributos(desglose, subatributos, arreglo) {
        for (const [atrNombre, atrValor] of Object.entries(subatributos)) {
            let _esAtributoDinamico = (atrNombre == CONFIG.ATR_NOMBRE_DINAMICO);
            let _atrNombreReal = _esAtributoDinamico ? atrNombre : _DES.alias(atrNombre);
            
            // ------------------------------------------------------
            // DEFINCIÓN DE VALORES DESGLOSADOS (NO VALORES SIMPLES)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            if (atrValor !== null && atrValor !== undefined && typeof atrValor === 'object' && !Array.isArray(atrValor)) {
                
              // Se verifica si el valor se corresponde a la DEFINICIÓN DESGLOSADA de algún "Entidad del Socorro", 
              // es decir, "Estilo", "Actor", "Reparto", "Repartidor", "Variable", "Variador", "Vector" o "VectorVar".
              let _entidadSocorrista = S.O.S.entidad(atrValor);
              if (_entidadSocorrista !== undefined) {
                  let _entidad = _entidadSocorrista().def(atrValor); // Se crea la "Entidad del Socorro" y se define su "Desglose"
                  if (!_esAtributoDinamico)  // Se guarda en el desglose sólo si no es una entidad dinámica (ej. "Actor de Reparto") 
                      desglose[_atrNombreReal] = _entidad;
                  _DEF$metadefinicion(_entidad, _DES, desglose, _atrNombreReal, arreglo);
                  continue;
              }
              else if (S.O.S.esUnVector(atrValor)   || S.O.S.esUnVectorVar(atrValor) || S.O.S.esUnaVariable(atrValor) || 
                       S.O.S.esUnVariador(atrValor) || S.O.S.esUnEstilo(atrValor)    || S.O.S.esUnActor(atrValor) || 
                       S.O.S.esUnReparto(atrValor)) {
                  let _entidad = atrValor;   // La "Entidad del Socorro" vino ya creada en la definición desglosada
                  if (!_esAtributoDinamico)  // Se guarda en el desglose sólo si no es una entidad dinámica (ej. "Actor de Reparto")
                    desglose[_atrNombreReal] = _entidad; 
                  _DEF$metadefinicion(_entidad, _DES, desglose, _atrNombreReal, arreglo);
                  continue;
              }
              // Si el nombre del atributo no está definido actualmente en el "Desglose" actual o ya existe, pero no
              // se trata de una definición desglosada (o es un "array"), se inicializa un "subdesglose" en blanco.
              else if (!desglose.hasOwnProperty(_atrNombreReal) || typeof desglose[_atrNombreReal] !== 'object' || Array.isArray(desglose[_atrNombreReal])) {
                desglose[_atrNombreReal] = {};
              }
              // Invocación recursiva para definir los valores del "Desglose" de siguiente nivel (subdesglose)
              _DEF$atributos(desglose[_atrNombreReal], atrValor);
            }

            // ---------------------------------------------------------
            // DEFINICIÓN DE VALORES DEGLOSADOS COMO ARREGLOS (ARRAYS)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else if (Array.isArray(atrValor)) {
                desglose[_atrNombreReal] = [];
                // Invocación recursiva para incluir los valores del "arreglo" en el "Desglose"
                _DEF$atributos(desglose[_atrNombreReal], atrValor, _atrNombreReal);
            }  

            // ----------------------------------------------------------
            // DEFINICIÓN DE VALORES SIMPLES (ÚLTIMO NIVEL DEL DESGLOSE)
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else {
                if (!_esAtributoDinamico) // Se guarda en el desglose sólo si no es una entidad dinámica (ej. "Actor de Reparto")
                    desglose[_atrNombreReal] = atrValor;
            }
        }
    }
    
    /**
     * _DEF$metadefinicion
     * Función de uso interno que permite definir, en el "Desglose" actual, la información de tipo
     * complementaria que lo vincula con un "Desglose" superior. Estos datos se rellenan cuando
     * una "Entidad del Socorro" es utilizada como valor de un atributo en la definición desglosada
     * de otra entidad. Por ejemplo, cuando a través del método "def" se define un "Actor" como
     * atributo de la "Escena" o como parte de un "Reparto". Lo mismo ocurre cuando se define 
     * a un "Reparto" como atributo de la "Escena" o de otro "Reparto".
     * Este método se encarga de completar la siguiente información: 
     *  - El objeto "Desglose" de nivel superior dentro del cual este "Desglose" está definido.
     *  - La entrada dentro de la definición desglosada de nivel superior donde este "Desglose" está definido.
     *  - El nombre del atributo del "Desglose" superior bajo el cual este "Desglose" está definido.
     *  - En caso de formar parte de un arreglo en el "Desglose" superior, el nombre dicho arreglo.
     */
    function _DEF$metadefinicion(entidad, desgloseSuperior, entradaDesglose, nombreAtributo, nombreArreglo) {
        let _definicionDesglosada = S.O.S.desglose(entidad);
        
        // Se completa la información relacional en el "Desglose" base del objeto recibido
        if (_definicionDesglosada) {
            _definicionDesglosada[CONFIG.DES_SUPERIOR]   = desgloseSuperior;
            _definicionDesglosada[CONFIG.DES_CONTENEDOR] = entradaDesglose;
            _definicionDesglosada[CONFIG.DES_AGRUPACION] = nombreArreglo;
            _definicionDesglosada[CONFIG.DES_ATRIBUTO]   = nombreAtributo;
            
            // Finalmente, se inscribe la entidad recibida como argumento en el registro interno de la "Escena"
            S.O.S.registrar(entidad);
        }
    }
    
    /**
     * _VAL$obtener
     * Función privada para obtener el valor del atributo existente en el "Desglose".
     * En caso de recibir una cadena de nombres de atributos, la función se ocupa de
     * recorrer el "Desglose", bajando uno a uno en los niveles de profundidad de su 
     * definición (realiza un "tree traversal" en la definición desglosada). 
     * Esta función se encarga, también, de llevar a cabo los reemplazos de nombres
     * de atributos por sus "alias" en caso que existan.
     * Sus argumentos son:
     *  - desglose  : objeto con las definiciones desglosadas de la entidad.
     *  - atributos : nombre del atributo a obtener (o cadena de nombres para llegar a él).
     */
    function _VAL$obtener(desglose, ...atributos) {
        for (let i = 0; i < atributos.length; i++) {
            if (desglose.hasOwnProperty(atributos[i])) {

                // Si se trata del último nombre de la lista, se retorna su valor almacenado.
                // Podría tratarse de un valor simple o un objeto ("Vector", "Estilo", etc).
                // Ejemplo: en la instrucción de abajo "colorFondo" es el valor solicitado.
                // 
                //   escena.val("paletas", "nocturna", "colorFondo");
                //                 ^           ^            ^
                //              desglose   subdesglose   atributo                   
                // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                if (i == atributos.length - 1) {
                  return _VAL$evaluarDefinicion(desglose, atributos[i]);
                }
                else {
                    // Si no se trata del último valor, se verifica si se está solicitando el 
                    // atributo de un objeto (ej. "Estilo", "Actor"). En ese caso, se delega el
                    // llamado a la función homónima de la entidad en cuestión.
                    // Ejemplo: si el valor del atributo "opciones" fuese un objeto "Estilo".
                    // 
                    //    escena.val("opciones")          => Retorna un objeto de tipo "Estilo"
                    //    escena.val("opciones", "color") => Retorna el color del objeto "Estilo"
                    //                 
                    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                    let _subdesglose = desglose[atributos[i]];
                    if (S.O.S.esUnEstilo(_subdesglose) || S.O.S.esUnActor(_subdesglose) || S.O.S.esUnReparto(_subdesglose)) {
                        return _subdesglose.val(atributos.slice(i+1));
                    }
                    // Sino, se baja un nivel más en la jerarquía (al "subdesglose") y se continúa 
                    // con la búsqueda del valor del atributo solicitado en el "loop" principal.
                    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                    else {
                        desglose = _subdesglose;
                    }
                }
            }
            // Si el atributo no existe y no se trata de un "atributo asociado"
            // (por ejemplo: "color$alfa", "grandro$trazo", etc), se evalúa si
            // no se trata de un "alias" de algún otro atributo base.
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            else if (atributos[i].indexOf(CONFIG.ATR_SEPARADOR) < 0) {
                let _nombreAtributoOriginal = _DES.alias(atributos[i]);
                if (_nombreAtributoOriginal != atributos[i]) {
                    let _subatr = [_nombreAtributoOriginal];
                    for (let j = i+1; j < atributos.length; j++)
                        _subatr.push(atributos[j]);
                    return _VAL$obtener(desglose, ..._subatr);
                }
                break;
            }
        }
        return null;
    }
    
    /**
     * _VAL$evaluarDefinicion
     * Función privada para extraer efectivamente el valor de un atributo del "Desglose".
     * Esta función tiene en cuenta los siguientes tipos de valores de atributos:
     *
     * - VARIABLE / VARIADOR: Si el valor buscado está representado como un objeto
     *   de tipo "Variable" o "Variador", entonces realiza el cálculo dinámico, según 
     *   el "método de evaluación" y retorna su valor. En el caso de tratarse de un
     *   objeto VECTORVAR (de uso interno), se evalúan sus componentes y se retorna
     *   un "Vector" con sus componentes evaluadas.
     * 
     * - COLOR: Si el valor obtenido es un "color" (de p5js), entonces verifica si 
     *   existe el "atributo asociado" que defina su opacidad. De ser así, lo calcula 
     *   y lo aplica (los "atributos asociados" son atributos vecinos en el "Desglose"
     *   a los que se les añade un sufijo (ejemplo: "$alfa" para indicar "opacidad").
     * 
     * - OTROS: Si no se trata de una "Variable", ni de un "Variador", ni de un color, 
     *   se retorna el valor sin ningún tipo de procesamiento. Por ejemplo, los "Vectores",
     *   los "Estilos", los "Actores" y los "Repartos" caen en esta categoría. El caso
     *   del objeto "VectorVar" es un caso particular: se evalúan primero sus componentes
     *   y se termina retornando un "Vector" evaluado. Nunca se retorna un "VectorVar".
     */
    function _VAL$evaluarDefinicion(_valores, atrNombre) {
      let _valor = _valores[atrNombre];
      if (_valor) {
        // Objetos que deben ser evaluados antes de devolver su valor
        if (S.O.S.esUnaVariable(_valor) || S.O.S.esUnVariador(_valor) || S.O.S.esUnVectorVar(_valor))
          _valor = _valor.val();
        
        // En el caso de los colores, se busca la presencia del "atributo
        // asociado" que eventualmente defina su opacidad 
        if (S.O.S.esUnColor(_valor)) {
          let _atrNombreExtra = atrNombre + CONFIG.ATR_VARIABLE_ALFA;
          if (_valores.hasOwnProperty(_atrNombreExtra)) {
            let _alfa = _VAL$evaluarDefinicion(_valores, _atrNombreExtra); // Busca la opacidad como atributo "vecino"
            if (_alfa) {
              _valor.setAlpha(_alfa * 255);
            }
          }
        }
      }
      return _valor;  // En cualquier otro caso, se retorna el valor obtenido, sin evaluación
    } 
    
    
// --------------------------------------------------------------------------------------------------
//   FUNCIONES PRIVADAS PARA LA EXPORTACIÓN
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    /**
     * _EXPORT$convertirATexto
     * Función privada que convierte a texto (en formato JSON) cada uno de
     * los pares <atributo, valor> del "Desglose" recibido como argumento.
     * En otras palabras, retorna la definición desglosada de una "Entidad
     * del Socorro". La función se invoca a sí misma, recursivamente en 
     * caso de detectar "Subdesgloses".
     */
    function _EXPORT$convertirATexto(atributos, indentacion = "") {
      let esUnObjeto = true;
      if (atributos && Object.keys(atributos).length === 1 && Object.keys(atributos)[0] === CONFIG.ATR_ARRAY_CLAVE_AUX)
          esUnObjeto = false;
      let salida = esUnObjeto ? "{\n" : "\n";
      let existenValores = false;
      let nombres = Object.keys(atributos);

      for (let i = 0; i < nombres.length; i++) {
        let atrNombre = nombres[i];
        let atrValor  = atributos[atrNombre];
        if (atrValor !== null) {
          if (typeof atrValor === "object" && !Array.isArray(atrValor)) {
            let subdesglose = atrValor.exportar?.(indentacion + "\t");
            if (subdesglose === undefined) {
              subdesglose = _EXPORT$convertirATexto(atrValor, indentacion + "\t");
            }
            if (subdesglose !== null) {
              salida += _EXPORT$formatearRegistroExportado(indentacion, atrNombre, subdesglose, esUnObjeto);
              existenValores = true;  
            }
          }
          else if (Array.isArray(atrValor)) {
            salida += indentacion + "\t\"" + _EXPORT$obtenerAliasAtributo(atrNombre) + "\"\t:\t[";
            for (let j = 0; j < atrValor.length; j++) {
                let elementoArray = {};
                elementoArray[CONFIG.ATR_ARRAY_CLAVE_AUX] = atrValor[j];
                salida += _EXPORT$convertirATexto(elementoArray, indentacion + "\t") + (j < atrValor.length - 1 ? "," : "");              
            }
            salida += "\n" + indentacion + "\t],\n";
            existenValores = true;
          }
          else {
            let valor = typeof atrValor === "number" || typeof atrValor === "boolean" ? atrValor : "\"" + atrValor + "\"";
            salida += _EXPORT$formatearRegistroExportado(indentacion, atrNombre, valor, esUnObjeto);
            existenValores = true;
          }
        }
      }
      if (existenValores) {
        if (esUnObjeto) {
            salida = salida.substring(0, salida.length-2) + "\n";
            salida += indentacion + "}";
        }
        return salida;
      }
      else
        return null;
    }
    
    /**
     * _EXPORT$formatearRegistroExportado
     * Función interna que construye una línea de la salida del texto de exportación
     */
    function _EXPORT$formatearRegistroExportado(indentacion, atrNombre, atrValor, esUnObjeto = true) {
        if (esUnObjeto)
            return indentacion + "\t\"" + _EXPORT$obtenerAliasAtributo(atrNombre) + "\"\t:\t" + atrValor + ",\n";
        else
            return indentacion + "\t" + atrValor;
    }
    
    /**
     * _EXPORT$obtenerAliasAtributo
     * Método para obtener el "alias" de exportación de un atributo del "Desglose"
     * (los atributos se exportan siempre bajo su nombre de su "alias", si existe).
     */
    function _EXPORT$obtenerAliasAtributo(nombreAtr) {
        let _nombreExportacion = nombreAtr;
        for (const [atrAlias, atrNombre] of Object.entries(_ALI)) {
            if (atrNombre == nombreAtr) {
                _nombreExportacion = atrAlias;
                break;
            }
        }
        return _nombreExportacion;
    }
        
    return _DES;
}


export default Desglose;