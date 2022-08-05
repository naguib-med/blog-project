import { async } from "regenerator-runtime";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainer = document.querySelector(".articles-container");
const categoriesContainer = document.querySelector(".categories");

const createArticles = (articles) => {
  const articlesDOM = articles.map((article) => {
    const articleDOM = document.createElement("div");
    articleDOM.classList.add("article");
    articleDOM.innerHTML = `
      <img
        src="${article.img}"
        alt="profile"
      />
      <h2>${article.title}</h2>
      <p class="article-author">${article.author} - ${new Date(
      article.createdAt
    ).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}</p>
      <p class="article-content">
       ${article.content}
      </p>
  
      <div class="article-actions">
        <button class="btn btn-primary" data-id=${article._id}>Modifier</button>
        <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
      </div>
  
      `;

    return articleDOM;
  });

  articleContainer.innerHTML = "";
  articleContainer.append(...articlesDOM);

  const deleteButtons = articleContainer.querySelectorAll(".btn-danger");
  const editButtons = articleContainer.querySelectorAll(".btn-primary");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.target;
      const articleId = target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const target = event.target;
        const articleId = target.dataset.id;
        const response = await fetch(
          `https://restapi.fr/api/article/${articleId}`,
          {
            method: "DELETE",
          }
        );

        const body = await response.json();
        fetchArticle();
      } catch (error) {
        console.log("error", error);
      }
    });
  });
};

const displayMenuCategories = (categoriesArray) => {
  const liElements = categoriesArray.map((category) => {
    const li = document.createElement("li");
    li.innerHTML = `<li>${category[0]} (<strong>${category[1]}</strong>)</li>`;
    return li;
  });

  categoriesContainer.innerHTML = "";
  categoriesContainer.append(...liElements);
};

const createMenuCategories = (articles) => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category] += 1;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArray = Object.keys(categories).map((category) => {
    return [category, categories[category]];
  });

  displayMenuCategories(categoriesArray);
};

const fetchArticle = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/article");
    const articles = await response.json();

    createMenuCategories(articles);

    if (articles.length > 1) {
      createArticles(articles);
    } else {
      createArticles([articles]);
    }
  } catch (error) {
    console.log("error", error);
  }
};

fetchArticle();
