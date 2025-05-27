import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "./hooks/useredux";
import { characters } from "./data/characters";
import CharacterCard from "./components/CharacterCard";
import SummonModal from "./components/SummonModal";
import { selectGems } from "./features/summon/summonSlice";

function App() {
  // Alias 'open' as 'isOpen' for Chakra UI compatibility
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const gems = useAppSelector(selectGems);

  return (
    <Container maxW="container.xl" py={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Star Rail Assistant Collection</Heading>
        <Box>
          <Text mb={1} fontWeight="bold">
            Gems: {gems}
          </Text>
          <Button colorScheme="purple" onClick={onOpen}>
            Open Summon
          </Button>
        </Box>
      </Flex>

      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
          xl: "repeat(6, 1fr)",
        }}
        gap={6}
      >
        {characters.map((char) => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </Grid>

      <SummonModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}

export default App;
