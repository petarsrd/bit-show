const nav = document.createElement("div");
const footer = document.createElement("div");
const logo = document.createElement("span");
const title = document.createElement("span");
const search = document.createElement("input");

title.textContent = "BitShow";
logo.textContent = "Copyright @Petar Srdanovic 2022";
search.setAttribute("placeholder", "search");
nav.append(title);
nav.append(search);
footer.append(logo);

document.body.append(nav);

nav.classList.add("nav");
footer.classList.add("footer");
const main = document.createElement("div");
main.classList.add("main");
document.body.append(main);
const wrapper = document.createElement("div");
// -----------------------------
function renderSeasons(data) {
    let heading = document.createElement("h3");
    heading.textContent = `Seasons (${data.length})`;
    let lista = document.createElement("ul");
    lista.append(heading);
    data.forEach((e) => {
        let sezona = document.createElement("li");
        sezona.innerHTML += `${e.premiereDate} - ${e.endDate}`;
        lista.append(sezona);
    });
    wrapper.append(lista);
}

function getSeasons(objekat) {
    fetch(`https://api.tvmaze.com/shows/${objekat.id}/seasons`).then((res) => res.json()).then((data) => renderSeasons(data));
}

function renderCast(data) {
    let heading = document.createElement("h3");
    heading.textContent = `Cast`;
    let lista = document.createElement("ul");
    lista.append(heading);
    data.forEach((e) => {
        let actor = document.createElement("li");
        actor.innerHTML += `${e.person.name}`;
        lista.append(actor);
    }) 
    wrapper.append(lista);
}

function getCast(objekat) {
    fetch(`https://api.tvmaze.com/shows/${objekat.id}/cast`).then((res) => res.json()).then((data) => renderCast(data));
}

function createCard(obj) {
    let card = document.createElement("div");
    let img = document.createElement("img");
    let title = document.createElement("p");
    img.setAttribute("src", obj.image.medium);
    title.textContent = obj.name;
    card.append(img);
    card.append(title);
    card.addEventListener("click", () => {
        main.innerHTML = "";
        wrapper.innerHTML = "";
        main.append(title);
        main.append(img);
        getSeasons(obj);
        getCast(obj);
        main.append(wrapper);
        main.classList.add("info-div");
        let summary = document.createElement("p");
        summary.innerHTML = `<h3>Show Details</h3> <br> ${obj.summary}`;
        main.append(summary);
    })
    main.append(card);
}

function handleRequest(data) {
    data.sort((a, b) => b.rating.average - a.rating.average).slice(0, 51).forEach((e) => createCard(e));
}

function handleResponse() {
    fetch(`https://api.tvmaze.com/shows`).then((response) => response.json()).then((data) => handleRequest(data));
}
window.addEventListener("load", handleResponse);

search.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        main.classList.remove("info-div");
        main.innerHTML = "";
        let query = search.value;
        fetch(`https://api.tvmaze.com/search/shows/?q=${query}`).then((res) => res.json()).then((data) => data.forEach((e) => createCard(e.show)));
    }
})
// -------------------------
document.body.append(footer);