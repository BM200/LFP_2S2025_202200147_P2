/**
 * Clase Token
 * Representa un token identificado por el analizador léxico
 */

class Token {
    /**
     * Constructor de Token
     * @param {string} tipo - Tipo de token (de TipoToken)
     * @param {string} lexema - Texto del token
     * @param {number} linea - Línea donde aparece
     * @param {number} columna - Columna donde aparece
     */
    constructor(tipo, lexema, linea, columna) {
        this.tipo = tipo;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
    }

    /**
     * Representación en string del token
     * @returns {string}
     */
    toString() {
        return `Token(${this.tipo}, "${this.lexema}", línea: ${this.linea}, columna: ${this.columna})`;
    }

    /**
     * Convierte el token a objeto simple para JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            tipo: this.tipo,
            lexema: this.lexema,
            linea: this.linea,
            columna: this.columna
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Token;
}
