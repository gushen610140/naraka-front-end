<script lang="ts" setup>
import { ref } from "vue";
import { addPlayerAPI } from "@/api/PlayerAPI.ts";

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

  const submit = async (
    event: Promise<{
      valid: boolean;
    }>,
  ) => {
    const { valid } = await event;
    if (valid) {
      const res = await addPlayerAPI(form.value.player_name);
      console.log(res);
    }
  };

  return {
    form,
    rules,
    submit,
  };
};

const { form, rules, submit } = useForm();
</script>

<template>
  <v-form class="container w-50" @submit.prevent="submit">
    <v-text-field v-model="form.room_name" :rules="rules" label="房间名称"></v-text-field>
    <v-text-field v-model="form.player_name" :rules="rules" label="玩家昵称"></v-text-field>
    <v-btn block type="submit">确认</v-btn>
  </v-form>
</template>

<style scoped></style>
