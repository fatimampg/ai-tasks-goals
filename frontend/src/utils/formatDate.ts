// Convert string "YYYY-MM" into month and year:
export function formatMonthYear(monthYear: string): {
  month: string;
  year: string;
} {
  const year = monthYear.slice(0, 4);
  const month = monthYear.slice(6, 7);
  console.log("year", year, "month", month);
  return { month, year };
}

// Convert Date object into string with format "YYYY-MM-DD":
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); //ensure month has length 2 (ex.: 2 -> 02)
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
