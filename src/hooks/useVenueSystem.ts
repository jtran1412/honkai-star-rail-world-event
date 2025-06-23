import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useredux';
import { assignAssistant, removeAssistant } from '../store/gameSlice';
import type { Venue, Assistant, UnlockedCharacter, Character } from '../types/gameTypes';
import type { RootState } from '../store';
import { characters } from '../data/characters';

export const useVenueSystem = () => {
  const dispatch = useAppDispatch();
  const { venues, assistants, unlockedCharacters, level } = useAppSelector((state: RootState) => state.game);

  const calculateVenueRevenue = useCallback((venue: Venue) => {
    const venueAssistants = assistants.filter((a: Assistant) => a.venueId === venue.id);
    const baseRevenue = venue.baseRevenue;
    
    // Calculate assistant bonus
    const assistantBonus = venueAssistants.reduce((total: number, assistant: Assistant) => {
      return total + assistant.generationRate;
    }, 0);

    return {
      baseRevenue,
      assistantBonus,
      totalRevenue: baseRevenue + assistantBonus,
      assistantCount: venueAssistants.length,
    };
  }, [assistants]);

  const assignCharacterToVenue = (characterId: string) => {
    // Get character data
    const characterData = characters.find((c: Character) => c.id === characterId);
    if (!characterData) {
      return {
        success: false,
        message: "Character not found",
      };
    }

    // Find first available venue of matching type that is unlocked
    const availableVenue = venues.find((v: Venue) => {
      const venueAssistants = assistants.filter((a: Assistant) => a.venueId === v.id);
      return v.type === characterData.area && 
             venueAssistants.length < v.maxAssistants &&
             v.unlockLevel <= level;
    });

    if (!availableVenue) {
      const matchingVenue = venues.find((v: Venue) => v.type === characterData.area);
      if (!matchingVenue || matchingVenue.unlockLevel > level) {
        return {
          success: false,
          message: `${characterData.area} area unlocks at level ${matchingVenue?.unlockLevel || '???'}`,
        };
      }
      return {
        success: false,
        message: `No available ${characterData.area} venues with space`,
      };
    }

    // Get character's generation rate based on duplicate level
    const character = unlockedCharacters.find((c: UnlockedCharacter) => c.characterId === characterId);
    if (!character) {
      return {
        success: false,
        message: "Character not unlocked",
      };
    }

    dispatch(assignAssistant({ 
      characterId, 
      venueId: availableVenue.id,
    }));

    return {
      success: true,
      message: `Successfully deployed to ${availableVenue.name}`,
    };
  };

  return {
    calculateVenueRevenue,
    assignCharacterToVenue,
    removeAssistantFromVenue: (characterId: string) => {
      const assistant = assistants.find((a: Assistant) => a.characterId === characterId);
      if (!assistant) {
        return {
          success: false,
          message: "Character not found in any venue",
        };
      }
      dispatch(removeAssistant(characterId));
      return {
        success: true,
        message: "Character successfully undeployed",
      };
    },
  };
};

export default useVenueSystem; 