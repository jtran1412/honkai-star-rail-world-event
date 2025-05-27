import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  selectGems,
  addGems,
  summonCharacter,
  selectSummoned,
} from "../features/summon/summonSlice";
import { characters } from "../data/characters";
import type { Character } from "../data/characters";

interface SummonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extend Character to include upgrades for summoned characters
interface SummonedCharacter extends Character {
  upgrades: number;
}

const SUMMON_COSTS = [100, 200, 300, 400, 500]; // cost per rarity 1★ to 5★

const SummonModal: React.FC<SummonModalProps> = ({ isOpen, onClose }) => {
  const gems = useAppSelector(selectGems);
  // Cast summoned to SummonedCharacter[] so TypeScript knows about upgrades property
  const summoned = useAppSelector(selectSummoned) as SummonedCharacter[];
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [result, setResult] = useState<Character | null>(null);

  // Check if player can summon given rarity (1-5)
  // Enforce max all lower rarity before next rarity unlocked
  function canSummon(rarity: number) {
    if (rarity === 1) return true; // 1★ always available
    for (let r = 1; r < rarity; r++) {
      const charsOfRarity = characters.filter((c) => c.rarity === r);
      // check if all chars of lower rarity are maxed (5 upgrades)
      for (const char of charsOfRarity) {
        // Find deployed with upgrades
        const deployedChar = summoned.find(
          (s) => s.id === char.id && s.upgrades >= 5
        );
        if (!deployedChar) return false;
      }
    }
    return true;
  }

  function handleSummon(rarity: number) {
    const cost = SUMMON_COSTS[rarity - 1];
    if (gems < cost) {
      toast({
        title: "Not enough gems",
        description: `You need ${cost} gems to summon ${rarity}★ character.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!canSummon(rarity)) {
      toast({
        title: "Rarity locked",
        description: `You must max all ${rarity - 1}★ characters before summoning ${rarity}★.`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Filter characters by rarity
    const pool = characters.filter((c) => c.rarity === rarity);
    // Pick random character
    const char = pool[Math.floor(Math.random() * pool.length)];

    // Dispatch summon and deduct gems
    dispatch(summonCharacter(char));
    dispatch(addGems(-cost));
    setResult(char);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Summon Characters</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>You have {gems} gems</Text>
          <VStack spacing={3} align="stretch">
            {[1, 2, 3, 4, 5].map((rarity) => (
              <Button
                key={rarity}
                onClick={() => handleSummon(rarity)}
                isDisabled={gems < SUMMON_COSTS[rarity - 1] || !canSummon(rarity)}
                colorScheme="purple"
              >
                Summon {rarity}★ (Cost: {SUMMON_COSTS[rarity - 1]} gems)
              </Button>
            ))}
          </VStack>
          {result && (
            <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <Text fontWeight="bold" mb={2}>
                You summoned: {result.name} ({result.rarity}★)
              </Text>
              <Text>Title: {result.title}</Text>
              <Text>Area: {result.area}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SummonModal;
