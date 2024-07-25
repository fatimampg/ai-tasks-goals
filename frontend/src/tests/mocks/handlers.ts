import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:3001/api/username", () => {
    console.log("inside the handler");
    return HttpResponse.json({
      userName: "John",
    });
  }),
];
