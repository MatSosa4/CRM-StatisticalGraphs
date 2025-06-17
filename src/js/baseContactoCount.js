import Chart from 'chart.js/auto';
import moment from 'moment';

import { getDataFromAPI } from "./main";
import { getISOWeekNumber } from '../backend/utils';
import { empresas } from './main';

const basesActivos = document.getElementById('base-activos');
const contactosActivos = document.getElementById('contactos-activos');
const basesInhabilitadas = document.getElementById('base-inhabilitados');

const weeks = getISOWeekNumber(moment(), 4);  // [22, 23, 24, 25]

getDataFromAPI('bases?estado=Base').then((res) => {
  const data = {};

  // { tipo: [] }
  empresas.forEach(e => {
    data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  // Por cada row, revisar la fecha_modif y obtener su ISOWeek
  // Restar ISOWeek menor a todos para index[]
  res.forEach(row => {
    const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
  });

  new Chart(basesActivos, {
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
          barPercentage: 0.7
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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

getDataFromAPI('bases?estado=Contacto').then((res) => {
  const data = {};

  // { tipo: [] }
  empresas.forEach(e => {
    data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  // Por cada row, revisar la fecha_modif y obtener su ISOWeek
  // Restar ISOWeek menor a todos para index[]
  res.forEach(row => {
    const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
  });

  new Chart(contactosActivos, {
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
          barPercentage: 0.7
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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

getDataFromAPI('bases?estado=Inhabilitado').then((res) => {
  const data = {};

  // { tipo: [] }
  empresas.forEach(e => {
    data[e] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  // Por cada row, revisar la fecha_modif y obtener su ISOWeek
  // Restar ISOWeek menor a todos para index[]
  res.forEach(row => {
    const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
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
