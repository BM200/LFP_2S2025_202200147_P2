/**
 * ============================================================================
 * ANALIZADOR LÉXICO - AFD (Autómata Finito Determinista) Manual
 * ============================================================================
 * 
 * Este analizador implementa un AFD manual que reconoce tokens de Java
 * mediante la lectura carácter por carácter del código fuente.
 * 
 * ESTADOS DEL AFD:
 * ----------------
 * S0  - Estado Inicial (esperando siguiente token)
 * S1  - Leyendo Identificador/Palabra Reservada
 * S2  - Leyendo Número Entero
 * S3  - Leyendo Número Decimal (después del punto)
 * S4  - Leyendo Cadena de texto (comillas dobles)
 * S5  - Leyendo Carácter (comillas simples)
 * S6  - Leyendo Comentario de línea (barras diagonales dobles)
 * S7  - Leyendo Comentario de bloque (barra-asterisco)
 * S8  - Leyendo Operador de 1 carácter (más, menos, por, etc.)
 * S9  - Leyendo Operador de 2 caracteres (doble ampersand, doble pipe, etc.)
 * SF  - Estado Final (token reconocido)
 * 
 * TRANSICIONES:
 * -------------
 * S0 → S1: Si encuentra letra o guion bajo
 * S0 → S2: Si encuentra dígito o guion seguido de dígito
 * S0 → S4: Si encuentra comilla doble
 * S0 → S5: Si encuentra comilla simple
 * S0 → S6: Si encuentra dos barras diagonales
 * S0 → S7: Si encuentra barra-asterisco
 * S0 → S8/S9: Si encuentra operador o símbolo
 * 
 * Restricción: NO SE USA REGEX - Todo es procesamiento manual con charCodeAt()
 * ============================================================================
 */

// Importar dependencias (Node.js)
if (typeof require !== 'undefined') {
    const Token = require('./Token.js');
    const { TipoToken, PALABRAS_RESERVADAS } = require('./TipoToken.js');
    
    // Hacer disponibles globalmente para uso en la clase
    global.Token = Token;
    global.TipoToken = TipoToken;
    global.PALABRAS_RESERVADAS = PALABRAS_RESERVADAS;
}

class AnalizadorLexico {
    /**
     * Constructor del analizador léxico
     * @param {string} input - Código fuente Java a analizar
     */
    constructor(input) {
        this.input = input;
        this.pos = 0;              // Posición actual en el input
        this.linea = 1;            // Línea actual
        this.columna = 1;          // Columna actual
        this.tokens = [];          // Tokens reconocidos
        this.errores = [];         // Errores léxicos encontrados
    }

