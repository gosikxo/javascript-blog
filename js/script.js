'use strict';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function addEventListenersToLinks(){ 
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks() {
  let html = ''; 
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector); 
  titleList.innerHTML = '';
  
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;  
    /* create HTML of the link */
    const linkHTML = '<li><a class="article-link" href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    
    /* insert link into titleList */
    html = html + linkHTML;
    
  }
  titleList.innerHTML = html;

  addEventListenersToLinks();
}

generateTitleLinks();

function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll('article');
  /* START LOOP: for every article: */
  for (const article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */

    /* split tags into array */
    const tags = article.dataset.tags.split(' ');
    /* START LOOP: for each tag */
    for(const tag of tags) {
      /* generate HTML of the link */
      const tagHTML = "<li><a>" + tag + "</a></li>";
      /* add generated code to html variable */
      html += tagHTML;
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
}
}
generateTags();