import type { Character } from '../types/gameTypes';

export const getRandomCharacter = (characters: Character[]): Character => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}; 