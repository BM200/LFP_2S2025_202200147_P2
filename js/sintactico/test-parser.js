/**
 * test-parser.js - Pruebas del Analizador Sintáctico
 * Ejecuta pruebas completas del Parser con el Analizador Léxico
 */

// Importar módulos (Node.js)
const AnalizadorLexico = require('../lexico/AnalizadorLexico.js');
const Parser = require('./Parser.js');
const { TablaSimbolos } = require('./TablaSimbolos.js');

// También necesitamos las clases del AST
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

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

function imprimirSeparador(titulo) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${titulo}`);
    console.log('='.repeat(70) + '\n');
}

function imprimirResultado(exito) {
    if (exito) {
        console.log('✓ RESULTADO: ÉXITO');
    } else {
        console.log('✗ RESULTADO: ERRORES ENCONTRADOS');
    }
}

function imprimirAST(nodo, nivel = 0) {
    const indent = '  '.repeat(nivel);
    
    if (!nodo) {
        console.log(indent + '(null)');
        return;
    }

    console.log(indent + nodo.toString());

    // Imprimir hijos
    if (nodo.main) {
        imprimirAST(nodo.main, nivel + 1);
    }

    if (nodo.sentencias && Array.isArray(nodo.sentencias)) {
        nodo.sentencias.forEach(s => imprimirAST(s, nivel + 1));
    }

    if (nodo.sentenciasIf && Array.isArray(nodo.sentenciasIf)) {
        console.log(indent + '  [THEN]:');
        nodo.sentenciasIf.forEach(s => imprimirAST(s, nivel + 2));
    }

    if (nodo.sentenciasElse && Array.isArray(nodo.sentenciasElse) && nodo.sentenciasElse.length > 0) {
        console.log(indent + '  [ELSE]:');
        nodo.sentenciasElse.forEach(s => imprimirAST(s, nivel + 2));
    }
}

// ============================================================================
// PRUEBAS
// ============================================================================

function test1_ProgramaBasico() {
    imprimirSeparador('TEST 1: Programa Básico');

    const codigo = `
public class MiClase {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);
    }
}
`;

    console.log('Código a analizar:');
    console.log(codigo);
    console.log();

    // Fase 1: Análisis Léxico
    console.log('1. Análisis Léxico...');
    const lexico = new AnalizadorLexico(codigo);
    const resultadoLexico = lexico.analizar();

    if (!resultadoLexico.exito) {
        console.log('✗ Errores léxicos:');
        resultadoLexico.errores.forEach(e => {
            console.log(`  - ${e.descripcion}`);
        });
        return;
    }

    console.log(`✓ ${resultadoLexico.tokens.length} tokens encontrados\n`);

    // Fase 2: Análisis Sintáctico
    console.log('2. Análisis Sintáctico...');
    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    if (!resultadoParser.exito) {
        console.log('✗ Errores sintácticos:');
        resultadoParser.errores.forEach(e => {
            console.log(`  - Línea ${e.linea}, Col ${e.columna}: ${e.mensaje}`);
        });
    } else {
        console.log('✓ Análisis sintáctico exitoso\n');
        console.log('3. Árbol de Sintaxis Abstracta (AST):');
        imprimirAST(resultadoParser.ast);
        console.log();
        console.log('4. Tabla de Símbolos:');
        console.log(resultadoParser.tablaSimbolos.toString());
    }

    imprimirResultado(resultadoParser.exito);
}

function test2_EstructurasControl() {
    imprimirSeparador('TEST 2: Estructuras de Control');

    const codigo = `
public class ControlFlow {
    public static void main(String[] args) {
        int x = 5;
        
        if (x > 3) {
            System.out.println("Mayor a 3");
        } else {
            System.out.println("Menor o igual a 3");
        }
        
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
        
        while (x > 0) {
            x--;
        }
    }
}
`;

    console.log('Código a analizar:');
    console.log(codigo);
    console.log();

    const lexico = new AnalizadorLexico(codigo);
    const resultadoLexico = lexico.analizar();

    if (!resultadoLexico.exito) {
        console.log('✗ Errores léxicos encontrados');
        return;
    }

    console.log(`✓ ${resultadoLexico.tokens.length} tokens encontrados\n`);

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    if (!resultadoParser.exito) {
        console.log('✗ Errores sintácticos:');
        resultadoParser.errores.forEach(e => {
            console.log(`  - Línea ${e.linea}: ${e.mensaje}`);
        });
    } else {
        console.log('✓ Análisis sintáctico exitoso\n');
        console.log('AST Simplificado:');
        imprimirAST(resultadoParser.ast);
    }

    imprimirResultado(resultadoParser.exito);
}

function test3_ErroresSintacticos() {
    imprimirSeparador('TEST 3: Detección de Errores Sintácticos');

    const codigo = `
