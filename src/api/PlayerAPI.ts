import http from "@/utils/http.ts";

export const addPlayerAPI = (nickname: string) => {
  return http<string>({
    url: "/add_player",
    method: "post",
    params: {
      nickname,
    },
  });
};
