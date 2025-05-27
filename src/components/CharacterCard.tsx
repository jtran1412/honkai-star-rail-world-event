import { Box, Text, Badge, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Character } from "../data/characters";

type CharacterCardProps = {
  character: Character;
};

const MotionBox = motion(Box);

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "");

const CharacterCard = ({ character }: CharacterCardProps) => {
  const imagePath = `/images/character/${normalizeName(character.name)}.jpg`;

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="md"
      bg="gray.800"
      color="white"
      p={4}
    >
      <VStack gap={3}>
        <Image
          src={imagePath}
          alt={character.name}
          borderRadius="xl"
          boxSize="150px"
          objectFit="cover"
        />
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          {character.name}
        </Text>
        <Badge colorScheme="purple">{character.rarity}★</Badge>
        <Badge colorScheme="blue">{character.area}</Badge>
        <Text fontSize="sm" textAlign="center" color="gray.300">
          {character.unlockRequirement}
        </Text>
      </VStack>
    </MotionBox>
  );
};

export default CharacterCard;
