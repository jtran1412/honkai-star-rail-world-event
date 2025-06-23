import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { assignAssistant, removeAssistant } from '../store/gameSlice';
import type { Venue, Assistant } from '../types/gameTypes';
import { characters } from '../data/characters';

export const useVenueSystem = () => {
  const dispatch = useAppDispatch();
  const { venues, assistants, unlockedCharacters, level } = useAppSelector(state => state.game);

  const calculateVenueRevenue = useCallback((venue: Venue) => {
    const venueAssistants = assistants.filter((a: Assistant) => a.venueId === venue.id);
    const baseRevenue = venue.baseRevenue;
    
    // Calculate assistant bonus
    const assistantBonus = venueAssistants.reduce((total, assistant) => {
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
    const characterData = characters.find(c => c.id === characterId);
    if (!characterData) {
      return {
        success: false,
        message: "Character not found",
      };
    }

    // Find first available venue of matching type that is unlocked
    const availableVenue = venues.find(venue => {
      const venueAssistants = assistants.filter((a: Assistant) => a.venueId === venue.id);
      return venue.type === characterData.area && 
             venueAssistants.length < venue.maxAssistants &&
             venue.unlockLevel <= level;
    });

    if (!availableVenue) {
      const matchingVenue = venues.find(v => v.type === characterData.area);
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
    const character = unlockedCharacters.find(c => c.characterId === characterId);
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