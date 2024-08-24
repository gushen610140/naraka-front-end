import http from "@/utils/http.ts";

export const getCardListByPlayer = (player_id: string) => {
  return http<Card[]>({
    url: "/card/list_by_player",
    method: "get",
    params: {
      player_id,
    },
  });
};
