const pokemonCount = 10;
const typesCount = 18;
const cardArea = document.getElementById("pokemon-container");

const colors = {
	fire: "#FDDFDF", // Array com cores para definir o background para cada tipo de pokemon.
	grass: "#DEFDE0",
	electric: "#FCF7DE",
	water: "#DEF3FD",
	ground: "#f4e7da",
	rock: "#d5d5d4",
	fairy: "#fceaff",
	poison: "#98d7a5",
	bug: "#f8d5a3",
	dragon: "#97b3e6",
	psychic: "#eaeda1",
	flying: "#F5F5F5",
	fighting: "#E6E0D4",
	normal: "#F5F5F5",
	dark: "#424347",
	ghost: "#003264",
	steel: "#253647",
	ice: "#B5E2F4",
};

const typesPoke = Object.keys(colors);

const getPokemons = async (id) => {
	// Puxa os dados dos pokemons por "id" ou "name" e retorna seus dados na createPokemonCard()
	const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const resp = await fetch(URL);
	const data = await resp.json();
	createPokemonCard(data);
};

const fetchPokemons = async () => {
	// Cria um looping para retornar todos os "id" de "pokemonCount" para "getPokemons()"
	for (let i = 1; i <= pokemonCount; i++) {
		await getPokemons(i);
	}
};

const createPokemonCard = (poke) => {
	// Cria o card de cada pokemon buscado tanto por 'type' tanto pela barra de pesquisa.
	const card = document.createElement("div");
	card.classList.add("cardInfo");

	const name = poke.name[0].toUpperCase() + poke.name.slice(1);
	const id = poke.id.toString().padStart(3, 0);

	const pokeTypes = poke.types.map((type) => type.type.name);
	const type = typesPoke.find((type) => pokeTypes.indexOf(type) > -1);
	const color = colors[type];
	card.style.backgroundColor = color;

	const pokemonInnerHtml = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}" class="imgCard">
        <span class="number">${id}</span>
        <div class="pokeInfo">
            <h3 class="titlePokemon">${name}</h3>
            <small class="type">Tipo: <span class="type-span">${type}</span></small>
        </div>`;
	card.innerHTML = pokemonInnerHtml;

	cardArea.appendChild(card);
};

const getTypes = async (idTypes) => {
	// Busca na api todos os 'types' dos pokemons e retorna todos os pokemons de cada tipo
	const urlFilter = `https://pokeapi.co/api/v2/type/${idTypes}`;
	const resp = await fetch(urlFilter);
	const data = await resp.json();
	console.log(data.name);
	createTypesFilter(data);
};

const fetchTypes = async () => {
	// Cria um looping para acessar cada 'type' que existe na API.
	for (let i = 1; i <= typesCount; i++) {
		await getTypes(i);
	}
};

const createTypesFilter = (type) => {
	// Cria os itens do select para filtrar os 'types'
	const select = document.getElementById("types");
	const createOption = document.createElement("option");
	createOption.value = type.id;
	createOption.textContent = type.name[0].toUpperCase() + type.name.slice(1);
	select.appendChild(createOption);
};

const filterByType = async (id) => {
	//Acessa a API pelo o 'id' de cada 'type'
	const idTypes = String(id || ""); //e cria um looping para retornar cada nome de pokemon do tipo escolhido
	const URL = `https://pokeapi.co/api/v2/type/${idTypes}`; //e manda para a function getPokemons() para criar os cards dos pokemons
	const resp = await fetch(URL);
	const data = await resp.json();
	let idPoke;
	for (i = 0; i <= 99; i++) {
		idPoke = data.pokemon[i].pokemon.name;
		getPokemons(idPoke);
	}
};
const select = document.getElementById("types"); // Reseta a tela toda vez que mudar o filtro dos pokemons.
const handleTypeFilter = async () => {
	const selectType = select.value;
	if (selectType !== "types") {
		filterByType(selectType);
		cardArea.innerHTML = "";
	} else {
		cardArea.innerHTML = "";
		await fetchPokemons();
	}
};
select.addEventListener("change", handleTypeFilter);

window.addEventListener("DOMContentLoaded", async () => {
	// Faz rodar a function principal para que possa ver os pokemons na tela inicial.
	const option = document.getElementById("option-id");
	if (option.value === "types") {
		await fetchPokemons();
	}
});

fetchTypes();
