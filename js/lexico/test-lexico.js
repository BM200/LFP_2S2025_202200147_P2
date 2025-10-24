
/**
 * Prueba 1: Código Java válido completo
 */
function test1_CodigoValido() {
    console.log('\n=== TEST 1: Código Java Válido ===\n');
    
    const codigo = `public class Calculadora {
    public static void main(String[] args) {
        int numero = 42;
        double pi = 3.14;
        char letra = 'A';
        String mensaje = "Hola Mundo";
        boolean activo = true;
        
        numero++;
        numero--;
        
        if (numero >= 40) {
            System.out.println(mensaje);
        }
    }
}`;
    
    const analizador = new AnalizadorLexico(codigo);
    const resultado = analizador.analizar();
    
    console.log(`Tokens encontrados: ${resultado.tokens.length}`);
    console.log(`Errores encontrados: ${resultado.errores.length}`);
    console.log(`Análisis exitoso: ${resultado.exito}`);
    
    // Mostrar primeros 10 tokens
    console.log('\nPrimeros 10 tokens:');
    resultado.tokens.slice(0, 10).forEach((token, idx) => {
        console.log(`${idx + 1}. ${token.toString()}`);
    });
    
    return resultado;
}

/**
 * Prueba 2: Errores léxicos
 */
function test2_ErroresLexicos() {
    console.log('\n=== TEST 2: Errores Léxicos ===\n');
    
    const codigo = `public class Test {
    public static void main(String[] args) {
        int x = 10;
        char c = @;           // Error: carácter no reconocido
        String s = "hola;     // Error: cadena sin cerrar
        double d = 12.34.56;  // Error: número mal formado
    }
}`;
    
    const analizador = new AnalizadorLexico(codigo);
    const resultado = analizador.analizar();
    
    console.log(`Tokens encontrados: ${resultado.tokens.length}`);
    console.log(`Errores encontrados: ${resultado.errores.length}`);
    console.log(`Análisis exitoso: ${resultado.exito}`);
    
    // Mostrar errores
    if (resultado.errores.length > 0) {
        console.log('\nErrores léxicos:');
        resultado.errores.forEach((error, idx) => {
            console.log(`${idx + 1}. [${error.tipo}] "${error.error}" - ${error.descripcion} (Línea: ${error.linea}, Columna: ${error.columna})`);
        });
    }
    
    return resultado;
}

/**
 * Prueba 3: Comentarios
 */
function test3_Comentarios() {
    console.log('\n=== TEST 3: Comentarios ===\n');
    
    const codigo = `public class Test {
    // Comentario de línea
    public static void main(String[] args) {
        /* Comentario
           de bloque */
        int x = 10;
    }
}`;
    
    const analizador = new AnalizadorLexico(codigo);
    const resultado = analizador.analizar();
    
    console.log(`Tokens encontrados: ${resultado.tokens.length}`);
    
    // Filtrar solo comentarios
    const comentarios = resultado.tokens.filter(t => 
        t.tipo === TipoToken.COMENTARIO_LINEA || 
        t.tipo === TipoToken.COMENTARIO_BLOQUE
    );
    
    console.log(`\nComentarios encontrados: ${comentarios.length}`);
    comentarios.forEach((token, idx) => {
        console.log(`${idx + 1}. ${token.toString()}`);
    });
    
    return resultado;
}

/**
 * Prueba 4: Operadores
 */
function test4_Operadores() {
    console.log('\n=== TEST 4: Operadores ===\n');
    
    const codigo = `public class Test {
    public static void main(String[] args) {
        int a = 5 + 3;
        int b = 10 - 2;
        int c = 4 * 5;
        int d = 20 / 4;
        boolean e = a == b;
        boolean f = a != b;
        boolean g = a > b;
        boolean h = a < b;
        boolean i = a >= b;
        boolean j = a <= b;
        a++;
        b--;
    }
}`;
    
    const analizador = new AnalizadorLexico(codigo);
    const resultado = analizador.analizar();
    
    // Filtrar solo operadores
    const operadores = resultado.tokens.filter(t => 
        [TipoToken.MAS, TipoToken.MENOS, TipoToken.MULTIPLICACION, TipoToken.DIVISION,
         TipoToken.IGUAL_IGUAL, TipoToken.DIFERENTE, TipoToken.MAYOR_QUE, 
         TipoToken.MENOR_QUE, TipoToken.MAYOR_IGUAL, TipoToken.MENOR_IGUAL,
         TipoToken.INCREMENTO, TipoToken.DECREMENTO].includes(t.tipo)
    );
    
    console.log(`Operadores encontrados: ${operadores.length}`);
    operadores.forEach((token, idx) => {
        console.log(`${idx + 1}. ${token.lexema} (${token.tipo})`);
    });
    
    return resultado;
}

/**
 * Ejecutar todas las pruebas
 */
function ejecutarTodasLasPruebas() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   PRUEBAS DEL ANALIZADOR LÉXICO - JAVABRIDGE  ║');
    console.log('║   SIN REGEX - Procesamiento carácter x carácter║');
    console.log('╚════════════════════════════════════════════════╝');
    
    test1_CodigoValido();
    test2_ErroresLexicos();
    test3_Comentarios();
    test4_Operadores();
    
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║          PRUEBAS COMPLETADAS                   ║');
    console.log('╚════════════════════════════════════════════════╝\n');
}

// Ejecutar si se corre directamente
if (typeof module !== 'undefined' && require.main === module) {
    ejecutarTodasLasPruebas();
}

// Exportar funciones de prueba
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        test1_CodigoValido,
        test2_ErroresLexicos,
        test3_Comentarios,
        test4_Operadores,
        ejecutarTodasLasPruebas
    };
}
