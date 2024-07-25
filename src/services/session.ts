import { get } from "../utils/http.ts";

export const getSessionAPI = async () => {
  return get<Session[]>("/api/session");
};
