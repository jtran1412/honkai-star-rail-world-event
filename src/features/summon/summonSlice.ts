import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "../../types/gameTypes";
// import type { RootState } from "../../store";

export interface DeployedCharacter extends Character {
  duplicates: number; // number of duplicates used for upgrades (max 5)
  upgrades: number;   // upgrades from duplicates, max 5
}

interface SummonState {
  gems: number;
  gold: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  summoned: Character[];           // all summoned characters (duplicates included)
  deployed: DeployedCharacter[];  // characters currently deployed
}

const initialState: SummonState = {
  gems: 0,
  gold: 0,
  level: 1,
  experience: 0,
  experienceToNextLevel: 1000,
  summoned: [],
  deployed: [],
};

const summonSlice = createSlice({
  name: "summon",
  initialState,
  reducers: {
    addGems(state, action: PayloadAction<number>) {
      state.gems += action.payload;
    },

    addGold(state, action: PayloadAction<number>) {
      state.gold += action.payload;
    },

    addExperience(state, action: PayloadAction<number>) {
      state.experience += action.payload;

      while (state.experience >= state.experienceToNextLevel) {
        state.experience -= state.experienceToNextLevel;
        state.level += 1;
        state.experienceToNextLevel = Math.floor(state.experienceToNextLevel * 1.2);
        state.gems += 100; // reward gems on level up
      }
    },

    summonCharacter(state, action: PayloadAction<Character>) {
      state.summoned.push(action.payload);
    },

    deployCharacter(state, action: PayloadAction<Character>) {
      // Prevent deploying the same character multiple times
      const exists = state.deployed.find((c) => c.name === action.payload.name);
      if (!exists) {
        state.deployed.push({
          ...action.payload,
          duplicates: 0,
          upgrades: 0,
        });
      }
    },

    undeployCharacter(state, action: PayloadAction<string>) {
      // Remove from deployed by character name
      state.deployed = state.deployed.filter((c) => c.name !== action.payload);
    },

    upgradeCharacter(state, action: PayloadAction<string>) {
      // payload: character name to upgrade
      const char = state.deployed.find((c) => c.name === action.payload);
      if (!char) return;

      if (char.upgrades < 5 && char.duplicates > 0) {
        char.upgrades += 1;
        char.duplicates -= 1;
      }
    },

    addDuplicate(state, action: PayloadAction<string>) {
      // payload: character name
      const char = state.deployed.find((c) => c.name === action.payload);
      if (!char) return;

      if (char.upgrades < 5) {
        char.duplicates += 1;
      } else {
        // max upgrades reached, convert duplicates to gold
        state.gold += 50;
      }
    },
  },
});

export const {
  addGems,
  addGold,
  addExperience,
  summonCharacter,
  deployCharacter,
  undeployCharacter,
  upgradeCharacter,
  addDuplicate,
} = summonSlice.actions;

// export const selectGems = (state: RootState) => state.summon.gems;
// export const selectGold = (state: RootState) => state.summon.gold;
// export const selectLevel = (state: RootState) => state.summon.level;
// export const selectExperience = (state: RootState) => state.summon.experience;
// export const selectExperienceToNextLevel = (state: RootState) => state.summon.experienceToNextLevel;
// export const selectSummoned = (state: RootState) => state.summon.summoned;
// export const selectDeployed = (state: RootState) => state.summon.deployed;

export default summonSlice.reducer;
