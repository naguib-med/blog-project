import { async } from "regenerator-runtime";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainer = document.querySelector(".articles-container");

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

const fetchArticle = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/article");
    const articles = await response.json();
    console.log(articles);
    // articles.isArray ? createArticles([articles]) : createArticles(articles);
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
