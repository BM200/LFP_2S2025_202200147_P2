/**
 * test-traductor.js - Pruebas del Traductor Java → Python
 */

const AnalizadorLexico = require('../lexico/AnalizadorLexico.js');
const Parser = require('../sintactico/Parser.js');
const Traductor = require('./Traductor.js');

function imprimirSeparador(titulo) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${titulo}`);
    console.log('='.repeat(70) + '\n');
}

function test1_ProgramaBasico() {
    imprimirSeparador('TEST 1: Programa Básico - Traducción');

    const codigoJava = `
public class MiPrograma {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        System.out.println(x);
        System.out.println(y);
    }
}
`;

    console.log('CÓDIGO JAVA:');
    console.log(codigoJava);

    // Análisis léxico
    const lexico = new AnalizadorLexico(codigoJava);
    const resultadoLexico = lexico.analizar();

    if (!resultadoLexico.exito) {
        console.log('✗ Errores léxicos');
        return;
    }

    // Análisis sintáctico
    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    if (!resultadoParser.exito) {
        console.log('✗ Errores sintácticos');
        return;
    }

    // Traducción
    const traductor = new Traductor(resultadoParser.ast, resultadoParser.tablaSimbolos);
    const resultadoTraduccion = traductor.traducir();

    console.log('\nCÓDIGO PYTHON GENERADO:');
    console.log('─'.repeat(70));
    console.log(resultadoTraduccion.codigo);
    console.log('─'.repeat(70));

    if (resultadoTraduccion.exito) {
        console.log('\n✓ Traducción exitosa');
    } else {
        console.log('\n✗ Errores en la traducción:');
        resultadoTraduccion.errores.forEach(e => console.log(`  - ${e.mensaje}`));
    }
}

function test2_EstructurasControl() {
    imprimirSeparador('TEST 2: Estructuras de Control');

    const codigoJava = `
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

    console.log('CÓDIGO JAVA:');
    console.log(codigoJava);

    const lexico = new AnalizadorLexico(codigoJava);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    const traductor = new Traductor(resultadoParser.ast, resultadoParser.tablaSimbolos);
    const resultadoTraduccion = traductor.traducir();

    console.log('\nCÓDIGO PYTHON GENERADO:');
    console.log('─'.repeat(70));
    console.log(resultadoTraduccion.codigo);
    console.log('─'.repeat(70));

    if (resultadoTraduccion.exito) {
        console.log('\n✓ Traducción exitosa');
    } else {
        console.log('\n✗ Errores en la traducción');
    }
}

function test3_ExpresionesComplejas() {
    imprimirSeparador('TEST 3: Expresiones Aritméticas y Lógicas');

    const codigoJava = `
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

    console.log('CÓDIGO JAVA:');
    console.log(codigoJava);

    const lexico = new AnalizadorLexico(codigoJava);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    const traductor = new Traductor(resultadoParser.ast, resultadoParser.tablaSimbolos);
    const resultadoTraduccion = traductor.traducir();

    console.log('\nCÓDIGO PYTHON GENERADO:');
    console.log('─'.repeat(70));
    console.log(resultadoTraduccion.codigo);
    console.log('─'.repeat(70));

    if (resultadoTraduccion.exito) {
        console.log('\n✓ Traducción exitosa');
    } else {
        console.log('\n✗ Errores en la traducción');
    }
}

function test4_DoWhile() {
    imprimirSeparador('TEST 4: Do-While');

    const codigoJava = `
public class DoWhileTest {
    public static void main(String[] args) {
        int contador = 0;
        
        do {
            System.out.println(contador);
            contador++;
        } while (contador < 5);
    }
}
`;

    console.log('CÓDIGO JAVA:');
    console.log(codigoJava);

    const lexico = new AnalizadorLexico(codigoJava);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    const traductor = new Traductor(resultadoParser.ast, resultadoParser.tablaSimbolos);
    const resultadoTraduccion = traductor.traducir();

    console.log('\nCÓDIGO PYTHON GENERADO:');
    console.log('─'.repeat(70));
    console.log(resultadoTraduccion.codigo);
    console.log('─'.repeat(70));

    if (resultadoTraduccion.exito) {
        console.log('\n✓ Traducción exitosa');
    } else {
        console.log('\n✗ Errores en la traducción');
    }
}

function ejecutarTodasLasPruebas() {
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║          SUITE DE PRUEBAS - TRADUCTOR JAVA → PYTHON              ║');
    console.log('║                    (JavaBridge)                                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');

    test1_ProgramaBasico();
    test2_EstructurasControl();
    test3_ExpresionesComplejas();
    test4_DoWhile();

    console.log('\n' + '='.repeat(70));
    console.log('  PRUEBAS COMPLETADAS');
    console.log('='.repeat(70) + '\n');
}

// Ejecutar si se corre directamente
if (typeof require !== 'undefined' && require.main === module) {
    ejecutarTodasLasPruebas();
}

module.exports = {
    test1_ProgramaBasico,
    test2_EstructurasControl,
    test3_ExpresionesComplejas,
    test4_DoWhile,
    ejecutarTodasLasPruebas
};
