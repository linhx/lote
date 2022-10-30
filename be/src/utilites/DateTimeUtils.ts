export const addDays = (d, days) => {
  const date = d ? new Date(d) : new Date();
  date.setDate(date.getDate() + days);
  return date;
};
