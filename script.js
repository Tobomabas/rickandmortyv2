const serverAdres = "http://localhost:3000";
const cardContainer = document.getElementById("main-wrapper");
const filterIinput = document.getElementById("filter-by-name-input");
const selectStatus = document.querySelectorAll('input[name="select"]');
const inputName = document.getElementById("input-name");
const deadOrAlive = document.getElementById("dead-or-alive");
const inputSpecies = document.getElementById("input-race");

let maxPages;
let page = 1;
let items = [];
let filterName = "";
let filterStatus = "";
let itemLimit = 5;
async function loadItems() {
  try {
    filterName = filterIinput.value.trim();
    const response = await fetch(
      `${serverAdres}/persons?name_like=${filterName}&_page=${page}&_limit=${itemLimit}&status_like=${filterStatus}`
    );
    totalItems = response.headers.get("X-Total-Count");
    const data = await response.json();
    console.log(data);
    items = data;
  } catch (err) {
    console.log("Problem z pobraniem elementów", err);
    filterName = "";
    filterStatus = "";
    return;
  }
  cardContainer.innerHTML = "";
  if (items.length === 0) {
    cardContainer.innerHTML =
      "Nie znaleziono postaci spełniających kryteria wyszukiwania";
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    const img = document.createElement("img");
    const cardName = document.createElement("div");
    const statGatContainer = document.createElement("div");
    const spanInCard = document.createElement("p");
    const spanInCard2 = document.createElement("p");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń Postać";
    deleteButton.onclick = () => deleteItem(item.id);
    deleteButton.className = "delete-button";
    card.classList.add("card");
    img.src = item.image;
    img.alt = item.name;
    cardName.classList.add("card-name");
    cardName.textContent = item.name;
    statGatContainer.classList.add("statgat");
    spanInCard.textContent = `Status: ${item.status}`;
    spanInCard2.textContent = `Gatunek: ${item.species}`;
    statGatContainer.append(spanInCard, spanInCard2);
    card.append(img, cardName, statGatContainer, deleteButton);
    cardContainer.appendChild(card);
  });
}
async function addItem() {
  postData = {
    name: inputName.value,
    status: deadOrAlive.value,
    species: inputSpecies.value,
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  };
  try {
    await fetch(`${serverAdres}/persons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
  } catch {
    err;
  }
  {
    console.log("Błąd w dodawaniu obiekty", err);
  }
}
async function deleteItem(id) {
  try {
    await fetch(`${serverAdres}/persons/${id}`, {
      method: "DELETE",
    });
    // Po usunięciu ładujemy ponownie książki
  } catch (err) {
    console.log("Błąd podczas usuwania książki", err);
  }
}
function nextPage() {
  let maxPages = totalItems / itemLimit;
  if (page < Math.ceil(maxPages)) {
    page++;
    loadItems();
  }
}

function prevPage() {
  if (page > 1) {
    page--;
    loadItems();
  }
}

filterIinput.addEventListener("input", () => {
  loadItems();
});

function getSelectedOption() {
  const selectedOption = document.querySelector('input[name="select"]:checked');
  return selectedOption ? selectedOption.value : "";
}

selectStatus.forEach((radio) => {
  radio.addEventListener("change", () => {
    page = 1;
    filterStatus = getSelectedOption();
    loadItems();
  });
});
loadItems();
