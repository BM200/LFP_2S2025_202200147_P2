/**
 * Traductor.js - Traduce AST de Java a código Python
 * Convierte el árbol sintáctico abstracto generado por el Parser a código Python equivalente
 */

// Importar dependencias (Node.js)
if (typeof require !== 'undefined') {
    // Las clases del AST ya están disponibles globalmente desde el Parser
}

class Traductor {
    constructor(ast, tablaSimbolos) {
        this.ast = ast;
        this.tablaSimbolos = tablaSimbolos;
        this.codigoPython = '';
        this.indentacion = 0;
        this.errores = [];
    }

    /**
     * Método principal que inicia la traducción
     */
    traducir() {
        try {
            if (!this.ast) {
                throw new Error('No hay AST para traducir');
            }

            this.codigoPython = this.traducirPrograma(this.ast);

            return {
                exito: this.errores.length === 0,
                codigo: this.codigoPython,
                errores: this.errores
            };
        } catch (error) {
            this.errores.push({
                tipo: 'ERROR_TRADUCCION',
                mensaje: error.message
            });

            return {
                exito: false,
                codigo: this.codigoPython,
                errores: this.errores
            };
        }
    }

    // ========================================================================
    // MÉTODOS AUXILIARES
    // ========================================================================

    indent() {
        return '    '.repeat(this.indentacion);
    }

    aumentarIndentacion() {
        this.indentacion++;
    }

    disminuirIndentacion() {
        if (this.indentacion > 0) {
            this.indentacion--;
        }
    }

    agregarLinea(codigo) {
        this.codigoPython += this.indent() + codigo + '\n';
    }

    // ========================================================================
    // TRADUCCIÓN DE NODOS DEL AST
    // ========================================================================

    /**
     * Traduce el nodo PROGRAMA
     */
    traducirPrograma(nodo) {
        let codigo = '';
        
        // Comentario inicial
        codigo += `# Código traducido de Java a Python\n`;
        codigo += `# Clase original: ${nodo.nombreClase}\n`;
        codigo += `# Generado por JavaBridge\n\n`;

        // Traducir el método main
        if (nodo.main) {
            codigo += this.traducirMain(nodo.main);
        }

        return codigo;
    }

    /**
     * Traduce el método main
     */
    traducirMain(nodo) {
        let codigo = '';
        
        // Python no necesita una función main obligatoria, pero la creamos por claridad
        codigo += 'def main():\n';
        this.aumentarIndentacion();

        // Traducir sentencias
        if (nodo.sentencias && nodo.sentencias.length > 0) {
            for (const sentencia of nodo.sentencias) {
                codigo += this.traducirSentencia(sentencia);
            }
        } else {
            codigo += this.indent() + 'pass\n';
        }

        this.disminuirIndentacion();
        
        // Llamada al main
        codigo += '\nif __name__ == "__main__":\n';
        codigo += '    main()\n';

        return codigo;
    }

    /**
     * Traduce una sentencia
     */
    traducirSentencia(nodo) {
        if (!nodo) return '';

        switch (nodo.tipo) {
            case 'COMENTARIO':
                return this.traducirComentario(nodo);
            case 'DECLARACION':
                return this.traducirDeclaracion(nodo);
            case 'ASIGNACION':
                return this.traducirAsignacion(nodo);
            case 'IF':
                return this.traducirIf(nodo);
            case 'FOR':
                return this.traducirFor(nodo);
            case 'WHILE':
                return this.traducirWhile(nodo);
            case 'DO_WHILE':
                return this.traducirDoWhile(nodo);
            case 'LLAMADA_FUNCION':
                return this.traducirLlamadaFuncion(nodo);
            case 'EXPRESION_UNARIA':
                return this.traducirExpresionUnaria(nodo);
            default:
                this.errores.push({
                    tipo: 'NODO_NO_SOPORTADO',
                    mensaje: `Tipo de nodo no soportado: ${nodo.tipo}`
                });
                return '';
        }
    }

    /**
     * Traduce un comentario de Java a Python
     * Comentarios de línea se convierten a # en Python
     * Comentarios de bloque se convierten a # o triple comilla
     */
    traducirComentario(nodo) {
        let codigo = this.indent();

        if (nodo.tipoComentario === 'LINEA') {
            // Comentario de línea: // texto → # texto
            const texto = nodo.texto.replace(/^\/\/\s*/, ''); // Quitar //
            codigo += `# ${texto}\n`;
        } else if (nodo.tipoComentario === 'BLOQUE') {
            // Comentario de bloque: quitar delimitadores y usar # o triple comilla
            let texto = nodo.texto.replace(/^\/\*\s*/, '').replace(/\s*\*\/$/, ''); // Quitar delimitadores
            
            // Si el comentario tiene saltos de línea, usar comentario multilinea de Python
            if (texto.includes('\n')) {
                codigo += `"""\n${texto}\n"""\n`;
            } else {
                codigo += `# ${texto}\n`;
            }
        }

        return codigo;
    }

