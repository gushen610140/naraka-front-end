import { router } from "@/router/index.ts";

export const changePage = (page: string) => {
  router.push(page);
};
