/**
 * Enumeración de tipos de tokens
 * NO SE USA REGEX - Solo clasificación de tokens
 */

const TipoToken = {
    // Palabras reservadas
    PALABRA_RESERVADA: 'PALABRA_RESERVADA',
    
    // Identificadores y literales
    IDENTIFICADOR: 'IDENTIFICADOR',
    NUMERO_ENTERO: 'NUMERO_ENTERO',
    NUMERO_DECIMAL: 'NUMERO_DECIMAL',
    CADENA: 'CADENA',
    CARACTER: 'CARACTER',
    BOOLEANO: 'BOOLEANO',
    
    // Símbolos
    LLAVE_ABRE: 'LLAVE_ABRE',           // {
    LLAVE_CIERRA: 'LLAVE_CIERRA',       // }
    PAR_ABRE: 'PAR_ABRE',               // (
    PAR_CIERRA: 'PAR_CIERRA',           // )
    COR_ABRE: 'COR_ABRE',               // [
    COR_CIERRA: 'COR_CIERRA',           // ]
    PUNTO_COMA: 'PUNTO_COMA',           // ;
    COMA: 'COMA',                       // ,
    PUNTO: 'PUNTO',                     // .
    
    // Operadores de asignación
    IGUAL: 'IGUAL',                     // =
    
    // Operadores aritméticos
    MAS: 'MAS',                         // +
    MENOS: 'MENOS',                     // -
    MULTIPLICACION: 'MULTIPLICACION',   // *
    DIVISION: 'DIVISION',               // /
    MODULO: 'MODULO',                   // %
    
    // Operadores lógicos
    AND: 'AND',                         // &&
    OR: 'OR',                           // ||
    NOT: 'NOT',                         // !
    
    // Operadores de comparación
    IGUAL_IGUAL: 'IGUAL_IGUAL',         // ==
    DIFERENTE: 'DIFERENTE',             // !=
    MAYOR_QUE: 'MAYOR_QUE',             // >
    MENOR_QUE: 'MENOR_QUE',             // <
    MAYOR_IGUAL: 'MAYOR_IGUAL',         // >=
    MENOR_IGUAL: 'MENOR_IGUAL',         // <=
    
    // Operadores de incremento/decremento
    INCREMENTO: 'INCREMENTO',           // ++
    DECREMENTO: 'DECREMENTO',           // --
    
    // Comentarios
    COMENTARIO_LINEA: 'COMENTARIO_LINEA',
    COMENTARIO_BLOQUE: 'COMENTARIO_BLOQUE',
    
    // Fin de archivo
    EOF: 'EOF'
};

// Palabras reservadas de Java (case-sensitive)
// NOTA: args, System, out, println son identificadores, NO palabras reservadas
const PALABRAS_RESERVADAS = new Set([
    'public',
    'class',
    'static',
    'void',
    'main',
    'String',
    'int',
    'double',
    'char',
    'boolean',
    'true',
    'false',
    'if',
    'else',
    'for',
    'while',
    'do'
]);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TipoToken, PALABRAS_RESERVADAS };
}
