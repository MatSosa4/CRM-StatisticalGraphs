import moment from "moment";
import Chart from 'chart.js/auto';

import { getDataFromAPI, getWeeks } from "./main";
import { usuarios } from "./main";
import { addDateValueToURLApi } from "./utils";

const usersChart = document.getElementById('users-chart');
const statesChart = document.getElementById('states-chart');

const selectTable = document.getElementById('select-table');
const datePicker = document.getElementById('date-picker');

let canvas1 = null;
let canvas2 = null;

let weeks;

// Al cambiar el estado de un comboBox (Bases, Contactos, Promociones, Leads, Propuestas, Cierres)
// se cambia la data del gráfico, rescatando diferentes datos pero siempre el conteo de usuarios por
// semana.
function displayDynamicTable(value) {
  const tableName = String(value).charAt(0).toUpperCase() + String(value).slice(1).split('?')[0];  // bases?param=value
  weeks = getWeeks(datePicker.value);

  if (canvas1) canvas1.destroy();  // Remove actual data
  if (canvas2) canvas2.destroy();  // Remove actual data

  console.log(addDateValueToURLApi(value, datePicker));
  console.log(value);

  getDataFromAPI(addDateValueToURLApi(value, datePicker)).then((res) => {
    const data = {};

    usuarios.forEach(name => {
      data[name] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);  // Save Total in Array

    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_usuario][index]++
      data.total[index]++;
    });

    canvas1 = new Chart(usersChart, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: usuarios.map(name => ({
          label: name,
          data: data[name],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.65
          }
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        title: {
          display: true,
          text: `Conteo Semanal de ${tableName}`  // Capitalize
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

  // States
  getDataFromAPI(addDateValueToURLApi(value, datePicker)).then((res) => {
    const data = {};
    data.total = Array(4).fill(0);

    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3

      // Dynamic Values
      if (!row.estado) row.estado = 'No definido';
      if (!data.hasOwnProperty(row.estado)) data[row.estado] = Array(4).fill(0);

      data[row.estado][index]++;
      data.total[index]++;
    });

    const states = Object.keys(data);
    states.splice(states.indexOf('total'), 1)  // No 'total' in states

    // Estados
    canvas2 = new Chart(statesChart, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: states.map(name => ({
          label: name,
          data: data[name],
          borderWidth: 1
        }))
      },
      options: {
        interaction: {
          intersect: false,
          mode: 'index',
        },
        datasets: {
          bar: {
            barPercentage: 0.65
          }
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        title: {
          display: true,
          text: `Conteo Semanal de Estados de ${tableName}`  // Capitalize
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

displayDynamicTable(selectTable.value);  // Empieza siempre en Base

// When modified
selectTable.addEventListener('change', () => displayDynamicTable(selectTable.value));

document.getElementById('search-date').addEventListener('click', () => displayDynamicTable(selectTable.value));
document.getElementById('reload').addEventListener('click', () => displayDynamicTable(selectTable.value));
datePicker.addEventListener('change', () => displayDynamicTable(selectTable.value));
