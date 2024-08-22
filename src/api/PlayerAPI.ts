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

export const confirmActionAPI = (player_me_id: string, player_opponent_id: string, chosen_action: string) => {
  return http<boolean>({
    url: "/player/confirm_action",
    method: "put",
    params: {
      player_me_id,
      player_opponent_id,
      chosen_action,
    },
  });
};

export const updateAttackNetWorkAPI = (player_status_result: PlayerStatusResult) => {
  return http({
    url: import.meta.env.VITE_SOCKET_API_SERVER + "/attack",
    method: "put",
    data: player_status_result,
  });
};

export const executeAttackAPI = (session_id: string) => {
  return http<PlayerStatusResult>({
    url: "/player/execute_attack",
    method: "put",
    params: {
      session_id,
    },
  });
};
