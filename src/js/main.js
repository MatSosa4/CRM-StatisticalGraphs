// // Data Structures: https://www.chartjs.org/docs/latest/general/data-structures.html
// import Chart from 'chart.js/auto';

// const barChart = document.getElementById('barChart');  // https://www.chartjs.org/docs/latest/charts/bar.html
// const stackedChart = document.getElementById('stackedChart');  // https://www.chartjs.org/docs/latest/charts/bar.html#stacked-bar-chart
// const groupChart = document.getElementById('groupChart');
// const stackedGroupChart = document.getElementById('stackedGroupChart');

// new Chart(barChart, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });

// new Chart(stackedChart, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [
//     {
//       label: '# of Votes',
//       data: [10, 9, 8, 3],
//       borderWidth: 1
//     },
//     {
//       label: '#2 of Votes',
//       data: [6, 5, 4, 3],
//       borderWidth: 1
//     },
//     ]
//   },
//   options: {
//     scales: {
//       x: {
//         stacked: true
//       },
//       y: {
//         stacked: true
//       }
//     }
//   }
// });

// new Chart(groupChart, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green'],
//     datasets: [
//       {
//         label: '# of Votes',
//         data: [10, 9, 8, 7],
//         borderWidth: 1
//       },
//       {
//         label: '#2 of Votes',
//         data: [6, 5, 4, 3],
//         borderWidth: 1
//       },
//     ]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });

// new Chart(stackedGroupChart, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green'],
//     datasets: [
//       {
//         label: 'Dataset 1',
//         data: [1, 2, 3, 4],
//         stack: 'Stack 0',
//       },
//       {
//         label: 'Dataset 2',
//         data: [5, 6, 7, 8],
//         stack: 'Stack 0',
//       },
//       {
//         label: 'Dataset 3',
//         data: [9, 10, 11, 12],
//         stack: 'Stack 1',
//       },
//     ]
//   }
// });

import { getISOWeekNumber } from "./utils";
import moment from "moment";

// API Variables
const host = 'localhost';
const port = '5010';

// URL de la API para no escribirla siempre
export function getAPIUrl() {
  return `http://${host}:${port}/api/Data`;
}

// Obtiene información de la API en JSON
export async function getDataFromAPI(apiData) {
  const url = `${getAPIUrl()}/${apiData}`;

  const res = await fetch(url);
  return await res.json();
}

// Obtiene el rango de 4 semanas si se envía una fecha, sino, la fecha actual
export function getWeeks(dateValue) {
  return getISOWeekNumber(dateValue ? moment(dateValue) : moment(), 4);
}

// Empresas y Servicios accesibles
export let empresas;
export let servicios;
export let usuarios;

await getDataFromAPI('empresas').then((res) => empresas = res.map(r => r.nombre_tipo));
await getDataFromAPI('servicios').then((res) => servicios = res.map(r => r.nombre_tipo));
await getDataFromAPI('usuarios').then((res) => usuarios = res.map(u => u.nombre_usuario));
