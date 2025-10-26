/**
 * main.js - Controlador principal de JavaBridge
 * Integra todos los componentes del traductor
 */

class JavaBridgeApp {
    constructor() {
        this.editorJava = document.getElementById('editor-java');
        this.editorPython = document.getElementById('editor-python');
        this.consoleOutput = document.getElementById('console-output');
        
        this.ultimaTraduccion = null;
        this.ultimosTokens = null;
        this.ultimosErroresLexicos = null;
        this.ultimosErroresSintacticos = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.logConsole('JavaBridge iniciado correctamente. Listo para traducir código.', 'info');
    }

    setupEventListeners() {
        // Menú Archivo
        document.getElementById('menu-nuevo').addEventListener('click', (e) => {
            e.preventDefault();
            this.nuevoArchivo();
        });
        
        document.getElementById('menu-abrir').addEventListener('click', (e) => {
            e.preventDefault();
            this.abrirArchivo();
        });
        
        document.getElementById('menu-guardar').addEventListener('click', (e) => {
            e.preventDefault();
            this.guardarJava();
        });
        
        document.getElementById('menu-guardar-python').addEventListener('click', (e) => {
            e.preventDefault();
            this.guardarPython();
        });
        
        document.getElementById('menu-salir').addEventListener('click', (e) => {
            e.preventDefault();
            this.salir();
        });

        // Menú Traducir
        document.getElementById('menu-traducir').addEventListener('click', (e) => {
            e.preventDefault();
            this.traducir();
        });
        
        document.getElementById('menu-ver-tokens').addEventListener('click', (e) => {
            e.preventDefault();
            this.verTokens();
        });
        
        document.getElementById('menu-ver-errores-lexicos').addEventListener('click', (e) => {
            e.preventDefault();
            this.verErroresLexicos();
        });
        
        document.getElementById('menu-ver-errores-sintacticos').addEventListener('click', (e) => {
            e.preventDefault();
            this.verErroresSintacticos();
        });

        // Menú Ayuda
        document.getElementById('menu-acerca').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarAcercaDe();
        });
        
        document.getElementById('menu-manual').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarManual();
        });

        // Botones de la barra de acciones
        document.getElementById('btn-nuevo').addEventListener('click', () => this.nuevoArchivo());
        document.getElementById('btn-abrir').addEventListener('click', () => this.abrirArchivo());
        document.getElementById('btn-guardar').addEventListener('click', () => this.guardarJava());
        document.getElementById('btn-traducir').addEventListener('click', () => this.traducir());
        document.getElementById('btn-ver-tokens').addEventListener('click', () => this.verTokens());
        document.getElementById('btn-guardar-python').addEventListener('click', () => this.guardarPython());

        // Consola
        document.getElementById('btn-limpiar-consola').addEventListener('click', () => this.limpiarConsola());

        // Input de archivo
        document.getElementById('file-input').addEventListener('change', (e) => this.cargarArchivo(e));

        // Actualizar estadísticas al escribir
        this.editorJava.addEventListener('input', () => this.updateStats());

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.nuevoArchivo();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.abrirArchivo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.guardarJava();
                        break;
                    case 't':
                        e.preventDefault();
                        this.traducir();
                        break;
                }
            }
        });
    }

    // === FUNCIONES DE ARCHIVO ===

    nuevoArchivo() {
        if (this.editorJava.value && !confirm('¿Deseas descartar los cambios actuales?')) {
            return;
        }
        
        this.editorJava.value = '';
        this.editorPython.value = '';
        this.ultimaTraduccion = null;
        document.getElementById('btn-guardar-python').disabled = true;
        this.updateTranslationStatus('Sin traducir', false);
        this.updateStats();
        this.logConsole('Nuevo archivo creado', 'info');
    }

    abrirArchivo() {
        document.getElementById('file-input').click();
    }

    cargarArchivo(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.editorJava.value = e.target.result;
            this.updateStats();
            this.logConsole(`Archivo cargado: ${file.name}`, 'success');
        };
        reader.readAsText(file);
    }

    guardarJava() {
        const codigo = this.editorJava.value;
        if (!codigo.trim()) {
            this.logConsole('No hay código para guardar', 'warning');
            return;
        }

        const blob = new Blob([codigo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'codigo.java';
        a.click();
        URL.revokeObjectURL(url);
        
        this.logConsole('Código Java guardado exitosamente', 'success');
    }

    guardarPython() {
        const codigo = this.editorPython.value;
        if (!codigo.trim()) {
            this.logConsole('No hay código Python para guardar', 'warning');
            return;
        }

        const blob = new Blob([codigo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'codigo.py';
        a.click();
        URL.revokeObjectURL(url);
        
        this.logConsole('Código Python guardado exitosamente', 'success');
    }

    salir() {
        if (confirm('¿Estás seguro de que deseas salir?')) {
            window.close();
        }
    }

    // === FUNCIONES DE TRADUCCIÓN ===

    traducir() {
        const codigoJava = this.editorJava.value;
        
        if (!codigoJava.trim()) {
            this.logConsole('No hay código Java para traducir', 'warning');
            return;
        }

        this.logConsole('Iniciando análisis léxico...', 'info');

        // Paso 1: Análisis Léxico
        const lexico = new AnalizadorLexico(codigoJava);
        const resultadoLexico = lexico.analizar();
        
        this.ultimosTokens = resultadoLexico.tokens;
        this.ultimosErroresLexicos = resultadoLexico.errores;

        this.logConsole(`✓ Análisis léxico completado: ${resultadoLexico.tokens.length} tokens encontrados`, 'success');

        if (resultadoLexico.errores.length > 0) {
            this.logConsole(`✗ Se detectaron ${resultadoLexico.errores.length} errores léxicos`, 'error');
            this.updateTranslationStatus('Error léxico', false);
            return;
        }

        // Paso 2: Análisis Sintáctico
        this.logConsole('Iniciando análisis sintáctico...', 'info');
        
        const parser = new Parser(resultadoLexico.tokens);
        const resultadoParser = parser.parse();
        
        this.ultimosErroresSintacticos = resultadoParser.errores;

        if (!resultadoParser.exito) {
            this.logConsole(`✗ Se detectaron ${resultadoParser.errores.length} errores sintácticos`, 'error');
            this.updateTranslationStatus('Error sintáctico', false);
            return;
        }

        this.logConsole('✓ Análisis sintáctico completado exitosamente', 'success');

        // Paso 3: Traducción
        this.logConsole('Iniciando traducción a Python...', 'info');
        
        const traductor = new Traductor(resultadoParser.ast, resultadoParser.tablaSimbolos);
        const resultadoTraduccion = traductor.traducir();

        if (!resultadoTraduccion.exito) {
            this.logConsole(`✗ Error en la traducción: ${resultadoTraduccion.errores[0].mensaje}`, 'error');
            this.updateTranslationStatus('Error en traducción', false);
            return;
        }

        // Mostrar código Python
        this.editorPython.value = resultadoTraduccion.codigo;
        this.ultimaTraduccion = resultadoTraduccion;
        document.getElementById('btn-guardar-python').disabled = false;
        
        this.updateTranslationStatus('Traducido exitosamente', true);
        this.updateStats();
        
        this.logConsole('✓ Traducción completada exitosamente', 'success');
        this.logConsole(`  → ${resultadoTraduccion.codigo.split('\n').length} líneas de Python generadas`, 'info');
    }

    // === FUNCIONES DE REPORTES ===

    verTokens() {
        if (!this.ultimosTokens || this.ultimosTokens.length === 0) {
            this.logConsole('Primero debes traducir código para ver los tokens', 'warning');
            return;
        }

        const generador = new GeneradorHTML();
        const html = generador.generarReporteTokens(this.ultimosTokens);
        
        this.abrirReporteEnNuevaVentana(html, 'Reporte de Tokens');
        this.logConsole(`Reporte de tokens generado: ${this.ultimosTokens.length} tokens`, 'success');
    }

    verErroresLexicos() {
        const errores = this.ultimosErroresLexicos || [];
        
        const generador = new GeneradorHTML();
        const html = generador.generarReporteErroresLexicos(errores);
        
        this.abrirReporteEnNuevaVentana(html, 'Errores Léxicos');
        
        if (errores.length === 0) {
            this.logConsole('No hay errores léxicos para mostrar', 'success');
        } else {
            this.logConsole(`Reporte de errores léxicos: ${errores.length} errores`, 'warning');
        }
    }

    verErroresSintacticos() {
        const errores = this.ultimosErroresSintacticos || [];
        
        const generador = new GeneradorHTML();
        const html = generador.generarReporteErroresSintacticos(errores);
        
        this.abrirReporteEnNuevaVentana(html, 'Errores Sintácticos');
        
        if (errores.length === 0) {
            this.logConsole('No hay errores sintácticos para mostrar', 'success');
        } else {
            this.logConsole(`Reporte de errores sintácticos: ${errores.length} errores`, 'warning');
        }
    }

    abrirReporteEnNuevaVentana(html, titulo) {
        const ventana = window.open('', titulo, 'width=1000,height=700');
        ventana.document.write(html);
        ventana.document.close();
    }

    // === FUNCIONES DE AYUDA ===

    mostrarAcercaDe() {
        const modal = new bootstrap.Modal(document.getElementById('modal-acerca'));
        modal.show();
    }

    mostrarManual() {
        this.logConsole('Manual de usuario disponible en la documentación del proyecto', 'info');
    }

    // === FUNCIONES DE UI ===

    updateStats() {
        const javaCode = this.editorJava.value;
        const pythonCode = this.editorPython.value;
        
        document.getElementById('java-lines').innerHTML = 
            `<i class="bi bi-list-ol"></i> ${javaCode.split('\n').length} líneas`;
        document.getElementById('java-chars').innerHTML = 
            `<i class="bi bi-pencil"></i> ${javaCode.length} caracteres`;
        
        document.getElementById('python-lines').innerHTML = 
            `<i class="bi bi-list-ol"></i> ${pythonCode.split('\n').length} líneas`;
    }

    updateTranslationStatus(message, success) {
        const badge = document.getElementById('translation-status');
        badge.textContent = message;
        badge.className = 'badge';
        if (success) {
            badge.classList.add('bg-success');
        } else {
            badge.classList.add('bg-danger');
        }
    }

    logConsole(message, type = 'info') {
        const time = new Date().toLocaleTimeString('es-GT');
        const messageDiv = document.createElement('div');
        
        const iconClass = {
            'success': 'text-success',
            'error': 'text-danger',
            'warning': 'text-warning',
            'info': 'text-info'
        }[type] || 'text-info';
        
        const icon = this.getBootstrapIcon(type);
        
        messageDiv.className = `console-message ${iconClass}`;
        messageDiv.innerHTML = `
            <span class="console-time text-muted">[${time}]</span>
            <span class="console-text ms-2">
                <i class="bi ${icon}"></i> ${message}
            </span>
        `;
        
        this.consoleOutput.appendChild(messageDiv);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    getIcon(type) {
        const icons = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    getBootstrapIcon(type) {
        const icons = {
            'success': 'bi-check-circle',
            'error': 'bi-x-circle',
            'warning': 'bi-exclamation-triangle',
            'info': 'bi-info-circle'
        };
        return icons[type] || 'bi-info-circle';
    }

    limpiarConsola() {
        this.consoleOutput.innerHTML = '';
        this.logConsole('Consola limpiada', 'info');
    }
}

// Inicializar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JavaBridgeApp();
});
