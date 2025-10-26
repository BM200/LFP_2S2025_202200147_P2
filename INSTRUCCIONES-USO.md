# 🧪 Instrucciones de Prueba - JavaBridge

## ✅ Pasos para probar en el navegador

### 1️⃣ Test Rápido en Consola
Abre `test-browser.html` en tu navegador:
- Presiona **F12** para abrir la consola
- Verás el proceso completo: Léxico → Parser → Traducción
- Si todo está en verde ✅, el sistema funciona correctamente

### 2️⃣ Interfaz Web Completa
Abre `index.html` en tu navegador:

#### **Opción A: Escribir código manualmente**
1. Escribe código Java en el editor izquierdo
2. Haz clic en **"▶️ Generar Traducción"** (o Ctrl+T)
3. Verás el código Python en el editor derecho
4. Puedes guardar el resultado con **"💾 Guardar Python"**

#### **Opción B: Cargar archivo de ejemplo**
1. Haz clic en **"📂 Abrir"** (menú Archivo)
2. Selecciona `docs/ejemplo-simple.txt`
3. Haz clic en **"▶️ Generar Traducción"**
4. ✨ Verás la traducción automática

### 3️⃣ Ver Reportes
Después de traducir, puedes:
- **Ver Tokens**: Muestra todos los tokens encontrados
- **Ver AST**: Árbol de sintaxis abstracta
- **Ver Errores**: Errores léxicos y sintácticos (si los hay)

---

## 🐛 Si no funciona la traducción

### Paso 1: Abre la Consola del Navegador
- Presiona **F12**
- Ve a la pestaña **Console**
- Busca mensajes de error en rojo

### Paso 2: Verifica los errores comunes

#### Error: "No genera la traducción"
**Causa**: El código Java tiene errores sintácticos
**Solución**: Revisa el código en el editor, debe ser código Java válido

#### Error: "Cannot read property 'tipo' of undefined"
**Causa**: Problema al cargar los módulos
**Solución**: 
1. Refresca la página (F5)
2. Verifica que todos los archivos JS estén en su lugar:
   - `js/lexico/AnalizadorLexico.js`
   - `js/sintactico/Parser.js`
   - `js/traductor/Traductor.js`

#### Error: "Sentencia no reconocida"
**Causa**: Sintaxis no soportada aún
**Solución**: Usa solo las características soportadas:
- Variables: `int`, `double`, `char`, `String`, `boolean`
- Operadores: `+`, `-`, `*`, `/`, `%`, `&&`, `||`, `!`
- Estructuras: `if-else`, `for`, `while`, `do-while`
- Salida: `System.out.println()`

---

## 📝 Código Java Válido de Ejemplo

```java
public class Ejemplo {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int suma = x + y;
        
        System.out.println("Resultado:");
        System.out.println(suma);
        
        if (suma > 25) {
            System.out.println("Mayor a 25");
        }
    }
}
```

---

## 🎯 Lista de Verificación

Antes de reportar un problema, verifica:

- [ ] ¿El código Java es válido?
- [ ] ¿Tiene la estructura `public class X { public static void main(...) { } }`?
- [ ] ¿No tiene errores de sintaxis (punto y coma, llaves, etc.)?
- [ ] ¿Refrescaste la página (F5)?
- [ ] ¿Revisaste la consola del navegador (F12)?

---

## 📞 Mensaje de Error Útil

Si el problema persiste, copia este mensaje:

```
PROBLEMA: No genera la traducción
NAVEGADOR: [Chrome/Firefox/Edge + versión]
CÓDIGO JAVA: [pega aquí tu código]
ERROR EN CONSOLA: [pega aquí el mensaje de error]
```

---

## ✨ Características Soportadas

### ✅ Completamente funcional:
- Análisis léxico (tokens)
- Análisis sintáctico (AST)
- Traducción Java → Python
- Comentarios (`//` y `/* */`)
- Declaraciones múltiples (`int a, b, c;`)
- Operadores aritméticos, lógicos y relacionales
- Estructuras de control (if, for, while, do-while)
- Incremento/decremento (`++`, `--`)

### ⏳ Características futuras:
- Arrays
- Métodos personalizados
- Clases múltiples
- Switch-case

---

¡Listo para usar! 🚀
