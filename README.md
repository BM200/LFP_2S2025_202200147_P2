# 🚀 JavaBridge - Traductor Java → Python

**Proyecto 2 - Lenguajes Formales y de Programación**  
**Carnet:** 202200147  
**Fecha límite:** 25 de Octubre de 2025

---

## 📋 Descripción del Proyecto

**JavaBridge** es un traductor de código Java a Python que implementa:
- ✅ **Analizador Léxico (AFD)** - SIN USAR REGEX
- ✅ **Analizador Sintáctico (Parser Manual)** - Basado en gramática libre de contexto
- ✅ **Traductor Java → Python** - Preservando semántica
- ✅ **Generador de Reportes HTML** - Tokens y errores
- ✅ **Interfaz Web** - Editor de código con visualización
- ✅ **Simulador de Ejecución** - Ejecuta código Python generado

---

## ⚠️ RESTRICCIONES CRÍTICAS

### 🚫 PROHIBIDO
- ❌ **Expresiones regulares (regex)**
- ❌ Librerías de parsing (ANTLR, JFlex, Lex)
- ❌ Herramientas automáticas de análisis

### ✅ IMPLEMENTACIÓN MANUAL
- ✔️ AFD carácter por carácter
- ✔️ Parser descendente recursivo
- ✔️ Traducción basada en AST

---

## 📁 Estructura del Proyecto

```
LFP_P2_202200147/
│
├── index.html                          # Interfaz principal
├── README.md                           # Este archivo
├── PLAN_DESARROLLO.md                  # Plan detallado por fases
├── input.txt                           # Archivo de prueba
│
├── css/
│   └── styles.css                     # Estilos de la interfaz
│
├── js/
│   ├── main.js                        # Controlador principal
│   │
│   ├── lexico/                        # ✅ FASE 1 COMPLETADA
│   │   ├── Token.js                  # Clase Token
│   │   ├── TipoToken.js              # Tipos de tokens
│   │   ├── AnalizadorLexico.js       # AFD SIN REGEX
│   │   └── test-lexico.js            # Pruebas del analizador
│   │
│   ├── sintactico/                    # 🔄 EN DESARROLLO
│   │   ├── Parser.js                 # Analizador sintáctico
│   │   ├── AST.js                    # Árbol sintáctico
│   │   └── TablaSimbolos.js          # Tabla de símbolos
│   │
│   ├── traductor/                     # ⏳ PENDIENTE
│   │   └── Traductor.js              # Traducción Java → Python
│   │
│   ├── reportes/                      # ⏳ PENDIENTE
│   │   ├── GeneradorHTML.js          # Reportes HTML
│   │   └── ErrorHandler.js           # Manejo de errores
│   │
│   ├── simulador/                     # ⏳ PENDIENTE
│   │   └── Simulador.js              # Simulación de ejecución
│   │
│   └── utils/
│       └── Helper.js                  # Funciones auxiliares
│
├── tests/
│   └── test-cases/                    # Casos de prueba
│
└── docs/
    ├── manual-tecnico.pdf            # Manual técnico
    └── manual-usuario.pdf            # Manual de usuario
```

---

## 🎯 PROGRESO DEL PROYECTO

