import moment from "moment";
import Chart from 'chart.js/auto';

import { getISOWeekNumber } from "../backend/utils";
import { getDataFromAPI } from "./main";

const usersChart = document.getElementById('users-chart');
const selectTable = document.getElementById('select-table');
let currentCanvas = null;

const data = {};

const weeks = getISOWeekNumber(moment(), 4);

const usersName = [];
getDataFromAPI('usuarios').then((res) => {
  res.forEach(row => {
    usersName.push(row.nombre_usuario);
  });
});

// Al cambiar el estado de un comboBox (Bases, Contactos, Promociones, Leads, Propuestas, Cierres)
// se cambia la data del gráfico, rescatando diferentes datos pero siempre el conteo de usuarios por
// semana.
function displayDynamicTable(value) {
  getDataFromAPI(value).then((res) => {
    usersName.forEach(name => {
      data[name] = Array(4).fill(0);  // [0, 0, 0, 0]
    });

    res.forEach(row => {
      const index = moment(row.fecha_modif).isoWeek() - weeks[0];  // 25 - 22 = 3
      data[row.nombre_usuario][index]++
    });

    if (currentCanvas) currentCanvas.destroy(); 

    currentCanvas = new Chart(usersChart, {
      type: 'bar',
      data: {
        labels: weeks.map(week => "Semana " + week),
        datasets: usersName.map(name => ({
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
          text: `Conteo Semanal de ${String(value).charAt(0).toUpperCase() + String(value).slice(1)}`  // Capitalize
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

selectTable.addEventListener('change', () => {
  displayDynamicTable(selectTable.value);
});
