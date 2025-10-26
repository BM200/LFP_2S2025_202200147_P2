/**
 * GeneradorHTML.js - Genera reportes HTML profesionales
 * Fase 4 del proyecto JavaBridge
 */

class GeneradorHTML {
    constructor() {
        this.estilosBase = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .header p {
                    font-size: 1.1em;
                    opacity: 0.9;
                }
                
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 30px;
                    background: #f8f9fa;
                }
                
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                    transition: transform 0.3s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                }
                
                .stat-number {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 5px;
                }
                
                .stat-label {
                    color: #666;
                    font-size: 0.9em;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .content {
                    padding: 30px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background: white;
                }
                
                thead {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                th {
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85em;
                    letter-spacing: 1px;
                }
                
                td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                tbody tr:hover {
                    background-color: #f5f5f5;
                    transition: background-color 0.2s ease;
                }
                
                tbody tr:nth-child(even) {
                    background-color: #fafafa;
                }
                
                .token-type {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 500;
                }
                
                .tipo-palabra-reservada {
                    background: #e3f2fd;
                    color: #1976d2;
                }
                
                .tipo-identificador {
                    background: #f3e5f5;
                    color: #7b1fa2;
                }
                
                .tipo-numero {
                    background: #e8f5e9;
                    color: #388e3c;
                }
                
                .tipo-cadena {
                    background: #fff3e0;
                    color: #f57c00;
                }
                
                .tipo-simbolo {
                    background: #fce4ec;
                    color: #c2185b;
                }
                
                .tipo-operador {
                    background: #e0f2f1;
                    color: #00796b;
                }
                
                .error-row {
                    background-color: #ffebee !important;
                }
                
                .error-icon {
                    color: #d32f2f;
                    font-weight: bold;
                    font-size: 1.2em;
                }
                
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    color: #666;
                    border-top: 1px solid #e0e0e0;
                }
                
                .timestamp {
                    font-size: 0.9em;
                    color: #999;
                }
                
                .no-errors {
                    text-align: center;
                    padding: 40px;
                    color: #4caf50;
                    font-size: 1.2em;
                }
                
                .no-errors::before {
                    content: "✓";
                    display: block;
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }
                    
                    .stat-card:hover {
                        transform: none;
                    }
                }
            </style>
        `;
    }

    /**
     * Genera reporte de tokens
     */
    generarReporteTokens(tokens) {
        const fecha = new Date().toLocaleString('es-GT', { 
            timeZone: 'America/Guatemala' 
        });

        // Estadísticas
        const totalTokens = tokens.length;
        const tiposUnicos = new Set(tokens.map(t => t.tipo)).size;
        const lineas = tokens.length > 0 ? Math.max(...tokens.map(t => t.linea)) : 0;

        // Contar tokens por tipo
        const conteoPorTipo = {};
        tokens.forEach(token => {
            conteoPorTipo[token.tipo] = (conteoPorTipo[token.tipo] || 0) + 1;
        });

        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens - JavaBridge</title>
    ${this.estilosBase}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Reporte de Tokens</h1>
            <p>Análisis Léxico - JavaBridge</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${totalTokens}</div>
                <div class="stat-label">Tokens Totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${tiposUnicos}</div>
                <div class="stat-label">Tipos Diferentes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${lineas}</div>
                <div class="stat-label">Líneas Analizadas</div>
            </div>
        </div>
        
        <div class="content">
            <h2>Tokens Reconocidos</h2>
            <table>
                <thead>
                    <tr>
                        <th style="width: 60px;">No.</th>
                        <th>Lexema</th>
                        <th>Tipo</th>
                        <th style="width: 80px;">Línea</th>
                        <th style="width: 80px;">Columna</th>
                    </tr>
                </thead>
                <tbody>
        `;

        tokens.forEach((token, index) => {
            const clase = this.obtenerClaseTipo(token.tipo);
            html += `
                    <tr>
                        <td><strong>${index + 1}</strong></td>
                        <td><code>${this.escaparHTML(token.lexema)}</code></td>
                        <td><span class="token-type ${clase}">${token.tipo}</span></td>
                        <td>${token.linea}</td>
                        <td>${token.columna}</td>
                    </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p><strong>JavaBridge</strong> - Traductor Java → Python</p>
            <p class="timestamp">Generado: ${fecha}</p>
            <p class="timestamp">Carnet: 202200147</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    /**
     * Genera reporte de errores léxicos
     */
    generarReporteErroresLexicos(errores) {
        const fecha = new Date().toLocaleString('es-GT', { 
            timeZone: 'America/Guatemala' 
        });

        const totalErrores = errores.length;

        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Léxicos - JavaBridge</title>
    ${this.estilosBase}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Reporte de Errores Léxicos</h1>
            <p>Análisis Léxico - JavaBridge</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" style="color: #d32f2f;">${totalErrores}</div>
                <div class="stat-label">Errores Detectados</div>
            </div>
        </div>
        
        <div class="content">
        `;

        if (errores.length === 0) {
            html += `
            <div class="no-errors">
                ¡No se detectaron errores léxicos!
            </div>
            `;
        } else {
            html += `
            <h2>Errores Encontrados</h2>
            <table>
                <thead>
                    <tr>
                        <th style="width: 60px;">No.</th>
                        <th style="width: 100px;">Carácter</th>
                        <th>Descripción</th>
                        <th style="width: 80px;">Línea</th>
                        <th style="width: 80px;">Columna</th>
                    </tr>
                </thead>
                <tbody>
            `;

            errores.forEach((error, index) => {
                html += `
                    <tr class="error-row">
                        <td><strong>${index + 1}</strong></td>
                        <td><span class="error-icon">${this.escaparHTML(error.caracter || error.lexema || '???')}</span></td>
                        <td>${this.escaparHTML(error.descripcion || error.mensaje || 'Error desconocido')}</td>
                        <td>${error.linea || 0}</td>
                        <td>${error.columna || 0}</td>
                    </tr>
                `;
            });

            html += `
                </tbody>
            </table>
            `;
        }

        html += `
        </div>
        
        <div class="footer">
            <p><strong>JavaBridge</strong> - Traductor Java → Python</p>
            <p class="timestamp">Generado: ${fecha}</p>
            <p class="timestamp">Carnet: 202200147</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    /**
     * Genera reporte de errores sintácticos
     */
    generarReporteErroresSintacticos(errores) {
        const fecha = new Date().toLocaleString('es-GT', { 
            timeZone: 'America/Guatemala' 
        });

        const totalErrores = errores.length;

        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Sintácticos - JavaBridge</title>
    ${this.estilosBase}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔴 Reporte de Errores Sintácticos</h1>
            <p>Análisis Sintáctico - JavaBridge</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" style="color: #d32f2f;">${totalErrores}</div>
                <div class="stat-label">Errores Detectados</div>
            </div>
        </div>
        
        <div class="content">
        `;

        if (errores.length === 0) {
            html += `
            <div class="no-errors">
                ¡No se detectaron errores sintácticos!
            </div>
            `;
        } else {
            html += `
            <h2>Errores Encontrados</h2>
            <table>
                <thead>
                    <tr>
                        <th style="width: 60px;">No.</th>
                        <th style="width: 150px;">Token</th>
                        <th>Descripción</th>
                        <th style="width: 80px;">Línea</th>
                        <th style="width: 80px;">Columna</th>
                    </tr>
                </thead>
                <tbody>
            `;

            errores.forEach((error, index) => {
                html += `
                    <tr class="error-row">
                        <td><strong>${index + 1}</strong></td>
                        <td><span class="error-icon">${this.escaparHTML(error.token || error.lexema || '???')}</span></td>
                        <td>${this.escaparHTML(error.mensaje || error.descripcion || 'Error desconocido')}</td>
                        <td>${error.linea || 0}</td>
                        <td>${error.columna || 0}</td>
                    </tr>
                `;
            });

            html += `
                </tbody>
            </table>
            `;
        }

        html += `
        </div>
        
        <div class="footer">
            <p><strong>JavaBridge</strong> - Traductor Java → Python</p>
            <p class="timestamp">Generado: ${fecha}</p>
            <p class="timestamp">Carnet: 202200147</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    /**
     * Escapa caracteres HTML para evitar inyección
     */
    escaparHTML(texto) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(texto).replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Obtiene la clase CSS según el tipo de token
     */
    obtenerClaseTipo(tipo) {
        const mapa = {
            'PALABRA_RESERVADA': 'tipo-palabra-reservada',
            'IDENTIFICADOR': 'tipo-identificador',
            'ENTERO': 'tipo-numero',
            'DECIMAL': 'tipo-numero',
            'CADENA': 'tipo-cadena',
            'CARACTER': 'tipo-cadena',
            'BOOLEANO': 'tipo-palabra-reservada',
            'SUMA': 'tipo-operador',
            'RESTA': 'tipo-operador',
            'MULTIPLICACION': 'tipo-operador',
            'DIVISION': 'tipo-operador',
            'MODULO': 'tipo-operador',
            'ASIGNACION': 'tipo-operador',
            'IGUAL': 'tipo-operador',
            'DIFERENTE': 'tipo-operador',
            'MENOR': 'tipo-operador',
            'MAYOR': 'tipo-operador',
            'MENOR_IGUAL': 'tipo-operador',
            'MAYOR_IGUAL': 'tipo-operador',
            'AND': 'tipo-operador',
            'OR': 'tipo-operador',
            'NOT': 'tipo-operador',
            'INCREMENTO': 'tipo-operador',
            'DECREMENTO': 'tipo-operador'
        };

        return mapa[tipo] || 'tipo-simbolo';
    }

    /**
     * Guarda el HTML en un archivo (para Node.js)
     */
    guardarArchivo(html, nombreArchivo) {
        if (typeof require !== 'undefined') {
            const fs = require('fs');
            fs.writeFileSync(nombreArchivo, html, 'utf8');
            return true;
        }
        return false;
    }

    /**
     * Descarga el HTML en el navegador
     */
    descargarEnNavegador(html, nombreArchivo) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeneradorHTML;
}
