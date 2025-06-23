import { useAppDispatch, useAppSelector } from "./useredux";
import type { RootState } from "../store";
import { addCharacter, spendGems } from '../store/gameSlice';
import { characters } from '../data/characters';
import { getRandomCharacter } from '../utils/randomUtils';

interface DrawOption {
  cost: number;
  guaranteedRarity: number;
  name: string;
  colorScheme: string;
}

const DRAW_OPTIONS: DrawOption[] = [
  { cost: 100, guaranteedRarity: 1, name: "Basic Draw", colorScheme: "green" },
  { cost: 200, guaranteedRarity: 2, name: "Rare Draw", colorScheme: "blue" },
  { cost: 300, guaranteedRarity: 3, name: "Elite Draw", colorScheme: "purple" },
  { cost: 400, guaranteedRarity: 4, name: "Epic Draw", colorScheme: "orange" },
  { cost: 500, guaranteedRarity: 5, name: "Legendary Draw", colorScheme: "red" },
];

export const useCardSystem = () => {
  const dispatch = useAppDispatch();
  const { gems, unlockedCharacters, level } = useAppSelector((state: RootState) => state.game);

  const canAffordDraw = (drawType: number) => {
    const option = DRAW_OPTIONS[drawType];
    return gems >= option.cost;
  };

  const isCharacterUnlockable = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return false;

    // Check unlock requirements
    if (character.unlockRequirement.type === 'level') {
      const requiredLevel = character.unlockRequirement.value || 1;
      return level >= requiredLevel;
    }
    // For 'pull' type, character is always unlockable through draws
    if (character.unlockRequirement.type === 'pull') {
      return true;
    }
    return false;
  };

  const drawCard = (drawType: number) => {
    const option = DRAW_OPTIONS[drawType];
    
    if (!canAffordDraw(drawType)) {
      return {
        success: false,
        message: `Not enough gems. Need ${option.cost} gems for ${option.name}.`,
      };
    }

    // Filter characters by guaranteed rarity AND unlock conditions
    const eligibleCharacters = characters.filter(
      (char) => 
        char.rarity === option.guaranteedRarity && 
        isCharacterUnlockable(char.id)
    );

    if (eligibleCharacters.length === 0) {
      return {
        success: false,
        message: `No characters available for ${option.name} at your current level.`,
      };
    }

    const drawnCharacter = getRandomCharacter(eligibleCharacters);
    
    // Check if character is already unlocked
    const existingCharacter = unlockedCharacters.find(
      (c) => c.characterId === drawnCharacter.id
    );

    dispatch(spendGems(option.cost));

    if (existingCharacter) {
      // Duplicate found - increase generation rate
      dispatch(
        addCharacter({
          characterId: drawnCharacter.id,
          isDuplicate: true,
        })
      );
      return {
        success: true,
        message: `Duplicate ${drawnCharacter.name} (${drawnCharacter.rarity}★) - Generation rate increased!`,
      };
    }

    // New character
    dispatch(
      addCharacter({
        characterId: drawnCharacter.id,
        isDuplicate: false,
      })
    );

    return {
      success: true,
      message: `New character unlocked: ${drawnCharacter.name} (${drawnCharacter.rarity}★)!`,
    };
  };

  return {
    drawCard,
    canAffordDraw,
    drawOptions: DRAW_OPTIONS,
  };
};

export default useCardSystem; 