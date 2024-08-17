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
