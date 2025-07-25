/**
 * Obtiene el valor de una cookie por su nombre.
 * @param {string} name - El nombre de la cookie.
 * @returns {string|null} El valor de la cookie o null si no se encuentra.
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const trimmedCookie = cookie.trim();
            // La cookie comienza con el nombre que buscamos?
            if (trimmedCookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(trimmedCookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

/**
 * Muestra un modal de error utilizando SweetAlert2.
 * @param {string|object} obj - El mensaje de error o un objeto con los errores.
 */
function message_error(obj) {
    let html = '';
    if (typeof obj === 'object' && obj !== null) {
        html = '<ul style="text-align: left;">';
        // Usando Object.entries para iterar sobre el objeto de forma moderna
        for (const [key, value] of Object.entries(obj)) {
            html += `<li>${key}: ${value}</li>`;
        }
        html += '</ul>';
    } else {
        html = `<p>${obj}</p>`;
    }
    Swal.fire({
        title: '¡Error!',
        html: html,
        icon: 'error'
    });
}

/**
 * Envía datos vía AJAX, con una confirmación opcional.
 * Si el parámetro 'title' es nulo, el envío es directo.
 * @param {string} url - La URL a la que se enviarán los datos.
 * @param {string|null} title - El título para el diálogo de confirmación. Si es null, no hay confirmación.
 * @param {string} content - El mensaje para el diálogo de confirmación.
 * @param {FormData} parameters - Los datos del formulario a enviar.
 * @param {function} callback - La función a ejecutar si la petición tiene éxito.
 */
function submit_with_ajax(url, title, content, parameters, callback) {
    const process_ajax = () => {
        $.ajax({
            url: url,
            data: parameters,
            type: 'POST',
            dataType: 'json',
            headers: { 'X-CSRFToken': csrftoken },
            processData: false,
            contentType: false,
        }).done(function(request) {
            if (!request.hasOwnProperty('error')) {
                callback(request);
            } else {
                message_error(request.error);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            message_error(errorThrown + ' ' + textStatus);
        });
    };

    // Si no se proporciona un título, ejecuta el AJAX directamente sin confirmación.
    if (title === null) {
        process_ajax();
        return;
    }

    // Si hay título, muestra el diálogo de confirmación.
    $.confirm({
        theme: 'material',
        title: title,
        icon: 'fa fa-info',
        content: content,
        columnClass: 'small',
        typeAnimated: true,
        cancelButtonClass: 'btn-primary',
        draggable: true,
        dragWindowBorder: false,
        buttons: {
            info: {
                text: "Sí",
                btnClass: 'btn-primary',
                action: function() {
                    process_ajax();
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-red',
                action: function() {}
            },
        }
    });
}

/**
 * Muestra un diálogo de confirmación genérico.
 * @param {string} title - El título del diálogo.
 * @param {string} content - El mensaje del diálogo.
 * @param {function} callback - Función a ejecutar al confirmar.
 * @param {function} [cancel] - Función opcional a ejecutar al cancelar.
 */
function alert_action(title, content, callback, cancel) {
    $.confirm({
        theme: 'material',
        title: title,
        icon: 'fa fa-info',
        content: content,
        columnClass: 'small',
        typeAnimated: true,
        cancelButtonClass: 'btn-primary',
        draggable: true,
        dragWindowBorder: false,
        buttons: {
            info: {
                text: "Sí",
                btnClass: 'btn-primary',
                action: function() {
                    callback();
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-red',
                action: function() {
                    if (cancel) {
                        cancel();
                    }
                }
            },
        }
    });
}

// Las funciones de validación de teclado se mantienen por compatibilidad,
// aunque se recomienda usar validación basada en eventos de 'input' y regex.
function validate_form_text(type, event, regex) {
    // ... (El código interno de esta función se mantiene sin cambios)
}

function validate_decimals(el, evt) {
    // ... (El código interno de esta función se mantiene sin cambios)
}