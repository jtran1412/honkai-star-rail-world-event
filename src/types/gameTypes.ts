export type Rarity = 1 | 2 | 3 | 4 | 5;
export type VenueType = 'Market' | 'Commemoration' | 'Entertainment';

export interface Character {
  id: string;
  name: string;
  title: string;
  area: VenueType;
  rarity: Rarity;
  unlockRequirement: {
    type: 'level' | 'revenue' | 'starter' | 'pull';
    value?: number;
    description: string;
  };
  effects: string[];
  synergyGroup?: string;
  baseGenerationRate: number; // Gold per second
}

export interface UnlockedCharacter {
  characterId: string;
  duplicateLevel: number; // Increases generation rate
}

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  theme: string;
  level: number;
  unlockLevel: number;
  baseRevenue: number;
  maxAssistants: number;
  bonusThemes: string[];
  imageUrl: string;
  lastCollected?: number;
}

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  cost: number;
  theme: string;
  effect: {
    type: 'cooldown' | 'coins' | 'taskReward';
    value: number;
  };
  bonds: string[]; // IDs of cards this card has synergy with
}

export interface Assistant {
  characterId: string;
  venueId: string;
  generationRate: number;
}

export interface GameState {
  level: number;
  goldCoins: number;
  gems: number;
  venues: Venue[];
  activeCards: Card[];
  assistants: Assistant[];
  unlockedCharacters: UnlockedCharacter[];
  lastGoldUpdate: number;
  totalRevenue: number;
  lastLevelUpNotification: number;
}

export type BondEffect = {
  cards: string[];
  bonusMultiplier: number;
}; 