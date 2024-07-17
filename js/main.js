// Instalar json-server desde NPM (npm install -g json-server)

// Utilizar el comando (json-server --watch pacientes.json --port 3000) en powershell para crear servidor local
document.addEventListener("DOMContentLoaded", function () {
  const formIngresoPaciente = document.getElementById("formIngresoPaciente");
  const formBusqueda = document.getElementById("formBusqueda");
  const resultadosBusqueda = document.getElementById("resultadosBusqueda");
  const resultadoBusquedaIndividual = document.getElementById("resultadoBusquedaIndividual");

  function generateUniqueId() {
    return "id-" + new Date().getTime();
  }

  if (formIngresoPaciente) {
    formIngresoPaciente.addEventListener("submit", function (event) {
      event.preventDefault();

      const id = generateUniqueId();
      const nombre = document.getElementById("nombre").value;
      const edad = document.getElementById("edad").value;
      const direccion = document.getElementById("direccion").value;
      const telefono = document.getElementById("telefono").value;

      const paciente = { id, nombre, edad, direccion, telefono, historiaClinica: [] };

      fetch('http://localhost:3000/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente)
      })
      .then(response => response.json())
      .then(data => {
        Toastify({
          text: "Historia Clinica creada correctamente",
          duration: 3000,
          className: "notificacion",
          style: { background: "green", color: "white" }
        }).showToast();
        formIngresoPaciente.reset();
      })
      .catch(error => console.error('Error:', error));
    });
  }

  if (formBusqueda) {
    formBusqueda.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombreBusqueda = document.getElementById("nombreBusqueda").value.toLowerCase();

      fetch(`http://localhost:3000/pacientes`)
        .then(response => response.json())
        .then(pacientes => {
          const pacientesEncontrados = pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(nombreBusqueda));
          resultadosBusqueda.innerHTML = "";
          resultadoBusquedaIndividual.innerHTML = "";

          if (pacientesEncontrados.length > 0) {
            resultadosBusqueda.innerHTML = `<h3>Pacientes Encontrados</h3>`;
            pacientesEncontrados.forEach((paciente) => {
              resultadosBusqueda.innerHTML += `
                <div>
                  <p>ID: ${paciente.id}</p>
                  <p>Nombre: ${paciente.nombre}</p>
                  <button onclick="verDetallesPaciente('${paciente.id}')">Ver Detalles</button>
                </div>
              `;
            });
          } else {
            Toastify({
              text: "Paciente no encontrado",
              duration: 3000,
              className: "notificacion",
              style: { background: "red", color: "white" }
            }).showToast();
          }
        })
        .catch(error => console.error('Error:', error));
    });
  }
});

function verDetallesPaciente(id) {
  fetch(`http://localhost:3000/pacientes/${id}`)
    .then(response => response.json())
    .then(paciente => {
      const historiaClinicaHtml = paciente.historiaClinica.map(entrada => `<p>${entrada.fecha}: ${entrada.entrada}</p>`).join('');

      document.getElementById("resultadoBusquedaIndividual").innerHTML = `
        <h3>Detalles del Paciente</h3>
        <p>ID: ${paciente.id}</p>
        <p>Nombre y apellido: ${paciente.nombre}</p>
        <p>Edad: ${paciente.edad}</p>
        <p>Dirección: ${paciente.direccion}</p>
        <p>Teléfono: ${paciente.telefono}</p>
        <h4>Historia Clínica</h4>
        <div id="historiaClinica-${paciente.id}">${historiaClinicaHtml}</div>
        <textarea id="nuevaEntrada-${paciente.id}" rows="8" cols="100" placeholder="Añadir nueva entrada"></textarea>
        <button id="boton-guardar" onclick="guardarHistoriaClinica('${paciente.id}')">Guardar</button>
      `;
    })
    .catch(error => console.error('Error:', error));
}

function guardarHistoriaClinica(id) {
  const nuevaEntrada = document.getElementById(`nuevaEntrada-${id}`).value;
  if (nuevaEntrada.trim() !== "") {
    const fechaActual = new Date().toLocaleDateString();
    const entradaConFecha = { entrada: nuevaEntrada, fecha: fechaActual };

    fetch(`http://localhost:3000/pacientes/${id}`)
      .then(response => response.json())
      .then(paciente => {
        paciente.historiaClinica.push(entradaConFecha);
        return fetch(`http://localhost:3000/pacientes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paciente)
        });
      })
      .then(response => response.json())
      .then(data => {
        const nuevaEntradaHtml = `<p>${fechaActual}: ${nuevaEntrada}</p>`;
        document.getElementById(`historiaClinica-${id}`).innerHTML += nuevaEntradaHtml;
        document.getElementById(`nuevaEntrada-${id}`).value = "";
        Toastify({
          text: "Historia clínica guardada con éxito",
          duration: 3000,
          className: "notificacion",
          style: { background: "green", color: "white" }
        }).showToast();
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert("Por favor, escribe una entrada para la historia clínica.");
  }
}
