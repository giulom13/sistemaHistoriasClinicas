document.addEventListener('DOMContentLoaded', function() {
    const formIngresoPaciente = document.getElementById('formIngresoPaciente');
    const formBusqueda = document.getElementById('formBusqueda');
    const resultadosBusqueda = document.getElementById('resultadosBusqueda');
    const resultadoBusqueda = document.getElementById('resultadoBusqueda');

    function generateUniqueId() {
        return 'id-' + new Date().getTime();
    }

    if (formIngresoPaciente) {
        formIngresoPaciente.addEventListener('submit', function(event) {
            event.preventDefault();

            const id = generateUniqueId();
            const nombre = document.getElementById('nombre').value;
            const edad = document.getElementById('edad').value;
            const direccion = document.getElementById('direccion').value;
            const telefono = document.getElementById('telefono').value;

            const paciente = {
                id,
                nombre,
                edad,
                direccion,
                telefono,
                historiaClinica: []
            };

            let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            pacientes.push(paciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));

            alert('Paciente ingresado con éxito');
            formIngresoPaciente.reset();
        });
    }

    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombreBusqueda = document.getElementById('nombreBusqueda').value;
            const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            const pacientesEncontrados = pacientes.filter(paciente => paciente.nombre.toLowerCase() === nombreBusqueda.toLowerCase());

            resultadosBusqueda.innerHTML = '';
            resultadoBusqueda.innerHTML = '';

            if (pacientesEncontrados.length > 0) {
                resultadosBusqueda.innerHTML = '<h3>Pacientes Encontrados</h3>';
                pacientesEncontrados.forEach(paciente => {
                    resultadosBusqueda.innerHTML += `
                        <div>
                            <p>ID: ${paciente.id}</p>
                            <p>Nombre: ${paciente.nombre}</p>
                            <button onclick="verDetallesPaciente('${paciente.id}')">Ver Detalles</button>
                        </div>
                    `;
                });
            } else {
                resultadosBusqueda.innerHTML = '<p>No se encontró ningún paciente con ese nombre.</p>';
            }
        });
    }
});

function verDetallesPaciente(id) {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(paciente => paciente.id === id);

    if (paciente) {
        const historiaClinicaHtml = paciente.historiaClinica.map(entrada => `<p>${entrada}</p>`).join('');

        document.getElementById('resultadoBusqueda').innerHTML = `
            <h3>Detalles del Paciente</h3>
            <p>ID: ${paciente.id}</p>
            <p>Nombre: ${paciente.nombre}</p>
            <p>Edad: ${paciente.edad}</p>
            <p>Dirección: ${paciente.direccion}</p>
            <p>Teléfono: ${paciente.telefono}</p>
            <h4>Historia Clínica</h4>
            <div id="historiaClinica-${paciente.id}">${historiaClinicaHtml}</div>
            <textarea id="nuevaEntrada-${paciente.id}" rows="8" cols="100" placeholder="Añadir nueva entrada"></textarea>
            <button onclick="guardarHistoriaClinica('${paciente.id}')">Guardar</button>
        `;
    } else {
        alert('No se pudo encontrar el paciente.');
    }
}

function guardarHistoriaClinica(id) {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(paciente => paciente.id === id);

    if (paciente) {
        const nuevaEntrada = document.getElementById(`nuevaEntrada-${id}`).value;
        if (nuevaEntrada.trim() !== "") {
            const fechaActual = new Date().toLocaleDateString();
            const entradaConFecha = `${fechaActual}: ${nuevaEntrada}`;

            paciente.historiaClinica.push(entradaConFecha);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));

            const nuevaEntradaHtml = `<p>${entradaConFecha}</p>`;
            document.getElementById(`historiaClinica-${id}`).innerHTML += nuevaEntradaHtml;

            document.getElementById(`nuevaEntrada-${id}`).value = "";
            alert('Historia clínica guardada con éxito');
        } else {
            alert('Por favor, escribe una entrada para la historia clínica.');
        }
    } else {
        alert('No se pudo encontrar el paciente.');
    }
}




