import './style.css'

const gridLayout = document.querySelector('.grid-layout');
const fetchNumberPokemons = 20;

// Función para obtener datos de un Pokémon
// Función para obtener datos de un Pokémon
async function getPokemonData(pokemonId) {
  try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      
      if (!response.ok) throw new Error('Pokémon no encontrado');
      
      const data = await response.json();
      createPokemonCard(data);

  } catch (error) {
      console.error('Error al obtener los datos del Pokémon:', error);
  }
}


// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('article');
    card.classList.add('card');

    card.innerHTML = `
        <h3>${pokemon.name.toUpperCase()}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Altura: ${pokemon.height}</p>
        <p>Peso: ${pokemon.weight}</p>
    `;

    gridLayout.appendChild(card);
}

// Función para cargar múltiples Pokémon (ejemplo con los primeros 10)
async function loadPokemons() {
    for (let i = 1; i <= fetchNumberPokemons; i++) {
        await getPokemonData(i);
    }
}

// Cargar Pokémon al iniciar la página
document.addEventListener('DOMContentLoaded', loadPokemons);
