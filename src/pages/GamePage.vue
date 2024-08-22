<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useSessionStore, useSocketStore } from "@/store";
import { confirmActionAPI, getPlayerAPI } from "@/api/PlayerAPI.ts";
import { nextRoundNetworkAPI } from "@/api/SessionAPI.ts";
import { changePage } from "@/utils/page.ts";

const useSession = () => {
  const session = computed(() => useSessionStore().getSession());

  return {
    session,
  };
};

const usePlayerInfo = () => {
  const player_me = ref<Player>();
  const player_opponent = ref<Player>();

  const loadPlayerInfo = async () => {
    const { data: player_me_data } = await getPlayerAPI(session.value.player_me_id);
    const { data: player_opponent_data } = await getPlayerAPI(session.value.player_opponent_id);
    player_me.value = player_me_data;
    player_opponent.value = player_opponent_data;
  };

  return {
    player_me,
    player_opponent,
    loadPlayerInfo,
  };
};

const useSocket = () => {
  const socket = computed(() => useSocketStore().getSocket());

  // socket.value!.on("attack", async (player_status_result: PlayerStatusResult) => {
  //   if (player_status_result.player_1_damage_value == 0 && player_status_result.player_2_damage_value == 0) {
  //     useToast().info("无事发生");
  //   } else if (player_status_result.player_1_id == player_me.value!.id) {
  //     if (player_status_result.player_1_damage_value > 0) {
  //       useToast().error(`你受到了 ${player_status_result.player_1_damage_value} 点伤害`);
  //     } else {
  //       useToast().success(`你造成了 ${player_status_result.player_2_damage_value} 点伤害`);
  //     }
  //   } else {
  //     if (player_status_result.player_2_damage_value > 0) {
  //       useToast().error(`你受到了 ${player_status_result.player_2_damage_value} 点伤害`);
  //     } else {
  //       useToast().success(`你造成了 ${player_status_result.player_1_damage_value} 点伤害`);
  //     }
  //   }
  //
  //   await loadPlayerInfo();
  //   setTimeout(() => {
  //     loading.value = false;
  //     isLock.value = false;
  //   }, 500);
  //
  //   setTimeout(() => {
  //     if (player_status_result.player_1_health_cur_value <= 0 || player_status_result.player_2_health_cur_value <= 0) {
  //       isEnd.value = true;
  //     }
  //   }, 1000);
  // });

  socket.value!.on("next_round", async () => {
    await loadPlayerInfo();
    if (player_me.value!.health_cur <= 0 || player_opponent.value!.health_cur <= 0) {
      isEnd.value = true;
    }
  });

  return {
    socket,
  };
};

const useActions = () => {
  const action = ref("");
  const isLock = ref(false);
  const loading = ref(false);

  const lockAttackEvent = async () => {
    isLock.value = true;
    const { code } = await confirmActionAPI(player_me.value!.id, player_opponent.value!.id, action.value);
    if (code == 200) {
      await nextRoundNetworkAPI();
      loading.value = true;
    }
  };

  return {
    action,
    isLock,
    loading,
    lockAttackEvent,
  };
};

const useEnd = () => {
  const isEnd = ref(false);

  const endTextTitle = computed(() => {
    if (player_me.value!.health_cur <= 0) {
      return "失败";
    } else {
      return "胜利";
    }
  });

  const endTextContent = computed(() => {
    if (player_me.value!.health_cur <= 0) {
      return "菜，就多练";
    } else {
      return "收徒";
    }
  });

  const gameEndEvent = () => {
    useSessionStore().clearSession();
    changePage("/");
  };

  return {
    isEnd,
    endTextTitle,
    endTextContent,
    gameEndEvent,
  };
};

const { session } = useSession();
const {} = useSocket();
const { player_me, player_opponent, loadPlayerInfo } = usePlayerInfo();
const { action, isLock, loading, lockAttackEvent } = useActions();
const { isEnd, endTextTitle, endTextContent, gameEndEvent } = useEnd();

onMounted(() => {
  loadPlayerInfo();
});
</script>

<template>
  <v-card class="mt-10" min-width="600">
    <v-card-title>对手</v-card-title>
    <v-card-item>
      <div>昵称: {{ player_opponent?.nickname }}</div>
      <div>血量: {{ player_opponent?.health_cur }} / {{ player_opponent?.health_max }}</div>
    </v-card-item>
  </v-card>
  <div class="flex-grow"></div>
  <v-card variant="tonal">
    <v-card-title>选择攻击方式</v-card-title>
    <v-card-item>
      <v-radio-group v-model="action" :disabled="isLock">
        <v-radio label="轻击" value="flick"></v-radio>
        <v-radio label="重击" value="pound"></v-radio>
        <v-radio label="振刀" value="bounce"></v-radio>
        <v-radio label="治愈" value="treat"></v-radio>
        <v-radio label="怒气" value="rage"></v-radio>
      </v-radio-group>
    </v-card-item>
    <v-card-actions>
      <div class="flex-grow"></div>
      <v-btn :disabled="isLock" :loading="loading" variant="tonal" @click="lockAttackEvent">锁定</v-btn>
    </v-card-actions>
  </v-card>
  <div class="flex-grow"></div>
  <v-card class="mb-10" min-width="600">
    <v-card-title>我</v-card-title>
    <v-card-item>
      <div>昵称: {{ player_me?.nickname }}</div>
      <div>血量: {{ player_me?.health_cur }} / {{ player_me?.health_max }}</div>
    </v-card-item>
  </v-card>
  <v-dialog v-model="isEnd" persistent width="400">
    <v-card>
      <v-card-title>{{ endTextTitle }}</v-card-title>
      <v-card-text>{{ endTextContent }}</v-card-text>
      <v-card-actions>
        <div class="flex-grow"></div>
        <v-btn @click="gameEndEvent">返回大厅</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
