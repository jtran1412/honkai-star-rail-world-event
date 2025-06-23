import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  useToast,
  Avatar,
  AvatarGroup,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./hooks/useRedux";
import { useCardSystem } from "./hooks/useCardSystem";
import { useVenueSystem } from "./hooks/useVenueSystem";
import { useGoldGeneration } from "./hooks/useGoldGeneration";
import { acknowledgeLevel } from "./store/gameSlice";
import CharacterList from "./components/CharacterList";
import { characters } from "./data/characters";
import { CoinIcon, GemIcon } from "./components/icons/Icons";
import type { Assistant, Character, UnlockedCharacter } from "./types/gameTypes";

const XP_PER_GOLD = 1.0;
const BASE_XP_PER_LEVEL = 1000;

// Calculate XP needed for current level
const getXPForLevel = (level: number) => {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(1.5, level - 1));
};

function App() {
  const { 
    goldCoins, 
    gems, 
    venues, 
    assistants, 
    unlockedCharacters,
    level,
    totalRevenue,
    lastLevelUpNotification,
  } = useAppSelector((state) => state.game);
  const { drawCard, canAffordDraw, drawOptions } = useCardSystem();
  const { calculateVenueRevenue } = useVenueSystem();
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Start gold generation
  useGoldGeneration();

  // Calculate XP and progress to next level
  const totalXP = totalRevenue * XP_PER_GOLD;
  let currentLevelXP = totalXP;
  
  // Calculate XP needed for current level
  for (let i = 1; i < level; i++) {
    const xpForLevel = getXPForLevel(i);
    currentLevelXP -= xpForLevel;
  }
  
  const xpNeededForCurrentLevel = getXPForLevel(level);
  const levelProgress = (currentLevelXP / xpNeededForCurrentLevel) * 100;

  // Show level up notification using useEffect
  useEffect(() => {
    if (level > lastLevelUpNotification) {
      const nextLevelXP = getXPForLevel(level);
      toast({
        title: `Level Up! You're now level ${level}`,
        description: `You received 500 gems as a reward! Next level requires ${nextLevelXP} XP`,
        status: "success",
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => dispatch(acknowledgeLevel(level)),
      });
    }
  }, [level, lastLevelUpNotification, toast, dispatch]);

  const handleDrawCard = (drawType: number) => {
    const result = drawCard(drawType);
    if (result.success) {
      toast({
        title: "Character Drawn!",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Draw Failed",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getDeployedCharacters = (venueId: string) => {
    return assistants
      .filter((a: Assistant) => a.venueId === venueId)
      .map((a: Assistant) => {
        const character = characters.find((c: Character) => c.id === a.characterId);
        const charData = unlockedCharacters.find((uc: UnlockedCharacter) => uc.characterId === a.characterId);
        return {
          ...character,
          duplicateLevel: charData?.duplicateLevel || 1,
          generationRate: a.generationRate,
        };
      });
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6} align="stretch">
        {/* Header with resources and level */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="stretch" spacing={2}>
            <Heading size="lg">Cosmic Exhibition Manager</Heading>
            <HStack>
              <Text>Level {level}</Text>
              <Progress 
                value={levelProgress} 
                size="sm" 
                width="200px" 
                colorScheme="purple"
                borderRadius="full"
              />
            </HStack>
          </VStack>
          <HStack spacing={4}>
            <HStack>
              <CoinIcon color="gold" boxSize={6} />
              <Text fontWeight="bold">{Math.floor(goldCoins)}</Text>
            </HStack>
            <HStack>
              <GemIcon color="purple" boxSize={6} />
              <Text fontWeight="bold">{gems}</Text>
            </HStack>
          </HStack>
        </Flex>

        <Tabs variant="enclosed" colorScheme="purple">
          <TabList>
            <Tab>Characters</Tab>
            <Tab>Areas</Tab>
            <Tab>Summon</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Characters Section */}
              <Box>
                <Heading size="md" mb={4}>Characters</Heading>
                <CharacterList />
              </Box>
            </TabPanel>

            <TabPanel>
              {/* Areas Section */}
              <Box>
                <Heading size="md" mb={4}>Venues</Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                  {venues.map((venue) => {
                    const deployedChars = getDeployedCharacters(venue.id);
                    const revenue = calculateVenueRevenue(venue);

                    return (
                      <Box
                        key={venue.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg={venue.unlockLevel > level ? "gray.700" : "blue.700"}
                        color="white"
                        opacity={venue.unlockLevel > level ? 0.7 : 1}
                      >
                        <VStack align="stretch" spacing={3}>
                          <Image
                            src={venue.imageUrl}
                            alt={venue.name}
                            borderRadius="md"
                            height="150px"
                            objectFit="cover"
                            filter={venue.unlockLevel > level ? "grayscale(100%)" : undefined}
                          />
                          <Text fontWeight="bold">{venue.name}</Text>
                          <Badge colorScheme="yellow">{venue.type}</Badge>
                          <Text fontSize="sm">Theme: {venue.theme}</Text>
                          <Text fontSize="sm">Level Required: {venue.unlockLevel}</Text>
                          
                          {venue.unlockLevel <= level && (
                            <>
                              <VStack align="stretch" spacing={1}>
                                <Text fontSize="sm">Revenue Generation:</Text>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Base:</Text>
                                  <Text fontSize="sm">{revenue.baseRevenue}/s</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Assistant Bonus:</Text>
                                  <Text fontSize="sm" color="green.300">+{revenue.assistantBonus}/s</Text>
                                </HStack>
                                <Divider />
                                <HStack justify="space-between">
                                  <Text fontSize="sm" fontWeight="bold">Total:</Text>
                                  <Text fontSize="sm" fontWeight="bold">{revenue.totalRevenue}/s</Text>
                                </HStack>
                              </VStack>

                              <Box>
                                <Text fontSize="sm" mb={2}>
                                  Deployed Characters ({revenue.assistantCount}/{venue.maxAssistants}):
                                </Text>
                                <AvatarGroup max={4} size="md">
                                  {deployedChars.map(char => (
                                    <Avatar
                                      key={char.id}
                                      name={char.name}
                                      src={`/images/characters/${char.id}.jpg`}
                                      title={`${char.name} (${char.duplicateLevel}★) - ${char.generationRate.toFixed(1)}/s`}
                                    />
                                  ))}
                                </AvatarGroup>
                              </Box>
                            </>
                          )}

                          {venue.unlockLevel > level && (
                            <Text fontSize="sm" color="red.300">
                              Unlocks at Level {venue.unlockLevel}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    );
                  })}
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel>
              {/* Summon Section */}
              <Box>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Summon Characters</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {drawOptions.map((option, index) => (
                      <Box
                        key={option.name}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg={`${option.colorScheme}.700`}
                        color="white"
                        opacity={canAffordDraw(index) ? 1 : 0.7}
                      >
                        <VStack spacing={3} align="stretch">
                          <Heading size="sm">{option.name}</Heading>
                          <Text>Guaranteed {option.guaranteedRarity}★ Character</Text>
                          <HStack>
                            <GemIcon />
                            <Text>{option.cost} Gems</Text>
                          </HStack>
                          <Button
                            colorScheme={option.colorScheme}
                            onClick={() => handleDrawCard(index)}
                            isDisabled={!canAffordDraw(index)}
                            leftIcon={<GemIcon />}
                            variant="solid"
                          >
                            Summon
                          </Button>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default App;
