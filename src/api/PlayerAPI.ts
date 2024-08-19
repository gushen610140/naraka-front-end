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

export const updateStatusAPI = (id: string, status: string) => {
  return http<boolean>({
    url: "/player/change",
    method: "put",
    params: {
      id,
      status,
    },
  });
};

export const updateStatusNetworkAPI = () => {
  return http({
    url: import.meta.env.VITE_SOCKET_API_SERVER + "/status",
    method: "put",
  });
};
