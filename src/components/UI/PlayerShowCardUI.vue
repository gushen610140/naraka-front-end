<script lang="ts" setup>
import { ref } from "vue";

const { player_name } = defineProps<{
  player_name: string;
}>();

enum Status {
  NotReady,
  Ready,
}

const status = ref(Status.NotReady);

// 我要怎么告诉你~ 我已经用了~
const readyColor = "#41d019";
const notReadyColor = "#d01919";
</script>

<template>
  <div class="card">
    <div class="card-border-top"></div>
    <div class="img"></div>
    <span> {{ player_name }}</span>
    <p class="job">{{ status === Status.Ready ? "已准备" : "未准备" }}</p>
    <button
      @click="status = status === Status.Ready ? Status.NotReady : Status.Ready"
    >
      {{ status === Status.Ready ? "取消准备" : "准备" }}
    </button>
  </div>
</template>

<style scoped>
.card {
  width: 190px;
  height: 254px;
  background: #1f1e1f;
  border-radius: 15px;
  box-shadow: 1px 5px 60px 0 #1f1e1f6b;
}

.card .card-border-top {
  width: 60%;
  height: 3%;
  background: #b6b3b3;
  margin: auto;
  border-radius: 0 0 15px 15px;
}

.card span {
  font-weight: 600;
  color: white;
  text-align: center;
  display: block;
  padding-top: 10px;
  font-size: 16px;
}

.card .job {
  font-weight: 400;
  color: white;
  display: block;
  text-align: center;
  padding-top: 3px;
  font-size: 12px;
}

.card .img {
  width: 70px;
  height: 80px;
  background: v-bind("status == Status.Ready ? readyColor : notReadyColor");
  box-shadow: 0 0 10px
    v-bind("status == Status.Ready ? readyColor : notReadyColor");
  border-radius: 15px;
  margin: 25px auto auto;
  transition: all ease 0.5s;
}

.card button {
  padding: 8px 25px;
  display: block;
  border-radius: 8px;
  border: none;
  margin: 30px auto auto;
  background: #b6b3b3;
  color: black;
  font-weight: 600;
  transition: all ease 0.3s;
}

.card button:hover {
  background: #777474;
}

.card button:focus {
  outline: none;
}
</style>
