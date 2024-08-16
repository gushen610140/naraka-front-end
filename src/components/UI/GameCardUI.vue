<script lang="ts" setup>
const { gameSessionInfo } = defineProps<{
  gameSessionInfo: Session;
}>();
</script>

<template>
  <div class="card">
    <div class="card-inner">
      <div class="card-front">
        <p>{{ gameSessionInfo.round }}</p>
      </div>
      <div class="card-back">
        <p>加入游戏</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 300px;
  height: 200px;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.999s;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  background-color: #242424;
  color: #fff;
  display: flex;
  align-items: center;
  border: 10px solid #fff;
  border-radius: 10px;
  justify-content: center;
  font-size: 24px;
  transform: rotateY(0deg);
}

.card-back {
  background-color: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  border: 10px solid #fff;
  border-radius: 10px;
  justify-content: center;
  font-size: 24px;
  transform: rotateY(180deg);
}
</style>
