import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Image, Text, Button, Spinner, Heading, IconButton, useToast, SimpleGrid } from '@chakra-ui/react';
import { StarIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import axios from 'axios';

const SWActors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const toast = useToast();

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
    <Box p={8}>
    <Heading as="h1" size="xl" mb={6} textAlign="center">
      Star Wars Characters
    </Heading>
    {loading ? (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    ) : (
        <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={6}>
        {actors.map((actor) => (
          <Box
            key={actor.name}
            w="250px"
            mb={6}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            textAlign="center"
            position="relative"
            bg="white"
          >
            <IconButton
              icon={<StarIcon />}
              colorScheme={favorites.includes(actor.name) ? "yellow" : "gray"}
              isRound
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => toggleFavorite(actor.name)}
            />
            <Link to={`/character/${actor.url.match(/\d+/)}`}>
                <Image
                src={`https://starwars-visualguide.com/assets/img/characters/${actor.url.match(/\d+/)}.jpg`}
                alt={actor.name}
                mb={4}
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                mx="auto"
                />
                <Text fontWeight="bold" fontSize="lg">
                {actor.name}
                </Text>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    )}
    <Flex justifyContent="space-between" mt={8}>
      <Button
        leftIcon={<ArrowBackIcon />}
        onClick={() => {
            currentPage === 1 ? toast({
                title: "Can't go to the previous page",
                description: `You are already at the first page.`,
                status: "info",
                duration: 3000,
                isClosable: true,
            }) : setCurrentPage((prev) =>Math.max(prev - 1, 1))}            
        }
      >
        Previous
      </Button>
      <Button rightIcon={<ArrowForwardIcon />} onClick={() => setCurrentPage((prev) => prev + 1)}>
        Next
      </Button>
    </Flex>
  </Box>
  );
};

export default SWActors;
