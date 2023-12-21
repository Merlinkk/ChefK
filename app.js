const title = document.getElementById("recipeName"); // <input id="recipeName" type="text" />
const foodImg = document.getElementById("mainImg"); // <img id="mainImg">
const foodContainerMain = document.querySelector(".recipeContainer"); // <div id="foodContainerMain">
const popup = document.getElementById("popup");
const popupName = document.getElementById("popupName");
const foodVideo = document.querySelector("iframe");
const popupImgLink = document.getElementById("imgLink");
const cross1 = document.getElementById("cross1");
const cross2 = document.getElementById("cross2");

const youtubeLink = document.getElementById('yLink')

// const youtube = document.getElementById("yTlogo");

const fail = document.getElementById("fail");

const searchBtn = document.getElementById("btn1");

const ingredientList = document.getElementById("ingList");
const instructions = document.getElementById("instPara");

const popupImg = document.getElementById("popupImg"); // <img id="popupImg">
const discover = document.getElementById("discover"); // <button id="discover">

const loader = document.getElementById("loader");
const mealText = document.querySelector(".mealText");

// youtube.style.display = "none";

loader.style.display = "flex";
fetchMeal(title, foodImg);

fail.style.display = "none";

function fetchMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => data.meals[0])
    .then((data) => {
      renderMeal(data);
      renderInstructions(data);
      console.log(ingredientsData(data));
      renderIngredients(renderIngredientImage(data), ingredientsData(data));
      loader.style.display = "none";
      foodContainerMain.style.display = "flex";
      mealText.innerHTML =
        "Delve into today's culinary adventure with our featured recipe, Bon appétit!";
      console.log(data);
      title.innerHTML = data.strMeal;
      foodImg.src = data.strMealThumb;
      foodImg.addEventListener("click", () => {
        fetchByID(data.idMeal);
        popup.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    })
    .catch((err) => {
      loader.style.display = "none";
      console.error(err);
    });
}

function renderMeal(data) {
  popupImg.src = data.strMealThumb;
  popupName.innerHTML = data.strMeal;
  popupImgLink.href = data.strSource;

  youtubeLink.href = data.strYoutube

  document.getElementById("areaIN").innerHTML = data.strArea;
  document.getElementById("catIN").innerHTML = data.strCategory;

  foodVideo.setAttribute(
    "src",
    `https://www.youtube.com/embed/${videoId(data.strYoutube)}`
  );
}

function videoId(url) {
  const parts = url.split("=");
  const videoId = parts[parts.length - 1];

  return videoId;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popup.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

cross1.addEventListener("click", () => {
  popup.style.display = "none";
  document.body.style.overflow = "auto";
});
cross2.addEventListener("click", () => {
  popup.style.display = "none";
  document.body.style.overflow = "auto";
});

function fetchIngredientImage(ingredient) {
  return `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;
}

function ingredientsData(data) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients.push(
        `${data[`strIngredient${i}`]} - ${data[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  return ingredients;
}

function renderIngredientImage(data) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients.push(fetchIngredientImage(data[`strIngredient${i}`]));
    } else {
      break;
    }
  }
  return ingredients;
}

function renderIngredients(imageLinks, ingredients) {
  ingredientList.innerHTML=""
  for (let i = 0; i < ingredients.length; i++) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");
    img.src = imageLinks[i];
    span.innerHTML = ingredients[i];
    li.appendChild(img);
    li.appendChild(span);
    ingredientList.appendChild(li);
  }
}

function renderInstructions(data) {
  let str = data.strInstructions;

  instructions.innerText = str;
}

const searchResults = document.getElementById("searchResults");
const searchGlass = document.getElementById("searchGlass");
const resultList = document.getElementById("resultContainer");

searchResults.style.display = "none";

searchGlass.addEventListener("click", () => {
  document.getElementById("searchResults").style.display = "initial";
  let query = document.getElementById("search").value;
  document.getElementById("searchRl").innerHTML = `${query}:`;
  loader.style.display = "flex";
  fetchByCategory(query);
  scroll(searchResults);
});

searchBtn.addEventListener("click", () => {
  document.getElementById("searchResults").style.display = "initial";
  let query = document.getElementById("search").value;
  document.getElementById("searchRl").innerHTML = `${query}:`;
  loader.style.display = "flex";
  fetchByCategory(query);
  scroll(searchResults);
});

function fetchByCategory(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
      fail.style.display = "none";
      console.log(data.meals);
      return data.meals;
    })
    .then((meals) => {
      renderFoodArray(meals);
      loader.style.display = "none";
    })
    .catch((err) => {
      loader.style.display = "none";
      fail.style.display = "initial";
    });
}

function renderFoodArray(meals) {
  resultList.innerHTML = "";
  for (let i = 0; i < meals.length; i++) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");
    img.src = meals[i].strMealThumb;
    span.innerHTML = meals[i].strMeal;
    li.setAttribute("onclick", `fetchPopUp(${meals[i].idMeal})`);
    li.appendChild(img);
    li.appendChild(span);
    resultList.appendChild(li);
    searchResults.style.display = "flex";
  }
  // console.log(meals[0].strMeal)
}
//

function fetchPopUp(Id) {
  fetchByID(Id);
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function fetchByID(Id) {
  loader.style.display = "flex";
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${Id}`)
    .then((res) => res.json())
    .then((data) => {
      renderMeal(data.meals[0]);
      renderIngredients(renderIngredientImage(data.meals[0]), ingredientsData(data.meals[0]));
      renderInstructions(data.meals[0]);
      loader.style.display = "none";
      popup.style.display = "flex";
      document.body.style.overflow = "hidden";
      // scroll(document.getElementById("arrow"));
    });
}

function scroll(dest) {
  const target = document.documentElement;
  dest.scrollIntoView({ behavior: "smooth" });
}

discover.addEventListener("click", () => {
  loader.style.display='flex'
  fetchMeal(title, foodImg);
  scroll(foodImg);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchResults").style.display = "initial";
    let query = document.getElementById("search").value;
    document.getElementById("searchRl").innerHTML = `${query}:`;
    loader.style.display = "flex";
    fetchByCategory(query);
    scroll(searchResults);
  }
});
