(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.fetchPressData();
        },
        cacheElements() {
            this.$articles = document.querySelector(".press__articles");
        },
        async fetchPressData() {
            //fetch data needed for Press page from local JSON file with Class
            try {
                const data = new Press();
                const pressData = await data.getPressData();
                this.$articles.innerHTML = this.createHTMLForPress(pressData);
            } catch (error) {
                console.log(error);
            };
        },
        createHTMLForPress(articlesData) {
            //create HTML header from fetched data for each section on Press page 
            let pressSection = "";
            articlesData.map(section => {
                pressSection += `
                        <section class="rotate__section">
                            <div class="rotate__header">
                                <h2 class="rotate__title">${section.header ?? ""}</h2>
                                <a class="rotate__link" href="#"><span class="rotate__link__span">archive</span></a>
                            </div>
                            <div class="rotate__section__articles__container section__articles__container">
                                ${this.getArticles(section.articles)}
                            </div>
                        </section>`
            }).join('');
            return pressSection;
        },
        getArticles(articles) {
            //Create HTML from articles content
            let articleContent = "";
            articles.map((article) => {
                articleContent += `
                    <article class="section__article">
                        <a href="./my-secret-garden-valencia/index.html" class="section__article__link">
                            <img class="section__article__image" src="./../${article.thumbnail ?? ""}" alt="sculpture"/>
                        </a>
                        <h3 class="section__article__header">${article.intro ?? ""}</h3>
                        <h4 class="section__article__title">${article.title ?? ""}</h4>
                        <p class="section__article__paragraph">${article.description ?? ""}</p>
                        <a class="section__article__more" href="./my-secret-garden-valencia/index.html">${this.readFullArticle(article.type)}</a>
                    </article>`
            }).join('');
            return articleContent;
        },
        //User can click to read full article depending on type 
        readFullArticle(type) {
            return {
                'article': 'download article',
                'website': 'visit website',
                'press release': 'Open press release'
            } [type];
        }
    };
    app.initialise();
})();