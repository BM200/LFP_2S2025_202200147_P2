# 📋 PLAN DE DESARROLLO - JAVABRIDGE
## Traductor Java → Python con Análisis Léxico y Sintáctico Manual

**Proyecto:** Proyecto 2 - Lenguajes Formales y de Programación  
**Carnet:** 202200147  
**Fecha límite:** 25 de Octubre de 2025, 23:59  
**Lenguaje:** JavaScript (sin regex, sin librerías de parsing)

---

## 🎯 OBJETIVOS DEL PROYECTO

### Objetivo General
Desarrollar **JavaBridge**, una aplicación web que traduzca un subconjunto de código Java a Python, implementando análisis léxico y sintáctico manual (sin regex), con generación de reportes HTML y simulación de ejecución.

### Objetivos Específicos
1. ✅ Implementar un **AFD (Autómata Finito Determinista)** que reconozca tokens de Java sin usar regex
2. ✅ Desarrollar un **parser manual** basado en gramática libre de contexto
3. ✅ Definir **reglas de traducción** Java → Python preservando semántica
4. ✅ Generar **reportes HTML** (tokens, errores léxicos, errores sintácticos)
5. ✅ Crear **interfaz web** con editor de código y visualización
6. ✅ Implementar **simulador de ejecución** del código Python generado

---

## ⚠️ RESTRICCIONES CRÍTICAS

### 🚫 PROHIBIDO
- ❌ Expresiones regulares (regex)
- ❌ Librerías de parsing (ANTLR, JFlex, Lex, etc.)
- ❌ Librerías de análisis de texto
- ❌ Herramientas automáticas de generación de analizadores

### ✅ PERMITIDO
- ✔️ Manipulación manual de strings (charAt, substring, indexOf, etc.)
- ✔️ Estructuras de datos nativas (arrays, objetos, maps, sets)
- ✔️ Funciones propias para identificar caracteres y tokens
- ✔️ Bibliotecas de UI (para interfaz web)

---

## 📐 ARQUITECTURA DEL SISTEMA

```
JavaBridge/
│
├── Entrada: archivo .java
│     ↓
├── FASE 1: Analizador Léxico (AFD) → Lista de tokens
│     ↓
├── FASE 2: Analizador Sintáctico (Parser) → AST (Árbol Sintáctico)
│     ↓
├── FASE 3: Traductor → Código Python
│     ↓
├── FASE 4: Generador de Reportes HTML
│     ↓
├── FASE 5: Interfaz Web
│     ↓
└── FASE 6: Simulador de Ejecución
```

---

## 🗂️ ESTRUCTURA DEL PROYECTO

```
LFP_P2_202200147/
│
├── index.html                    # Interfaz principal
├── README.md                     # Documentación del proyecto
├── PLAN_DESARROLLO.md           # Este archivo
│
├── css/
│   └── styles.css               # Estilos de la interfaz
│
├── js/
│   ├── main.js                  # Controlador principal
│   ├── lexico/
│   │   ├── Token.js            # Clase Token
│   │   ├── TipoToken.js        # Enumeración de tipos de token
│   │   └── AnalizadorLexico.js # AFD - Analizador léxico (SIN REGEX)
│   │
│   ├── sintactico/
│   │   ├── Parser.js           # Analizador sintáctico manual
│   │   ├── AST.js              # Nodos del árbol sintáctico
│   │   └── TablaSimbolos.js    # Tabla de símbolos
│   │
│   ├── traductor/
│   │   └── Traductor.js        # Traducción Java → Python
│   │
│   ├── reportes/
│   │   ├── GeneradorHTML.js    # Generación de reportes HTML
│   │   └── ErrorHandler.js     # Manejo de errores
│   │
│   ├── simulador/
│   │   └── Simulador.js        # Simulación de ejecución Python
│   │
│   └── utils/
│       └── Helper.js           # Funciones auxiliares
│
├── tests/
│   ├── input.txt               # Archivo de prueba
│   └── test-cases/             # Casos de prueba
│
└── docs/
    ├── manual-tecnico.pdf      # Manual técnico
    └── manual-usuario.pdf      # Manual de usuario
```

---

## 📅 FASES DE DESARROLLO

