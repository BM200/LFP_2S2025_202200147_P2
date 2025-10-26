/**
 * AST.js - Árbol de Sintaxis Abstracta (Abstract Syntax Tree)
 * Define todas las clases de nodos para representar la estructura del programa Java
 * 
 * Restricción: NO se permite usar REGEX - Todo es procesamiento manual
 */

// ============================================================================
// CLASE BASE
// ============================================================================

class NodoAST {
    constructor(tipo) {
        this.tipo = tipo;
    }

    toString() {
        return JSON.stringify(this, null, 2);
    }
}

// ============================================================================
// PROGRAMA PRINCIPAL
// ============================================================================

class Programa extends NodoAST {
    /**
     * Representa: public class ID { MAIN }
     */
    constructor(nombreClase, main) {
        super('PROGRAMA');
        this.nombreClase = nombreClase;
        this.main = main;
    }

    toString() {
        return `Programa(clase: ${this.nombreClase})`;
    }
}

class MetodoMain extends NodoAST {
    /**
     * Representa: public static void main(String[] args) { SENTENCIAS }
     */
    constructor(nombreParametro, sentencias) {
        super('MAIN');
        this.nombreParametro = nombreParametro;
        this.sentencias = sentencias || [];
    }

    toString() {
        return `Main(param: ${this.nombreParametro}, sentencias: ${this.sentencias.length})`;
    }
}

// ============================================================================
// DECLARACIONES
// ============================================================================

class Declaracion extends NodoAST {
    /**
     * Representa: TIPO ID = EXPRESION;
     * Ejemplo: int x = 10;
     */
    constructor(tipo, identificador, expresion = null) {
        super('DECLARACION');
        this.tipoDato = tipo;
        this.identificador = identificador;
        this.expresion = expresion;
    }

    toString() {
        return `Declaracion(${this.tipoDato} ${this.identificador})`;
    }
}

// ============================================================================
// SENTENCIAS DE CONTROL
// ============================================================================

class SentenciaIf extends NodoAST {
    /**
     * Representa: if (CONDICION) { SENTENCIAS } [else { SENTENCIAS }]
     */
    constructor(condicion, sentenciasIf, sentenciasElse = null) {
        super('IF');
        this.condicion = condicion;
        this.sentenciasIf = sentenciasIf || [];
        this.sentenciasElse = sentenciasElse || [];
    }

    toString() {
        return `If(condicion, ${this.sentenciasIf.length} sentencias)`;
    }
}

class SentenciaFor extends NodoAST {
    /**
     * Representa: for (INIT; CONDICION; INCREMENTO) { SENTENCIAS }
     */
    constructor(inicializacion, condicion, incremento, sentencias) {
        super('FOR');
        this.inicializacion = inicializacion;
        this.condicion = condicion;
        this.incremento = incremento;
        this.sentencias = sentencias || [];
    }

    toString() {
        return `For(${this.sentencias.length} sentencias)`;
    }
}

class SentenciaWhile extends NodoAST {
    /**
     * Representa: while (CONDICION) { SENTENCIAS }
     */
    constructor(condicion, sentencias) {
        super('WHILE');
        this.condicion = condicion;
        this.sentencias = sentencias || [];
    }

    toString() {
        return `While(${this.sentencias.length} sentencias)`;
    }
}

class SentenciaDoWhile extends NodoAST {
    /**
     * Representa: do { SENTENCIAS } while (CONDICION);
     */
    constructor(sentencias, condicion) {
        super('DO_WHILE');
        this.sentencias = sentencias || [];
        this.condicion = condicion;
    }

    toString() {
        return `DoWhile(${this.sentencias.length} sentencias)`;
    }
}

// ============================================================================
// ASIGNACIÓN
// ============================================================================

class Asignacion extends NodoAST {
    /**
     * Representa: ID = EXPRESION;
     */
    constructor(identificador, expresion) {
        super('ASIGNACION');
        this.identificador = identificador;
        this.expresion = expresion;
    }

    toString() {
        return `Asignacion(${this.identificador} = ...)`;
    }
}

// ============================================================================
// EXPRESIONES
// ============================================================================

class ExpresionBinaria extends NodoAST {
    /**
     * Representa: EXPRESION OPERADOR EXPRESION
     * Operadores: +, -, *, /, %, ==, !=, <, >, <=, >=, &&, ||
     */
    constructor(izquierda, operador, derecha) {
        super('EXPRESION_BINARIA');
        this.izquierda = izquierda;
        this.operador = operador;
        this.derecha = derecha;
    }

    toString() {
        return `ExpBinaria(... ${this.operador} ...)`;
    }
}

class ExpresionUnaria extends NodoAST {
    /**
     * Representa: OPERADOR EXPRESION
     * Operadores: !, -, ++, --
     */
    constructor(operador, expresion, esPrefijo = true) {
        super('EXPRESION_UNARIA');
        this.operador = operador;
        this.expresion = expresion;
        this.esPrefijo = esPrefijo;
    }

    toString() {
        return `ExpUnaria(${this.operador} ...)`;
    }
}

class LlamadaFuncion extends NodoAST {
    /**
     * Representa: System.out.println(EXPRESION)
     */
    constructor(nombreFuncion, argumentos) {
        super('LLAMADA_FUNCION');
        this.nombreFuncion = nombreFuncion;
        this.argumentos = argumentos || [];
    }

    toString() {
        return `LlamadaFuncion(${this.nombreFuncion}, ${this.argumentos.length} args)`;
    }
}

// ============================================================================
// LITERALES
// ============================================================================

class Literal extends NodoAST {
    /**
     * Representa valores literales: números, cadenas, booleanos, caracteres
     */
    constructor(valor, tipoDato) {
        super('LITERAL');
        this.valor = valor;
        this.tipoDato = tipoDato; // 'int', 'double', 'String', 'boolean', 'char'
    }

    toString() {
        return `Literal(${this.tipoDato}: ${this.valor})`;
    }
}

class Identificador extends NodoAST {
    /**
     * Representa una referencia a una variable
     */
    constructor(nombre) {
        super('IDENTIFICADOR');
        this.nombre = nombre;
    }

    toString() {
        return `Id(${this.nombre})`;
    }
}

// ============================================================================
// COMENTARIOS
// ============================================================================

class Comentario extends NodoAST {
    /**
     * Representa un comentario de línea o de bloque
     */
    constructor(texto, tipoComentario) {
        super('COMENTARIO');
        this.texto = texto;
        this.tipoComentario = tipoComentario; // 'LINEA' o 'BLOQUE'
    }

    toString() {
        return `Comentario(${this.tipoComentario}: ${this.texto.substring(0, 30)}...)`;
    }
}

// ============================================================================
// EXPORTAR CLASES (para Node.js y navegador)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        NodoAST,
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
        Identificador,
        Comentario
    };
}
