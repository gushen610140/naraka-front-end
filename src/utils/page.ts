import { router } from "@/router/index.ts";

export const changePage = async (page: string) => {
  try {
    await router.push(page);
  } catch (e) {
    await router.push(page);
  }
};
