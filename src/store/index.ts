import { defineStore } from "pinia";
import { ref } from "vue";
import { getWaitRoomAPI } from "@/api/WaitRoomAPI.ts";

export const useWaitRoomStore = defineStore("wait_room", () => {
  const waitRoom = ref<WaitRoom>();

  const setWaitRoom = async (id: string) => {
    const { data } = await getWaitRoomAPI(id);
    waitRoom.value = data;
  };

  const getWaitRoom = () => {
    return waitRoom.value;
  };

  const checkWaitRoom = () => {
    return waitRoom.value != undefined;
  };

  return {
    getWaitRoom,
    setWaitRoom,
    checkWaitRoom,
  };
});
