// public/src/analyzer/AnalizadorLexico.js

/**
 * ============================================================================
 * ANALIZADOR LÉXICO - IMPLEMENTACIÓN DE AFD MANUAL
 * ============================================================================
 * ESTADOS DEL AFD (Nomenclatura Q):
 * Q0: Estado Inicial
 * Q_ID: Leyendo Identificador / Palabra Reservada
 * Q_ENTERO: Leyendo parte entera de un Número
 * Q_DECIMAL: Leyendo parte decimal de un Número
 * Q_CADENA: Leyendo Cadena ("...")
 * Q_CHAR: Leyendo Caracter ('...')
 * Q_COMENTARIO_LINEA: Leyendo Comentario de Línea (//...)
 * Q_COMENTARIO_BLOQUE: Leyendo Comentario de Bloque (/*...* /)
 * Q_SIMBOLO: Leyendo Símbolos y Operadores
 * SF: Estado Final de Aceptación (implícito al finalizar un método 'leer...')
 * 
 * RESTRICCIÓN: Implementación 100% manual sin RegExp ni .includes().
 * ============================================================================
 */

class AnalizadorLexico {
    constructor(codigoFuente) {
        this.codigoFuente = codigoFuente;
        this.posicion = 0;
        this.linea = 1;
        this.columna = 1;
        this.tokens = [];
        this.errores = [];
    }

    analizar() {
        // --- CICLO PRINCIPAL ---
        // Este bucle representa el ESTADO Q0 (Estado Inicial).
        while (this.posicion < this.codigoFuente.length) {
            const charActual = this.caracterActual();
            
            // TRANSICIÓN: Q0 -> Q0 (Ignorar espacios en blanco)
            if (this.esEspacio(charActual)) {
                this.avanzar();
                continue;
            }
            
            if (charActual === '/') {
                if (this.siguienteCaracter() === '/') {
                    // TRANSICIÓN: Q0 -> Q_COMENTARIO_LINEA
                    this.leerComentarioLinea();
                    continue;
                } else if (this.siguienteCaracter() === '*') {
                    // TRANSICIÓN: Q0 -> Q_COMENTARIO_BLOQUE
                    this.leerComentarioBloque();
                    continue;
                }
            }
            
            // TRANSICIÓN: Q0 -> Q_ID
            if (this.esLetra(charActual) || charActual === '_') {
                this.leerIdentificadorOReservada();
                continue;
            }
            
            // TRANSICIÓN: Q0 -> Q_ENTERO
            if (this.esDigito(charActual)) {
                this.leerNumero();
                continue;
            }
            
            // TRANSICIÓN: Q0 -> Q_CADENA
            if (charActual === '"') {
                this.leerCadena();
                continue;
            }
            
            // TRANSICIÓN: Q0 -> Q_CHAR
            if (charActual === "'") {
                this.leerCaracter();
                continue;
            }
            
            // TRANSICIÓN: Q0 -> Q_SIMBOLO
            if (this.esSimbolo(charActual)) {
                this.leerSimbolo();
                continue;
            }
            
            // ESTADO DE ERROR: No hay transición válida desde Q0.
            this.agregarError(charActual, 'Carácter no reconocido', this.linea, this.columna);
            this.avanzar();
        }
        
        return { tokens: this.tokens, errores: this.errores };
    }

    /**
     * Lógica del ESTADO Q_ID (Identificador).
     * El bucle interno es la transición Q_ID -> Q_ID.
     * La salida del bucle es la transición Q_ID -> SF.
     */
    leerIdentificadorOReservada() {
        const posInicial = { linea: this.linea, columna: this.columna };
        let lexema = '';
        
        while (this.posicion < this.codigoFuente.length) {
            const char = this.caracterActual();
            if (this.esLetraODigito(char) || char === '_') {
                lexema += char;
                this.avanzar();
            } else {
                break; // Transición a SF
            }
        }
        
        const tipo = PALABRAS_RESERVADAS.has(lexema) ? TipoToken.PALABRA_RESERVADA : TipoToken.IDENTIFICADOR;
        this.agregarToken(tipo, lexema, posInicial.linea, posInicial.columna);
    }
    
