import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Image, Text, Spinner, Heading, List, ListItem, HStack, useToast } from '@chakra-ui/react';
import axios from 'axios';

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
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
    axios.all(apiList.map((film) => axios.get(film))).then(
        (data) => {
          console.log("Data: ", data)
          setFilms(data);
        },
      );
  }

  const fetchCharacter= () => {
    setLoading(true)
    axios.get(`https://swapi.dev/api/people/${id}/`)
    .then((res) => {
        console.log("Character Details: ", res);
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

  useEffect(() => {
    console.log("MovieList: ", films)
  }, [films])

  return (
    <Box p={8}>
      {loading ? (
        <Flex justify="center" align="center">
          <Spinner size="xl" />
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
        />
        <Heading as="h2" size="xl" textAlign="center">
          {character.name}
        </Heading>
      </Flex>
      <Box mb={8}>
        <Text fontSize="lg"><strong>Height:</strong> {character.height}</Text>
        <Text fontSize="lg"><strong>Mass:</strong> {character.mass}</Text>
        <Text fontSize="lg"><strong>Hair Color:</strong> {character.hair_color}</Text>
        <Text fontSize="lg"><strong>Skin Color:</strong> {character.skin_color}</Text>
        <Text fontSize="lg"><strong>Eye Color:</strong> {character.eye_color}</Text>
        <Text fontSize="lg"><strong>Birth Year:</strong> {character.birth_year}</Text>
        <Text fontSize="lg"><strong>Gender:</strong> {character.gender}</Text>
      </Box>
      <Heading as="h3" size="lg" mb={4}>Films</Heading>

      <Box overflowX="auto">
        <HStack spacing={4} py={4} minWidth="1000px">
          {films.map((film, index) => (
            <Box
              key={index}
              w="200px"
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
            >
              <Image
                src={moviePosters[film.data.title]}
                alt={film.data.title}
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                mb={4}
              />
              <Text fontWeight="bold" fontSize="lg">{film.data.title}</Text>
              <Text fontSize="md">Release Date: {film.data.releaseDate}</Text>
            </Box>
          ))}
        </HStack>
      </Box>

        </Box>
      )}
    </Box>
  );
};

export default CharacterDetails;
