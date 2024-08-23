import { defineStore } from "pinia";
import { ref } from "vue";
import { getWaitRoomAPI } from "@/api/WaitRoomAPI.ts";
import { getPlayerAPI } from "@/api/PlayerAPI.ts";
import { Socket } from "socket.io-client";

export const useWaitRoomStore = defineStore("wait_room", () => {
  const waitRoom = ref<WaitRoom>({
    id: "",
    player_1_id: "",
    player_2_id: "",
    status: "",
    room_name: "",
  });

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

export const usePlayerStore = defineStore("player", () => {
  const player = ref<Player>({
    id: "",
    chosen_action: "",
    chosen_card: "",
    health_max: 0,
    health_cur: 0,
    nickname: "",
    status: "",
    rage: 0,
  });

  const setPlayer = async (id: string) => {
    const { data } = await getPlayerAPI(id);
    player.value = data;
  };

  const getPlayer = () => {
    return player.value;
  };

  const clearPlayer = () => {
    player.value = {
      id: "",
      chosen_action: "",
      chosen_card: "",
      health_max: 0,
      health_cur: 0,
      nickname: "",
      status: "",
      rage: 0,
    };
  };

  return {
    player,
    setPlayer,
    getPlayer,
    clearPlayer,
  };
});

export const useSocketStore = defineStore("socket", () => {
  const socket = ref<Socket<any>>();

  const setSocket = (connectedSocket: Socket) => {
    socket.value = connectedSocket;
  };

  const getSocket = () => {
    return socket.value;
  };

  return {
    socket,
    setSocket,
    getSocket,
  };
});

export const useSessionStore = defineStore("session", () => {
  const session = ref<Session>({
    player_me_id: "",
    player_opponent_id: "",
  });

  const initSession = (player_me_id: string, player_opponent_id: string) => {
    session.value.player_me_id = player_me_id;
    session.value.player_opponent_id = player_opponent_id;
  };

  const clearSession = () => {
    session.value.player_me_id = "";
    session.value.player_opponent_id = "";
  };

  const getSession = () => {
    return session.value;
  };

  return {
    initSession,
    getSession,
    clearSession,
  };
});
