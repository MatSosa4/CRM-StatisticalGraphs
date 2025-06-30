import moment from "moment";
import Chart from 'chart.js/auto';

import { getDataFromAPI, getWeeks } from "./main";
import { servicios } from "./main";

const leadsCount = document.getElementById('leads-count');
const propuestasCount = document.getElementById('propuestas-count');
const cierresCount = document.getElementById('cierres-count');

const datePicker = document.getElementById('date-picker');

let weeks;  // [22, 23, 24, 25]
let canvas1;
let canvas2;
let canvas3;

function displayDynamicTable() {
  weeks = getWeeks(datePicker.value);

  if (canvas1) canvas1.destroy();
  if (canvas2) canvas2.destroy();
  if (canvas3) canvas3.destroy();

  // Conteo Semanal de Leads
  getDataFromAPI('leads').then((res) => {
    const data = {};

    // { tipo: [] }
    servicios.forEach(s => {
      data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);

    res.forEach(row => {
      const index = moment(row.fecha_modif_lead).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_tipo][index]++;
      data.total[index]++;
    });

    canvas1 = new Chart(leadsCount, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: servicios.map(s => ({
          label: s,
          data: data[s],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.4
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
            text: "Conteo Semanal de Leads"
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

  // Conteo Semanal de Propuestas
  getDataFromAPI('propuestas').then((res) => {
    const data = {};

    // { tipo: [] }
    servicios.forEach(s => {
      data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);

    res.forEach(row => {
      const index = moment(row.fecha_modif_propuesta).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_tipo][index]++;
      data.total[index]++;
    });

    canvas2 = new Chart(propuestasCount, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: servicios.map(s => ({
          label: s,
          data: data[s],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.4
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
            text: "Conteo Semanal de Propuestas"
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

  // Conteo Semanal de Cierres
  getDataFromAPI('cierres').then((res) => {
    const data = {};

    // { tipo: [] }
    servicios.forEach(s => {
      data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
    });
    data.total = Array(4).fill(0);

    res.forEach(row => {
      const index = moment(row.firma_contrato_cierre).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_tipo][index]++;
      data.total[index]++;
    });

    canvas3 = new Chart(cierresCount, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: servicios.map(s => ({
          label: s,
          data: data[s],
          borderWidth: 1
        }))
      },
      options: {
        datasets: {
          bar: {
            barPercentage: 0.4
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
            text: "Conteo Semanal de Cierres"
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
            stacked: true,
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
