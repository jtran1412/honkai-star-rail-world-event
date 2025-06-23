import {
  Grid,
  useToast,
} from "@chakra-ui/react";
import { useAppSelector } from "../hooks/useredux";
import { useVenueSystem } from "../hooks/useVenueSystem";
import { characters } from "../data/characters";
import CharacterCard from "./CharacterCard";
import type { Character, UnlockedCharacter, Assistant } from "../types/gameTypes";
import type { RootState } from "../store";

export const CharacterList = () => {
  const { unlockedCharacters, assistants, level, totalRevenue } = useAppSelector((state: RootState) => state.game);
  const { assignCharacterToVenue, removeAssistantFromVenue } = useVenueSystem();
  const toast = useToast();

  const handleDeploy = (characterId: string) => {
    const result = assignCharacterToVenue(characterId);
    
    if (result.success) {
      toast({
        title: "Character Deployed",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Deployment Failed",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUndeploy = (characterId: string) => {
    const result = removeAssistantFromVenue(characterId);
    
    if (result.success) {
      toast({
        title: "Character Undeployed",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Undeploy Failed",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deployedCharacterIds = assistants.map((a: Assistant) => a.characterId);

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={6}
    >
      {characters.map((character: Character) => {
        const unlockedChar = unlockedCharacters.find((uc: UnlockedCharacter) => uc.characterId === character.id);
        return (
          <CharacterCard
            key={character.id}
            character={character}
            onDeploy={handleDeploy}
            onUndeploy={handleUndeploy}
            isDeployed={deployedCharacterIds.includes(character.id)}
            isUnlocked={!!unlockedChar}
            duplicateLevel={unlockedChar?.duplicateLevel}
            playerLevel={level}
            totalRevenue={totalRevenue}
          />
        );
      })}
    </Grid>
  );
};

export default CharacterList; 