---

## 🔷 FASE 1: ANALIZADOR LÉXICO (AFD)
**Duración estimada:** 2-3 días  
**Prioridad:** CRÍTICA

### Objetivos
- Implementar AFD que reconozca todos los tokens de Java
- **SIN USAR REGEX** - Solo manipulación carácter por carácter
- Detectar errores léxicos

### Tokens a reconocer

#### Palabras Reservadas (case-sensitive)
```javascript
public, class, static, void, main, String, args, 
int, double, char, boolean, true, false, 
if, else, for, while, System, out, println
```

#### Símbolos
```javascript
{, }, (, ), [, ], ;, ,, ., =, +, -, *, /, 
==, !=, >, <, >=, <=, ++, --
```

#### Identificadores
- Patrón: `[A-Za-z_][A-Za-z0-9_]*`
- Ejemplos válidos: `variable`, `_temp`, `contador1`, `miVariable`
- Ejemplos inválidos: `1variable`, `class`, `for`

#### Literales
- **Enteros:** `123`, `0`, `-45`
- **Decimales:** `12.34`, `0.0`, `-3.14`
- **Caracteres:** `'a'`, `'1'`, `' '`
- **Cadenas:** `"hola"`, `""`, `"texto con espacios"`
- **Booleanos:** `true`, `false`

#### Comentarios
- Línea: `// texto hasta fin de línea`
- Bloque: `/* texto multilínea */`

### Implementación del AFD (SIN REGEX)

```javascript
// Estrategia: Máquina de estados finita
class AnalizadorLexico {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.linea = 1;
        this.columna = 1;
        this.tokens = [];
        this.errores = [];
    }

    // Función principal
    analizar() {
        while (this.pos < this.input.length) {
            let char = this.input[this.pos];
            
            // Ignorar espacios en blanco
            if (this.esEspacio(char)) {
                this.avanzar(char);
                continue;
            }
            
            // Comentarios
            if (char === '/' && this.verSiguiente() === '/') {
                this.leerComentarioLinea();
                continue;
            }
            
            if (char === '/' && this.verSiguiente() === '*') {
                this.leerComentarioBloque();
                continue;
            }
            
            // Identificadores y palabras reservadas
            if (this.esLetra(char) || char === '_') {
                this.leerIdentificador();
                continue;
            }
            
            // Números
            if (this.esDigito(char) || (char === '-' && this.esDigito(this.verSiguiente()))) {
                this.leerNumero();
                continue;
            }
            
            // Cadenas
            if (char === '"') {
                this.leerCadena();
                continue;
            }
            
            // Caracteres
            if (char === "'") {
                this.leerCaracter();
                continue;
            }
            
            // Símbolos
            if (this.esSimbolo(char)) {
                this.leerSimbolo();
                continue;
            }
            
            // Carácter no reconocido (ERROR LÉXICO)
            this.errores.push({
                tipo: 'LEXICO',
                caracter: char,
                descripcion: 'Carácter no reconocido',
                linea: this.linea,
                columna: this.columna
            });
            this.avanzar(char);
        }
        
        return { tokens: this.tokens, errores: this.errores };
    }

    // Funciones auxiliares SIN REGEX
    esLetra(char) {
        // Verificar manualmente si es letra A-Z o a-z
        let code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    esDigito(char) {
        // Verificar manualmente si es dígito 0-9
        let code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    esEspacio(char) {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    // ... más funciones
}
```

### Errores Léxicos a Detectar
1. ❌ Carácter inesperado: `@`, `#`, `%` → "Carácter no reconocido"
2. ❌ Cadena no cerrada: `"hola` → "Cadena sin cerrar"
3. ❌ Carácter no cerrado: `'ab` → "Carácter mal formado"
4. ❌ Número mal formado: `12.34.56` → "Número decimal inválido"

### Salida esperada
```javascript
{
    tokens: [
        { lexema: 'public', tipo: 'PALABRA_RESERVADA', linea: 1, columna: 1 },
        { lexema: 'class', tipo: 'PALABRA_RESERVADA', linea: 1, columna: 8 },
        // ...
    ],
    errores: [
        { tipo: 'LEXICO', caracter: '@', descripcion: 'Carácter no reconocido', linea: 5, columna: 10 }
    ]
}
```

