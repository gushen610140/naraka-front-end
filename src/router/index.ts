import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/pages/StartPage.vue"),
  },
  {
    path: "/join_game",
    component: () => import("@/pages/JoinGamePage.vue"),
  },
  {
    path: "/create_game",
    component: () => import("@/pages/CreateGamePage.vue"),
  },
  {
    path: "/wait_game",
    component: () => import("@/pages/WaitGamePage.vue"),
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