### ✅ Fase 1: Analizador Léxico (COMPLETADO)
- [x] Clase Token
- [x] Enumeración TipoToken
- [x] AnalizadorLexico (AFD sin regex)
- [x] Reconocimiento de palabras reservadas
- [x] Reconocimiento de identificadores
- [x] Reconocimiento de números (enteros y decimales)
- [x] Reconocimiento de cadenas y caracteres
- [x] Reconocimiento de símbolos y operadores
- [x] Reconocimiento de comentarios (// y /* */)
- [x] Detección de errores léxicos
- [x] Pruebas unitarias

### 🔄 Fase 2: Analizador Sintáctico (EN DESARROLLO)
- [ ] Clase Parser
- [ ] Nodos del AST
- [ ] Tabla de símbolos
- [ ] Validación de estructura
- [ ] Detección de errores sintácticos

### ⏳ Fase 3: Traductor (PENDIENTE)
- [ ] Recorrido del AST
- [ ] Reglas de traducción
- [ ] Generación de código Python

### ⏳ Fase 4: Reportes HTML (PENDIENTE)
- [ ] Reporte de tokens
- [ ] Reporte de errores léxicos
- [ ] Reporte de errores sintácticos

### ⏳ Fase 5: Interfaz Web (PENDIENTE)
- [ ] Layout principal
- [ ] Menú Archivo
- [ ] Menú Traducir
- [ ] Editor de código
- [ ] Visualización de resultados

### ⏳ Fase 6: Simulador (PENDIENTE)
- [ ] Ejecución paso a paso
- [ ] Visualización de variables

### ⏳ Fase 7: Documentación (PENDIENTE)
- [ ] Manual técnico
- [ ] Manual de usuario

---

## 🚀 Cómo Usar (Desarrollo)

### Probar el Analizador Léxico

#### En Node.js:
```bash
cd "c:\Users\balam\Dropbox\PC\Documents\USAC 2025\LFP_P2_202200147"
node js/lexico/test-lexico.js
```

#### En Navegador:
1. Crear un archivo HTML de prueba
2. Incluir los scripts:
   ```html
   <script src="js/lexico/Token.js"></script>
   <script src="js/lexico/TipoToken.js"></script>
   <script src="js/lexico/AnalizadorLexico.js"></script>
   <script src="js/lexico/test-lexico.js"></script>
   ```
3. Ejecutar `ejecutarTodasLasPruebas()` en consola

---

## 📖 Documentación Técnica

### Tokens Reconocidos

#### Palabras Reservadas
```
public, class, static, void, main, String, args,
int, double, char, boolean, true, false,
if, else, for, while, System, out, println
```

#### Símbolos
```
{, }, (, ), [, ], ;, ,, ., =, +, -, *, /,
==, !=, >, <, >=, <=, ++, --
```

#### Literales
- **Enteros:** `123`, `0`, `-45`
- **Decimales:** `12.34`, `0.0`, `-3.14`
- **Caracteres:** `'a'`, `'1'`, `' '`
- **Cadenas:** `"hola"`, `""`, `"texto con espacios"`
- **Booleanos:** `true`, `false`

### Ejemplo de Uso del Analizador Léxico

```javascript
const codigo = `public class Test {
    public static void main(String[] args) {
        int x = 42;
        System.out.println("Hola Mundo");
    }
}`;

const analizador = new AnalizadorLexico(codigo);
const resultado = analizador.analizar();

console.log(`Tokens: ${resultado.tokens.length}`);
console.log(`Errores: ${resultado.errores.length}`);
console.log(`Éxito: ${resultado.exito}`);
```

---

## 🔧 Tecnologías Utilizadas

- **Lenguaje:** JavaScript (ES6+)
- **Entorno:** Navegador web (HTML5 + CSS3)
- **Sin dependencias externas** para análisis léxico/sintáctico

---

## 📝 Notas de Desarrollo

### Implementación del AFD (Sin Regex)

El analizador léxico implementa un **Autómata Finito Determinista** que:

1. **Lee carácter por carácter** el código fuente
2. **Identifica patrones** mediante funciones auxiliares:
   - `esLetra(char)` - Verifica si es A-Z o a-z usando códigos ASCII
   - `esDigito(char)` - Verifica si es 0-9 usando códigos ASCII
   - `esEspacio(char)` - Detecta espacios, tabs y saltos de línea
3. **Transiciona entre estados** según el carácter actual
4. **Genera tokens** cuando completa un patrón válido
5. **Reporta errores** cuando encuentra caracteres inválidos

**Ejemplo de función sin regex:**
```javascript
esLetra(char) {
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) ||   // A-Z
           (code >= 97 && code <= 122);     // a-z
}
```

---

## 👨‍💻 Autor

**Carnet:** 202200147  
**Curso:** Lenguajes Formales y de Programación  
**Sección:** Segunda Semestre 2025

---

## 📅 Fecha de Entrega

**25 de Octubre de 2025 - 23:59**

---

## 📄 Licencia

Proyecto académico - Universidad de San Carlos de Guatemala (USAC)