---

## 🔷 FASE 2: ANALIZADOR SINTÁCTICO (PARSER MANUAL)
**Duración estimada:** 3-4 días  
**Prioridad:** CRÍTICA

### Objetivos
- Implementar parser descendente recursivo basado en la gramática
- Construir AST (Árbol Sintáctico Abstracto)
- Detectar errores sintácticos

### Gramática Libre de Contexto

```
PROGRAMA ::= 'public' 'class' ID '{' MAIN '}'

MAIN ::= 'public' 'static' 'void' 'main' '(' 'String' '[' ']' ID ')' '{' SENTENCIAS '}'

SENTENCIAS ::= SENTENCIA SENTENCIAS | ε

SENTENCIA ::= DECLARACION 
           | ASIGNACION 
           | IF 
           | FOR 
           | WHILE 
           | PRINT 
           | ';'

DECLARACION ::= TIPO LISTA_VARS ';'

LISTA_VARS ::= VAR_DECL (',' VAR_DECL)*

VAR_DECL ::= ID ('=' EXPRESION)?

ASIGNACION ::= ID '=' EXPRESION ';'

IF ::= 'if' '(' EXPRESION ')' '{' SENTENCIAS '}' ('else' '{' SENTENCIAS '}')?

FOR ::= 'for' '(' FOR_INIT ';' EXPRESION ';' FOR_UPDATE ')' '{' SENTENCIAS '}'

FOR_INIT ::= TIPO ID '=' EXPRESION

FOR_UPDATE ::= ID ('++' | '--')

WHILE ::= 'while' '(' EXPRESION ')' '{' SENTENCIAS '}'

PRINT ::= 'System' '.' 'out' '.' 'println' '(' (EXPRESION | '') ')' ';'

EXPRESION ::= TERMINO (('==' | '!=' | '<' | '>' | '<=' | '>=') TERMINO)*

TERMINO ::= FACTOR (('+' | '-') FACTOR)*

FACTOR ::= PRIMARIO (('*' | '/') PRIMARIO)*

PRIMARIO ::= ID | LITERAL | '(' EXPRESION ')'

TIPO ::= 'int' | 'double' | 'char' | 'String' | 'boolean'

LITERAL ::= ENTERO | DECIMAL | CARACTER | CADENA | BOOLEANO
```

### Implementación del Parser

```javascript
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.errores = [];
        this.tablaSimbolos = new Map(); // Variables declaradas
    }

    // Método principal
    parsear() {
        try {
            let ast = this.programa();
            return { ast, errores: this.errores, exito: this.errores.length === 0 };
        } catch (error) {
            this.errores.push(error);
            return { ast: null, errores: this.errores, exito: false };
        }
    }

    // Regla: PROGRAMA ::= 'public' 'class' ID '{' MAIN '}'
    programa() {
        this.match('public');
        this.match('class');
        let nombreClase = this.match('IDENTIFICADOR');
        this.match('{');
        let main = this.main();
        this.match('}');
        
        return {
            tipo: 'PROGRAMA',
            nombreClase: nombreClase.lexema,
            main: main
        };
    }

    // Regla: MAIN ::= 'public' 'static' 'void' 'main' '(' 'String' '[' ']' ID ')' '{' SENTENCIAS '}'
    main() {
        this.match('public');
        this.match('static');
        this.match('void');
        this.match('main');
        this.match('(');
        this.match('String');
        this.match('[');
        this.match(']');
        let args = this.match('IDENTIFICADOR');
        this.match(')');
        this.match('{');
        let sentencias = this.sentencias();
        this.match('}');
        
        return {
            tipo: 'MAIN',
            sentencias: sentencias
        };
    }

    // ... más reglas de producción
}
```

### Errores Sintácticos a Detectar
1. ❌ Estructura de clase incorrecta: `private class` → "Se esperaba 'public'"
2. ❌ Método main incorrecto: `void main()` → "Se esperaba 'public static void main(String[] args)'"
3. ❌ Falta punto y coma: `int x = 5` → "Se esperaba ';'"
4. ❌ Llave no balanceada: `if (x > 0) { int y = 5` → "Se esperaba '}'"
5. ❌ Tipo no reconocido: `float x;` → "Tipo de dato no soportado"
6. ❌ Variable no declarada: `x = 5;` → "Variable no declarada"

