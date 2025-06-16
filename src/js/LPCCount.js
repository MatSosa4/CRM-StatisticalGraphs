import { getDataFromAPI } from "./main";

const leadsCount = document.getElementById('leads-count');
const propuestasCount = document.getElementById('propuestas-count');
const cierresCount = document.getElementById('cierres-count');

getDataFromAPI('leads').then((res) => {
  console.log(res);
});
