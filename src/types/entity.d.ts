declare interface Result<T> {
  code: number;
  message: string;
  data: T;
}

declare interface Session {
  id: string;
  player_1_id: string;
  player_2_id: string;
  round: number;
  cards: string;
}