---

## 🔷 FASE 3: TRADUCTOR JAVA → PYTHON
**Duración estimada:** 2-3 días  
**Prioridad:** ALTA

### Objetivos
- Recorrer el AST y generar código Python equivalente
- Aplicar reglas de traducción para cada constructo

### Reglas de Traducción

#### 1. Tipos de Datos
```javascript
// Java → Python
int      → valor por defecto: 0
double   → valor por defecto: 0.0
char     → valor por defecto: ''
String   → valor por defecto: ""
boolean  → true→True, false→False, defecto: False
```

#### 2. Declaraciones
```java
// JAVA
int a, b, c;
int x = 5, y = 10;
```
```python
# PYTHON
a = 0  # Declaracion: int
b = 0  # Declaracion: int
c = 0  # Declaracion: int
x = 5  # Declaracion: int
y = 10 # Declaracion: int
```

#### 3. Conversiones Automáticas
```python
# int/double/boolean + String → str(valor) + String
x = y + 5
mensaje = "El resultado es: " + str(x)
```

#### 4. System.out.println
```java
// JAVA
System.out.println("Hola");
System.out.println(variable);
System.out.println("Texto: " + variable);
```
```python
# PYTHON
print("Hola")
print(str(variable))
print("Texto: " + str(variable))
```

#### 5. Comentarios
```java
// JAVA
// Comentario de línea
/* Comentario
   de bloque */
```
```python
# PYTHON
# Comentario de línea
''' Comentario
    de bloque '''
```

#### 6. IF-ELSE
```java
// JAVA
if (condicion) {
    // sentencias
} else {
    // sentencias
}
```
```python
# PYTHON (indentación 4 espacios)
if condicion:
    # sentencias
else:
    # sentencias
```

#### 7. FOR → WHILE
```java
// JAVA
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

for (int i = 10; i > 0; i--) {
    System.out.println(i);
}
```
```python
# PYTHON
i = 0
while i < 10:
    print(str(i))
    i += 1

i = 10
while i > 0:
    print(str(i))
    i -= 1
```

#### 8. WHILE
```java
// JAVA
while (condicion) {
    // sentencias
}
```
```python
# PYTHON
while condicion:
    # sentencias
```

#### 9. Operadores ++ y --
```java
// JAVA
numero++;
numero--;
```
```python
# PYTHON
numero += 1
numero -= 1
```

### Implementación

```javascript
class Traductor {
    constructor(ast) {
        this.ast = ast;
        this.codigoPython = [];
        this.indentacion = 0;
    }

    traducir() {
        this.codigoPython = [];
        this.visitarPrograma(this.ast);
        return this.codigoPython.join('\n');
    }

    visitarPrograma(nodo) {
        this.agregar(`# Traducido de Java a Python`);
        this.agregar(`# Clase: ${nodo.nombreClase}`);
        this.agregar('');
        this.visitarMain(nodo.main);
    }

    visitarMain(nodo) {
        for (let sentencia of nodo.sentencias) {
            this.visitarSentencia(sentencia);
        }
    }

    visitarDeclaracion(nodo) {
        for (let variable of nodo.variables) {
            let valorDefecto = this.obtenerValorDefecto(nodo.tipo);
            let valor = variable.valor || valorDefecto;
            this.agregar(`${variable.nombre} = ${valor} # Declaracion: ${nodo.tipo}`);
        }
    }

    // ... más métodos de visita
}
```

---

## 🔷 FASE 4: GENERADOR DE REPORTES HTML
**Duración estimada:** 1-2 días  
**Prioridad:** MEDIA

### Objetivos
- Generar 3 tipos de reportes HTML
- Estilo profesional con tablas

### Reportes a Generar

#### 1. Reporte de Tokens
```html
<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Tokens</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>Tokens generados: 128</h1>
    <table>
        <tr>
            <th>No.</th>
            <th>Lexema</th>
            <th>Tipo</th>
            <th>Línea</th>
            <th>Columna</th>
        </tr>
        <tr>
            <td>1</td>
            <td>public</td>
            <td>PALABRA_RESERVADA</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <!-- ... más filas -->
    </table>
