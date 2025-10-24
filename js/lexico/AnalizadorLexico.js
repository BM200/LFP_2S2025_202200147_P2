/**
 * ANALIZADOR LÉXICO (AFD - Autómata Finito Determinista)
 * Este analizador implementa un AFD manual que reconoce tokens de Java
 * mediante la lectura secuencial del código fuente.
 */

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
     * @returns {Object} { tokens: Token[], errores: Object[] }
     */
    analizar() {
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            // Ignorar espacios en blanco
            if (this.esEspacio(char)) {
                this.avanzar();
                continue;
            }
            
            // Comentarios de línea: //
            if (char === '/' && this.siguiente() === '/') {
                this.leerComentarioLinea();
                continue;
            }
            
            // Comentarios de bloque: /* */
            if (char === '/' && this.siguiente() === '*') {
                this.leerComentarioBloque();
                continue;
            }
            
            // Identificadores y palabras reservadas
            if (this.esLetra(char) || char === '_') {
                this.leerIdentificador();
                continue;
            }
            
            // Números (enteros y decimales)
            if (this.esDigito(char)) {
                this.leerNumero();
                continue;
            }
            
            // Números negativos
            if (char === '-' && this.esDigito(this.siguiente())) {
                this.leerNumero();
                continue;
            }
            
            // Cadenas de texto: "..."
            if (char === '"') {
                this.leerCadena();
                continue;
            }
            
            // Caracteres: '...'
            if (char === "'") {
                this.leerCaracter();
                continue;
            }
            
            // Símbolos y operadores
            if (this.esSimbolo(char)) {
                this.leerSimbolo();
                continue;
            }
            
            // Carácter no reconocido - ERROR LÉXICO
            this.agregarError(
                char,
                'Carácter no reconocido',
                this.linea,
                this.columna
            );
            this.avanzar();
        }
        
        return {
            tokens: this.tokens,
            errores: this.errores,
            exito: this.errores.length === 0
        };
    }

    /**
     * Lee un identificador o palabra reservada
     * Patrón: [A-Za-z_][A-Za-z0-9_]*
     */
    leerIdentificador() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Primer carácter debe ser letra o _
        while (this.pos < this.input.length) {
            const char = this.actual();
            if (this.esLetraODigito(char) || char === '_') {
                lexema += char;
                this.avanzar();
            } else {
                break;
            }
        }
        
        // Verificar si es palabra reservada
        const tipo = PALABRAS_RESERVADAS.has(lexema) 
            ? TipoToken.PALABRA_RESERVADA 
            : TipoToken.IDENTIFICADOR;
        
        this.tokens.push(new Token(tipo, lexema, inicioLinea, inicioColumna));
    }

    /**
     * Lee un número (entero o decimal)
     * Permite negativos: -123, -45.67
     */
    leerNumero() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        let esDecimal = false;
        let puntosEncontrados = 0;
        
        // Signo negativo
        if (this.actual() === '-') {
            lexema += '-';
            this.avanzar();
        }
        
        while (this.pos < this.input.length) {
            const char = this.actual();
            
            if (this.esDigito(char)) {
                lexema += char;
                this.avanzar();
            } else if (char === '.' && !esDecimal) {
                // Primer punto decimal
                puntosEncontrados++;
                if (puntosEncontrados > 1) {
                    // Error: múltiples puntos decimales
                    this.agregarError(
                        lexema + char,
                        'Número decimal inválido',
                        inicioLinea,
                        inicioColumna
                    );
                    this.avanzar();
                    return;
                }
                esDecimal = true;
                lexema += char;
                this.avanzar();
            } else {
                break;
            }
        }
        
        // Verificar que después del punto haya al menos un dígito
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
     * Lee símbolos y operadores
     */
    leerSimbolo() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        const char = this.actual();
        const siguiente = this.siguiente();
        
        // Operadores de dos caracteres
        if (char === '=' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.IGUAL_IGUAL, '==', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        if (char === '!' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.DIFERENTE, '!=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        if (char === '>' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.MAYOR_IGUAL, '>=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        if (char === '<' && siguiente === '=') {
            this.tokens.push(new Token(TipoToken.MENOR_IGUAL, '<=', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        if (char === '+' && siguiente === '+') {
            this.tokens.push(new Token(TipoToken.INCREMENTO, '++', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        if (char === '-' && siguiente === '-') {
            this.tokens.push(new Token(TipoToken.DECREMENTO, '--', inicioLinea, inicioColumna));
            this.avanzar();
            this.avanzar();
            return;
        }
        
        // Operadores de un carácter
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
            '>': TipoToken.MAYOR_QUE,
            '<': TipoToken.MENOR_QUE
        };
        
        const tipo = simbolos[char];
        if (tipo) {
            this.tokens.push(new Token(tipo, char, inicioLinea, inicioColumna));
            this.avanzar();
        }
    }

    /**
     * Lee comentario de línea: // hasta fin de línea
     */
    leerComentarioLinea() {
        const inicioLinea = this.linea;
        const inicioColumna = this.columna;
        let lexema = '';
        
        // Consumir //
        lexema += this.actual();
        this.avanzar();
        lexema += this.actual();
        this.avanzar();
        
        // Leer hasta fin de línea
        while (this.pos < this.input.length && this.actual() !== '\n') {
            lexema += this.actual();
            this.avanzar();
        }
        
        this.tokens.push(new Token(TipoToken.COMENTARIO_LINEA, lexema, inicioLinea, inicioColumna));
    }

    /**
     * Lee comentario de bloque: /* ... *\/
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
        const simbolos = '{}()[];,.=+-*/><!';
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

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalizadorLexico;
}
