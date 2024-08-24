declare interface Result<T> {
  code: number;
  message: string;
  data: T;
}

declare interface Session {
  player_me_id: string;
  player_opponent_id: string;
}

declare interface Player {
  id: string;
  chosen_action: string;
  chosen_card: string;
  health_max: number;
  health_cur: number;
  nickname: string;
  status: string;
  rage: number;
}

declare interface WaitRoom {
  id: string;
  player_1_id: string;
  player_2_id: string;
  status: string;
  room_name: string;
}

declare interface RoundResult {
  oldPlayerMe: Player;
  oldPlayerOpponent: Player;
  newPlayerMe: Player;
  newPlayerOpponent: Player;
}
