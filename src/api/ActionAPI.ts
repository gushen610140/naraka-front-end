import http from "@/utils/http.ts";

export const getActionList = () => {
  return http<Action[]>({
    url: "/action/list",
    method: "get",
  });
};
