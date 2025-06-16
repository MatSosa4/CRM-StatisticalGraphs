// ISO Week range
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
export function getISOWeekNumber(date, numWeeks) {
  const now = date;
  const nums = [];

  for (let i = 0; i < numWeeks; i++) {
    nums.push(now.isoWeek());

    now.subtract(1, 'week');
  }

  return nums.sort();
}