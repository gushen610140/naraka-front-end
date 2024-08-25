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

export const confirmActionAPI = (
  player_me_id: string,
  player_opponent_id: string,
  chosen_action: string,
  chosen_card: string | undefined,
) => {
  return http<RoundResult>({
    url: "/player/confirm_action",
    method: "put",
    params: {
      player_me_id,
      player_opponent_id,
      chosen_action,
      chosen_card,
    },
  });
};

export const removePlayerAPI = (id: string) => {
  return http({
    url: "/player/remove",
    method: "delete",
    params: { id },
  });
};

export const nextRoundNetworkAPI = async (roundResult: RoundResult) => {
  return http({
    url: import.meta.env.VITE_SOCKET_API_SERVER + "/next_round",
    method: "put",
    data: roundResult,
  });
};