    /**
     * Traduce una declaración de variable
     * Java: int x = 10;
     * Python: x = 10
     */
    traducirDeclaracion(nodo) {
        let codigo = this.indent();

        // En Python no se declara el tipo
        codigo += nodo.identificador;

        if (nodo.expresion) {
            codigo += ' = ' + this.traducirExpresion(nodo.expresion);
        } else {
            // Inicializar con None si no hay valor inicial
            codigo += ' = None';
        }

        return codigo + '\n';
    }

    /**
     * Traduce una asignación
     * Java: x = 10;
     * Python: x = 10
     */
    traducirAsignacion(nodo) {
        let codigo = this.indent();
        codigo += nodo.identificador + ' = ';
        codigo += this.traducirExpresion(nodo.expresion);
        return codigo + '\n';
    }

    /**
     * Traduce un if
     * Java: if (condicion) { ... } else { ... }
     * Python: if condicion:\n    ...
     */
    traducirIf(nodo) {
        let codigo = this.indent();
        codigo += 'if ' + this.traducirExpresion(nodo.condicion) + ':\n';

        this.aumentarIndentacion();
        if (nodo.sentenciasIf && nodo.sentenciasIf.length > 0) {
            for (const sentencia of nodo.sentenciasIf) {
                codigo += this.traducirSentencia(sentencia);
            }
        } else {
            codigo += this.indent() + 'pass\n';
        }
        this.disminuirIndentacion();

        // Else opcional
        if (nodo.sentenciasElse && nodo.sentenciasElse.length > 0) {
            codigo += this.indent() + 'else:\n';
            this.aumentarIndentacion();
            for (const sentencia of nodo.sentenciasElse) {
                codigo += this.traducirSentencia(sentencia);
            }
            this.disminuirIndentacion();
        }

        return codigo;
    }

    /**
     * Traduce un for
     * Java: for (int i = 0; i < 10; i++) { ... }
     * Python: for i in range(0, 10):
     */
    traducirFor(nodo) {
        let codigo = '';

        // Intentar detectar un for simple de rango
        if (this.esForDeRango(nodo)) {
            codigo = this.traducirForRango(nodo);
        } else {
            // For complejo - usar while equivalente
            codigo = this.traducirForComoWhile(nodo);
        }

        return codigo;
    }

    /**
     * Verifica si un for es del tipo: for(int i = inicio; i < fin; i++)
     */
    esForDeRango(nodo) {
        // Verificar patrón común: inicialización, comparación, incremento
        if (!nodo.inicializacion || !nodo.condicion || !nodo.incremento) {
            return false;
        }

        // La condición debe ser una comparación <
        if (nodo.condicion.tipo === 'EXPRESION_BINARIA' && 
            (nodo.condicion.operador === '<' || nodo.condicion.operador === '<=')) {
            return true;
        }

        return false;
    }

    /**
     * Traduce for de rango a Python
     */
    traducirForRango(nodo) {
        let codigo = this.indent();

        // Obtener variable del for
        const variable = nodo.inicializacion.identificador;
        const inicio = this.traducirExpresion(nodo.inicializacion.expresion);
        const fin = this.traducirExpresion(nodo.condicion.derecha);

        // Ajustar fin si es <=
        const finAjustado = nodo.condicion.operador === '<=' ? 
            `${fin} + 1` : fin;

        codigo += `for ${variable} in range(${inicio}, ${finAjustado}):\n`;

        this.aumentarIndentacion();
        if (nodo.sentencias && nodo.sentencias.length > 0) {
            for (const sentencia of nodo.sentencias) {
                codigo += this.traducirSentencia(sentencia);
            }
        } else {
            codigo += this.indent() + 'pass\n';
        }
        this.disminuirIndentacion();

        return codigo;
    }

    /**
     * Traduce for complejo como while
     */
    traducirForComoWhile(nodo) {
        let codigo = '';

        // Inicialización
        if (nodo.inicializacion) {
            codigo += this.traducirSentencia(nodo.inicializacion);
        }

        // While
        codigo += this.indent() + 'while ' + this.traducirExpresion(nodo.condicion) + ':\n';
        
        this.aumentarIndentacion();
        
        // Sentencias del cuerpo
        if (nodo.sentencias && nodo.sentencias.length > 0) {
            for (const sentencia of nodo.sentencias) {
                codigo += this.traducirSentencia(sentencia);
            }
        }
        
        // Incremento al final
        if (nodo.incremento) {
            if (nodo.incremento.tipo === 'EXPRESION_UNARIA') {
                codigo += this.traducirExpresionUnaria(nodo.incremento);
            } else {
                codigo += this.traducirSentencia(nodo.incremento);
            }
        }
        
        this.disminuirIndentacion();

        return codigo;
    }

    /**
     * Traduce un while
     * Java: while (condicion) { ... }
     * Python: while condicion:
     */
    traducirWhile(nodo) {
        let codigo = this.indent();
        codigo += 'while ' + this.traducirExpresion(nodo.condicion) + ':\n';

        this.aumentarIndentacion();
        if (nodo.sentencias && nodo.sentencias.length > 0) {
            for (const sentencia of nodo.sentencias) {
                codigo += this.traducirSentencia(sentencia);
            }
        } else {
            codigo += this.indent() + 'pass\n';
        }
        this.disminuirIndentacion();

        return codigo;
    }

