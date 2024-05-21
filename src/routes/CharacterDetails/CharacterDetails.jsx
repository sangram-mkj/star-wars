import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Image, Text, Spinner, Heading, HStack, VStack, useToast, Divider, IconButton, SimpleGrid, Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { ArrowBackIcon } from '@chakra-ui/icons';

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieLoading, setMovieLoading] = useState(true)
  const [apiList, setApiList] = useState([])
  const [films, setFilms] = useState([]);

  const toast = useToast();

  const moviePosters = {
    "A New Hope": "https://starwars-visualguide.com/assets/img/films/1.jpg",
    "The Empire Strikes Back": "https://starwars-visualguide.com/assets/img/films/2.jpg",
    "Return of the Jedi": "https://starwars-visualguide.com/assets/img/films/3.jpg",
    "The Phantom Menace": "https://starwars-visualguide.com/assets/img/films/4.jpg",
    "Attack of the Clones": "https://starwars-visualguide.com/assets/img/films/5.jpg",
    "Revenge of the Sith": "https://starwars-visualguide.com/assets/img/films/6.jpg",
    "The Force Awakens": "https://starwars-visualguide.com/assets/img/films/7.jpg",
    "The Last Jedi": "https://starwars-visualguide.com/assets/img/films/8.jpg",
    "The Rise of Skywalker": "https://starwars-visualguide.com/assets/img/films/9.jpg",
  };

  const fetchFilms = (apiList) => {
    setMovieLoading(true)
    axios.all(apiList.map((film) => axios.get(film)))
    .then((data) => {
        setFilms(data);
        setMovieLoading(false)
    })
    .catch((err) => {
      console.log("Error while fetching movie list: ", err);
      toast({
        title: "Can't fetch Movie list",
        description: `Please refresh the page`,
        status: "warning",
        duration: 5000,
        isClosable: false,
    })
    })
  }

  const fetchCharacter = () => {
    setLoading(true)
    axios.get(`https://swapi.dev/api/people/${id}/`)
    .then((res) => {
        // console.log("Character Details: ", res);
        setApiList(res.data.films)
        setCharacter(res.data);
        setLoading(false)
    })
    .catch((err) => {
        console.log("Error in fetching character details: ", err)
        toast({
          title: "Can't fetch data",
          description: `Are you connected to the internet?`,
          status: "warning",
          duration: 8000,
          isClosable: false,
      })
    })
  }

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  useEffect(() => {
    fetchFilms(apiList);
  }, [apiList])

  return (
    <Box
      p={8}
      bgImage="url('https://images4.alphacoders.com/134/thumb-1920-1347937.png')"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      color="white"
      position="relative"
    >
      <Box bg="rgba(0, 0, 0, 0.8)" p={8} borderRadius="lg" maxWidth="1000px" mx="auto">
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          aria-label="Back"
          position="absolute"
          top={4}
          left={4}
          colorScheme="teal"
        />
        {loading ? (
          <Flex justify="center" align="center" height="50vh">
            <Spinner size="xl" color="teal.300" />
          </Flex>
        ) : (
          <Box>
            <Flex justify="center" align="center" direction="column" mb={6}>
              <Image
                src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
                alt={character.name}
                borderRadius="full"
                boxSize="200px"
                objectFit="cover"
                mb={4}
                border="2px solid teal"
              />
              <Heading as="h2" size="xl" textAlign="center" color="teal.300">
                {character.name}
              </Heading>
            </Flex>
            <Box mb={8} p={4} bg="rgba(255, 255, 255, 0.2)" borderRadius="md">
              <VStack spacing={2} align="start">
                <Text fontSize="lg"><strong>Height:</strong> {character.height}</Text>
                <Text fontSize="lg"><strong>Mass:</strong> {character.mass}</Text>
                <Text fontSize="lg"><strong>Hair Color:</strong> {character.hair_color}</Text>
                <Text fontSize="lg"><strong>Skin Color:</strong> {character.skin_color}</Text>
                <Text fontSize="lg"><strong>Eye Color:</strong> {character.eye_color}</Text>
                <Text fontSize="lg"><strong>Birth Year:</strong> {character.birth_year}</Text>
                <Text fontSize="lg"><strong>Gender:</strong> {character.gender}</Text>
              </VStack>
            </Box>
            <Divider my={6} borderColor="teal.300" />
            <Heading as="h3" size="lg" mb={4} color="teal.300">Films Appreared in:</Heading>
            <Box overflowX="auto">
              {movieLoading ? (
                <Flex justify="center" align="center" height="50vh">
                <Spinner size="xl" color="teal.300" />
              </Flex>
              ) : (
                <HStack spacing={4} py={4} minWidth="1000px">
                {films.map((film, index) => (
                  <Box
                    key={index}
                    minW="200px"
                    h="300px"
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="md"
                    textAlign="center"
                    bg="rgba(255, 255, 255, 0.8)"
                    color="black"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Tooltip label={film.data.title}>
                    <Image
                      src={moviePosters[film.data.title]}
                      alt={film.data.title}
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="md"
                      mb={4}
                      alignSelf="center"
                    />
                    </Tooltip>
                    <Text fontWeight="bold" fontSize="lg" mb={2}>{film.data.title}</Text>
                    <Text fontSize="sm">Release Date: {film.data.release_date}</Text>
                  </Box>
                ))}
              </HStack>
              )}              
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CharacterDetails;