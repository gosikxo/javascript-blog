'use strict';

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorsSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassPrefix: 'tag-size-',
  authorsSelector: '.authors.list',
}

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorLinks: Handlebars.compile(document.querySelector('#template-authorlinks').innerHTML),
}

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

function addEventListenersToLinks() {
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}



function generateTitleLinks(customSelector = '') {
  let html = '';
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    html = html + linkHTML;

  }
  console.log({html});
  titleList.innerHTML = html;

  addEventListenersToLinks();
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const relativeValue = count / params.max;
  const range = params.max - params.min;
  return `${opts.cloudClassPrefix}${Math.floor(relativeValue * range + params.min)}`;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (const article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */

    /* split tags into array */
    const tags = article.dataset.tags.split(' ');
    /* START LOOP: for each tag */
    for (const tag of tags) {
      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: `tag-${tag}`, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      // if (!allTags.hasOwnProperty(tag)) {
      if (!Object.prototype.hasOwnProperty.call(allTags, tag)) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  /*[NEW] create variable for all links HTML code*/
  const allTagsData = { tags: [] };
  /*[NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /*[NEW] END LOOP: for each tag in allTags: */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);

}
generateTags();

function generateAuthors() {

  const allAuthorsData = {authors: []};
  const allAuthors= [];

  const articles = document.querySelectorAll(opts.articleSelector);

  let html = '';

  for (const article of articles) {
    const author = article.dataset.author;

    if (!Object.prototype.hasOwnProperty.call(allAuthors, author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }

  for (const author in allAuthors) {
    console.log(author, allAuthors);
    //const linkHTML = `<li><a class="${calculateTagsParams(allAuthors)}" href="#author-${author}">${author}</a><li>`;
    //html += linkHTML;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }

  const authorsWrapper = document.querySelector(opts.authorsSelector);

  //authorsWrapper.innerHTML = html;
  console.log(templates.authorLinks(allAuthorsData));
  authorsWrapper.innerHTML = templates.authorLinks(allAuthorsData);
}
generateAuthors();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (const activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */

  const sameTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (const sameTagLink of sameTagLinks) {
    /* add class active */
    sameTagLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (const link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  }
  /* END LOOP: for each link */
}
addClickListenersToTags();


function generateAuthor() {
  const articles = document.querySelectorAll(opts.articleSelector);
  for (const article of articles) {
    const authorWrapper = article.querySelector(opts.articleAuthorsSelector);
    const author = article.dataset.author;
    //authorWrapper.innerHTML = '<a href="#author-' + author + '">by ' + author + '</a>';
     const linkHTMLData = {id: `author-${author}`, title: author};
       const linkHTML = templates.authorLink(linkHTMLData);
    authorWrapper.innerHTML = linkHTML
  }
}



generateAuthor();


function authorClickHandler() {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for (const activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  const sameAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (const sameAuthorLink of sameAuthorLinks) {
    sameAuthorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (const link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

