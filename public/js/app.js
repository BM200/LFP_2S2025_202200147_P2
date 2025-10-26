// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const javaEditor = document.getElementById('java-editor');
    const btnVerTokens = document.getElementById('btnVerTokens');
    const btnVerTokensMenu = document.getElementById('btnVerTokensMenu');
    
    // Elementos del Modal
    const tokensModalElement = document.getElementById('tokensModal');
    const tokensModal = new bootstrap.Modal(tokensModalElement);
    const tokensTableBody = document.getElementById('tokens-table-body');
    const errorReportContainer = document.getElementById('error-report-container');
    const errorsTableBody = document.getElementById('errors-table-body');
    
    // --- LÓGICA PRINCIPAL ---

    /**
     * Función que se ejecuta al presionar "Ver Tokens".
     * Realiza el análisis léxico y muestra los resultados.
     */
    const realizarAnalisisLexico = () => {
        // 1. Obtener el código fuente del editor
        const codigoFuente = javaEditor.value;

        // 2. Crear una instancia del analizador y ejecutarlo
        const lexer = new AnalizadorLexico(codigoFuente);
        const resultado = lexer.analizar(); // Contiene { tokens: [], errores: [] }

        // 3. Renderizar los resultados en las tablas del modal
        renderizarTablaTokens(resultado.tokens);
        renderizarTablaErrores(resultado.errores);

        // 4. Mostrar el modal con los resultados
        tokensModal.show();
    };

    /**
     * Limpia y llena la tabla de tokens con los datos del análisis.
     * @param {Token[]} tokens - El array de tokens generados.
     */
    const renderizarTablaTokens = (tokens) => {
        // Limpiar contenido previo
        tokensTableBody.innerHTML = '';
        
        if (tokens.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center text-muted">No se generaron tokens.</td>`;
            tokensTableBody.appendChild(row);
            return;
        }

        // Poblar la tabla con cada token
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const row = document.createElement('tr');
            
            // Usamos innerHTML para construir la fila, es simple y efectivo
            row.innerHTML = `
                <th scope="row">${i + 1}</th>
                <td>${escapeHTML(token.lexema)}</td>
                <td>${escapeHTML(token.tipo)}</td>
                <td>${token.linea}</td>
                <td>${token.columna}</td>
            `;
            tokensTableBody.appendChild(row);
        }
    };

    /**
     * Limpia y llena la tabla de errores. Si no hay errores, oculta la sección.
     * @param {Object[]} errores - El array de errores generados.
     */
    const renderizarTablaErrores = (errores) => {
        if (errores.length === 0) {
            // Si no hay errores, nos aseguramos que la sección de errores esté oculta
            errorReportContainer.style.display = 'none';
            return;
        }

        // Si hay errores, mostramos la sección y limpiamos la tabla
        errorReportContainer.style.display = 'block';
        errorsTableBody.innerHTML = '';

        // Poblamos la tabla con cada error
        for (let i = 0; i < errores.length; i++) {
            const error = errores[i];
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${error.linea}</td>
                <td>${error.columna}</td>
                <td>'${escapeHTML(error.lexema)}'</td>
                <td>${escapeHTML(error.descripcion)}</td>
            `;
            errorsTableBody.appendChild(row);
        }
    };

    /**
     * Función auxiliar para escapar caracteres HTML y prevenir inyección de código.
     * @param {string} str - La cadena de texto a escapar.
     * @returns {string} La cadena escapada.
     */
    const escapeHTML = (str) => {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    };

    // --- ASIGNACIÓN DE EVENTOS ---
    btnVerTokens.addEventListener('click', realizarAnalisisLexico);
    btnVerTokensMenu.addEventListener('click', realizarAnalisisLexico);

});