    /**
     * Método principal - Analiza todo el input y genera tokens
     * Este método implementa el ciclo principal del AFD
     * @returns {Object} { tokens: Token[], errores: Object[] }
     */
    analizar() {
        // CICLO PRINCIPAL DEL AFD - Procesa carácter por carácter
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            // ============================================================
            // ESTADO S0: Estado Inicial - Determinar siguiente transición
            // ============================================================
            
            // TRANSICIÓN: S0 → S0 (si espacio en blanco, permanecer en S0)
            if (this.esEspacio(char)) {
                this.avanzar(); // Consumir espacio y volver a S0
                continue;
            }
            
            // TRANSICIÓN: S0 → S6 (Comentario de línea //)
            if (char === '/' && this.siguiente() === '/') {
                this.leerComentarioLinea(); // Entrar a estado S6
                continue; // Volver a S0 después de procesar
            }
            
            // TRANSICIÓN: S0 → S7 (Comentario de bloque /* */)
            if (char === '/' && this.siguiente() === '*') {
                this.leerComentarioBloque(); // Entrar a estado S7
                continue; // Volver a S0 después de procesar
            }
            
            // TRANSICIÓN: S0 → S1 (Identificador o palabra reservada)
            if (this.esLetra(char) || char === '_') {
                this.leerIdentificador(); // Entrar a estado S1
                continue; // Volver a S0 después de reconocer token
            }
            
            // TRANSICIÓN: S0 → S2 (Número entero o decimal)
            if (this.esDigito(char)) {
                this.leerNumero(); // Entrar a estado S2
                continue; // Volver a S0 después de reconocer token
            }
            
            // TRANSICIÓN: S0 → S2 (Número negativo)
            if (char === '-' && this.esDigito(this.siguiente())) {
                this.leerNumero(); // Entrar a estado S2
                continue; // Volver a S0 después de reconocer token
            }
            
            // TRANSICIÓN: S0 → S4 (Cadena de texto "...")
            if (char === '"') {
                this.leerCadena(); // Entrar a estado S4
                continue; // Volver a S0 después de reconocer token
            }
            
            // TRANSICIÓN: S0 → S5 (Carácter '...')
            if (char === "'") {
                this.leerCaracter(); // Entrar a estado S5
                continue; // Volver a S0 después de reconocer token
            }
            
            // TRANSICIÓN: S0 → S8/S9 (Símbolos y operadores)
            if (this.esSimbolo(char)) {
                this.leerSimbolo(); // Entrar a estado S8 o S9
                continue; // Volver a S0 después de reconocer token
            }
            
            // ERROR: Carácter no reconocido - No hay transición válida desde S0
            this.agregarError(
                char,
                'Carácter no reconocido',
                this.linea,
                this.columna
            );
            this.avanzar(); // Saltar carácter inválido y volver a S0
        }
        
