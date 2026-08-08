const STORAGE_KEY = 'sonrisa-vital-citas';
const HEADERS = ['nombre', 'telefono', 'correo', 'fecha', 'hora', 'servicio', 'motivo'];

const form = document.querySelector('#appointmentForm');
const tableBody = document.querySelector('#appointmentsTable');
const message = document.querySelector('#formMessage');
const downloadCsv = document.querySelector('#downloadCsv');
const downloadExcel = document.querySelector('#downloadExcel');
const clearData = document.querySelector('#clearData');

function getAppointments() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function renderAppointments() {
  const appointments = getAppointments();
  tableBody.innerHTML = '';

  if (appointments.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="7">Aún no hay citas guardadas.</td>';
    tableBody.appendChild(row);
    return;
  }

  appointments.forEach((appointment) => {
    const row = document.createElement('tr');
    HEADERS.forEach((key) => {
      const cell = document.createElement('td');
      cell.textContent = appointment[key] || '—';
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

function serializeCsv(appointments) {
  const escapeValue = (value) => `"${String(value || '').replaceAll('"', '""')}"`;
  const rows = [HEADERS.join(',')].concat(
    appointments.map((appointment) => HEADERS.map((key) => escapeValue(appointment[key])).join(','))
  );
  return rows.join('\n');
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportData(format) {
  const appointments = getAppointments();
  if (appointments.length === 0) {
    message.textContent = 'No hay citas para exportar.';
    return;
  }

  const csv = serializeCsv(appointments);
  if (format === 'excel') {
    downloadFile('citas-odontologicas.xls', csv, 'application/vnd.ms-excel;charset=utf-8');
    return;
  }
  downloadFile('citas-odontologicas.csv', csv, 'text/csv;charset=utf-8');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const appointment = Object.fromEntries(formData.entries());
  const appointments = getAppointments();

  appointments.push({
    nombre: appointment.nombre.trim(),
    telefono: appointment.telefono.trim(),
    correo: appointment.correo.trim(),
    fecha: appointment.fecha,
    hora: appointment.hora,
    servicio: appointment.servicio,
    motivo: appointment.motivo.trim(),
  });

  saveAppointments(appointments);
  renderAppointments();
  form.reset();
  message.textContent = 'Cita guardada correctamente. Puedes descargarla en CSV o Excel.';
});

downloadCsv.addEventListener('click', () => exportData('csv'));
downloadExcel.addEventListener('click', () => exportData('excel'));
clearData.addEventListener('click', () => {
  if (getAppointments().length === 0) return;
  saveAppointments([]);
  renderAppointments();
  message.textContent = 'Registros borrados de este navegador.';
});

renderAppointments();
