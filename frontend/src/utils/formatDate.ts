// Goals input format (receives: 2024-05)
export function formatMonthYear(monthYear: string): {
  month: string;
  year: string;
} {
  const year = monthYear.slice(0, 4);
  const month = monthYear.slice(6, 7);
  console.log("year", year, "month", month);
  return { month, year };
}
