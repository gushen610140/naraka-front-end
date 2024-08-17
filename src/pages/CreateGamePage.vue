<script lang="ts" setup>
import { ref } from "vue";
import { addPlayerAPI } from "@/api/PlayerAPI.ts";
import { addWaitRoomAPI } from "@/api/WaitRoomAPI.ts";
import { changePage } from "@/utils/page.ts";
import { useWaitRoomStore } from "@/store";

const useForm = () => {
  const form = ref({
    room_name: "",
    player_name: "",
  });

  const rules = [
    (value: string) => {
      if (value) return true;
      return "房间名称不能为空";
    },
    (value: string) => {
      if (value) return true;
      return "玩家昵称不能为空";
    },
  ];

  const loading = ref(false);

  const submit = async (
    event: Promise<{
      valid: boolean;
    }>,
  ) => {
    const { valid } = await event;
    if (valid) {
      loading.value = true;
      const { data: player_1_id } = await addPlayerAPI(form.value.player_name);
      const { data: wait_room_id } = await addWaitRoomAPI(player_1_id, form.value.room_name);
      await useWaitRoomStore().setWaitRoom(wait_room_id);
      // 拟造加载效果，突显游戏体量
      setTimeout(() => {
        loading.value = false;
        changePage("/wait_game");
      }, 1000);
    }
  };

  return {
    form,
    rules,
    submit,
    loading,
  };
};

const { form, rules, submit, loading } = useForm();
</script>

<template>
  <v-form class="container w-50" @submit.prevent="submit">
    <v-text-field v-model="form.room_name" :rules="rules" label="房间名称"></v-text-field>
    <v-text-field v-model="form.player_name" :rules="rules" label="玩家昵称"></v-text-field>
    <v-btn :loading="loading" block type="submit">确认</v-btn>
    <v-btn block class="mt-4" @click="changePage('/')">取消</v-btn>
  </v-form>
</template>

<style scoped></style>
