import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameState } from '../types/gameTypes';
import { characters } from '../data/characters';
import { venues } from '../data/venues';

const LEVEL_UP_GEMS = 500;
const XP_PER_GOLD = 1.0;
const BASE_XP_PER_LEVEL = 1000; // Base XP needed for level 1

// Calculate XP needed for a specific level
const getXPForLevel = (level: number) => {
  // Each level requires 50% more XP than the previous level
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(1.5, level - 1));
};

// Calculate current level based on total XP
const calculateLevel = (totalXP: number) => {
  let level = 1;
  let xpRequired = BASE_XP_PER_LEVEL;
  let remainingXP = totalXP;

  while (remainingXP >= xpRequired) {
    remainingXP -= xpRequired;
    level++;
    xpRequired = getXPForLevel(level);
  }

  return level;
};

interface CharacterAction {
  characterId: string;
  isDuplicate: boolean;
}

const initialState: GameState = {
  level: 1,
  goldCoins: 0,
  gems: 1000,
  venues: venues,
  activeCards: [],
  assistants: [],
  unlockedCharacters: [],
  lastGoldUpdate: Date.now(),
  totalRevenue: 0,
  lastLevelUpNotification: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGoldCoins: (state) => {
      const now = Date.now();
      const timeDiff = (now - state.lastGoldUpdate) / 1000; // Convert to seconds
      
      // Calculate total gold generation from all assistants
      const generatedGold = state.assistants.reduce((total, assistant) => {
        return total + (assistant.generationRate * timeDiff);
      }, 0);

      const roundedGold = Math.floor(generatedGold);
      state.goldCoins += roundedGold;
      state.totalRevenue += roundedGold;
      state.lastGoldUpdate = now;

      // Calculate new level based on total XP
      const totalXP = state.totalRevenue * XP_PER_GOLD;
      const newLevel = calculateLevel(totalXP);
      
      if (newLevel > state.level) {
        // Level up reward - only give gems for one level at a time
        state.gems += LEVEL_UP_GEMS;
        state.level = state.level + 1;
      }
    },

    acknowledgeLevel: (state, action: PayloadAction<number>) => {
      state.lastLevelUpNotification = action.payload;
    },

    addCharacter: (state, action: PayloadAction<CharacterAction>) => {
      const { characterId, isDuplicate } = action.payload;
      
      if (isDuplicate) {
        const existingChar = state.unlockedCharacters.find(
          c => c.characterId === characterId
        );
        if (existingChar) {
          existingChar.duplicateLevel += 1;
        }
      } else {
        state.unlockedCharacters.push({
          characterId,
          duplicateLevel: 1,
        });
      }
    },

    assignAssistant: (state, action: PayloadAction<{ characterId: string; venueId: string }>) => {
      const { characterId, venueId } = action.payload;
      const venue = state.venues.find(v => v.id === venueId);
      const unlockedChar = state.unlockedCharacters.find(c => c.characterId === characterId);
      const characterData = characters.find(c => c.id === characterId);
      
      if (!venue || !unlockedChar || !characterData) return;

      // Remove from any existing venue
      state.assistants = state.assistants.filter(a => a.characterId !== characterId);

      // Add to new venue with generation rate based on character's base rate and duplicate level
      state.assistants.push({
        characterId,
        venueId,
        generationRate: characterData.baseGenerationRate * unlockedChar.duplicateLevel,
      });
    },

    removeAssistant: (state, action: PayloadAction<string>) => {
      state.assistants = state.assistants.filter(a => a.characterId !== action.payload);
    },

    spendGems: (state, action: PayloadAction<number>) => {
      state.gems -= action.payload;
    },
  },
});

export const {
  updateGoldCoins,
  addCharacter,
  assignAssistant,
  removeAssistant,
  spendGems,
  acknowledgeLevel,
} = gameSlice.actions;

export default gameSlice.reducer; 