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
      useToast().success(res.message, { timeout: 3000 });
    });
  };

  return {
    renderWaitRoomList,
    renderHeader,
    flashWaitRoomListEvent,
  };
};

const useJoinRoom = () => {
  const roomId = ref("");
  const player_nickname = ref("");
  const loading = ref(false);

  const rules = [
    (value: string) => {
      if (value) return true;
      return "玩家名称不能为空";
    },
  ];

  const joinRoomEvent = async (event: Promise<{ valid: boolean }>) => {
    const { valid } = await event;
    if (valid) {
      loading.value = true;
      const { data: player_2_id } = await addPlayerAPI(player_nickname.value);
      await usePlayerStore().setPlayer(player_2_id);
      await joinWaitRoomAPI(roomId.value, player_2_id);
      await useWaitRoomStore().setWaitRoom(roomId.value);
      setTimeout(() => {
        loading.value = false;
        changePage("/wait_game");
      }, 500);
    }
  };

  return {
    roomId,
    player_nickname,
    loading,
    rules,
    joinRoomEvent,
  };
};

const { renderWaitRoomList, renderHeader, flashWaitRoomListEvent } = useRoomList();
const { roomId, player_nickname, loading, rules, joinRoomEvent } = useJoinRoom();

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
            <v-btn v-bind="props" @click="roomId = item.id">加入房间</v-btn>
          </template>
          <v-card title="加入房间">
            <v-card-item>
              <v-form @submit.prevent="joinRoomEvent">
                <v-text-field v-model="player_nickname" :rules="rules" label="玩家昵称"></v-text-field>
                <v-btn :loading="loading" block type="submit">确定</v-btn>
              </v-form>
            </v-card-item>
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
