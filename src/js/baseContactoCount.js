import Chart from 'chart.js/auto';
import moment from 'moment';

import { getDataFromAPI, getWeeks } from "./main";
import { empresas } from './main';
import { addDateValueToURLApi } from './utils'

const basesActivos = document.getElementById('base-activos');
const contactosActivos = document.getElementById('contactos-activos');
const basesInhabilitadas = document.getElementById('base-inhabilitados');

const datePicker = document.getElementById('date-picker');

let weeks;  // [22, 23, 24, 25]
let canvas1;
let canvas2;
let canvas3;

function displayDynamicTable() {
  weeks = getWeeks(datePicker ? datePicker.value : '');
  if (canvas1) canvas1.destroy();
  if (canvas2) canvas2.destroy();
  if (canvas3) canvas3.destroy();

  // Conteo TOTAL de Base en todas las fechas (fecha=all)
  getDataFromAPI('bases?estado=Base&fecha=all').then((res) => {
    const data = {};

    // { usuario: 0 }
    empresas.forEach(e => {
      data[e] = 0;
    });
    data.total = 0;

    // Por cada row, revisar el usuario
    res.forEach(row => {
      data[row.nombre_tipo]++;
      data.total++;
    });

    canvas1 = new Chart(basesActivos, {
      type: 'pie',
      data: {
        labels: empresas,
        datasets: [{
          label: "Empresas",
          data: empresas.map(e => data[e]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Conteo Total de Bases Activas"
          },
          tooltip: {
            callbacks: {
              title: () => "Empresas",
              label: function(context) {
                return `${context.label}: ${context.parsed}`;
              },
              footer: () => `Total: ${data.total}`
            }
          }
        },
      }
    });
  });

  // Conteo TOTAL de Contactos en todas las fechas (fecha=all)
  getDataFromAPI('bases?estado=Contacto&fecha=all').then((res) => {
    const data = {};

    // { tipo_empresa: 0 }
    empresas.forEach(u => {
      data[u] = 0;
    });
    data.total = 0;

    // Por cada row, revisar el usuario
    res.forEach(row => {
      data[row.nombre_tipo]++
      data.total++;
    });

    canvas2 = new Chart(contactosActivos, {
      type: 'pie',
      data: {
        labels: empresas,
        datasets: [{
          label: "Empresas",
          data: empresas.map(e => data[e]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Conteo Total de Contactos Activos"
          },
          tooltip: {
            callbacks: {
              title: () => "Usuarios",
              label: function(context) {
                return `${context.label}: ${context.parsed}`;
              },
              footer: () => `Total: ${data.total}`
            }
          }
        },
      }
    });
  });

  // Conteo Semanal de Bases Inhabilitadas
  getDataFromAPI(addDateValueToURLApi('bases?estado=Inhabilitado', datePicker)).then((res) => {
    const data = {};

    // { tipo: [] }
    empresas.forEach(e => {
      data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);

    // Por cada row, revisar la fecha_modif y obtener su ISOWeek
    // Restar ISOWeek menor a todos para index[]
    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_tipo][index]++;
      data.total[index]++;
    });

    canvas3 = new Chart(basesInhabilitadas, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: empresas.map(e => ({
          label: e,
          data: data[e],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.6
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Conteo Semanal de Bases Inhabilitadas"
          },
          tooltip: {
            callbacks: {
              footer: function(tooltips) {
                return `Total: ${data.total[tooltips[0].parsed.x]}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
  });
}

displayDynamicTable();

document.getElementById('reload').addEventListener('click', () => displayDynamicTable());
document.getElementById('search-date').addEventListener('click', () => displayDynamicTable());
datePicker.addEventListener('change', () => displayDynamicTable());
