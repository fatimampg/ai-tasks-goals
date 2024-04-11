export const extractMonthFromDate = (deadline: string) => {
  const date = new Date(deadline); // create Date built-in object from a date string (input format: YYYY-MM-DDTHH:MM:SSZ)
  const month = date.getMonth() + 1;
  console.log("Month:", month);
  return { month };
};

export const extractYearFromDate = (deadline: string) => {
  const date = new Date(deadline); // create Date built-in object from a date string (input format: YYYY-MM-DDTHH:MM:SSZ)
  const year = date.getFullYear() + 1;

  console.log("Year:", year);

  return { year };
};
