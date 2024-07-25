import { http, HttpResponse, delay } from "msw";
import { server } from "./server";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay(100);
      return HttpResponse.json([]);
    }),
  );
};

export const simulateError = (endpoint: string) => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.error();
    }),
  );
};

export const formattedDate = (date: Date) => {
  return date.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
