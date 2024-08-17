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

declare interface Player {
  id: string;
  chosen_action: string;
  chosen_card: string;
  cards: string;
  health_max: number;
  health_cur: number;
  nickname: string;
  status: string;
}

declare interface WaitRoom {
  id: string;
  player_1_id: string;
  player_2_id: string;
  status: string;
  room_name: string;
}
