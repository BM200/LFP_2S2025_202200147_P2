/**
 * test-reportes.js - Pruebas del Generador de Reportes HTML
 */

const AnalizadorLexico = require('../lexico/AnalizadorLexico.js');
const Parser = require('../sintactico/Parser.js');
const GeneradorHTML = require('./GeneradorHTML.js');
const fs = require('fs');
const path = require('path');

function imprimirSeparador(titulo) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${titulo}`);
    console.log('='.repeat(70) + '\n');
}

function test1_ReporteTokens() {
    imprimirSeparador('TEST 1: Reporte de Tokens');

    const codigoJava = `
public class MiClase {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int suma = x + y;
        System.out.println(suma);
    }
}
`;

    console.log('Analizando código Java...');
    const lexico = new AnalizadorLexico(codigoJava);
    const resultado = lexico.analizar();

    console.log(`✓ Tokens reconocidos: ${resultado.tokens.length}`);

    const generador = new GeneradorHTML();
    const html = generador.generarReporteTokens(resultado.tokens);

    const rutaReporte = path.join(__dirname, '../../reportes/reporte-tokens.html');
    
    // Crear carpeta si no existe
    const dirReportes = path.dirname(rutaReporte);
    if (!fs.existsSync(dirReportes)) {
        fs.mkdirSync(dirReportes, { recursive: true });
    }

    fs.writeFileSync(rutaReporte, html, 'utf8');
    console.log(`✓ Reporte generado: ${rutaReporte}`);
    console.log('  Abre el archivo en tu navegador para verlo\n');
}

function test2_ReporteErroresLexicos() {
    imprimirSeparador('TEST 2: Reporte de Errores Léxicos');

    // Código con errores léxicos intencionales
    const codigoConErrores = `
public class Test {
    public static void main(String[] args) {
        int x = 10;
        char c = @;  // Carácter inválido
        String s = "hola mundo;  // Cadena sin cerrar
    }
}
`;

    console.log('Analizando código con errores léxicos...');
    const lexico = new AnalizadorLexico(codigoConErrores);
    const resultado = lexico.analizar();

    console.log(`✓ Errores detectados: ${resultado.errores.length}`);
    resultado.errores.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.descripcion} (línea ${error.linea})`);
    });

    const generador = new GeneradorHTML();
    const html = generador.generarReporteErroresLexicos(resultado.errores);

    const rutaReporte = path.join(__dirname, '../../reportes/reporte-errores-lexicos.html');
    fs.writeFileSync(rutaReporte, html, 'utf8');
    console.log(`\n✓ Reporte generado: ${rutaReporte}`);
    console.log('  Abre el archivo en tu navegador para verlo\n');
}

function test3_ReporteErroresSintacticos() {
    imprimirSeparador('TEST 3: Reporte de Errores Sintácticos');

    // Código con errores sintácticos intencionales
    const codigoConErrores = `
public class Test {
    public static void main(String[] args) {
        int x = 10
        System.out.println(x);
    }
}
`;

    console.log('Analizando código con errores sintácticos...');
    const lexico = new AnalizadorLexico(codigoConErrores);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    console.log(`✓ Errores detectados: ${resultadoParser.errores.length}`);
    resultadoParser.errores.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.mensaje}`);
    });

    const generador = new GeneradorHTML();
    const html = generador.generarReporteErroresSintacticos(resultadoParser.errores);

    const rutaReporte = path.join(__dirname, '../../reportes/reporte-errores-sintacticos.html');
    fs.writeFileSync(rutaReporte, html, 'utf8');
    console.log(`\n✓ Reporte generado: ${rutaReporte}`);
    console.log('  Abre el archivo en tu navegador para verlo\n');
}

function test4_ReporteSinErrores() {
    imprimirSeparador('TEST 4: Reportes Sin Errores');

    const codigoValido = `
