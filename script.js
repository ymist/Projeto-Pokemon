const pokemonCount = 10;
const typesCount = 18;
const cardArea = document.getElementById("pokemon-container");

const colors = {
	fire: "#FDDFDF",
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
	const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const resp = await fetch(URL);
	const data = await resp.json();
	createPokemonCard(data);
};

const fetchPokemons = async () => {
	for (let i = 1; i <= pokemonCount; i++) {
		await getPokemons(i);
	}
};

const createPokemonCard = (poke) => {
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
	const urlFilter = `https://pokeapi.co/api/v2/type/${idTypes}`;
	const resp = await fetch(urlFilter);
	const data = await resp.json();
	console.log(data.name);
	createTypesFilter(data);
};

const fetchTypes = async () => {
	for (let i = 1; i <= typesCount; i++) {
		await getTypes(i);
	}
};
const createTypesFilter = (type) => {
	const select = document.getElementById("types");
	const createOption = document.createElement("option");
	createOption.value = type.id;
	createOption.textContent = type.name[0].toUpperCase() + type.name.slice(1);
	select.appendChild(createOption);
};

const requisitionByFilter = async (id) => {
	const idTypes = String(id || "");
	const URL = `https://pokeapi.co/api/v2/type/${idTypes}`;
	const resp = await fetch(URL);
	const data = await resp.json();
	let idPoke;
	for (i = 0; i <= 40; i++) {
		idPoke = data.pokemon[i].pokemon.name;
		getPokemons(idPoke);
	}
};

const createCardByFilter = (data) => {};

const select = document.getElementById("types");
select.addEventListener("change", async () => {
	const selectType = select.value;
	if (selectType !== "types") {
		requisitionByFilter(selectType);
		cardArea.innerHTML = "";
	} else {
		cardArea.innerHTML = "";
		fetchPokemons();
	}
});

fetchTypes();

window.addEventListener("DOMContentLoaded", async () => {
	const option = document.getElementById("option-id");
	if (option.value === "types") {
		await fetchPokemons();
	}
});
