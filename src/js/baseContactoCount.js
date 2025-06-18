import Chart from 'chart.js/auto';
import moment from 'moment';

import { getDataFromAPI, totalSum } from "./main";
import { getISOWeekNumber } from '../backend/utils';
import { empresas, usuarios } from './main';

const basesActivos = document.getElementById('base-activos');
const contactosActivos = document.getElementById('contactos-activos');
const basesInhabilitadas = document.getElementById('base-inhabilitados');

const weeks = getISOWeekNumber(moment(), 4);  // [22, 23, 24, 25]

getDataFromAPI('bases?estado=Base&fecha=all').then((res) => {
  const data = {};

  // { usuario: 0 }
  usuarios.forEach(u => {
    data[u] = 0;
  });

  // Por cada row, revisar el usuario
  res.forEach(row => {
    data[row.nombre_usuario]++
  });

  new Chart(basesActivos, {
    type: 'pie',
    data: {
      labels: usuarios,
      datasets: [{
        label: 'Usuarios',
        data: usuarios.map(u => data[u]),
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
            title: () => "Usuarios",
            label: function(context) {
              return `${context.label}: ${context.parsed}`;
            }
          }
        }
      },
    }
  });
});

getDataFromAPI('bases?estado=Contacto').then((res) => {
  const data = {};

  // { usuario: 0 }
  usuarios.forEach(u => {
    data[u] = 0;
  });

  // Por cada row, revisar el usuario
  res.forEach(row => {
    data[row.nombre_usuario]++
  });

  new Chart(contactosActivos, {
    type: 'pie',
    data: {
      labels: usuarios,
      datasets: [{
        label: 'Usuarios',
        data: usuarios.map(u => data[u]),
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
            }
          }
        }
      },
    }
  });
});

getDataFromAPI('bases?estado=Inhabilitado').then((res) => {
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

  new Chart(basesInhabilitadas, {
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
