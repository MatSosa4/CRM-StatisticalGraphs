import moment from "moment";
import Chart from 'chart.js/auto';

import { getDataFromAPI, totalSum } from "./main";
import { servicios } from "./main";
import { getISOWeekNumber } from "../backend/utils";

const leadsCount = document.getElementById('leads-count');
const propuestasCount = document.getElementById('propuestas-count');
const cierresCount = document.getElementById('cierres-count');

const weeks = getISOWeekNumber(moment(), 4);  // [22, 23, 24, 25]


getDataFromAPI('leads').then((res) => {
  const data = {};

  // { tipo: [] }
  servicios.forEach(s => {
    data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  res.forEach(row => {
    const index = moment(row.fecha_modif_lead).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
  });

  new Chart(leadsCount, {
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
          text: "Conteo Total de Leads"
        },
        tooltip: {
          callbacks: {
            footer: totalSum
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

getDataFromAPI('propuestas').then((res) => {
  const data = {};

  // { tipo: [] }
  servicios.forEach(s => {
    data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  res.forEach(row => {
    const index = moment(row.fecha_modif_propuesta).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
  });

  new Chart(propuestasCount, {
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
          text: "Conteo Total de Propuestas"
        },
        tooltip: {
          callbacks: {
            footer: totalSum
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

getDataFromAPI('cierres').then((res) => {
  const data = {};

  // { tipo: [] }
  servicios.forEach(s => {
    data[s] = Array(4).fill(0);  // [0, 0, 0, 0]
  });

  res.forEach(row => {
    const index = moment(row.firma_contrato_cierre).isoWeek() - weeks[0];  // 25 - 22 = 3
    data[row.nombre_tipo][index]++
  });

  new Chart(cierresCount, {
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
          text: "Conteo Total de Cierres"
        },
        tooltip: {
          callbacks: {
            footer: totalSum
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
