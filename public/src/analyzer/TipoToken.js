// public/src/analyzer/TipoToken.js
const TipoToken = {
    IDENTIFICADOR: 'IDENTIFICADOR',
    PALABRA_RESERVADA: 'PALABRA_RESERVADA',
    NUMERO_ENTERO: 'NUMERO_ENTERO',
    NUMERO_DECIMAL: 'NUMERO_DECIMAL',
    CADENA: 'CADENA',
    CARACTER: 'CARACTER',
    LLAVE_ABRE: 'LLAVE_ABRE',
    LLAVE_CIERRA: 'LLAVE_CIERRA',
    PAR_ABRE: 'PAR_ABRE',
    PAR_CIERRA: 'PAR_CIERRA',
    COR_ABRE: 'CORCHETE_ABRE',
    COR_CIERRA: 'CORCHETE_CIERRA',
    PUNTO_COMA: 'PUNTO_COMA',
    COMA: 'COMA',
    PUNTO: 'PUNTO',
    MAS: 'MAS',
    MENOS: 'MENOS',
    MULTIPLICACION: 'MULTIPLICACION',
    DIVISION: 'DIVISION',
    IGUAL: 'ASIGNACION',
    IGUAL_IGUAL: 'IGUAL_QUE',
    DIFERENTE: 'DIFERENTE_DE',
    MENOR_QUE: 'MENOR_QUE',
    MAYOR_QUE: 'MAYOR_QUE',
    MENOR_IGUAL: 'MENOR_O_IGUAL_QUE',
    MAYOR_IGUAL: 'MAYOR_O_IGUAL_QUE',
    INCREMENTO: 'INCREMENTO',
    DECREMENTO: 'DECREMENTO',
};

const PALABRAS_RESERVADAS = new Set([
    'public', 'class', 'static', 'void', 'main', 'String', 'args',
    'int', 'double', 'char', 'boolean', 'true', 'false',
    'if', 'else', 'for', 'while', 'System', 'out', 'println'
]);