</body>
</html>
```

#### 2. Reporte de Errores Léxicos
```html
<h1>REPORTE DE ERRORES LÉXICOS</h1>
<table>
    <tr>
        <th>No.</th>
        <th>Error</th>
        <th>Descripción</th>
        <th>Línea</th>
        <th>Columna</th>
    </tr>
    <tr>
        <td>1</td>
        <td>@</td>
        <td>Carácter no reconocido</td>
        <td>5</td>
        <td>10</td>
    </tr>
</table>
```

#### 3. Reporte de Errores Sintácticos
```html
<h1>REPORTE DE ERRORES SINTÁCTICOS</h1>
<table>
    <tr>
        <th>No.</th>
        <th>Error</th>
        <th>Descripción</th>
        <th>Línea</th>
        <th>Columna</th>
    </tr>
    <tr>
        <td>1</td>
        <td>}</td>
        <td>Se esperaba ';'</td>
        <td>12</td>
        <td>25</td>
    </tr>
</table>
```

---

## 🔷 FASE 5: INTERFAZ WEB
**Duración estimada:** 2-3 días  
**Prioridad:** ALTA

### Diseño de la Interfaz

#### Layout Principal
```
┌─────────────────────────────────────────────────────────────┐
│  Traductor Java → Python          Archivo  Traducir  Ayuda │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │  Editor (Java)       │  │  Python traducido        │    │
│  │                      │  │                          │    │
│  │  // Escribe tu código│  │  # Aquí aparecerá el     │    │
│  │  public class Test { │  │  # código traducido      │    │
│  │                      │  │                          │    │
│  │                      │  │                          │    │
│  └──────────────────────┘  └──────────────────────────┘    │
│                                                               │
│  [Nuevo] [Abrir] [Guardar] [Generar Traducción] [Ver Tokens]│
│                                     [Guardar Python como...] │
└─────────────────────────────────────────────────────────────┘
```

### Menús Obligatorios

#### Menú ARCHIVO
- **Nuevo:** Limpia el editor
- **Abrir:** Carga archivo .java
- **Guardar:** Guarda código Java actual
- **Guardar Python como:** Guarda código Python (solo si traducción exitosa)
- **Salir:** Cierra aplicación

#### Menú TRADUCIR
- **Generar Traducción:** Ejecuta análisis léxico → sintáctico → traducción
- **Ver Tokens:** Muestra reporte HTML de tokens
- **Simular Ejecución:** Ejecuta código Python paso a paso

#### Menú AYUDA
- **Acerca de:** Información del desarrollador

### Tecnologías
- HTML5
- CSS3 (tema oscuro)
- JavaScript puro (sin frameworks)
- CodeMirror o Monaco Editor (opcional para resaltado de sintaxis)

---

## 🔷 FASE 6: SIMULADOR DE EJECUCIÓN
**Duración estimada:** 2 días  
**Prioridad:** MEDIA

### Objetivos
- Ejecutar el código Python generado paso a paso
- Mostrar valores de variables en cada paso
- Mostrar salidas de `print()`

### Implementación
```javascript
class Simulador {
    constructor(codigoPython) {
        this.codigo = codigoPython;
        this.variables = new Map();
        this.salidas = [];
    }

    ejecutar() {
        // Parsear y ejecutar línea por línea
        let lineas = this.codigo.split('\n');
        
        for (let linea of lineas) {
            if (linea.includes('=') && !linea.includes('==')) {
                this.ejecutarAsignacion(linea);
            } else if (linea.includes('print(')) {
                this.ejecutarPrint(linea);
            }
            // ... más operaciones
        }
        
        return { variables: this.variables, salidas: this.salidas };
    }
}
```

---

## 🔷 FASE 7: INTEGRACIÓN Y PRUEBAS
**Duración estimada:** 1-2 días  
**Prioridad:** ALTA

### Casos de Prueba

#### Caso 1: Programa Válido Completo
```java
public class MiPrograma {
    public static void main(String[] args) {
        int contador = 0;
        String mensaje = "Inicio del programa";
        boolean activo = true;

        System.out.println(mensaje);

        for (int i = 1; i <= 5; i++) {
            System.out.println("Iteracion: " + i);
            contador = contador + i;
        }

        if (contador > 10) {
            System.out.println("Contador mayor a 10: " + contador);
        } else {
            System.out.println("Contador menor o igual a 10");
        }

        while (activo) {
            System.out.println("Ejecutando while");
            activo = false;
        }
    }
}
```

#### Caso 2: Error Léxico
```java
public class Test {
    public static void main(String[] args) {
        int x = 10;
        char c = @;  // Error léxico: carácter no reconocido
    }
}
```

#### Caso 3: Error Sintáctico
```java
public class Test {
    public static void main(String[] args) {
        int x = 10  // Error sintáctico: falta punto y coma
        System.out.println(x);
    }
}
```

---

## 📊 CRONOGRAMA

| Fase | Actividad | Duración | Prioridad |
|------|-----------|----------|-----------|
| 1 | Analizador Léxico (AFD) | 2-3 días | CRÍTICA |
| 2 | Analizador Sintáctico (Parser) | 3-4 días | CRÍTICA |
| 3 | Traductor Java → Python | 2-3 días | ALTA |
| 4 | Generador de Reportes HTML | 1-2 días | MEDIA |
| 5 | Interfaz Web | 2-3 días | ALTA |
| 6 | Simulador de Ejecución | 2 días | MEDIA |
| 7 | Integración y Pruebas | 1-2 días | ALTA |
| **TOTAL** | | **13-19 días** | |

---

## 📝 ENTREGABLES

### 1. Código Fuente
- ✅ Repositorio: `LFP_2S2025_202200147`
- ✅ Carpeta: `Proyecto 2`
- ✅ Todos los archivos fuente (.js, .html, .css)

### 2. Documentación
- ✅ Manual Técnico (PDF)
- ✅ Manual de Usuario (PDF)
- ✅ README.md con instrucciones

### 3. Aplicación Funcional
- ✅ Interfaz web completa
- ✅ Todas las funcionalidades implementadas
- ✅ Casos de prueba ejecutados

### 4. Link GitHub
- ✅ Subir a UEDI antes del 25 de Octubre 2025, 23:59

---

## ✅ CHECKLIST DE CUMPLIMIENTO

### Requisitos Técnicos
- [ ] ❌ NO se usó regex
- [ ] ❌ NO se usaron librerías de parsing
- [ ] ✅ AFD implementado manualmente
- [ ] ✅ Parser manual basado en gramática
- [ ] ✅ Traducción Java → Python funcional
- [ ] ✅ Reportes HTML generados
- [ ] ✅ Interfaz web completa
- [ ] ✅ Simulador de ejecución

### Funcionalidades
- [ ] Analizador léxico detecta todos los tokens
- [ ] Analizador sintáctico valida estructura
- [ ] Traductor genera código Python correcto
- [ ] Reporte de tokens en HTML
- [ ] Reporte de errores léxicos en HTML
- [ ] Reporte de errores sintácticos en HTML
- [ ] Interfaz permite abrir/guardar archivos
- [ ] Simulador ejecuta código Python

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Crear estructura de carpetas
2. ✅ Implementar clase Token y TipoToken
3. ✅ Implementar AnalizadorLexico (AFD sin regex)
4. ✅ Probar analizador léxico con casos de prueba
5. ✅ Implementar Parser manual
6. ✅ Implementar Traductor
7. ✅ Crear interfaz web
8. ✅ Integrar todos los componentes
9. ✅ Pruebas exhaustivas
10. ✅ Documentación

---

## 📚 RECURSOS

### Autómatas y Compiladores
- Libro: "Compilers: Principles, Techniques, and Tools" (Dragon Book)
- Teoría de autómatas finitos deterministas (AFD)
- Gramáticas libres de contexto

### JavaScript
- Manipulación de strings sin regex
- Estructuras de datos (Map, Set, Array)
- Manejo de archivos en el navegador

---

**Fecha de creación:** 23 de Octubre de 2025  
**Última actualización:** 23 de Octubre de 2025  
**Estudiante:** Carnet 202200147
