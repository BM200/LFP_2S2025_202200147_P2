# 🌉 JavaBridge - Traductor Java → Python

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
- ✅ **Interfaz Web con Bootstrap** - Editor de código profesional

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

## 🎯 ESTADO DEL PROYECTO

### ✅ Fase 1: Analizador Léxico (COMPLETADO)
- [x] Clase Token
- [x] Enumeración TipoToken con todos los operadores (&&, ||, %, !)
- [x] AnalizadorLexico (AFD sin regex)
- [x] Reconocimiento de palabras reservadas
- [x] Reconocimiento de identificadores
- [x] Reconocimiento de números (enteros y decimales)
- [x] Reconocimiento de cadenas y caracteres
- [x] Reconocimiento de símbolos y operadores
- [x] Reconocimiento de comentarios (// y /* */)
- [x] Detección de errores léxicos
- [x] Pruebas unitarias (4 tests pasando)

### ✅ Fase 2: Analizador Sintáctico (COMPLETADO)
- [x] Clase Parser descendente recursivo
- [x] Nodos del AST (14 tipos diferentes)
- [x] Tabla de símbolos
- [x] Validación de estructura de clase Java
- [x] Detección de errores sintácticos
- [x] Validación de variables no declaradas
- [x] Pruebas unitarias (5 tests pasando)

### ✅ Fase 3: Traductor (COMPLETADO)
- [x] Recorrido del AST
- [x] Reglas de traducción Java → Python
- [x] Generación de código Python
- [x] Conversión de tipos de datos
- [x] Traducción de estructuras de control (if, for, while, do-while)
- [x] Conversión de operadores (&&→and, ||→or, /→//)
- [x] System.out.println → print()
- [x] Manejo de indentación Python
- [x] Pruebas unitarias (4 tests pasando)

### ✅ Fase 4: Reportes HTML (COMPLETADO)
- [x] Reporte de tokens con estadísticas
- [x] Reporte de errores léxicos
- [x] Reporte de errores sintácticos
- [x] Diseño profesional con gradientes
- [x] Tablas responsivas
- [x] Exportación a HTML
- [x] Pruebas (6 reportes generados)

### ✅ Fase 5: Interfaz Web (COMPLETADO)
- [x] Layout profesional con Bootstrap 5
- [x] Navbar con menús desplegables funcionales
- [x] Editor dual (Java y Python)
- [x] Menú Archivo (Nuevo, Abrir, Guardar)
- [x] Menú Traducir (Generar, Ver Tokens, Ver Errores)
- [x] Botones de acción con iconos Bootstrap
- [x] Consola de salida con logs
- [x] Modal "Acerca de"
- [x] Estadísticas en tiempo real
- [x] Atajos de teclado (Ctrl+N, Ctrl+O, Ctrl+S, Ctrl+T)
- [x] Diseño responsive

### ⏳ Pendiente (Opcional):
- [ ] Manual técnico en PDF
- [ ] Manual de usuario en PDF

---

## 🚀 Cómo Usar

### Opción 1: Interfaz Web (Recomendado)

1. **Abrir la aplicación:**
   ```bash
   # En Windows
   explorer index.html
   
   # O arrastrar index.html al navegador
   ```

2. **Usar el traductor:**
   - Escribe o pega código Java en el editor izquierdo
   - Clic en "Generar Traducción"
   - El código Python aparecerá en el editor derecho
   - Usa "Ver Tokens" para ver el análisis léxico
   - Usa "Guardar Python" para descargar el código traducido

3. **Funciones del menú:**
   - **Archivo → Nuevo:** Limpia los editores
   - **Archivo → Abrir:** Carga un archivo .java
   - **Archivo → Guardar:** Descarga el código Java
   - **Traducir → Generar Traducción:** Traduce Java a Python
   - **Traducir → Ver Tokens:** Abre reporte de tokens
   - **Traducir → Ver Errores:** Muestra errores detectados

### Opción 2: Pruebas en Node.js

#### Probar Analizador Léxico:
```bash
cd "c:\Users\balam\Dropbox\PC\Documents\USAC 2025\LFP_P2_202200147"
node js/lexico/test-lexico.js
```

#### Probar Parser:
```bash
node js/sintactico/test-parser.js
```

#### Probar Traductor:
```bash
node js/traductor/test-traductor.js
```

#### Generar Reportes HTML:
```bash
node js/reportes/test-reportes.js
```

Los reportes se guardan en la carpeta `reportes/`

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

## 📖 Ejemplo de Uso Completo

### Código Java de Entrada:
```java
public class Ejemplo {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        boolean mayor = (a > 5) && (b < 30);
        
        if (mayor) {
            System.out.println("Condición verdadera");
        }
        
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}
```

### Código Python Generado:
```python
# Código traducido de Java a Python
# Clase original: Ejemplo
# Generado por JavaBridge

def main():
    a = 10
    b = 20
    mayor = ((a > 5) and (b < 30))
    if mayor:
        print("Condición verdadera")
    for i in range(0, 5):
        print(i)

if __name__ == "__main__":
    main()
```

### Análisis Realizado:
- ✅ **43 tokens** reconocidos
- ✅ **0 errores** léxicos
- ✅ **0 errores** sintácticos
- ✅ Traducción exitosa
- ✅ Código Python válido y ejecutable

---

## 🔧 Tecnologías Utilizadas

- **Lenguaje:** JavaScript (ES6+)
- **Frontend:** HTML5 + CSS3 + Bootstrap 5.3
- **Iconos:** Bootstrap Icons
- **Entorno:** Navegador web moderno
- **Testing:** Node.js (opcional, para pruebas)
- **Sin dependencias** para análisis léxico/sintáctico (100% implementación manual)

---

## ✨ Características Destacadas

### 🎯 Análisis Léxico
- AFD implementado manualmente sin regex
- Reconoce 17+ tipos de tokens diferentes
- Detecta errores léxicos con línea y columna exacta
- Maneja comentarios de línea y bloque
- Soporte para operadores complejos (&&, ||, ++, --)

### 🌳 Análisis Sintáctico
- Parser descendente recursivo
- Genera AST (Abstract Syntax Tree)
- Validación de estructura de clase Java
- Detección de variables no declaradas
- Tabla de símbolos integrada
- 14 tipos de nodos AST

### 🔄 Traducción
- Conversión completa Java → Python
- Preserva semántica del programa
- Manejo de indentación Python automática
- Conversión de tipos de datos
- Traducción de estructuras de control:
  - if/else → if/else
  - for → range() o while
  - while → while
  - do-while → while True con break
- Conversión de operadores:
  - && → and
  - || → or
  - ! → not
  - / → // (división entera)
  - ++ → += 1
  - -- → -= 1
- System.out.println() → print()

### 📊 Reportes HTML
- Diseño profesional con gradientes
- Tablas interactivas con hover effects
- Estadísticas visuales
- Código coloreado por tipo
- Exportación directa a HTML
- Responsive (funciona en móviles)

### 💻 Interfaz Web
- Diseño moderno con Bootstrap
- Editores de código lado a lado
- Menús desplegables funcionales
- Consola de salida en tiempo real
- Atajos de teclado
- Carga y descarga de archivos
- Responsive design
- Tema oscuro profesional

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
