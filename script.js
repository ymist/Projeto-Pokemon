const pokemonCount = 150;
const typesCount = 18;
const cardArea = document.getElementById("pokemon-container");
const input = document.getElementById("search-poke");

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
	return data;
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
	/*Acessa a API pelo o 'id' de cada 'type' e cria um looping 
	para retornar cada nome de pokemon do tipo escolhido 
	e manda para a function getPokemons() para criar os cards dos pokemons */
	const idTypes = String(id || ""); //
	const URL = `https://pokeapi.co/api/v2/type/${idTypes}`;
	const resp = await fetch(URL);
	const data = await resp.json();
	let idPoke;
	for (i = 0; i <= 50; i++) {
		idPoke = data.pokemon[i].pokemon.name;
		getPokemons(idPoke);
	}
};
const select = document.getElementById("types"); // Reseta a tela toda vez que mudar o filtro dos pokemons.
const handleTypeFilter = async () => {
	const selectType = select.value;
	input.value = "";
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

// Barra de pesquisa

const searchPoke = () => {
	autoCompleteInput.innerHTML = "";
	cardArea.innerHTML = "";
	const searchInput = input.value.toLowerCase();
	const currentUrl = window.location.href.split("?")[0];
	const newUrl = `${currentUrl}?search=${searchInput}`;
	window.history.pushState({ searchReverted: true }, null, newUrl);
	getPokemons(searchInput);
};

input.addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		e.preventDefault()
		searchPoke();
		autoCompleteInput.innerHTML = ''
		input.value = ''
	}
});
const searchBtn = document.getElementById('search-btn')

searchBtn.addEventListener('click', ()=>{
	searchPoke()
})

const revertSearch = () => {
	input.value = "";
	searchPoke();

	if (select === "types") {
		fetchPokemons();
	} else {
		handleTypeFilter();
	}
	console.log(input.value);
};
window.addEventListener("popstate", (e) => {
	if (e.state && e.state.searchReverted) {
		revertSearch();
	}
});

const autoCompleteInput = document.getElementById("autocomplete");

const autocomplete = (item) => {
	autoCompleteInput.innerHTML =''
	const cardList = document.createElement("ul");
	const name = item.name[0].toUpperCase() + item.name.slice(1);
	const id = item.id.toString().padStart(3, 0);
	console.log(item);
	const pokeTypes = item.types.map((type) => type.type.name);
	const type = typesPoke.find((type) => pokeTypes.indexOf(type) > -1);
	const color = colors[type];
	cardList.style.backgroundColor = color;

	const itemList = `
				<li id="list-li">
					<img
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png"
						alt="${name}" />
					<div class="info-autocomplete">
						<span class="number-autocomplete">${id}</span>
						<span class="span-name">${name}</span>
						<span class="span-type">${type}</span>
					</div>
				</li>`;
	cardList.innerHTML = itemList;
	autoCompleteInput.appendChild(cardList);
	const listLi = document.getElementById("list-li");
	listLi.addEventListener("click", () => {
		searchPoke();
		listLi.style.display = 'none';
	});
};

let timeoutId;
input.addEventListener("input", async () => {
	clearTimeout(timeoutId);
	const inputTrim = input.value.trim();
	if (inputTrim.length < 3) {
		autoCompleteInput.innerHTML = "";
		return;
	}
	timeoutId = setTimeout(async () => {
		const URL = `https://pokeapi.co/api/v2/pokemon/${inputTrim.toLowerCase()}`;
		const resp = await fetch(URL);
		const results = await resp.json();
		console.log(resp.ok)
		console.log(results)
		if(resp.ok !== false){
			autocomplete(results);
		}
		
	}, 250);
});

document.addEventListener('click', (event) => {
	if(!autoCompleteInput.contains(event.target)){
		input.value = ''
		autoCompleteInput.innerHTML = ''
	}
})