    /**
     * Traduce un do-while
     * Java: do { ... } while (condicion);
     * Python: while True:\n    ...\n    if not condicion: break
     */
    traducirDoWhile(nodo) {
        let codigo = this.indent() + 'while True:\n';

        this.aumentarIndentacion();
        
        // Sentencias
        if (nodo.sentencias && nodo.sentencias.length > 0) {
            for (const sentencia of nodo.sentencias) {
                codigo += this.traducirSentencia(sentencia);
            }
        }

        // Verificar condición al final
        codigo += this.indent() + 'if not (' + this.traducirExpresion(nodo.condicion) + '):\n';
        this.aumentarIndentacion();
        codigo += this.indent() + 'break\n';
        this.disminuirIndentacion();

        this.disminuirIndentacion();

        return codigo;
    }

    /**
     * Traduce una llamada a función
     * Java: System.out.println(x);
     * Python: print(x)
     */
    traducirLlamadaFuncion(nodo) {
        let codigo = this.indent();

        // Traducir System.out.println a print
        if (nodo.nombreFuncion === 'System.out.println') {
            codigo += 'print(';
            if (nodo.argumentos && nodo.argumentos.length > 0) {
                codigo += this.traducirExpresion(nodo.argumentos[0]);
            }
            codigo += ')';
        } else {
            // Otras funciones (por si se expande el proyecto)
            codigo += nodo.nombreFuncion + '(';
            if (nodo.argumentos && nodo.argumentos.length > 0) {
                codigo += nodo.argumentos.map(arg => this.traducirExpresion(arg)).join(', ');
            }
            codigo += ')';
        }

        return codigo + '\n';
    }

    /**
     * Traduce expresión unaria (++, --, !, -)
     */
    traducirExpresionUnaria(nodo) {
        let codigo = '';

        if (nodo.operador === 'INCREMENTO' || nodo.operador === '++') {
            // x++ se convierte en x = x + 1
            const variable = this.traducirExpresion(nodo.expresion);
            codigo = this.indent() + `${variable} += 1\n`;
        } else if (nodo.operador === 'DECREMENTO' || nodo.operador === '--') {
            // x-- se convierte en x = x - 1
            const variable = this.traducirExpresion(nodo.expresion);
            codigo = this.indent() + `${variable} -= 1\n`;
        } else if (nodo.operador === 'NOT' || nodo.operador === '!') {
            // !expresion se convierte en not expresion
            codigo = 'not ' + this.traducirExpresion(nodo.expresion);
        } else if (nodo.operador === 'MENOS' || nodo.operador === '-') {
            // -expresion se mantiene
            codigo = '-' + this.traducirExpresion(nodo.expresion);
        }

        return codigo;
    }

    /**
     * Traduce una expresión
     */
    traducirExpresion(nodo) {
        if (!nodo) return '';

        switch (nodo.tipo) {
            case 'LITERAL':
                return this.traducirLiteral(nodo);
            case 'IDENTIFICADOR':
                return nodo.nombre;
            case 'EXPRESION_BINARIA':
                return this.traducirExpresionBinaria(nodo);
            case 'EXPRESION_UNARIA':
                // Para expresiones dentro de otras expresiones (no statements)
                if (nodo.operador === 'NOT' || nodo.operador === '!') {
                    return 'not (' + this.traducirExpresion(nodo.expresion) + ')';
                } else if (nodo.operador === 'MENOS' || nodo.operador === '-') {
                    return '-' + this.traducirExpresion(nodo.expresion);
                }
                return this.traducirExpresion(nodo.expresion);
            default:
                return '';
        }
    }

    /**
     * Traduce expresión binaria
     * Java: a + b, a && b, etc.
     * Python: a + b, a and b, etc.
     */
    traducirExpresionBinaria(nodo) {
        const izq = this.traducirExpresion(nodo.izquierda);
        const der = this.traducirExpresion(nodo.derecha);
        let operador = nodo.operador;

        // Convertir operadores de Java a Python
        const mapeoOperadores = {
            '&&': 'and',
            '||': 'or',
            '!': 'not',
            '==': '==',
            '!=': '!=',
            '<': '<',
            '>': '>',
            '<=': '<=',
            '>=': '>=',
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '//',  // División entera en Python
            '%': '%'
        };

        operador = mapeoOperadores[operador] || operador;

        return `(${izq} ${operador} ${der})`;
    }

    /**
     * Traduce un literal
     */
    traducirLiteral(nodo) {
        switch (nodo.tipoDato) {
            case 'int':
            case 'double':
                return String(nodo.valor);
            case 'String':
                // Mantener las comillas
                return nodo.valor;
            case 'char':
                // En Python los caracteres son strings
                return nodo.valor;
            case 'boolean':
                // Java: true/false -> Python: True/False
                return nodo.valor ? 'True' : 'False';
            default:
                return String(nodo.valor);
        }
    }
}

// ============================================================================
// EXPORTAR (para Node.js y navegador)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Traductor;
}
