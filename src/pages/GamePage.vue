<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { usePlayerStore, useSessionStore, useSocketStore } from "@/store";
import { confirmActionAPI, getPlayerAPI, nextRoundNetworkAPI, removePlayerAPI } from "@/api/PlayerAPI.ts";
import { changePage } from "@/utils/page.ts";
import { useToast } from "vue-toastification";
import { actionNameToChinese } from "@/utils/GameLogic.ts";
import { getCardListByPlayer } from "@/api/CardAPI.ts";
import { getActionList } from "@/api/ActionAPI.ts";

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
    try {
      const { data: player_me_data } = await getPlayerAPI(session.value.player_me_id);
      const { data: player_opponent_data } = await getPlayerAPI(session.value.player_opponent_id);
      player_me.value = player_me_data;
      player_opponent.value = player_opponent_data;
    } catch (e) {
      const { data: player_me_data } = await getPlayerAPI(session.value.player_me_id);
      const { data: player_opponent_data } = await getPlayerAPI(session.value.player_opponent_id);
      player_me.value = player_me_data;
      player_opponent.value = player_opponent_data;
    }
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
    // 消息提示
    let message;
    if (newPlayerMe.health_cur < oldPlayerMe.health_cur) {
      const harm_value = oldPlayerMe.health_cur - newPlayerMe.health_cur;
      message = `你受到了 ${harm_value} 点伤害`;
      useToast().error(message);
      writeHistory(message);
      suffer_harm_me.value = true;
      setTimeout(() => {
        suffer_harm_me.value = false;
      }, 2000);
    } else if (newPlayerMe.health_cur > oldPlayerMe.health_cur) {
      const treat_value = newPlayerMe.health_cur - oldPlayerMe.health_cur;
      message = `你恢复了 ${treat_value} 点生命值`;
      useToast().success(message);
      writeHistory(message);
      suffer_treat_me.value = true;
      setTimeout(() => {
        suffer_treat_me.value = false;
      }, 2000);
    }
    if (newPlayerOpponent.health_cur < oldPlayerOpponent.health_cur) {
      const harm_value = oldPlayerOpponent.health_cur - newPlayerOpponent.health_cur;
      message = `你造成了 ${harm_value} 点伤害`;
      useToast().success(message);
      writeHistory(message);
      suffer_harm_opponent.value = true;
      setTimeout(() => {
        suffer_harm_opponent.value = false;
      }, 2000);
    } else if (newPlayerOpponent.health_cur > oldPlayerOpponent.health_cur) {
      const treat_value = newPlayerOpponent.health_cur - oldPlayerOpponent.health_cur;
      message = `对方恢复了 ${treat_value} 点生命值`;
      useToast().warning(message);
      writeHistory(message);
      suffer_treat_opponent.value = true;
      setTimeout(() => {
        suffer_treat_opponent.value = false;
      }, 2000);
    }
    // 提示玩家双方选择的卡牌
    const chosen_card_me = oldPlayerMe.chosen_card;
    const chosen_card_opponent = oldPlayerOpponent.chosen_card;
    message = `卡牌结算：你选择了 ${chosen_card_me}，对方选择了 ${chosen_card_opponent}`;
    useToast().info(message);
    writeHistory(message);
    // 提示玩家双方选择的行动
    const chosen_action_me = actionNameToChinese(oldPlayerMe.chosen_action);
    const chosen_action_opponent = actionNameToChinese(oldPlayerOpponent.chosen_action);
    message = `行动结算：你选择了 ${chosen_action_me}，对方选择了 ${chosen_action_opponent}`;
    useToast().info(message);
    writeHistory(message);
    // 重新加载数据
    try {
      await loadCardList();
      await loadPlayerInfo();
    } catch (e) {
      await loadCardList();
      await loadPlayerInfo();
    }
    // 清除卡片选择
    cardSelect.value = undefined;
    loading.value = false;
    isLock.value = false;
    if (player_me.value!.health_cur <= 0 || player_opponent.value!.health_cur <= 0) {
      isEnd.value = true;
    }
    // 回合数增加
    round.value++;
  });

  return {
    socket,
  };
};

