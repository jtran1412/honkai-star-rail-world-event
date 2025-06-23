import {
  Box,
  Text,
  Badge,
  Image,
  Grid,
  Button,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Character } from "../types/gameTypes";
import { LockIcon } from "./icons/Icons";

const MotionBox = motion(Box);

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "");

interface CharacterCardProps {
  character: Character;
  onDeploy: (characterId: string) => void;
  onUndeploy: (characterId: string) => void;
  isDeployed: boolean;
  isUnlocked: boolean;
  duplicateLevel?: number;
  playerLevel: number;
  totalRevenue: number;
}

const CharacterCard = ({
  character,
  onDeploy,
  onUndeploy,
  isDeployed,
  isUnlocked,
  duplicateLevel = 0,
  playerLevel,
  totalRevenue,
}: CharacterCardProps) => {
  const imagePath = `/images/characters/${normalizeName(character.name)}.jpg`;

  const canUnlock = () => {
    switch (character.unlockRequirement.type) {
      case 'level':
        return playerLevel >= (character.unlockRequirement.value || 0);
      case 'revenue':
        return totalRevenue >= (character.unlockRequirement.value || 0);
      case 'starter':
        return true;
      case 'pull':
        return true; // Can always be pulled if that's the unlock method
      default:
        return false;
    }
  };

  // Color scheme based on rarity and unlock status
  const getRarityColor = () => {
    if (!isUnlocked) return "gray";
    switch (character.rarity) {
      case 1: return "green";
      case 2: return "blue";
      case 3: return "purple";
      case 4: return "orange";
      case 5: return "red";
      default: return "gray";
    }
  };

  const getBgGradient = () => {
    if (!isUnlocked) return "linear(to-b, gray.800, gray.900)";
    switch (character.rarity) {
      case 1: return "linear(to-b, green.800, gray.900)";
      case 2: return "linear(to-b, blue.800, gray.900)";
      case 3: return "linear(to-b, purple.800, gray.900)";
      case 4: return "linear(to-b, orange.800, gray.900)";
      case 5: return "linear(to-b, red.800, gray.900)";
      default: return "linear(to-b, gray.800, gray.900)";
    }
  };

  return (
    <MotionBox
      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="md"
      bgGradient={getBgGradient()}
      color="white"
      position="relative"
      opacity={isUnlocked ? 1 : 0.8}
      p={4}
    >
      <Grid gap={3}>
        <Box position="relative">
          <Image
            src={imagePath}
            alt={character.name}
            borderRadius="xl"
            boxSize="150px"
            objectFit="cover"
          />
          {!isUnlocked && (
            <Box
              position="absolute"
              top={2}
              right={2}
              bg="blackAlpha.600"
              borderRadius="full"
              p={2}
            >
              <Tooltip
                label={character.unlockRequirement.description}
                placement="top"
                hasArrow
              >
                <Box>
                  <LockIcon boxSize={6} />
                </Box>
              </Tooltip>
            </Box>
          )}
        </Box>
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          {character.name}
          {duplicateLevel > 0 && ` (${duplicateLevel}★)`}
        </Text>
        <Badge colorScheme={getRarityColor()}>{character.rarity}★</Badge>
        <Badge colorScheme={getRarityColor()}>{character.area}</Badge>
        <Text fontSize="sm" color={isUnlocked ? "gray.300" : "gray.500"}>
          {character.title}
        </Text>

        {isUnlocked && (
          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <StatLabel>Current Level ({duplicateLevel}★)</StatLabel>
              <StatNumber>{(character.baseGenerationRate * duplicateLevel).toFixed(1)}/s</StatNumber>
              <StatHelpText>Base Rate: {character.baseGenerationRate}/s</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Next Level ({duplicateLevel + 1}★)</StatLabel>
              <StatNumber>{(character.baseGenerationRate * (duplicateLevel + 1)).toFixed(1)}/s</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {character.baseGenerationRate}/s
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        )}

        {character.effects.map((effect, index) => (
          <Text key={index} fontSize="xs" color={isUnlocked ? "gray.400" : "gray.600"}>
            {effect}
          </Text>
        ))}
        
        {isUnlocked && (
          <Button
            colorScheme={isDeployed ? "red" : "green"}
            onClick={() => isDeployed ? onUndeploy(character.id) : onDeploy(character.id)}
          >
            {isDeployed ? "Undeploy" : "Deploy"}
          </Button>
        )}
        {!isUnlocked && (
          <Text fontSize="sm" color={canUnlock() ? "green.300" : "red.300"} textAlign="center">
            {character.unlockRequirement.description}
          </Text>
        )}
      </Grid>
    </MotionBox>
  );
};

export default CharacterCard;
