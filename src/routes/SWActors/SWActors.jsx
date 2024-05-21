import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Image, Text, Button, Spinner, Heading, IconButton, useToast, useDisclosure, ScaleFade, SimpleGrid, Tooltip } from '@chakra-ui/react';
import { StarIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {ReactComponent as HelmetIcon} from '../../icons/helmet.svg'
import axios from 'axios';

const SWActors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure()

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    fetchActors()
  }, [currentPage])

  const fetchActors = () => {
    setLoading(true);
    axios.get(`https://swapi.dev/api/people/?page=${currentPage}`)
    .then((res) => {
        setActors(res.data.results);
        setLoading(false);
        onToggle()
        console.log("Dataaaaa: ", res.data.results)
    })
    .catch((err) => {
        toast({
          title: "Can't fetch data",
          description: `Are you connected to the internet?`,
          status: "warning",
          duration: 5000,
          isClosable: false,
      })
    })
  }

  const toggleFavorite = (character) => {
    const updatedFavorites = favorites.includes(character)
      ? favorites.filter((fav) => fav !== character)
      : [...favorites, character];
      
    toast({
        title: updatedFavorites.includes(character) ? "Added to favorites" : "Removed from favorites",
        description: `${character} has been ${updatedFavorites.includes(character) ? "added to" : "removed from"} your favorites.`,
        status: "success",
        duration: 3000,
        isClosable: true,
    });

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
  <Box p={8} bg="gray.50" minH="100vh">
    <Heading as="h1" size="2xl" mb={8} textAlign="center" color="teal.500">
        Star Wars
    </Heading>
  {loading ? (
    <Flex justify="center" align="center" height="50vh">
      <Spinner size="xl" color="teal.500" />
    </Flex>
  ) : (
    <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={8}>
      {actors.map((actor) => (
        <Box
          key={actor.name}
          w="100%"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          textAlign="center"
          position="relative"
          bg="white"
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.05)' }}
        >
          <ScaleFade initialScale={0.9} in={!loading}>
            <Tooltip label={favorites.includes(actor.name) ? "Remove from favorites" : "Add to favorites"}>
              <IconButton
                icon={<StarIcon />}
                colorScheme={favorites.includes(actor.name) ? "yellow" : "gray"}
                isRound
                size="sm"
                position="absolute"
                top={2}
                right={2}
                onClick={() => toggleFavorite(actor.name)}
                _focus={{ boxShadow: "none" }}
              />
            </Tooltip>
            <Link to={`/character/${actor.url.match(/\d+/)[0]}`}>
              <Image
                src={`https://starwars-visualguide.com/assets/img/characters/${actor.url.match(/\d+/)[0]}.jpg`}
                alt={actor.name}
                mb={4}
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                mx="auto"
              />
              <Text fontWeight="bold" fontSize="lg" color="gray.700">
                {actor.name}
              </Text>
            </Link>
          </ScaleFade>
        </Box>
      ))}
    </SimpleGrid>
  )}
  <Flex justifyContent="space-between" mt={8}>
    <Button
      leftIcon={<ArrowBackIcon />}
      onClick={() => {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          toast({
            title: "Can't go to the previous page",
            description: "You are already on the first page.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }}
      colorScheme="teal"
      variant={currentPage === 1 ? "outline" : "solid"}
      size='md'
    >
      Previous
    </Button>
    <Button
      rightIcon={<ArrowForwardIcon />}
      onClick={() => setCurrentPage((prev) => prev + 1)}
      colorScheme="teal"
      variant="solid"
    >
      Next
    </Button>
  </Flex>
</Box>
  );
};

export default SWActors;
