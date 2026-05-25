export type Surface = 'dirt' | 'asphalt' | 'mixed';

export interface Circuit {
  id: string;
  name: string;
  country: string;
  surface: Surface;
  length: number;
  modifiers: {
    engine: number;
    aero: number;
    suspension: number;
    tires: number;
  };
}

export type DriverStyle = 'aggressive' | 'technical' | 'consistent';

export interface OpponentDriver {
  id: string;
  name: string;
  strength: number;
  style: DriverStyle;
  nationality: string;
}

export interface CarStats {
  engine: number;
  aero: number;
  transmission: number;
  suspension: number;
  tires: number;
  driver: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  stat: keyof CarStats;
  bonus: number;
  cost: number;
  level: number;
  maxLevel: number;
}

export interface Round {
  circuit: Circuit;
  completed: boolean;
  playerOverallPosition: number | null;
}

export type ChampionshipTier =
  | 'regional'
  | 'national'
  | 'euroRX'
  | 'worldRX'
  | 'title';

export interface Championship {
  id: ChampionshipTier;
  name: string;
  requiredReputation: number;
  opponentCount: number;
  opponents: OpponentDriver[];
  rounds: Round[];
  pointsTable: number[];
}

export interface PrestigeBonuses {
  regulationKnowledge: number;
  teamMorale: number;
  sponsorBonus: number;
}

export interface GameState {
  money: number;
  reputation: number;
  prestigeTokens: number;
  car: CarStats;
  upgrades: Upgrade[];
  currentChampionship: ChampionshipTier;
  currentRoundIndex: number;
  seasonNumber: number;
  championshipStandings: { driverName: string; points: number; isPlayer: boolean }[];
  phase: 'idle' | 'racing' | 'seasonEnd';
  prestige: PrestigeBonuses;
  unlockedChampionships: ChampionshipTier[];
  lastTickTime: number;
  passiveIncome: number;
}
