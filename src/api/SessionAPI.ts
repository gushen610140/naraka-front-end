import http from "@/utils/http.ts";

export const addSessionAPI = (player_1_id: string, player_2_id: string, wait_room_id: string) => {
  return http<string>({
    url: "/session/add",
    method: "post",
    params: {
      player_1_id,
      player_2_id,
      wait_room_id,
    },
  });
};

export const getSessionAPI = (id: string) => {
  return http<Session>({
    url: "/session/get",
    method: "get",
    params: {
      id,
    },
  });
};

export const getSessionByWaitRoomIdAPI = (wait_room_id: string) => {
  return http<Session | null>({
    url: "/session/get_by_wait_room_id",
    method: "get",
    params: {
      wait_room_id,
    },
  });
};

export const removeSessionAPI = (id: string) => {
  return http({
    url: "/session/remove",
    method: "delete",
    params: {
      id,
    },
  });
};

export const nextRoundNetworkAPI = async () => {
  return http({
    url: import.meta.env.VITE_SOCKET_API_SERVER + "/next_round",
    method: "get",
  });
};
