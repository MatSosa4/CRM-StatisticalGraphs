// ISO Week range
// Envía una lista de fechas, desde la asignada en `date` hasta `numWeeks` para atrás
export function getISOWeekRange(date, numWeeks) {
  const now = date;
  const dates = [];

  for (let i = 0; i <= numWeeks; i++) {
    dates.push(now.clone().endOf('isoWeek').format('YYYY-MM-DD'));

    now.subtract(1, 'week');  // Return a week
  }

  return dates;
}

// ISO Week Number
// Envía una lista de números de semana desde `date` hasta `numWeeks` para atrás
export function getISOWeekNumber(date, numWeeks) {
  const now = date;
  const nums = [];

  for (let i = 0; i < numWeeks; i++) {
    nums.push(now.isoWeek());

    now.subtract(1, 'week');
  }

  return nums.sort();
}

// Añade únicamente la fecha enviando el datePicker de HTML
export function addDateValueToURLApi(value, datePicker) {
  return `${value}${value.includes('?') ? '&' : '?'}fecha=${datePicker.value}`
}
