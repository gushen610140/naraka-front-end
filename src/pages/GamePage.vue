<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { usePlayerStore, useSessionStore, useSocketStore } from "@/store";
import { confirmActionAPI, getPlayerAPI, nextRoundNetworkAPI, removePlayerAPI } from "@/api/PlayerAPI.ts";
import { changePage } from "@/utils/page.ts";
import { useToast } from "vue-toastification";
import { actionNameToChinese } from "@/utils/GameLogic.ts";

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

  socket.value!.on("next_round", async (args: RoundResult) => {
    let { oldPlayerMe, oldPlayerOpponent, newPlayerMe, newPlayerOpponent } = args;
    // 传递过来的Me和Opponent需要重新判断
    if (oldPlayerMe.id != player_me.value!.id) {
      [oldPlayerMe, oldPlayerOpponent, newPlayerMe, newPlayerOpponent] = [
        oldPlayerOpponent,
        oldPlayerMe,
        newPlayerOpponent,
        newPlayerMe,
      ];
    }
    if (newPlayerMe.health_cur < oldPlayerMe.health_cur) {
      const harm_value = oldPlayerMe.health_cur - newPlayerMe.health_cur;
      useToast().error(`你受到了 ${harm_value} 点伤害`);
      suffer_harm_me.value = true;
      setTimeout(() => {
        suffer_harm_me.value = false;
      }, 2000);
    } else if (newPlayerMe.health_cur > oldPlayerMe.health_cur) {
      const treat_value = newPlayerMe.health_cur - oldPlayerMe.health_cur;
      useToast().success(`你恢复了 ${treat_value} 点生命值`);
      suffer_treat_me.value = true;
      setTimeout(() => {
        suffer_treat_me.value = false;
      }, 2000);
    }
    if (newPlayerOpponent.health_cur < oldPlayerOpponent.health_cur) {
      const harm_value = oldPlayerOpponent.health_cur - newPlayerOpponent.health_cur;
      useToast().success(`你造成了 ${harm_value} 点伤害`);
      suffer_harm_opponent.value = true;
      setTimeout(() => {
        suffer_harm_opponent.value = false;
      }, 2000);
    } else if (newPlayerOpponent.health_cur > oldPlayerOpponent.health_cur) {
      const treat_value = newPlayerOpponent.health_cur - oldPlayerOpponent.health_cur;
      useToast().warning(`对方恢复了 ${treat_value} 点生命值`);
      suffer_treat_opponent.value = true;
      setTimeout(() => {
        suffer_treat_opponent.value = false;
      }, 2000);
    }
    const chosen_action_me = actionNameToChinese(oldPlayerMe.chosen_action);
    const chosen_action_opponent = actionNameToChinese(oldPlayerOpponent.chosen_action);
    useToast().info(`你选择了 ${chosen_action_me}，对方选择了 ${chosen_action_opponent}`);
    await loadPlayerInfo();
    loading.value = false;
    isLock.value = false;
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

  const confirmActionEvent = async () => {
    isLock.value = true;
    loading.value = true;
    const { code, data } = await confirmActionAPI(player_me.value!.id, player_opponent.value!.id, action.value);
    if (code == 200) {
      await nextRoundNetworkAPI(data);
    }
  };

  return {
    action,
    isLock,
    loading,
    confirmActionEvent,
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
    removePlayerAPI(player_me.value!.id);
    removePlayerAPI(player_opponent.value!.id);
    useSessionStore().clearSession();
    usePlayerStore().clearPlayer();
    changePage("/");
  };

  return {
    isEnd,
    endTextTitle,
    endTextContent,
    gameEndEvent,
  };
};

const useAnimation = () => {
  const suffer_harm_me = ref(false);
  const suffer_harm_opponent = ref(false);
  const suffer_treat_me = ref(false);
  const suffer_treat_opponent = ref(false);

  return {
    suffer_harm_me,
    suffer_harm_opponent,
    suffer_treat_me,
    suffer_treat_opponent,
  };
};

const { session } = useSession();
const {} = useSocket();
const { player_me, player_opponent, loadPlayerInfo } = usePlayerInfo();
const { action, isLock, loading, confirmActionEvent } = useActions();
const { isEnd, endTextTitle, endTextContent, gameEndEvent } = useEnd();
const { suffer_harm_me, suffer_harm_opponent, suffer_treat_me, suffer_treat_opponent } = useAnimation();

onMounted(() => {
  loadPlayerInfo();
});
</script>

<template>
  <v-card
    :class="{ suffer_harm: suffer_harm_opponent, suffer_treat: suffer_treat_opponent }"
    class="mt-10"
    min-width="600"
  >
    <v-card-title>对手</v-card-title>
    <v-card-item>
      <div>昵称: {{ player_opponent?.nickname }}</div>
      <div>血量: {{ player_opponent?.health_cur }} / {{ player_opponent?.health_max }}</div>
      <div>怒气：{{ player_opponent?.rage }}</div>
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
      <v-btn :disabled="isLock" :loading="loading" variant="tonal" @click="confirmActionEvent">锁定</v-btn>
    </v-card-actions>
  </v-card>
  <div class="flex-grow"></div>
  <v-card :class="{ suffer_harm: suffer_harm_me, suffer_treat: suffer_treat_me }" class="mb-10" min-width="600">
    <v-card-title>我</v-card-title>
    <v-card-item>
      <div>昵称: {{ player_me?.nickname }}</div>
      <div>血量: {{ player_me?.health_cur }} / {{ player_me?.health_max }}</div>
      <div>怒气：{{ player_me?.rage }}</div>
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

<style scoped>
.suffer_harm {
  animation: suffer_harm 2s ease-in-out;
}

@keyframes suffer_harm {
  0% {
    background-color: transparent;
  }
  20% {
    background-color: #ff240050;
  }
  50% {
    background-color: #ff240060;
  }
  80% {
    background-color: #ff240050;
  }
  100% {
    background-color: transparent;
  }
}

.suffer_treat {
  animation: suffer_treat 2s ease-in-out;
}

@keyframes suffer_treat {
  0% {
    background-color: transparent;
  }
  20% {
    background-color: #5cf52f50;
  }
  50% {
    background-color: #5cf52f60;
  }
  80% {
    background-color: #5cf52f50;
  }
  100% {
    background-color: transparent;
  }
}
</style>
