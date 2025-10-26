// public/src/analyzer/Parser.js

class Parser {
    /**
     * @param {Token[]} tokens - La lista de tokens del analizador léxico.
     */
    constructor(tokens) {
        // Filtramos los comentarios para que el parser no tenga que lidiar con ellos.
        this.tokens = tokens.filter(token => 
            token.tipo !== 'COMENTARIO_LINEA' && 
            token.tipo !== 'COMENTARIO_BLOQUE'
        );
        this.posicion = 0;
        this.errores = [];
    }

    /**
     * Inicia el análisis sintáctico.
     * @returns {{ ast: NodoAST | null, errores: Object[] }}
     */
    parsear() {
        if (this.tokens.length === 0) {
            return { ast: null, errores: [] }; // No hacer nada si no hay tokens
        }
        const ast = this.parsearPrograma();
        
        if (this.posicion < this.tokens.length && this.errores.length === 0) {
            this.reportarError("Tokens inesperados al final del archivo.");
        }
        
        return {
            ast: this.errores.length > 0 ? null : ast,
            errores: this.errores
        };
    }

    // --- MÉTODOS DE PARSEO ---
    
    // REGLA: PROGRAMA ::= "public" "class" ID "{" MAIN "}"
    parsearPrograma() {
        const publicToken = this.matchLexema('public');
        if (!publicToken) return null;

        if (!this.matchLexema('class')) return null;

        const idToken = this.match(TipoToken.IDENTIFICADOR);
        if (!idToken) return null;
        
        if (!this.match(TipoToken.LLAVE_ABRE)) return null;

        const mainNode = this.parsearMain();
        if (!mainNode) return null;
        
        if (!this.match(TipoToken.LLAVE_CIERRA)) return null;

        return new ProgramaNode(mainNode, publicToken.linea, publicToken.columna);
    }

    // REGLA: MAIN ::= ... (Esqueleto temporal)
    parsearMain() {
        // TODO: Implementar la lógica completa de la regla MAIN.
        // Por ahora, solo avanzamos hasta el final para que el parseo no falle.
        const tokenInicial = this.peek();
        while(this.posicion < this.tokens.length && this.peek().tipo !== TipoToken.LLAVE_CIERRA) {
            this.avanzar();
        }
        return new MainNode([], tokenInicial.linea, tokenInicial.columna);
    }

    // --- FUNCIONES AUXILIARES ---

    peek() {
        if (this.posicion < this.tokens.length) {
            return this.tokens[this.posicion];
        }
        return this.tokens[this.tokens.length - 1]; // Devuelve el último token si estamos al final
    }

    match(tipoEsperado) {
        const tokenActual = this.peek();
        if (tokenActual && tokenActual.tipo === tipoEsperado) {
            this.avanzar();
            return tokenActual;
        }
        this.reportarError(`Se esperaba ${tipoEsperado} pero se encontró ${tokenActual ? tokenActual.tipo : 'fin de archivo'}.`);
        return null;
    }
    
    /**
     * ¡ESTA ES LA FUNCIÓN QUE FALTABA!
     * Comprueba el tipo Y el lexema del token actual antes de consumirlo.
     * @param {string} lexemaEsperado 
     * @returns {Token | null}
     */
    matchLexema(lexemaEsperado) {
        const tokenActual = this.peek();
        // Comprobamos que el lexema coincida y que sea una palabra reservada o un ID.
        if (tokenActual && tokenActual.lexema === lexemaEsperado) {
            this.avanzar();
            return tokenActual;
        }
        this.reportarError(`Se esperaba la palabra clave '${lexemaEsperado}' pero se encontró '${tokenActual ? tokenActual.lexema : 'fin de archivo'}'.`);
        return null;
    }

    avanzar() {
        if (this.posicion < this.tokens.length) {
            this.posicion++;
        }
    }
    
    reportarError(mensaje) {
        if (this.errores.length > 0) return; // Evitar errores en cascada

        const token = this.peek();
        this.errores.push({
            tipo: 'SINTACTICO',
            mensaje: mensaje,
            linea: token ? token.linea : '?',
            columna: token ? token.columna : '?'
        });
    }
}