const useActions = () => {
  const actionList = ref<Action[]>([]);
  const action = ref("");
  const isLock = ref(false);
  const loading = ref(false);

  const loadActionList = async () => {
    try {
      const { data } = await getActionList();
      actionList.value = data;
    } catch (e) {
      const { data } = await getActionList();
      actionList.value = data;
    }
  };

  const confirmActionEvent = async () => {
    if (action.value == "") {
      useToast().warning("必须选择一个行动");
      return;
    }
    isLock.value = true;
    loading.value = true;
    const { code, data } = await confirmActionAPI(
      player_me.value!.id,
      player_opponent.value!.id,
      action.value,
      cardSelect.value?.id,
    );
    if (code == 200) {
      await nextRoundNetworkAPI(data);
    }
  };

  return {
    actionList,
    action,
    isLock,
    loading,
    loadActionList,
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

const useCard = () => {
  const cardList = ref<Card[]>([]);
  const cardSelect = ref<Card | undefined>();

  const loadCardList = async () => {
    try {
      const { data } = await getCardListByPlayer(player_me.value!.id);
      cardList.value = data;
    } catch (e) {
      const { data } = await getCardListByPlayer(player_me.value!.id);
      cardList.value = data;
    }
  };

  const changeCardSelectEvent = (card: Card) => {
    if (cardSelect.value === card) {
      cardSelect.value = undefined;
      return;
    }
    if (card.rage > player_me.value!.rage) {
      useToast().warning("怒气不足", { timeout: 1500 });
      rage_insufficient.value = true;
      setTimeout(() => {
        rage_insufficient.value = false;
      }, 1000);
      return;
    }
    cardSelect.value = card;
  };

  return {
    cardList,
    cardSelect,
    loadCardList,
    changeCardSelectEvent,
  };
};

const useWheel = () => {
  const wheelRef = ref<HTMLDivElement | null>(null);

  const wheelEvent = (event: any) => {
    if (!wheelRef.value) return;

    const { scrollLeft, scrollWidth, clientWidth } = wheelRef.value;
    const { deltaY } = event;
    const maxScrollLeft = scrollWidth - clientWidth;
    let left = scrollLeft + deltaY;

    // 防止滚动超出边界
    if ((deltaY < 0 && left >= 0) || (deltaY > 0 && left <= maxScrollLeft)) {
      wheelRef.value.scrollLeft = left;
    }
  };

  return {
    wheelRef,
    wheelEvent,
  };
};

const useAnimation = () => {
  const suffer_harm_me = ref(false);
  const suffer_harm_opponent = ref(false);
  const suffer_treat_me = ref(false);
  const suffer_treat_opponent = ref(false);

  const rage_insufficient = ref(false);

  return {
    suffer_harm_me,
    suffer_harm_opponent,
    suffer_treat_me,
    suffer_treat_opponent,
    rage_insufficient,
  };
};

const useBugFix = () => {
  const fixBug = () => {
    loadPlayerInfo();
    loadCardList();
    isLock.value = false;
    loading.value = false;
  };

  return {
    fixBug,
  };
};

const useHistory = () => {
  const historyList = ref<string[]>([]);
  const round = ref(1);

  const writeHistory = (message: string) => {
    historyList.value.unshift(`第${round.value}回合：${message}`);
  };

  return {
    historyList,
    round,
    writeHistory,
  };
};

const { session } = useSession();
const {} = useSocket();
const { player_me, player_opponent, loadPlayerInfo } = usePlayerInfo();
const { action, actionList, isLock, loading, loadActionList, confirmActionEvent } = useActions();
const { isEnd, endTextTitle, endTextContent, gameEndEvent } = useEnd();
const { cardList, cardSelect, loadCardList, changeCardSelectEvent } = useCard();
const { wheelRef, wheelEvent } = useWheel();
const { suffer_harm_me, suffer_harm_opponent, suffer_treat_me, suffer_treat_opponent, rage_insufficient } =
  useAnimation();
const { fixBug } = useBugFix();
const { historyList, round, writeHistory } = useHistory();

onMounted(async () => {
  await loadPlayerInfo();
  await loadActionList();
  await loadCardList();
});
</script>

<template>
  <v-card :class="{ suffer_harm: suffer_harm_opponent, suffer_treat: suffer_treat_opponent }" class="mt-4" width="1200">
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
      <div class="flex">
        <v-radio-group v-model="action" :disabled="isLock">
          <v-tooltip v-for="actionItem in actionList" :text="actionItem.intro">
            <template v-slot:activator="{ props }">
              <v-radio :label="actionItem.cn_name" :value="actionItem.name" v-bind="props"></v-radio>
            </template>
          </v-tooltip>
        </v-radio-group>
        <v-card class="ml-15" width="800">
          <v-card-title>
            <div class="flex p-4">
              <div>卡组</div>
              <div class="flex-grow"></div>
              <v-btn :disabled="isLock" variant="tonal" @click="cardSelect = undefined">清空选择</v-btn>
            </div>
          </v-card-title>
          <v-card-item>
            <div ref="wheelRef" class="flex overflow-x-scroll gap-3 scroll-show p-4" @wheel="wheelEvent">
              <v-card
                v-for="cardItem in cardList"
                :class="{ card_select: cardSelect?.id == cardItem.id }"
                :title="cardItem.cn_name"
                class="mb-4 cursor-pointer rounded-xl"
                min-width="200"
                width="200"
                @click="changeCardSelectEvent(cardItem)"
              >
                <v-card-item>{{ cardItem.intro }}</v-card-item>
                <v-card-actions>
                  <div class="flex-grow"></div>
                  <div
                    :class="{
                      rage_enough: !player_me || cardItem.rage <= player_me.rage,
                      rage_insufficient: !player_me || cardItem.rage > player_me.rage,
                    }"
                  >
                    需要怒气：{{ cardItem.rage }}
                  </div>
                </v-card-actions>
              </v-card>
            </div>
          </v-card-item>
          <v-card-item>
            <div class="flex">
              <div class="text-neutral-500">TIP: 按住 shift 可以拥有更丝滑的滚动体验</div>
              <div class="flex-grow"></div>
              <div>卡牌数量：{{ cardList.length }}</div>
            </div>
          </v-card-item>
        </v-card>
      </div>
    </v-card-item>
    <v-card-actions>
      <div>回合数: {{ round }}</div>
      <div class="flex-grow"></div>
      <v-dialog max-width="1000">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="tonal">查看历史</v-btn>
        </template>
        <v-card class="history_scrollbar">
          <v-card-title>历史</v-card-title>
          <v-card-text v-for="historyItem in historyList">{{ historyItem }}</v-card-text>
        </v-card>
      </v-dialog>
      <v-btn variant="tonal" @click="fixBug">BUG修复</v-btn>
      <v-btn :disabled="isLock" :loading="loading" variant="tonal" @click="confirmActionEvent">锁定</v-btn>
    </v-card-actions>
  </v-card>
  <div class="flex-grow"></div>
  <v-card
    :class="{ suffer_harm: suffer_harm_me, suffer_treat: suffer_treat_me, rage_insufficient_anim: rage_insufficient }"
    class="mb-4"
    width="1200"
  >
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

.card_select {
  box-shadow: 0 0 1rem #d1e7d1;
}

.rage_enough {
  color: #5cf52f;
}

.rage_insufficient {
  color: #ff7575;
}

.rage_insufficient_anim {
  animation: rage_insufficient_anim 1s ease-in-out;
}

@keyframes rage_insufficient_anim {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: #d1d93560;
  }
  100% {
    background-color: transparent;
  }
}

.scroll-show::-webkit-scrollbar {
  display: block;
  background-color: #aaa;
  border-radius: 1rem;
}
.scroll-show::-webkit-scrollbar-thumb {
  background-color: #1a1a1a;
  border-radius: 1rem;
  cursor: pointer;
}
.history_scrollbar::-webkit-scrollbar {
  display: block;
  background-color: #aaa;
}
.history_scrollbar::-webkit-scrollbar-thumb {
  background-color: #1a1a1a;
  cursor: pointer;
}
</style>