        return {
            tokens: this.tokens,
            errores: this.errores,
            exito: this.errores.length === 0
        };
    }

    /**
     * ============================================================
     * ESTADO S1: Leer Identificador o Palabra Reservada
     * ============================================================
     * Patrón AFD: [A-Za-z_][A-Za-z0-9_]*
     * 
     * Transiciones dentro de S1:
     * - S1 → S1: mientras sea letra, dígito o '_'
     * - S1 → SF: cuando encuentra cualquier otro carácter (fin del identificador)
     */
    leerIdentificador() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // BUCLE DENTRO DEL ESTADO S1
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            // TRANSICIÓN: S1 → S1 (si es letra, dígito o '_')
            if (this.esLetraODigito(char) || char === '_') {
                lexema += char; // Acumular carácter
                this.avanzar(); // Avanzar posición
            } else {
                // TRANSICIÓN: S1 → SF (fin del identificador)
                break;
            }
        }
        
        // ESTADO SF: Token reconocido, determinar tipo
        // Verificar si es palabra reservada (int, double, if, for, etc.)
        const tipo = PALABRAS_RESERVADAS.has(lexema) 
            ? TipoToken.PALABRA_RESERVADA 
            : TipoToken.IDENTIFICADOR;
        
        // Crear token y agregarlo a la lista
        this.tokens.push(new Token(tipo, lexema, inicioLinea, inicioColumna));
        
        // Regresar a S0 (estado inicial)
    }

    /**
     * ============================================================
     * ESTADOS S2 y S3: Leer Número (Entero o Decimal)
     * ============================================================
     * Patrón AFD: -?[0-9]+(\.[0-9]+)?
     * 
     * S2: Leyendo parte entera
     * S3: Leyendo parte decimal (después del punto)
     * 
     * Transiciones:
     * - S2 → S2: mientras sea dígito
     * - S2 → S3: cuando encuentra '.'
     * - S3 → S3: mientras sea dígito
     * - S2/S3 → SF: cuando encuentra cualquier otro carácter
     */
    leerNumero() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        let esDecimal = false;
        let puntosEncontrados = 0;
        
        // Signo negativo opcional
        if (this.actual() === '-') {
            lexema += '-';
            this.avanzar();
        }
        
        // ESTADO S2: Leyendo parte entera
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            // TRANSICIÓN: S2 → S2 (mientras sea dígito)
            if (this.esDigito(char)) {
                lexema += char;
                this.avanzar();
            } 
            // TRANSICIÓN: S2 → S3 (punto decimal encontrado)
            else if (char === '.' && !esDecimal) {
                puntosEncontrados++;
                if (puntosEncontrados > 1) {
                    // ERROR: múltiples puntos decimales
                    this.agregarError(
                        lexema + char,
                        'Número decimal inválido',
                        inicioLinea,
                        inicioColumna
                    );
                    this.avanzar();
                    return; // Salir del estado con error
                }
                // CAMBIO DE ESTADO: S2 → S3
                esDecimal = true;
                lexema += char;
                this.avanzar();
            } 
            // TRANSICIÓN: S2/S3 → SF (fin del número)
            else {
                break;
            }
        }
        
        // Validar número decimal bien formado
        if (esDecimal && !this.esDigito(lexema[lexema.length - 1])) {
            this.agregarError(
                lexema,
                'Número decimal mal formado',
                inicioLinea,
                inicioColumna
            );
            return;
        }
        
        const tipo = esDecimal ? TipoToken.NUMERO_DECIMAL : TipoToken.NUMERO_ENTERO;
        this.tokens.push(new Token(tipo, lexema, inicioLinea, inicioColumna));
    }

    /**
     * Lee una cadena de texto: "..."
     */
    leerCadena() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Consumir comilla inicial
        lexema += this.actual();
        this.avanzar();
        
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            if (char === '"') {
                // Comilla de cierre
                lexema += char;
                this.avanzar();
                this.tokens.push(new Token(TipoToken.CADENA, lexema, inicioLinea, inicioColumna));
                return;
            } else if (char === '\n') {
                // Salto de línea antes de cerrar - ERROR
                this.agregarError(
                    lexema,
                    'Cadena sin cerrar',
                    inicioLinea,
                    inicioColumna
                );
                return;
            } else if (char === '\\' && this.siguiente() === '"') {
                // Escape de comilla: \"
                lexema += char;
                this.avanzar();
                lexema += this.actual();
                this.avanzar();
            } else {
                lexema += char;
                this.avanzar();
            }
        }
        
        // Llegamos al final sin cerrar la cadena - ERROR
        this.agregarError(
            lexema,
            'Cadena sin cerrar',
            inicioLinea,
            inicioColumna
        );
    }

    /**
     * Lee un carácter: '...'
     */
    leerCaracter() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Consumir comilla inicial
        lexema += this.actual();
        this.avanzar();
        
        if (this.pos >= this.input.length) {
            this.agregarError(lexema, 'Carácter sin cerrar', inicioLinea, inicioColumna);
            return;
        }
        
        // Leer el contenido (debe ser UN solo carácter)
        const contenido = this.actual();
        lexema += contenido;
        this.avanzar();
        
        if (this.pos >= this.input.length || this.actual() !== "'") {
            this.agregarError(lexema, 'Carácter mal formado', inicioLinea, inicioColumna);
            return;
        }
        
        // Comilla de cierre
        lexema += this.actual();
        this.avanzar();
        
        this.tokens.push(new Token(TipoToken.CARACTER, lexema, inicioLinea, inicioColumna));
    }

    /**
     * ============================================================
     * ESTADOS S8 y S9: Leer Símbolos y Operadores
     * ============================================================
     * S8: Operador de 1 carácter (+, -, *, /, %, <, >, !, =, etc.)
     * S9: Operador de 2 caracteres (&&, ||, ==, !=, >=, <=, ++, --)
     * 
     * Transiciones:
     * - S0 → S8: si encuentra símbolo de 1 carácter
     * - S0 → S9: si encuentra inicio de operador de 2 caracteres
     * - S9 → SF: después de leer el segundo carácter
     * - S8 → SF: después de leer el carácter
     */
    leerSimbolo() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        const char = this.actual();
        const siguiente = this.siguiente();
        
        // ============================================================
        // ESTADO S9: Operadores de DOS caracteres
        // ============================================================
        
        // TRANSICIÓN: S0 → S9 → SF (operador ==)
        if (char === '=' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.IGUAL_IGUAL, '==', inicioLinea, inicioColumna));
            this.avanzar(); // Consumir primer carácter
            this.avanzar(); // Consumir segundo carácter → SF
            return; // Regresar a S0
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador !=)
        if (char === '!' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.DIFERENTE, '!=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador >=)
        if (char === '>' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.MAYOR_IGUAL, '>=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador <=)
        if (char === '<' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.MENOR_IGUAL, '<=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador ++)
        if (char === '+' && siguiente === '+') {
            this.tokens.push(new Token(TipoToken.INCREMENTO, '++', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador --)
        if (char === '-' && siguiente === '-') {
            this.tokens.push(new Token(TipoToken.DECREMENTO, '--', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador &&)
        if (char === '&' && siguiente === '&') {
            this.tokens.push(new Token(TipoToken.AND, '&&', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // TRANSICIÓN: S0 → S9 → SF (operador ||)
        if (char === '|' && siguiente === '|') {
            this.tokens.push(new Token(TipoToken.OR, '||', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // ============================================================
        // ESTADO S8: Operadores de UN carácter
        // ============================================================
        const simbolos = {
            '{': TipoToken.LLAVE_ABRE,
            '}': TipoToken.LLAVE_CIERRA,
            '(': TipoToken.PAR_ABRE,
            ')': TipoToken.PAR_CIERRA,
            '[': TipoToken.COR_ABRE,
            ']': TipoToken.COR_CIERRA,
            ';': TipoToken.PUNTO_COMA,
            ',': TipoToken.COMA,
            '.': TipoToken.PUNTO,
            '=': TipoToken.IGUAL,
            '+': TipoToken.MAS,
            '-': TipoToken.MENOS,
            '*': TipoToken.MULTIPLICACION,
            '/': TipoToken.DIVISION,
            '%': TipoToken.MODULO,
            '>': TipoToken.MAYOR_QUE,
            '<': TipoToken.MENOR_QUE,
            '!': TipoToken.NOT
        };
        
        const tipo = simbolos[char];
        if (tipo) {
            // TRANSICIÓN: S0 → S8 → SF (símbolo de 1 carácter reconocido)
            this.tokens.push(new Token(tipo, char, inicioLinea, inicioColumna));
            this.avanzar(); // Consumir carácter → SF
            // Regresar a S0
        }
    }

    /**
     * ============================================================
     * ESTADO S6: Leer Comentario de Línea (//)
     * ============================================================
     * Transiciones:
     * - S6 → S6: mientras no sea '\n'
     * - S6 → SF: cuando encuentra '\n' (fin de línea)
     */
    leerComentarioLinea() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Consumir los dos caracteres "//"
        lexema += this.actual(); // /
        this.avanzar();
        lexema += this.actual(); // /
        this.avanzar();
        
        // BUCLE DENTRO DEL ESTADO S6
        // TRANSICIÓN: S6 → S6 (mientras no sea fin de línea)
        while (this.pos < this.input.length && this.actual() !== '\n') {
            lexema += this.actual();
            this.avanzar();
        }
        
        // TRANSICIÓN: S6 → SF (token de comentario reconocido)
        this.tokens.push(new Token(TipoToken.COMENTARIO_LINEA, lexema, inicioLinea, inicioColumna));
        // Regresar a S0
    }

    /**
     * ============================================================
     * ESTADO S7: Leer Comentario de Bloque
     * ============================================================
     */
    leerComentarioBloque() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Consumir /*
        lexema += this.actual();
        this.avanzar();
        lexema += this.actual();
        this.avanzar();
        
        // Leer hasta encontrar */
        while (this.pos < this.input.length) {
            const char = this.actual();
            const siguiente = this.siguiente();
            
            if (char === '*' && siguiente === '/') {
                lexema += char;
                this.avanzar();
                lexema += this.actual();
                this.avanzar();
                this.tokens.push(new Token(TipoToken.COMENTARIO_BLOQUE, lexema, inicioLinea, inicioColumna));
                return;
            }
            
            lexema += char;
            this.avanzar();
        }
        
        // Comentario no cerrado - ERROR
        this.agregarError(lexema, 'Comentario de bloque sin cerrar', inicioLinea, inicioColumna);
    }

    // ============== FUNCIONES AUXILIARES SIN REGEX ==============

    /**
     * Verifica si un carácter es una letra (A-Z, a-z)
     * SIN USAR REGEX
     */
    esLetra(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) ||   // A-Z
               (code >= 97 && code <= 122);     // a-z
    }

    /**
     * Verifica si un carácter es un dígito (0-9)
     * SIN USAR REGEX
     */
    esDigito(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;  // 0-9
    }

    /**
     * Verifica si un carácter es letra o dígito
     */
    esLetraODigito(char) {
        return this.esLetra(char) || this.esDigito(char);
    }

    /**
     * Verifica si un carácter es espacio en blanco
     */
    esEspacio(char) {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    /**
     * Verifica si un carácter es un símbolo válido
     */
    esSimbolo(char) {
        const simbolos = '{}()[];,.=+-*/%><!&|';
        return simbolos.includes(char);
    }

    /**
     * Obtiene el carácter actual sin avanzar
     */
    actual() {
        return this.input[this.pos];
    }

    /**
     * Obtiene el siguiente carácter sin avanzar
     */
    siguiente() {
        return this.input[this.pos + 1];
    }

    /**
     * Avanza una posición y actualiza línea/columna
     */
    avanzar() {
        if (this.actual() === '\n') {
            this.linea++;
            this.columna = 1;
        } else {
            this.columna++;
        }
        this.pos++;
    }

    /**
     * Agrega un error léxico
     */
    agregarError(caracter, descripcion, linea, columna) {
        this.errores.push({
            tipo: 'LEXICO',
            error: caracter,
            descripcion: descripcion,
            linea: linea,
            columna: columna
        });
    }
}

/**
 * ============================================================================
 * DIAGRAMA DE ESTADOS DEL AFD - JavaBridge Analizador Léxico
 * ============================================================================
 * 
 * TOTAL DE ESTADOS: 10 estados
 * 
 * S0  = Estado Inicial
 * S1  = Identificador
 * S2  = Número Entero  
 * S3  = Número Decimal
 * S4  = Cadena de texto
 * S5  = Carácter
 * S6  = Comentario de línea
 * S7  = Comentario de bloque
 * S8  = Operador de 1 carácter
 * S9  = Operador de 2 caracteres
 * SF  = Estado Final (token reconocido)
 * 
 * MÉTODO DE LECTURA MANUAL:
 * -------------------------
 * - charCodeAt(): Lee el código ASCII de cada carácter
 * - Ejemplo: 'A'.charCodeAt(0) retorna 65
 * - Comparaciones manuales: (code >= 65 && code <= 90) para letras mayúsculas
 * - NO SE USA REGEX como lo requiere el enunciado del proyecto
 * 
 * TRANSICIONES PRINCIPALES:
 * -------------------------
 * Desde S0 (Estado Inicial):
 *   - Si [A-Za-z_] → S1 (Identificador)
 *   - Si [0-9] → S2 (Número)
 *   - Si comilla doble → S4 (Cadena)
 *   - Si comilla simple → S5 (Carácter)
 *   - Si // → S6 (Comentario línea)
 *   - Si barra-asterisco → S7 (Comentario bloque)
 *   - Si operador 2 chars → S9 (&&, ||, ++, --, ==, !=, >=, <=)
 *   - Si operador 1 char → S8 (+, -, *, /, %, >, <, !, =, ;, ,, ., etc.)
 * 
 * Todos los estados eventualmente regresan a S0 después de reconocer un token
 * ============================================================================
 */

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalizadorLexico;
}
