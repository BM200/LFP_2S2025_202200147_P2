// public/src/ast/Nodos.js

/**
 * Clase base para todos los nodos del AST.
 * Contiene información común como la línea y columna.
 */
class NodoAST {
    constructor(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
}

/**
 * Representa un programa completo.
 * Su hijo es el nodo del método main.
 */
class ProgramaNode extends NodoAST {
    constructor(main, linea, columna) {
        super(linea, columna);
        this.main = main;
    }
}

/**
 * Representa el método main.
 * Su hijo es una lista de sentencias.
 */
class MainNode extends NodoAST {
    constructor(sentencias, linea, columna) {
        super(linea, columna);
        this.sentencias = sentencias; // Un array de nodos de sentencia
    }
}

/**
 * Representa una declaración de variable.
 * Ej: int contador = 10;
 */
class DeclaracionNode extends NodoAST {
    constructor(tipo, identificador, expresion, linea, columna) {
        super(linea, columna);
        this.tipo = tipo; // El token del tipo (ej: 'int')
        this.identificador = identificador; // El token del ID (ej: 'contador')
        this.expresion = expresion; // El nodo de la expresión (ej: NodoLiteral para '10') o null
    }
}

/**
 * Representa una expresión binaria.
 * Ej: contador + 1
 */
class OperacionBinariaNode extends NodoAST {
    constructor(operador, izq, der, linea, columna) {
        super(linea, columna);
        this.operador = operador; // El token del operador (ej: '+')
        this.izq = izq; // Nodo izquierdo
        this.der = der; // Nodo derecho
    }
}

/**
 * Representa un valor literal.
 * Ej: 10, "Hola!", true
 */
class LiteralNode extends NodoAST {
    constructor(token) {
        super(token.linea, token.columna);
        this.token = token; // El token completo del literal
    }
}

/**
 * Representa el uso de un identificador en una expresión.
 * Ej: usar 'contador' en una suma.
 */
class IdentificadorNode extends NodoAST {
    constructor(token) {
        super(token.linea, token.columna);
        this.token = token; // El token completo del ID
    }
}

// Podríamos seguir añadiendo nodos para If, For, While, etc.
// pero esto es un excelente punto de partida.