import './style.css'

const gridLayout = document.querySelector('.grid-layout');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const typeFilter = document.getElementById('type-filter');
const minWeightFilter = document.getElementById('min-weight-filter');
const minHeightFilter = document.getElementById('min-height-filter');
const clearButton = document.getElementById('clear-button');
let initialPokemonList = [];

async function getPokemonList() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=3000');
        if (!response.ok) throw new Error('No se pudo obtener la lista de Pokémon');
        const data = await response.json();
        const promises = data.results.map(pokemon => getPokemonDataByUrl(pokemon.url));
        initialPokemonList = await Promise.all(promises);

        displayInitialPokemons();
    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
        showAlert("Error al obtener la lista de Pokémon. Inténtalo más tarde.", "warning");
    }
}

async function getPokemonDataByUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos del Pokémon:', error);
        return null;
    }
}

function createPokemonCard(pokemon) {
    const card = document.createElement('article');
    card.classList.add('card');
    const pokemonName = pokemon.name.toUpperCase();
    const pokemonId = `#${pokemon.id}`;
    const pokemonImage = pokemon.sprites.front_default;
    const pokemonTypes = pokemon.types.map(type => type.type.name).join(', ');
    const pokemonAbilities = pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('');
    const pokemonStats = pokemon.stats.map(stat => {
        const statName = stat.stat.name.replace(/\b[a-z]/gi, match => match.toUpperCase());
        const statValue = stat.base_stat;
        return `<div class="stat"><span><b>${statName}</b></span><span>${statValue}</span></div>`;
    }).join('');
    const PokemonTypeFirst = pokemon.types[0].type.name;
    const PokemonTypeColors = {
        fire: '#EE8130',
        grass: '#7AC74C',
        eletric: '#F7D02C',
        water: '#6390F0',
        ground: '#E2BF65',
        rock: '#B6A136',
        fairy: '#D685AD',
        poison: '#A33EA1',
        bug: '#A6B91A',
        dragon: '#6F35FC',
        psychic: '#F95587',
        flying: '#A98FF3',
        fighting: '#C22E28',
        normal: '#A8A77A',
        ice: '#96D9D6',
        ghost: '#735797',
        dark: '#705746',
        steel: '#B7B7CE',
    };
    const AddColors = PokemonTypeColors[PokemonTypeFirst];
    
    card.innerHTML = `
    <div class="pokemon-card">
        <img class="pokemon-image" src="${pokemonImage}" alt="${pokemonName}"> 
        <h2 class="pokemon-name">${pokemonName}</h2>
        <div class="pokemon-info">
            <p><b>${pokemonId}</b></p>
            <div>
                <span class="pokemon-type">Type: ${pokemonTypes}</span>
            </div>
        </div>
        <p><b>Weight:</b> ${pokemon.weight} kg</p>
        <p><b>Height:</b> ${pokemon.height} cm</p>
        <h3>Abilities</h3>
        <ul class="pokemon-abilities">
            ${pokemonAbilities}
        </ul>
        <h3>Stats</h3>
        <div class="pokemon-stats">
            ${pokemonStats}
        </div>
    </div>
    `;

    card.style.background = AddColors;
    gridLayout.appendChild(card);
}

function searchPokemon() {
    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue) {
        const filteredPokemons = initialPokemonList.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchValue)
        );
        clearGrid();
        filteredPokemons.forEach(createPokemonCard);
    } else {
        displayInitialPokemons();
    }
}

function clearGrid() {
    gridLayout.innerHTML = '';
}

function displayInitialPokemons() {
    clearGrid();
    initialPokemonList.forEach(createPokemonCard);
}

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.createElement('p');
    const closeButton = document.createElement('button');
    const alertDiv = document.createElement('div');

    alertDiv.classList.add('alert', `alert-${type}`);
    alertMessage.textContent = message;
    alertDiv.appendChild(alertMessage);

    alertContainer.appendChild(alertDiv);

    closeButton.textContent = 'Aceptar';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        alertContainer.removeChild(alertDiv);
    });

    alertDiv.appendChild(closeButton);
    setTimeout(() => {
        alertContainer.removeChild(alertDiv);
    }, 3000);

    
}

function filterPokemon() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    const minWeight = parseFloat(minWeightFilter.value); 
    const minHeight = minHeightFilter.value; 

    const filteredPokemons = initialPokemonList.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(searchValue);
        const matchesType = selectedType ? pokemon.types.some(type => type.type.name === selectedType) : true;
        const matchesWeight = minWeight ? pokemon.weight >= minWeight : true;
        const matchesHeight = minHeight ? pokemon.height >= minHeight : true;

        return matchesName && matchesType && matchesWeight && matchesHeight;
    });

    clearGrid();
    filteredPokemons.forEach(createPokemonCard);
}

function clearInputs(){
    searchInput.value = '';
    typeFilter.value = '';
    minWeightFilter.value = '';
    minHeightFilter.value = '';
}


//applyFiltersButton.addEventListener('click', filterPokemon);
searchButton.addEventListener('click', filterPokemon);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterPokemon();
    }
});
clearButton.addEventListener('click', clearInputs);
document.addEventListener('DOMContentLoaded', getPokemonList);