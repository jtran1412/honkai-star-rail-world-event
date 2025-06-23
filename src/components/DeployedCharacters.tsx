import React from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { createToaster } from "@ark-ui/react/toast";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  upgradeCharacter,
  addDuplicate,
} from "../features/summon/summonSlice";
import { synergyRules } from "../data/synergies";
import type { VenueType } from "../types/gameTypes";
import type { DeployedCharacter } from "../features/summon/summonSlice";

const toast = createToaster({ placement: "top-end" });

const DeployedCharacters: React.FC = () => {
  const deployed = useAppSelector(() => []) as DeployedCharacter[];
  const dispatch = useAppDispatch();

  const deployedNames = deployed.map((c: DeployedCharacter) => c.name);
  const deployedAreas = deployed.map((c: DeployedCharacter) => c.area as VenueType);

  const activeSynergies = synergyRules.filter((rule) => {
    const allCharsDeployed = rule.characters.every((char: string) =>
      deployedNames.includes(char)
    );
    const areaMatch =
      !rule.areas || rule.areas.some((area: VenueType) => deployedAreas.includes(area));
    return allCharsDeployed && areaMatch;
  });

  const handleUpgrade = (id: string) => {
    const char = deployed.find((c: DeployedCharacter) => c.id === id);
    if (!char) return;

    if (char.duplicates === 0) {
      toast.create({
        title: "No duplicates available",
        description: "You need duplicates to upgrade this character.",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    if (char.upgrades >= 5) {
      toast.create({
        title: "Max upgrades reached",
        description: "This character is already fully upgraded.",
        type: "info",
        duration: 3000,
      });
      return;
    }

    dispatch(upgradeCharacter(id));
    toast.create({
      title: "Character upgraded",
      type: "success",
      duration: 2000,
    });
  };

  const handleAddDuplicate = (id: string) => {
    dispatch(addDuplicate(id));
    toast.create({
      title: "Duplicate added",
      type: "success",
      duration: 2000,
    });
  };

  return (
    <Box p={4} bg="gray.700" borderRadius="lg" color="white">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Deployed Characters
      </Text>
      <VStack gap={4} align="stretch">
        {deployed.length === 0 && <Text>No characters deployed yet.</Text>}

        {deployed.map((char: DeployedCharacter) => (
          <Box
            key={char.id}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.800"
          >
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {char.name}{" "}
                  <Badge colorScheme="purple" ml={2}>
                    {char.rarity}★
                  </Badge>
                </Text>
                <Text fontSize="sm" color="gray.300">
                  Area: {char.area}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  Upgrades: {char.upgrades} / 5
                </Text>
                <Text fontSize="sm" color="gray.300">
                  Duplicates: {char.duplicates}
                </Text>
              </Box>
              <VStack gap={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  disabled={char.upgrades >= 5 || char.duplicates <= 0}
                  onClick={() => handleUpgrade(char.id)}
                >
                  Upgrade
                </Button>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => handleAddDuplicate(char.id)}
                >
                  Add Duplicate
                </Button>
              </VStack>
            </HStack>
          </Box>
        ))}

        {activeSynergies.length > 0 && (
          <Box p={4} bg="blue.700" borderRadius="md" color="white" mt={6}>
            <Text fontWeight="bold" mb={2}>
              Active Synergies:
            </Text>
            <VStack align="start" gap={1}>
              {activeSynergies.map((synergy, i) => (
                <Text key={i} fontSize="sm">
                  {synergy.bonusText}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DeployedCharacters;