public class Perfecto {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        
        if (a < b) {
            System.out.println("a es menor");
        }
        
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}
`;

    console.log('Analizando código válido (sin errores)...');
    const lexico = new AnalizadorLexico(codigoValido);
    const resultadoLexico = lexico.analizar();

    const parser = new Parser(resultadoLexico.tokens);
    const resultadoParser = parser.parse();

    const generador = new GeneradorHTML();

    // Reporte de errores léxicos (sin errores)
    const htmlLexicos = generador.generarReporteErroresLexicos([]);
    fs.writeFileSync(
        path.join(__dirname, '../../reportes/reporte-sin-errores-lexicos.html'),
        htmlLexicos,
        'utf8'
    );

    // Reporte de errores sintácticos (sin errores)
    const htmlSintacticos = generador.generarReporteErroresSintacticos([]);
    fs.writeFileSync(
        path.join(__dirname, '../../reportes/reporte-sin-errores-sintacticos.html'),
        htmlSintacticos,
        'utf8'
    );

    console.log('✓ Reportes sin errores generados exitosamente');
    console.log('  - reporte-sin-errores-lexicos.html');
    console.log('  - reporte-sin-errores-sintacticos.html\n');
}

function test5_ReporteCompleto() {
    imprimirSeparador('TEST 5: Reporte Completo con Estadísticas');

    const codigoComplejo = `
public class Complejo {
    public static void main(String[] args) {
        int suma = 0;
        boolean activo = true;
        String mensaje = "Calculando...";
        
        System.out.println(mensaje);
        
        for (int i = 1; i <= 10; i++) {
            suma = suma + i;
            
            if (suma > 25) {
                System.out.println("Suma mayor a 25");
                activo = false;
            }
        }
        
        while (activo) {
            System.out.println("Ejecutando");
            activo = false;
        }
        
        System.out.println(suma);
    }
}
`;

    console.log('Generando reporte completo con estadísticas...');
    const lexico = new AnalizadorLexico(codigoComplejo);
    const resultado = lexico.analizar();

    // Estadísticas
    const tiposToken = {};
    resultado.tokens.forEach(token => {
        tiposToken[token.tipo] = (tiposToken[token.tipo] || 0) + 1;
    });

    console.log('\nEstadísticas:');
    console.log(`  Total de tokens: ${resultado.tokens.length}`);
    console.log(`  Tipos diferentes: ${Object.keys(tiposToken).length}`);
    console.log('\nDistribución por tipo:');
    Object.entries(tiposToken)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([tipo, cantidad]) => {
            console.log(`  - ${tipo}: ${cantidad}`);
        });

    const generador = new GeneradorHTML();
    const html = generador.generarReporteTokens(resultado.tokens);

    const rutaReporte = path.join(__dirname, '../../reportes/reporte-completo.html');
    fs.writeFileSync(rutaReporte, html, 'utf8');
    console.log(`\n✓ Reporte completo generado: ${rutaReporte}\n`);
}

function ejecutarTodasLasPruebas() {
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║        SUITE DE PRUEBAS - GENERADOR DE REPORTES HTML             ║');
    console.log('║                       (Fase 4 - JavaBridge)                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');

    test1_ReporteTokens();
    test2_ReporteErroresLexicos();
    test3_ReporteErroresSintacticos();
    test4_ReporteSinErrores();
    test5_ReporteCompleto();

    console.log('='.repeat(70));
    console.log('  PRUEBAS COMPLETADAS');
    console.log('  Todos los reportes guardados en: ./reportes/');
    console.log('='.repeat(70) + '\n');
}

// Ejecutar si se corre directamente
if (typeof require !== 'undefined' && require.main === module) {
    ejecutarTodasLasPruebas();
}

module.exports = {
    test1_ReporteTokens,
    test2_ReporteErroresLexicos,
    test3_ReporteErroresSintacticos,
    test4_ReporteSinErrores,
    test5_ReporteCompleto,
    ejecutarTodasLasPruebas
};
