(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.fetchAtelierData();
        },
        cacheElements() {
            this.$articles = document.querySelector(".atelier__articles");
        },
        async fetchAtelierData() {
            //fetch data needed for Atelier page from local JSON file with Class
            try {
                const data = new AtelierAndStudio();
                const atelierData = await data.getAtelierAndStudioData();
                this.$articles.innerHTML = this.createHTMLForAtelier(atelierData);
            } catch (error) {
                console.log(error);
            }
        },
        createHTMLForAtelier(articlesData) {
            //create HTML header from fetched data for each section on Atelier page 
            let atelierSection = "";
            articlesData.map((article, index) => {
                //start a new section for every three articles
                atelierSection += `
                ${(index % 3) ? "" : `<div class="section__articles__container">`}
                    <article class="section__article">
                        <a href="./visiting-mons-again/index.html" class="section__article__link">
                            <img class="section__article__image" src="./../static/img/imgs/${article.thumbnail ?? ""}" alt="sculpture"/>
                        </a>
                        <h3 class="section__article__header">${article.intro ?? ""}</h3>
                        <h4 class="section__article__title">${article.title ?? ""}</h4>
                        <p class="section__article__paragraph">${article.description ?? ""}</p>
                        <a class="section__article__more" href="./visiting-mons-again/index.html">Learn more</a>
                    </article>
                ${((index % 3) === 2) ? "</div>" : ""}`
            }).join('');
            return atelierSection;
        },
    };
    app.initialise();
})();