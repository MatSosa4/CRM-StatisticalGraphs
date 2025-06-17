import Chart from 'chart.js/auto';
import moment from 'moment';

import { getISOWeekNumber } from '../backend/utils';
import { servicios, empresas } from './main';
import { getDataFromAPI } from './main';

const chartServicios = document.getElementById('promociones-servicios');
const chartEmpresasServicios = document.getElementById('promociones-empresas-servicios');

const weeks = getISOWeekNumber(moment(), 4);  // [22, 23, 24, 25]

// Stacked Bar Promociones by Servicios
getDataFromAPI('promociones').then((res) => {
  const data = {};

  // { tipo: [] }
  servicios.forEach(e => {
    data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  // Por cada row, revisar la fecha_modif y obtener su ISOWeek
  // Restar ISOWeek menor a todos para index[]
  res.forEach(row => {
    const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.tipo_servicio][index]++
  });

  new Chart(chartServicios, {
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

getDataFromAPI('promociones').then((res) => {
  const data = {};

  // data: { servicio1: { empresa1: [], empresa2: [] }, servicio2: { empresa1: [], empresa2: [] } }
  servicios.forEach(s => {
    data[s] = {};
    empresas.forEach(e => {
      data[s][e] = Array(4).fill(0);
    });
  });

  res.forEach(row => {
    const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.tipo_servicio][row.tipo_empresa][index]++
  });

console.log();

  new Chart(chartEmpresasServicios, {
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
            } 
          }
        }
      },
    }
  });
});
