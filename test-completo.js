/**
 * Test completo del sistema con input.txt
 */

const fs = require('fs');
const path = require('path');

// Importar módulos
const AnalizadorLexico = require('./js/lexico/AnalizadorLexico.js');
const Parser = require('./js/sintactico/Parser.js');
const Traductor = require('./js/traductor/Traductor.js');

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║              TEST COMPLETO - JavaBridge                           ║');
console.log('║         Leyendo y procesando input.txt                            ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

// Leer input.txt
const inputPath = path.join(__dirname, 'input.txt');
const codigoJava = fs.readFileSync(inputPath, 'utf-8');

console.log('📄 Código Java leído:\n');
console.log('─'.repeat(70));
console.log(codigoJava);
console.log('─'.repeat(70));
console.log(`\n📊 Total de caracteres: ${codigoJava.length}\n`);

// FASE 1: Análisis Léxico
console.log('═'.repeat(70));
console.log('  FASE 1: ANÁLISIS LÉXICO');
console.log('═'.repeat(70));

const lexico = new AnalizadorLexico(codigoJava);
const resultadoLexico = lexico.analizar();

console.log(`✓ Tokens encontrados: ${resultadoLexico.tokens.length}`);
console.log(`✓ Errores léxicos: ${resultadoLexico.errores.length}\n`);

if (resultadoLexico.errores.length > 0) {
    console.log('⚠️  ERRORES LÉXICOS:\n');
    resultadoLexico.errores.forEach((error, i) => {
        console.log(`  ${i + 1}. Línea ${error.linea}, Col ${error.columna}: ${error.mensaje}`);
    });
    console.log();
}

// Mostrar primeros 20 tokens
console.log('📋 Primeros 20 tokens:\n');
resultadoLexico.tokens.slice(0, 20).forEach((token, i) => {
    console.log(`  ${String(i + 1).padStart(2, '0')}. ${token.tipo.padEnd(20)} "${token.lexema}" (L${token.linea}:C${token.columna})`);
});
if (resultadoLexico.tokens.length > 20) {
    console.log(`  ... y ${resultadoLexico.tokens.length - 20} tokens más\n`);
}

// FASE 2: Análisis Sintáctico
console.log('\n' + '═'.repeat(70));
console.log('  FASE 2: ANÁLISIS SINTÁCTICO');
console.log('═'.repeat(70));

const parser = new Parser(resultadoLexico.tokens);
const resultadoParser = parser.parse();

console.log(`✓ Análisis ${resultadoParser.exito ? 'EXITOSO' : 'CON ERRORES'}`);
console.log(`✓ Errores sintácticos: ${resultadoParser.errores.length}\n`);

if (resultadoParser.errores.length > 0) {
    console.log('⚠️  ERRORES SINTÁCTICOS:\n');
    resultadoParser.errores.forEach((error, i) => {
        console.log(`  ${i + 1}. Línea ${error.linea}, Col ${error.columna}: ${error.mensaje}`);
    });
    console.log();
}

// Mostrar tabla de símbolos
if (resultadoParser.tablaSimbolos) {
    const variables = resultadoParser.tablaSimbolos.obtenerSimbolos();
    console.log('📊 Tabla de Símbolos:\n');
    console.log('┌────────────────┬──────────┬──────────┐');
    console.log('│ Variable       │ Tipo     │ Usado    │');
    console.log('├────────────────┼──────────┼──────────┤');
    variables.slice(0, 10).forEach(v => {
        console.log(`│ ${v.nombre.padEnd(14)} │ ${v.tipo.padEnd(8)} │ ${v.usado ? '✓' : '-'}        │`);
    });
    console.log('└────────────────┴──────────┴──────────┘');
    if (variables.length > 10) {
        console.log(`... y ${variables.length - 10} variables más\n`);
    }
}

// FASE 3: Traducción a Python
if (resultadoParser.exito && resultadoParser.ast) {
    console.log('\n' + '═'.repeat(70));
    console.log('  FASE 3: TRADUCCIÓN A PYTHON');
    console.log('═'.repeat(70));

    const traductor = new Traductor(resultadoParser.ast);
    const resultadoTraduccion = traductor.traducir();
    const codigoPython = resultadoTraduccion.codigo;

    console.log('\n🐍 Código Python generado:\n');
    console.log('─'.repeat(70));
    console.log(codigoPython);
    console.log('─'.repeat(70));
    
    if (resultadoTraduccion.errores.length > 0) {
        console.log('\n⚠️  Advertencias de traducción:\n');
        resultadoTraduccion.errores.forEach((error, i) => {
            console.log(`  ${i + 1}. ${error.tipo}: ${error.mensaje}`);
        });
    }

    // Guardar el resultado
    const outputPath = path.join(__dirname, 'output.py');
    fs.writeFileSync(outputPath, codigoPython, 'utf-8');
    console.log(`\n✓ Código Python guardado en: ${outputPath}\n`);
}

// RESUMEN FINAL
console.log('\n' + '═'.repeat(70));
console.log('  RESUMEN FINAL');
console.log('═'.repeat(70));

console.log(`✓ Tokens: ${resultadoLexico.tokens.length}`);
console.log(`✓ Errores léxicos: ${resultadoLexico.errores.length}`);
console.log(`✓ Errores sintácticos: ${resultadoParser.errores.length}`);
console.log(`✓ Estado: ${(resultadoLexico.errores.length === 0 && resultadoParser.errores.length === 0) ? '✅ ÉXITO TOTAL' : '⚠️  CON ERRORES'}\n`);