    /**
     * Lógica de los ESTADOS Q_ENTERO y Q_DECIMAL.
     */
    leerNumero() {
        const posInicial = { linea: this.linea, columna: this.columna };
        let lexema = '';
        let estadoActual = 'Q_ENTERO';

        while (this.posicion < this.codigoFuente.length) {
            const char = this.caracterActual();

            if (estadoActual === 'Q_ENTERO') {
                if (this.esDigito(char)) { // TRANSICIÓN: Q_ENTERO -> Q_ENTERO
                    lexema += char;
                    this.avanzar();
                } else if (char === '.') { // TRANSICIÓN: Q_ENTERO -> Q_DECIMAL
                    estadoActual = 'Q_DECIMAL';
                    lexema += char;
                    this.avanzar();
                } else {
                    break; // TRANSICIÓN: Q_ENTERO -> SF
                }
            } else if (estadoActual === 'Q_DECIMAL') {
                if (this.esDigito(char)) { // TRANSICIÓN: Q_DECIMAL -> Q_DECIMAL
                    lexema += char;
                    this.avanzar();
                } else {
                    break; // TRANSICIÓN: Q_DECIMAL -> SF
                }
            }
        }
        
        if (lexema.charAt(lexema.length - 1) === '.') {
            this.agregarError(lexema, 'Número decimal mal formado', posInicial.linea, posInicial.columna);
        } else {
            const tipo = (estadoActual === 'Q_DECIMAL') ? TipoToken.NUMERO_DECIMAL : TipoToken.NUMERO_ENTERO;
            this.agregarToken(tipo, lexema, posInicial.linea, posInicial.columna);
        }
    }

    /** Lógica del ESTADO Q_CADENA. */
    leerCadena() {
        const posInicial = { linea: this.linea, columna: this.columna };
        this.avanzar(); // Consumir '"'
        let lexema = '';

        while (this.posicion < this.codigoFuente.length) {
            const char = this.caracterActual();
            if (char === '"') { // TRANSICIÓN: Q_CADENA -> SF
                this.avanzar(); 
                this.agregarToken(TipoToken.CADENA, `"${lexema}"`, posInicial.linea, posInicial.columna);
                return;
            }
            if (char === '\n') { // TRANSICIÓN: Q_CADENA -> ERROR
                this.agregarError(`"${lexema}`, 'Cadena sin cerrar', posInicial.linea, posInicial.columna);
                return;
            }
            lexema += char;
            this.avanzar();
        }
        
        this.agregarError(`"${lexema}`, 'Cadena sin cerrar al final del archivo', posInicial.linea, posInicial.columna);
    }

    /** Lógica del ESTADO Q_CHAR. */
    leerCaracter() {
        const posInicial = { linea: this.linea, columna: this.columna };
        this.avanzar(); // Consumir "'"
        
        if(this.posicion + 1 < this.codigoFuente.length && this.codigoFuente[this.posicion + 1] === "'") {
            const contenido = this.caracterActual();
            this.avanzar(2);
            this.agregarToken(TipoToken.CARACTER, `'${contenido}'`, posInicial.linea, posInicial.columna);
        } else {
            this.agregarError("'", "Carácter mal formado", posInicial.linea, posInicial.columna);
            while(this.posicion < this.codigoFuente.length && this.caracterActual() !== "'" && this.caracterActual() !== '\n') this.avanzar();
            if(this.posicion < this.codigoFuente.length && this.caracterActual() === "'") this.avanzar();
        }
    }

