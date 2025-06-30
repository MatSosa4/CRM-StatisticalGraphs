import Chart from 'chart.js/auto';
import moment from 'moment';

import { addDateValueToURLApi, getISOWeekNumber } from './utils';
import { servicios, empresas } from './main';
import { getDataFromAPI } from './main';

const chartServicios = document.getElementById('promociones-servicios');
const chartEmpresasServicios = document.getElementById('promociones-empresas-servicios');
const datePicker = document.getElementById('date-picker');

let weeks;
let canvas1;
let canvas2;;

function displayDynamicTable() {
  const value = 'promociones';

  let apiCall = addDateValueToURLApi(value, datePicker);
  weeks = getISOWeekNumber(datePicker.value ? moment(datePicker.value) : moment(), 4);

  if (canvas1) canvas1.destroy();
  if (canvas2) canvas2.destroy();

// Stacked Bar Promociones by Servicios
  getDataFromAPI(apiCall).then((res) => {
    const data = {};

    // { tipo: [] }
    servicios.forEach(e => {
      data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);

    // Por cada row, revisar la fecha_modif y obtener su ISOWeek
    // Restar ISOWeek menor a todos para index[]
    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.tipo_servicio][index]++;
      data.total[index]++;
    });

    canvas1 = new Chart(chartServicios, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: servicios.map(e => ({
          label: e,
          data: data[e],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.7
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
            text: "Conteo Semanal de Promociones por Servicio"
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

  getDataFromAPI(apiCall).then((res) => {
    const data = {};

    // data: { servicio1: { empresa1: [], empresa2: [] }, servicio2: { empresa1: [], empresa2: [] } }
    servicios.forEach(s => {
      data[s] = {};
      empresas.forEach(e => {
        data[s][e] = Array(4).fill(0);
      });
      data[s].total = Array(4).fill(0);
    });

    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.tipo_servicio][row.tipo_empresa][index]++
      data[row.tipo_servicio].total[index]++
    });

    canvas2 = new Chart(chartEmpresasServicios, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        // Separado por servicios
        datasets: servicios.flatMap(s =>
          // Cada Empresa
          empresas.map(e => ({
            label: e,
            data: data[s][e],
            stack: s,  // Cada barra es un servicio
            borderWidth: 1
          }))
        )
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.7
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
            text: "Conteo Semanal de Promociones (Tipo de Servicio & Tipo de Empresa)"
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].dataset.stack;
              },
              footer: function(tooltips) {
                return `Total: ${data[tooltips[0].dataset.stack].total[tooltips[0].parsed.x]}`;  // Stack = Servicio
              }
            }
          }
        },
      }
    });
  });
}

displayDynamicTable();

document.getElementById('search-date').addEventListener('click', () => displayDynamicTable());
document.getElementById('reload').addEventListener('click', () => displayDynamicTable());
datePicker.addEventListener('change', () => displayDynamicTable());
