/**
 * TablaSimbolos.js - Tabla de símbolos para el análisis semántico
 * Almacena información sobre variables declaradas y su ámbito
 * 
 * Restricción: NO se permite usar REGEX - Todo es procesamiento manual
 */

class Simbolo {
    constructor(nombre, tipo, valor = null, linea = 0, columna = 0) {
        this.nombre = nombre;
        this.tipo = tipo;          // 'int', 'double', 'String', 'boolean', 'char'
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        this.usado = false;        // Para detectar variables no usadas
    }

    toString() {
        return `Simbolo(${this.nombre}: ${this.tipo})`;
    }
}

class TablaSimbolos {
    constructor(padre = null) {
        this.simbolos = new Map();  // nombre -> Simbolo
        this.padre = padre;         // Tabla de símbolos padre (para ámbitos anidados)
        this.hijos = [];            // Tablas de símbolos hijas
    }

    /**
     * Agrega un nuevo símbolo a la tabla
     * Retorna true si se agregó correctamente, false si ya existe
     */
    agregar(nombre, tipo, valor = null, linea = 0, columna = 0) {
        if (this.simbolos.has(nombre)) {
            return {
                exito: false,
                error: `Variable '${nombre}' ya declarada en este ámbito (línea ${this.simbolos.get(nombre).linea})`
            };
        }

        const simbolo = new Simbolo(nombre, tipo, valor, linea, columna);
        this.simbolos.set(nombre, simbolo);
        
        return {
            exito: true,
            simbolo: simbolo
        };
    }

    /**
     * Busca un símbolo en esta tabla o en las tablas padre
     */
    buscar(nombre) {
        if (this.simbolos.has(nombre)) {
            return this.simbolos.get(nombre);
        }

        // Buscar en tabla padre (ámbito superior)
        if (this.padre !== null) {
            return this.padre.buscar(nombre);
        }

        return null;
    }

    /**
     * Actualiza el valor de un símbolo existente
     */
    actualizar(nombre, nuevoValor) {
        const simbolo = this.buscar(nombre);
        
        if (simbolo === null) {
            return {
                exito: false,
                error: `Variable '${nombre}' no declarada`
            };
        }

        simbolo.valor = nuevoValor;
        simbolo.usado = true;

        return {
            exito: true,
            simbolo: simbolo
        };
    }

    /**
     * Marca un símbolo como usado
     */
    marcarUsado(nombre) {
        const simbolo = this.buscar(nombre);
        if (simbolo !== null) {
            simbolo.usado = true;
        }
    }

    /**
     * Verifica si un símbolo existe (en cualquier ámbito)
     */
    existe(nombre) {
        return this.buscar(nombre) !== null;
    }

    /**
     * Crea una nueva tabla de símbolos hija (para un nuevo ámbito)
     */
    crearHija() {
        const hija = new TablaSimbolos(this);
        this.hijos.push(hija);
        return hija;
    }

    /**
     * Obtiene todos los símbolos de esta tabla (sin incluir padre)
     */
    obtenerSimbolos() {
        return Array.from(this.simbolos.values());
    }

    /**
     * Obtiene variables no usadas
     */
    obtenerNoUsadas() {
        return this.obtenerSimbolos().filter(s => !s.usado);
    }

    /**
     * Imprime la tabla de símbolos (para depuración)
     */
    toString() {
        let resultado = '┌─────────────────────────────────────────┐\n';
        resultado += '│      TABLA DE SÍMBOLOS                  │\n';
        resultado += '├───────────────┬──────────┬──────────────┤\n';
        resultado += '│ Nombre        │ Tipo     │ Valor        │\n';
        resultado += '├───────────────┼──────────┼──────────────┤\n';

        if (this.simbolos.size === 0) {
            resultado += '│ (vacía)                                 │\n';
        } else {
            for (const [nombre, simbolo] of this.simbolos) {
                const nombrePad = nombre.padEnd(13);
                const tipoPad = simbolo.tipo.padEnd(8);
                const valorStr = simbolo.valor !== null ? String(simbolo.valor) : 'null';
                const valorPad = valorStr.substring(0, 12).padEnd(12);
                resultado += `│ ${nombrePad} │ ${tipoPad} │ ${valorPad} │\n`;
            }
        }

        resultado += '└───────────────┴──────────┴──────────────┘\n';

        return resultado;
    }

    /**
     * Genera reporte HTML de la tabla de símbolos
     */
    generarReporteHTML() {
        let html = '<table class="tabla-simbolos">\n';
        html += '  <thead>\n';
        html += '    <tr>\n';
        html += '      <th>Nombre</th>\n';
        html += '      <th>Tipo</th>\n';
        html += '      <th>Valor</th>\n';
        html += '      <th>Línea</th>\n';
        html += '      <th>Usado</th>\n';
        html += '    </tr>\n';
        html += '  </thead>\n';
        html += '  <tbody>\n';

        if (this.simbolos.size === 0) {
            html += '    <tr><td colspan="5" style="text-align: center;">Sin variables declaradas</td></tr>\n';
        } else {
            for (const [nombre, simbolo] of this.simbolos) {
                const usado = simbolo.usado ? '✓' : '✗';
                const clase = simbolo.usado ? '' : ' class="no-usado"';
                html += `    <tr${clase}>\n`;
                html += `      <td>${nombre}</td>\n`;
                html += `      <td>${simbolo.tipo}</td>\n`;
                html += `      <td>${simbolo.valor !== null ? simbolo.valor : 'null'}</td>\n`;
                html += `      <td>${simbolo.linea}</td>\n`;
                html += `      <td>${usado}</td>\n`;
                html += `    </tr>\n`;
            }
        }

        html += '  </tbody>\n';
        html += '</table>\n';

        return html;
    }
}

// ============================================================================
// EXPORTAR (para Node.js y navegador)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Simbolo,
        TablaSimbolos
    };
}
