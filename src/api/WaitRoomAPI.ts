import http from "@/utils/http.ts";

export const addWaitRoomAPI = (player_1_id: string, room_name: string) => {
  return http<string>({
    url: "/wait_room/add",
    method: "post",
    params: {
      player_1_id,
      room_name,
    },
  });
};

export const getWaitRoomAPI = (id: string) => {
  return http<WaitRoom>({
    url: "/wait_room/get",
    method: "get",
    params: {
      id,
    },
  });
};

export const checkWaitRoomSpaceAPI = (id: string) => {
  return http<number>({
    url: "/wait_room/check",
    method: "get",
    params: {
      id,
    },
  });
};

export const getWaitRoomListAPI = () => {
  return http<WaitRoom[]>({
    url: "/wait_room/list",
    method: "get",
  });
};

export const joinWaitRoomAPI = (id: string, player_2_id: string) => {
  return http<string>({
    url: import.meta.env.VITE_SOCKET_API_SERVER + "/join",
    method: "PUT",
    params: {
      id,
      player_2_id,
    },
  });
};
