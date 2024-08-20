import { defineStore } from "pinia";
import { ref } from "vue";
import { getWaitRoomAPI } from "@/api/WaitRoomAPI.ts";
import { getPlayerAPI } from "@/api/PlayerAPI.ts";
import { Socket } from "socket.io-client";
import { getSessionAPI } from "@/api/SessionAPI.ts";

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

export const usePlayerStore = defineStore("player", () => {
  const player = ref<Player>();

  const setPlayer = async (id: string) => {
    const { data } = await getPlayerAPI(id);
    player.value = data;
  };

  const getPlayer = () => {
    return player.value;
  };

  return {
    setPlayer,
    getPlayer,
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
  const session = ref<Session>();

  const initSession = async (id: string) => {
    const { data } = await getSessionAPI(id);
    session.value = data;
  };

  const reloadSessionFromServer = async () => {
    const { data } = await getSessionAPI(session.value!.id);
    session.value = data;
  };

  const getSession = () => {
    return session.value;
  };

  return {
    initSession,
    reloadSessionFromServer,
    getSession,
  };
});