    /** Lógica del ESTADO Q_SIMBOLO. */
    leerSimbolo() {
        const posInicial = { linea: this.linea, columna: this.columna };
        const char1 = this.caracterActual();
        const char2 = this.siguienteCaracter();
        
        const opDoble = char1 + char2;
        switch (opDoble) {
            case '==': case '!=': case '>=': case '<=': case '++': case '--':
                const tipoDoble = { '==': TipoToken.IGUAL_IGUAL, '!=': TipoToken.DIFERENTE, '>=': TipoToken.MAYOR_IGUAL, '<=': TipoToken.MENOR_IGUAL, '++': TipoToken.INCREMENTO, '--': TipoToken.DECREMENTO }[opDoble];
                this.avanzar(2); this.agregarToken(tipoDoble, opDoble, posInicial.linea, posInicial.columna); return;
        }

        switch (char1) {
            case '{': this.avanzar(); this.agregarToken(TipoToken.LLAVE_ABRE, char1, posInicial.linea, posInicial.columna); return;
            case '}': this.avanzar(); this.agregarToken(TipoToken.LLAVE_CIERRA, char1, posInicial.linea, posInicial.columna); return;
            case '(': this.avanzar(); this.agregarToken(TipoToken.PAR_ABRE, char1, posInicial.linea, posInicial.columna); return;
            case ')': this.avanzar(); this.agregarToken(TipoToken.PAR_CIERRA, char1, posInicial.linea, posInicial.columna); return;
            case '[': this.avanzar(); this.agregarToken(TipoToken.COR_ABRE, char1, posInicial.linea, posInicial.columna); return;
            case ']': this.avanzar(); this.agregarToken(TipoToken.COR_CIERRA, char1, posInicial.linea, posInicial.columna); return;
            case ';': this.avanzar(); this.agregarToken(TipoToken.PUNTO_COMA, char1, posInicial.linea, posInicial.columna); return;
            case ',': this.avanzar(); this.agregarToken(TipoToken.COMA, char1, posInicial.linea, posInicial.columna); return;
            case '.': this.avanzar(); this.agregarToken(TipoToken.PUNTO, char1, posInicial.linea, posInicial.columna); return;
            case '=': this.avanzar(); this.agregarToken(TipoToken.IGUAL, char1, posInicial.linea, posInicial.columna); return;
            case '+': this.avanzar(); this.agregarToken(TipoToken.MAS, char1, posInicial.linea, posInicial.columna); return;
            case '-': this.avanzar(); this.agregarToken(TipoToken.MENOS, char1, posInicial.linea, posInicial.columna); return;
            case '*': this.avanzar(); this.agregarToken(TipoToken.MULTIPLICACION, char1, posInicial.linea, posInicial.columna); return;
            case '/': this.avanzar(); this.agregarToken(TipoToken.DIVISION, char1, posInicial.linea, posInicial.columna); return;
            case '>': this.avanzar(); this.agregarToken(TipoToken.MAYOR_QUE, char1, posInicial.linea, posInicial.columna); return;
            case '<': this.avanzar(); this.agregarToken(TipoToken.MENOR_QUE, char1, posInicial.linea, posInicial.columna); return;
        }
    }

    /** Lógica del ESTADO Q_COMENTARIO_LINEA. */
    leerComentarioLinea() {
        this.avanzar(2); // Consumir '//'
        while (this.posicion < this.codigoFuente.length && this.caracterActual() !== '\n') {
            this.avanzar();
        }
    }

    /** Lógica del ESTADO Q_COMENTARIO_BLOQUE. */
    leerComentarioBloque() {
        const posInicial = { linea: this.linea, columna: this.columna };
        this.avanzar(2); // Consumir '/*'
        
        while (this.posicion < this.codigoFuente.length) {
            if (this.caracterActual() === '*' && this.siguienteCaracter() === '/') {
                this.avanzar(2);
                return; // Comentario cerrado correctamente
            }
            this.avanzar();
        }
        
        this.agregarError('/*', 'Comentario de bloque sin cerrar', posInicial.linea, posInicial.columna);
    }

    // --- FUNCIONES AUXILIARES ---
    caracterActual() { return this.codigoFuente[this.posicion]; }
    siguienteCaracter() { return this.codigoFuente[this.posicion + 1]; }
    avanzar(pasos = 1) { for (let i = 0; i < pasos; i++) { if (this.posicion >= this.codigoFuente.length) break; if (this.caracterActual() === '\n') { this.linea++; this.columna = 1; } else { this.columna++; } this.posicion++; } }
    agregarToken(tipo, lexema, linea, columna) { this.tokens.push(new Token(tipo, lexema, linea, columna)); }
    agregarError(lexema, descripcion, linea, columna) { this.errores.push({ tipo: 'LEXICO', lexema, descripcion, linea, columna }); }
    esLetra(char) { if (typeof char !== 'string') return false; const code = char.charCodeAt(0); return (code >= 65 && code <= 90) || (code >= 97 && code <= 122); }
    esDigito(char) { if (typeof char !== 'string') return false; const code = char.charCodeAt(0); return code >= 48 && code <= 57; }
    esLetraODigito(char) { return this.esLetra(char) || this.esDigito(char); }
    esEspacio(char) { return char === ' ' || char === '\t' || char === '\n' || char === '\r'; }
    esSimbolo(char) { switch (char) { case '{': case '}': case '(': case ')': case '[': case ']': case '.': case ',': case ';': case '=': case '+': case '-': case '*': case '/': case '>': case '<': case '!': return true; default: return false; } }
}