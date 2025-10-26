# JavaBridge: Traductor de Java a Python


## 📜 Introducción

**JavaBridge** es un proyecto académico desarrollado para el curso de **Lenguajes Formales y de Programación** de la Facultad de Ingeniería, Universidad de San Carlos de Guatemala. El objetivo principal de este proyecto es construir un traductor que convierta un subconjunto definido del lenguaje de programación Java a su equivalente en Python.

La herramienta está diseñada como una aplicación web interactiva que permite al usuario escribir o cargar código Java, analizarlo, y ver la traducción resultante en tiempo real. Una de las restricciones fundamentales del proyecto es que tanto el **analizador léxico** como el **analizador sintáctico** deben ser implementados de forma manual, sin el uso de librerías o generadores automáticos (como ANTLR) ni expresiones regulares para el procesamiento de tokens.

---

## ✨ Características Principales (Fase Actual)

Actualmente, el proyecto se encuentra en una fase de desarrollo avanzada, con las siguientes funcionalidades completadas y en progreso:

*   **Interfaz Web Interactiva:** Una interfaz de usuario moderna y oscura construida con HTML, CSS y Bootstrap 5, que proporciona:
    *   Un editor para código Java.
    *   Una vista para el código Python traducido.
    *   Menús y botones para acceder a todas las funcionalidades.
*   **Analizador Léxico (Scanner) - 100% Completado:**
    *   Implementación de un Autómata Finito Determinista (AFD) manual.
    *   Reconocimiento de palabras reservadas, identificadores, números (enteros y decimales), cadenas, caracteres, símbolos y comentarios.
    *   Detección y reporte detallado de errores léxicos (ej: caracteres no válidos, cadenas sin cerrar).
*   **Analizador Sintáctico (Parser) - En Progreso:**
    *   Implementación de un parser descendente recursivo basado en la gramática libre de contexto del lenguaje.
    *   Capacidad para validar la estructura principal del programa (`public class ... { ... }`) y el método `main`.
    *   Construcción de un **Árbol de Sintaxis Abstracta (AST)** como representación interna del código válido.

---

## 🚀 Cómo Empezar

Para ejecutar este proyecto en tu máquina local, necesitarás tener instalado [Node.js](https://nodejs.org/).

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/BM200/LFP_2S2025_202200147_P2.git]
    cd javabridgetranslator
    ```

2.  **Instala las dependencias:**
    (Express para el servidor web)
    ```bash
    npm install express
    ```

3.  **Inicia el servidor:**
    ```bash
    node server.js
    ```

4.  **Abre la aplicación:**
    Abre tu navegador web y ve a la dirección `http://localhost:3000`.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3, Bootstrap 5
*   **Lógica del Cliente:** JavaScript (Vanilla JS, ES6+)
*   **Backend (Servidor de Desarrollo):** Node.js + Express
*   **Control de Versiones:** Git y GitHub

---

## 👨‍💻 Autor

*   **[Mario Rodrigo Balam]**
*   **Carné:** [202200147]
*   **Correo:** [2908263140708@ingenieria.usac.edu.gt]