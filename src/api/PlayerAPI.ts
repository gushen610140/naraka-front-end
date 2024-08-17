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

export const getPlayerAPI = (id: string) => {
  return http<Player>({
    url: "/player/get",
    method: "get",
    params: {
      id,
    },
  });
};
