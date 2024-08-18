<script lang="ts" setup>
import { getWaitRoomListAPI, joinWaitRoomAPI } from "@/api/WaitRoomAPI.ts";
import { computed, onMounted, ref } from "vue";
import { changePage } from "@/utils/page.ts";
import { useToast } from "vue-toastification";
import { usePlayerStore, useWaitRoomStore } from "@/store";
import { addPlayerAPI } from "@/api/PlayerAPI.ts";

const useRoomList = () => {
  const waitRoomList = ref<WaitRoom[]>([]);
  const renderWaitRoomList = computed(() => {
    return waitRoomList.value.map((room) => {
      return {
        id: room.id,
        name: room.room_name,
        status: room.status,
        actions: "",
      };
    });
  });
  const renderHeader = [
    {
      title: "房间名称",
      key: "name",
    },
    {
      title: "房间状态",
      key: "status",
    },
    {
      title: "操作",
      key: "actions",
    },
  ];

  const flashWaitRoomListEvent = () => {
    getWaitRoomListAPI().then((res) => {
      waitRoomList.value = res.data;
      useToast().success(res.message);
    });
  };

  return {
    renderWaitRoomList,
    renderHeader,
    flashWaitRoomListEvent,
  };
};

const useJoinRoom = () => {
  const player_nickname = ref("");
  const loading = ref(false);

  const joinRoomEvent = async (id: string) => {
    loading.value = true;
    const { data: player_2_id } = await addPlayerAPI(player_nickname.value);
    await usePlayerStore().setPlayer(player_2_id);
    await joinWaitRoomAPI(id, player_2_id);
    await useWaitRoomStore().setWaitRoom(id);
    setTimeout(() => {
      loading.value = false;
      changePage("/wait_game");
    }, 500);
  };

  return {
    player_nickname,
    loading,
    joinRoomEvent,
  };
};

const { renderWaitRoomList, renderHeader, flashWaitRoomListEvent } = useRoomList();
const { player_nickname, loading, joinRoomEvent } = useJoinRoom();

onMounted(() => {
  flashWaitRoomListEvent();
});
</script>

<template>
  <div class="w-11/12">
    <v-data-table :headers="renderHeader" :items="renderWaitRoomList">
      <template v-slot:item.actions="{ item }">
        <v-dialog width="600">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">加入房间</v-btn>
          </template>
          <v-card title="加入房间">
            <v-card-item>
              <v-text-field v-model="player_nickname" label="玩家昵称"></v-text-field>
            </v-card-item>
            <v-card-actions>
              <v-btn :loading="loading" block @click="joinRoomEvent(item.id)">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </div>
  <div class="w-11/12 flex justify-end mt-2 gap-2">
    <v-btn @click="changePage('/')">返回</v-btn>
    <v-btn @click="flashWaitRoomListEvent"> 刷新 </v-btn>
  </div>
</template>

<style scoped></style>
