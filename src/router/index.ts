import { createMemoryHistory, createRouter } from "vue-router";

import StartPage from "@/pages/StartPage.vue";

const routes = [
  { path: '/', component: () => StartPage },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})