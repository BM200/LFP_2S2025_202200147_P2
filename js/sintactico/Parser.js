/**
 * Parser.js - Analizador Sintáctico (Parser)
 * Implementa un analizador sintáctico descendente recursivo
 * 
 * GRAMÁTICA JavaBridge:
 * PROGRAMA    ::= 'public' 'class' ID '{' MAIN '}'
 * MAIN        ::= 'public' 'static' 'void' 'main' '(' 'String' '[' ']' ID ')' '{' SENTENCIAS '}'
 * SENTENCIAS  ::= SENTENCIA SENTENCIAS | ε
 * SENTENCIA   ::= DECLARACION | IGUAL | IF | FOR | WHILE | DO_WHILE | PRINT | INCREMENTO | DECREMENTO
 * 
 * Restricción: NO se permite usar REGEX - Todo es procesamiento manual
 */

// Importar dependencias (Node.js)
if (typeof require !== 'undefined') {
    const { TablaSimbolos } = require('./TablaSimbolos.js');
    const {
        Programa,
        MetodoMain,
        Declaracion,
        SentenciaIf,
        SentenciaFor,
        SentenciaWhile,
        SentenciaDoWhile,
        Asignacion,
        ExpresionBinaria,
        ExpresionUnaria,
        LlamadaFuncion,
        Literal,
        Identificador
    } = require('./AST.js');

    // Hacer disponibles globalmente para uso en la clase
    global.TablaSimbolos = TablaSimbolos;
    global.Programa = Programa;
    global.MetodoMain = MetodoMain;
    global.Declaracion = Declaracion;
    global.SentenciaIf = SentenciaIf;
    global.SentenciaFor = SentenciaFor;
    global.SentenciaWhile = SentenciaWhile;
    global.SentenciaDoWhile = SentenciaDoWhile;
    global.Asignacion = Asignacion;
    global.ExpresionBinaria = ExpresionBinaria;
    global.ExpresionUnaria = ExpresionUnaria;
    global.LlamadaFuncion = LlamadaFuncion;
    global.Literal = Literal;
    global.Identificador = Identificador;
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.posicion = 0;
        this.errores = [];
        this.tablaSimbolos = null;
        this.ast = null;
    }

    /**
     * Método principal que inicia el análisis sintáctico
     */
    parse() {
        try {
            this.tablaSimbolos = new TablaSimbolos();
            this.ast = this.parsearPrograma();

            return {
                exito: this.errores.length === 0,
                ast: this.ast,
                tablaSimbolos: this.tablaSimbolos,
                errores: this.errores
            };
        } catch (error) {
            this.errores.push({
                tipo: 'ERROR_SINTACTICO_FATAL',
                mensaje: error.message,
                linea: this.tokenActual()?.linea || 0,
                columna: this.tokenActual()?.columna || 0
            });

            return {
                exito: false,
                ast: null,
                tablaSimbolos: this.tablaSimbolos,
                errores: this.errores
            };
        }
    }

    // ========================================================================
    // MÉTODOS AUXILIARES
    // ========================================================================

    tokenActual() {
        if (this.posicion < this.tokens.length) {
            return this.tokens[this.posicion];
        }
        return null;
    }

    tokenSiguiente() {
        if (this.posicion + 1 < this.tokens.length) {
            return this.tokens[this.posicion + 1];
        }
        return null;
    }

    avanzar() {
        if (this.posicion < this.tokens.length) {
            this.posicion++;
        }
    }

    esperarToken(tipoEsperado, valorEsperado = null) {
        const token = this.tokenActual();

        if (token === null) {
            this.reportarError(`Se esperaba '${tipoEsperado}' pero se llegó al final del archivo`);
            return null;
        }

        if (token.tipo !== tipoEsperado) {
            this.reportarError(`Se esperaba '${tipoEsperado}' pero se encontró '${token.tipo}'`);
            return null;
        }

        if (valorEsperado !== null && token.lexema !== valorEsperado) {
            this.reportarError(`Se esperaba '${valorEsperado}' pero se encontró '${token.lexema}'`);
            return null;
        }

        this.avanzar();
        return token;
    }

    reportarError(mensaje) {
        const token = this.tokenActual();
        this.errores.push({
            tipo: 'ERROR_SINTACTICO',
            mensaje: mensaje,
            linea: token?.linea || 0,
            columna: token?.columna || 0,
            token: token?.lexema || 'EOF'
        });
    }

    esTipoDato(token) {
        if (!token) return false;
        const tipos = ['int', 'double', 'boolean', 'char', 'String'];
        return token.tipo === 'PALABRA_RESERVADA' && tipos.includes(token.lexema);
    }

    // ========================================================================
    // REGLAS DE LA GRAMÁTICA
    // ========================================================================

    /**
     * PROGRAMA ::= 'public' 'class' ID '{' MAIN '}'
     */
    parsearPrograma() {
        this.esperarToken('PALABRA_RESERVADA', 'public');
        this.esperarToken('PALABRA_RESERVADA', 'class');
        
        const nombreClase = this.esperarToken('IDENTIFICADOR');
        if (!nombreClase) {
            throw new Error('Se esperaba el nombre de la clase');
        }

        this.esperarToken('LLAVE_ABRE');
        const main = this.parsearMain();
        this.esperarToken('LLAVE_CIERRA');

        return new Programa(nombreClase.lexema, main);
    }

    /**
     * MAIN ::= 'public' 'static' 'void' 'main' '(' 'String' '[' ']' ID ')' '{' SENTENCIAS '}'
     */
    parsearMain() {
        this.esperarToken('PALABRA_RESERVADA', 'public');
        this.esperarToken('PALABRA_RESERVADA', 'static');
        this.esperarToken('PALABRA_RESERVADA', 'void');
        this.esperarToken('PALABRA_RESERVADA', 'main');
        this.esperarToken('PAR_ABRE');
        this.esperarToken('PALABRA_RESERVADA', 'String');
        this.esperarToken('COR_ABRE');
        this.esperarToken('COR_CIERRA');
        
        const nombreParam = this.esperarToken('IDENTIFICADOR');
        
        this.esperarToken('PAR_CIERRA');
        this.esperarToken('LLAVE_ABRE');

        const sentencias = this.parsearSentencias();

        this.esperarToken('LLAVE_CIERRA');

        return new MetodoMain(nombreParam?.lexema || 'args', sentencias);
    }

    /**
     * SENTENCIAS ::= SENTENCIA SENTENCIAS | ε
     */
    parsearSentencias() {
        const sentencias = [];

        while (this.tokenActual() && this.tokenActual().tipo !== 'LLAVE_CIERRA') {
            const sentencia = this.parsearSentencia();
            if (sentencia) {
                // Si es un array (declaraciones múltiples), agregar cada elemento
                if (Array.isArray(sentencia)) {
                    sentencias.push(...sentencia);
                } else {
                    sentencias.push(sentencia);
                }
            } else {
                // Si no se pudo parsear, avanzar para evitar ciclo infinito
                this.avanzar();
            }
        }

        return sentencias;
    }

    /**
     * SENTENCIA ::= DECLARACION | IGUAL | IF | FOR | WHILE | DO_WHILE | PRINT | INCREMENTO | DECREMENTO
     */
    parsearSentencia() {
        const token = this.tokenActual();

        if (!token) return null;

        // IGNORAR COMENTARIOS - El léxico los reconoce, pero el parser los salta
        if (token.tipo === 'COMENTARIO_LINEA' || token.tipo === 'COMENTARIO_BLOQUE') {
            this.avanzar(); // Saltar el comentario
            return this.parsearSentencia(); // Continuar con la siguiente sentencia
        }

        // Declaración: int x = 10;
        if (this.esTipoDato(token)) {
            return this.parsearDeclaracion();
        }

        // Estructuras de control
        if (token.tipo === 'PALABRA_RESERVADA') {
            switch (token.lexema) {
                case 'if':
                    return this.parsearIf();
                case 'for':
                    return this.parsearFor();
                case 'while':
                    return this.parsearWhile();
                case 'do':
                    return this.parsearDoWhile();
            }
        }

        // Asignación o incremento/decremento: x = 10; o x++;
        if (token.tipo === 'IDENTIFICADOR') {
            const siguiente = this.tokenSiguiente();
            
            // System.out.println()
            if (token.lexema === 'System') {
                return this.parsearPrint();
            }
            
            if (siguiente && siguiente.tipo === 'IGUAL') {
                return this.parsearAsignacion();
            }
            
            if (siguiente && (siguiente.tipo === 'INCREMENTO' || siguiente.tipo === 'DECREMENTO')) {
                return this.parsearIncrementoDecremento();
            }
        }

        this.reportarError(`Sentencia no reconocida: '${token.lexema}'`);
        return null;
    }

    /**
     * DECLARACION ::= TIPO ID ('=' EXPRESION)? (',' ID ('=' EXPRESION)?)* ';'
     * Soporta:
     * - int a;
     * - int a = 10;
     * - int a, b, c;
     * - int x = 1, y = 2, z = 3;
     */
    parsearDeclaracion() {
        const tipo = this.tokenActual();
        this.avanzar();

        const declaraciones = [];

        do {
            const id = this.esperarToken('IDENTIFICADOR');
            if (!id) return null;

            let expresion = null;

            // Verificar si hay inicialización
            if (this.tokenActual() && this.tokenActual().tipo === 'IGUAL') {
                this.avanzar(); // Consumir '='
                expresion = this.parsearExpresion();
            }

            // Agregar a tabla de símbolos
            const resultado = this.tablaSimbolos.agregar(
                id.lexema,
                tipo.lexema,
                null,
                id.linea,
                id.columna
            );

            if (!resultado.exito) {
                this.reportarError(resultado.error);
            }

            // Crear nodo de declaración
            const nodoDeclaracion = new Declaracion(
                tipo.lexema,
                id.lexema,
                expresion,
                id.linea,
                id.columna
            );

            declaraciones.push(nodoDeclaracion);

            // Verificar si hay más declaraciones (separadas por coma)
            if (this.tokenActual() && this.tokenActual().tipo === 'COMA') {
                this.avanzar(); // Consumir ','
                continue; // Continuar con la siguiente declaración
            } else {
                break; // No hay más declaraciones
            }

        } while (true);

        this.esperarToken('PUNTO_COMA');

        // Si solo hay una declaración, retornar el nodo directamente
        // Si hay múltiples, retornar un array (el AST lo manejará)
        return declaraciones.length === 1 ? declaraciones[0] : declaraciones;
    }

    /**
     * ASIGNACION ::= ID '=' EXPRESION ';'
     */
    parsearAsignacion() {
        const id = this.esperarToken('IDENTIFICADOR');
        if (!id) return null;

        // Verificar que la variable exista
        if (!this.tablaSimbolos.existe(id.lexema)) {
            this.reportarError(`Variable '${id.lexema}' no declarada`);
        } else {
            this.tablaSimbolos.marcarUsado(id.lexema);
        }

        this.esperarToken('IGUAL');
        const expresion = this.parsearExpresion();
        this.esperarToken('PUNTO_COMA');

        return new Asignacion(id.lexema, expresion);
    }

    /**
     * IF ::= 'if' '(' EXPRESION ')' '{' SENTENCIAS '}' ['else' '{' SENTENCIAS '}']
     */
    parsearIf() {
        this.esperarToken('PALABRA_RESERVADA', 'if');
        this.esperarToken('PAR_ABRE');
        const condicion = this.parsearExpresion();
        this.esperarToken('PAR_CIERRA');
        this.esperarToken('LLAVE_ABRE');
        const sentenciasIf = this.parsearSentencias();
        this.esperarToken('LLAVE_CIERRA');

        let sentenciasElse = null;

        // Verificar else opcional
        if (this.tokenActual() && this.tokenActual().lexema === 'else') {
            this.avanzar();
            this.esperarToken('LLAVE_ABRE');
            sentenciasElse = this.parsearSentencias();
            this.esperarToken('LLAVE_CIERRA');
        }

        return new SentenciaIf(condicion, sentenciasIf, sentenciasElse);
    }

    /**
     * FOR ::= 'for' '(' DECLARACION EXPRESION ';' EXPRESION ')' '{' SENTENCIAS '}'
     */
    parsearFor() {
        this.esperarToken('PALABRA_RESERVADA', 'for');
        this.esperarToken('PAR_ABRE');

        // Crear nuevo ámbito para el for
        const tablaAnterior = this.tablaSimbolos;
        this.tablaSimbolos = this.tablaSimbolos.crearHija();

        const inicializacion = this.parsearDeclaracion();
        const condicion = this.parsearExpresion();
        this.esperarToken('PUNTO_COMA');
        const incremento = this.parsearExpresionSimple();

        this.esperarToken('PAR_CIERRA');
        this.esperarToken('LLAVE_ABRE');
        const sentencias = this.parsearSentencias();
        this.esperarToken('LLAVE_CIERRA');

        // MENOSurar tabla anterior
        this.tablaSimbolos = tablaAnterior;

        return new SentenciaFor(inicializacion, condicion, incremento, sentencias);
    }

    /**
     * WHILE ::= 'while' '(' EXPRESION ')' '{' SENTENCIAS '}'
     */
    parsearWhile() {
        this.esperarToken('PALABRA_RESERVADA', 'while');
        this.esperarToken('PAR_ABRE');
        const condicion = this.parsearExpresion();
        this.esperarToken('PAR_CIERRA');
        this.esperarToken('LLAVE_ABRE');
        const sentencias = this.parsearSentencias();
        this.esperarToken('LLAVE_CIERRA');

        return new SentenciaWhile(condicion, sentencias);
    }

    /**
     * DO_WHILE ::= 'do' '{' SENTENCIAS '}' 'while' '(' EXPRESION ')' ';'
     */
    parsearDoWhile() {
        this.esperarToken('PALABRA_RESERVADA', 'do');
        this.esperarToken('LLAVE_ABRE');
        const sentencias = this.parsearSentencias();
        this.esperarToken('LLAVE_CIERRA');
        this.esperarToken('PALABRA_RESERVADA', 'while');
        this.esperarToken('PAR_ABRE');
        const condicion = this.parsearExpresion();
        this.esperarToken('PAR_CIERRA');
        this.esperarToken('PUNTO_COMA');

        return new SentenciaDoWhile(sentencias, condicion);
    }

    /**
     * PRINT ::= 'System' '.' 'out' '.' 'println' '(' EXPRESION ')' ';'
     */
    /**
     * PRINT ::= 'System' '.' 'out' '.' 'println' '(' EXPRESION ')' ';'
     */
    parsearPrint() {
        this.esperarToken('IDENTIFICADOR', 'System');
        this.esperarToken('PUNTO');
        this.esperarToken('IDENTIFICADOR', 'out');
        this.esperarToken('PUNTO');
        this.esperarToken('IDENTIFICADOR', 'println');
        this.esperarToken('PAR_ABRE');
        const expresion = this.parsearExpresion();
        this.esperarToken('PAR_CIERRA');
        this.esperarToken('PUNTO_COMA');

        return new LlamadaFuncion('System.out.println', [expresion]);
    }

    /**
     * INCREMENTO/DECREMENTO ::= ID '++' ';' | ID '--' ';'
     */
    parsearIncrementoDecremento() {
        const id = this.esperarToken('IDENTIFICADOR');
        const operador = this.tokenActual();
        this.avanzar(); // ++ o --
        this.esperarToken('PUNTO_COMA');

        // Verificar que la variable exista
        if (!this.tablaSimbolos.existe(id.lexema)) {
            this.reportarError(`Variable '${id.lexema}' no declarada`);
        } else {
            this.tablaSimbolos.marcarUsado(id.lexema);
        }

        return new ExpresionUnaria(operador.tipo, new Identificador(id.lexema), false);
    }

    /**
     * EXPRESION ::= EXPRESION_OR
     */
    parsearExpresion() {
        return this.parsearExpresionOr();
    }

    /**
     * EXPRESION_OR ::= EXPRESION_AND ('||' EXPRESION_AND)*
     */
    parsearExpresionOr() {
        let izquierda = this.parsearExpresionAnd();

        while (this.tokenActual() && this.tokenActual().tipo === 'OR') {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionAnd();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_AND ::= EXPRESION_IGUAL_IGUAL ('&&' EXPRESION_IGUAL_IGUAL)*
     */
    parsearExpresionAnd() {
        let izquierda = this.parsearExpresionIGUAL_IGUAL();

        while (this.tokenActual() && this.tokenActual().tipo === 'AND') {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionIGUAL_IGUAL();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_IGUAL_IGUAL ::= EXPRESION_RELACIONAL (('==' | '!=') EXPRESION_RELACIONAL)*
     */
    parsearExpresionIGUAL_IGUAL() {
        let izquierda = this.parsearExpresionRelacional();

        while (this.tokenActual() && (this.tokenActual().tipo === 'IGUAL_IGUAL' || this.tokenActual().tipo === 'DIFERENTE')) {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionRelacional();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_RELACIONAL ::= EXPRESION_ADITIVA (('<' | '>' | '<=' | '>=') EXPRESION_ADITIVA)*
     */
    parsearExpresionRelacional() {
        let izquierda = this.parsearExpresionAditiva();

        while (this.tokenActual() && 
               (this.tokenActual().tipo === 'MENOR_QUE' || 
                this.tokenActual().tipo === 'MAYOR_QUE' ||
                this.tokenActual().tipo === 'MENOR_IGUAL' ||
                this.tokenActual().tipo === 'MAYOR_IGUAL')) {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionAditiva();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_ADITIVA ::= EXPRESION_MULTIPLICATIVA (('+' | '-') EXPRESION_MULTIPLICATIVA)*
     */
    parsearExpresionAditiva() {
        let izquierda = this.parsearExpresionMultiplicativa();

        while (this.tokenActual() && (this.tokenActual().tipo === 'MAS' || this.tokenActual().tipo === 'MENOS')) {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionMultiplicativa();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_MULTIPLICATIVA ::= EXPRESION_UNARIA (('*' | '/' | '%') EXPRESION_UNARIA)*
     */
    parsearExpresionMultiplicativa() {
        let izquierda = this.parsearExpresionUnaria();

        while (this.tokenActual() && 
               (this.tokenActual().tipo === 'MULTIPLICACION' || 
                this.tokenActual().tipo === 'DIVISION' ||
                this.tokenActual().tipo === 'MODULO')) {
            const operador = this.tokenActual();
            this.avanzar();
            const derecha = this.parsearExpresionUnaria();
            izquierda = new ExpresionBinaria(izquierda, operador.lexema, derecha);
        }

        return izquierda;
    }

    /**
     * EXPRESION_UNARIA ::= ('!' | '-' | '++' | '--') EXPRESION_PRIMARIA
     *                   |  EXPRESION_PRIMARIA
     */
    parsearExpresionUnaria() {
        const token = this.tokenActual();

        if (token && (token.tipo === 'NOT' || token.tipo === 'MENOS' || 
                      token.tipo === 'INCREMENTO' || token.tipo === 'DECREMENTO')) {
            this.avanzar();
            const expresion = this.parsearExpresionPrimaria();
            return new ExpresionUnaria(token.lexema, expresion, true);
        }

        return this.parsearExpresionPrimaria();
    }

    /**
     * EXPRESION_PRIMARIA ::= NUMERO | CADENA | CARACTER | BOOLEANO | IDENTIFICADOR | '(' EXPRESION ')'
     */
    parsearExpresionPrimaria() {
        const token = this.tokenActual();

        if (!token) {
            this.reportarError('Se esperaba una expresión');
            return null;
        }

        // Número
        if (token.tipo === 'NUMERO_ENTERO') {
            this.avanzar();
            return new Literal(parseInt(token.lexema), 'int');
        }

        if (token.tipo === 'NUMERO_DECIMAL') {
            this.avanzar();
            return new Literal(parseFloat(token.lexema), 'double');
        }

        // Cadena
        if (token.tipo === 'CADENA') {
            this.avanzar();
            return new Literal(token.lexema, 'String');
        }

        // Caracter
        if (token.tipo === 'CARACTER') {
            this.avanzar();
            return new Literal(token.lexema, 'char');
        }

        // Boolean
        if (token.tipo === 'PALABRA_RESERVADA' && (token.lexema === 'true' || token.lexema === 'false')) {
            this.avanzar();
            return new Literal(token.lexema === 'true', 'boolean');
        }

        // Identificador
        if (token.tipo === 'IDENTIFICADOR') {
            this.avanzar();
            
            // Verificar que la variable exista
            if (!this.tablaSimbolos.existe(token.lexema)) {
                this.reportarError(`Variable '${token.lexema}' no declarada`);
            } else {
                this.tablaSimbolos.marcarUsado(token.lexema);
            }
            
            return new Identificador(token.lexema);
        }

        // Paréntesis
        if (token.tipo === 'PAR_ABRE') {
            this.avanzar();
            const expresion = this.parsearExpresion();
            this.esperarToken('PAR_CIERRA');
            return expresion;
        }

        this.reportarError(`Token inesperado en expresión: '${token.lexema}'`);
        return null;
    }

    /**
     * Parsea expresión simple para incremento en for (i++)
     */
    parsearExpresionSimple() {
        const token = this.tokenActual();

        if (token && token.tipo === 'IDENTIFICADOR') {
            const id = token.lexema;
            this.avanzar();

            const siguiente = this.tokenActual();
            if (siguiente && (siguiente.tipo === 'INCREMENTO' || siguiente.tipo === 'DECREMENTO')) {
                const operador = siguiente.lexema;
                this.avanzar();
                return new ExpresionUnaria(operador, new Identificador(id), false);
            }

            // i = i + 1
            if (siguiente && siguiente.tipo === 'IGUAL') {
                this.avanzar();
                const expresion = this.parsearExpresion();
                return new IGUAL(id, expresion);
            }
        }

        return null;
    }
}

// ============================================================================
// EXPORTAR (para Node.js y navegador)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Parser;
}