public class ErrorTest {
    public static void main(String[] args) {
        int x = 10
        y = 5;
        
        if x > 3 {
            System.out.println("Error");
        }
    }
}
`;

    console.log('Código con errores:');
    console.log(codigo);
    console.log();

    const lexico = new AnalizadorLexico(codigo);
    const resultadoLexico = lexico.analizar();

    if (!resultadoLexico.exito) {
        console.log('✗ Errores léxicos:');
        resultadoLexico.errores.forEach(e => console.log(`  - ${e.descripcion}`));
        return;
    }

    console.log(`✓ ${resultadoLexico.tokens.length} tokens encontrados\n`);

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    console.log('Errores sintácticos detectados:');
    if (resultadoParser.errores.length === 0) {
        console.log('  (Ninguno - esto es inesperado)');
    } else {
        resultadoParser.errores.forEach((e, idx) => {
            console.log(`  ${idx + 1}. Línea ${e.linea}, Col ${e.columna}: ${e.mensaje}`);
        });
    }

    imprimirResultado(!resultadoParser.exito); // Esperamos que falle
}

function test4_ExpresionesComplejas() {
    imprimirSeparador('TEST 4: Expresiones Aritméticas y Lógicas');

    const codigo = `
public class Expresiones {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        int c = 30;
        
        int resultado = a + b * c - 5;
        boolean condicion = (a > 5) && (b < 30) || (c == 30);
        
        if (condicion) {
            System.out.println(resultado);
        }
    }
}
`;

    console.log('Código a analizar:');
    console.log(codigo);
    console.log();

    const lexico = new AnalizadorLexico(codigo);
    const resultadoLexico = lexico.analizar();

    if (!resultadoLexico.exito) {
        console.log('✗ Errores léxicos');
        return;
    }

    console.log(`✓ ${resultadoLexico.tokens.length} tokens encontrados\n`);

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    if (!resultadoParser.exito) {
        console.log('✗ Errores sintácticos:');
        resultadoParser.errores.forEach(e => console.log(`  - ${e.mensaje}`));
    } else {
        console.log('✓ Análisis exitoso\n');
        console.log('Tabla de Símbolos:');
        console.log(resultadoParser.tablaSimbolos.toString());
    }

    imprimirResultado(resultadoParser.exito);
}

function test5_VariablesNoDeclaradas() {
    imprimirSeparador('TEST 5: Detección de Variables No Declaradas');

    const codigo = `
public class UndeclaredVar {
    public static void main(String[] args) {
        int x = 10;
        y = x + 5;
        System.out.println(y);
    }
}
`;

    console.log('Código con variable no declarada:');
    console.log(codigo);
    console.log();

    const lexico = new AnalizadorLexico(codigo);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    console.log('Errores semánticos detectados:');
    const erroresSemanticos = resultadoParser.errores.filter(e => 
        e.mensaje.includes('no declarada')
    );

    if (erroresSemanticos.length > 0) {
        erroresSemanticos.forEach(e => {
            console.log(`  ✓ ${e.mensaje} (Línea ${e.linea})`);
        });
    } else {
        console.log('  ✗ No se detectaron variables no declaradas');
    }

    imprimirResultado(erroresSemanticos.length > 0);
}

// ============================================================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================================================

function ejecutarTodasLasPruebas() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║          SUITE DE PRUEBAS - ANALIZADOR SINTÁCTICO                ║');
    console.log('║                    (Parser JavaBridge)                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');

    test1_ProgramaBasico();
    test2_EstructurasControl();
    test3_ErroresSintacticos();
    test4_ExpresionesComplejas();
    test5_VariablesNoDeclaradas();

    console.log('\n' + '='.repeat(70));
    console.log('  PRUEBAS COMPLETADAS');
    console.log('='.repeat(70) + '\n');
}

// ============================================================================
// EJECUTAR
// ============================================================================

if (typeof require !== 'undefined' && require.main === module) {
    // Ejecutar solo si se corre directamente
    ejecutarTodasLasPruebas();
}

// Exportar para uso en navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        test1_ProgramaBasico,
        test2_EstructurasControl,
        test3_ErroresSintacticos,
        test4_ExpresionesComplejas,
        test5_VariablesNoDeclaradas,
        ejecutarTodasLasPruebas
    };
}
