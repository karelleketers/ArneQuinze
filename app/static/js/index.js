(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.fetchArtsAndExhibitionsData();
            this.fetchAtelierData();
        },
        cacheElements() {
            this.$artAndExhibitionsArticles = document.querySelector(".index__art-and-exhibitions");
            this.$atelierArticles = document.querySelector(".index__atelier-studio");
        },
        async fetchArtsAndExhibitionsData() {
            //fetch data needed for Art page from local JSON file with Class
            try {
                const data = new ArtAndExhibitions();
                const artsData = await data.getArtsAndExhibitionsData();
                this.$artAndExhibitionsArticles.innerHTML = this.cacheArtsAndExhibitionsData(artsData);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchAtelierData() {
            //fetch data needed for Atelier page from local JSON file with Class
            try {
                const data = new AtelierAndStudio("index");
                const atelierData = await data.getAtelierAndStudioData();
                this.$atelierArticles.innerHTML = this.cacheAtelierData(atelierData);
            } catch (error) {
                console.log(error);
            }
        },
        cacheArtsAndExhibitionsData(articlesData) {
            const filteredObject = this.filterObject("arts")
            const title = filteredObject.header.pageName;
            const folder = filteredObject.header.folder;
            const subfolder = filteredObject.header.subfolder;
            const articlesFiltered = this.filterHighlightArticles(articlesData);
            const html = this.createHTMLForSections(articlesFiltered, title, folder, subfolder);
            return html;
        },
        filterHighlightArticles(articlesData) {
            const filteredArticles = articlesData.filter(article => {
                return article.highlight;
            });
            return filteredArticles;
        },
        cacheAtelierData(articlesData) {
            const filteredObject = this.filterObject("atelier")
            const title = filteredObject.header.pageName;
            const folder = filteredObject.header.folder;
            const subfolder = filteredObject.header.subfolder;
            const html = this.createHTMLForSections(articlesData, title, folder, subfolder);
            return html;
        },
        filterObject(type) {
            filteredObject = pages.find(page => {
                return (page.subject) === type;
            });
            return filteredObject;
        },
        createHTMLForSections(articlesData, title, folder, subfolder) {
            const featuredAmount = 3;
            const featuredArticles = articlesData.slice(0, featuredAmount);
            const html = `
            <div class="rotate__header">
                <h2 class="rotate__title">${title}</h2>
                <a class="rotate__link" href="./${folder}/index.html"><span class="rotate__link__span">View all</span></a>
            </div>
            <div class="rotate__section__articles__container section__articles__container">
                ${this.CreateHTMLForArticles(featuredArticles, folder, subfolder)}
            </div>`;
            return html;
        },
        CreateHTMLForArticles(articles, folder, subfolder) {
            let articleHTML = "";
            articles.map((article) => {
                articleHTML += `
                <article class="section__article">
                    <a href="./${folder}/${subfolder}/index.html" class="section__article__link">
                        <img class="section__article__image" src="././static/img/${article.cover ? `images/${article.cover}`: (article.thumbnail ? `imgs/${article.thumbnail}` : "")}" alt="sculpture"/>
                    </a>
                    <h3 class="section__article__header">${(article.tags) ? this.getTags(article.tags) : ""} ${article.location ? `- ${article.location}` : (article.intro ?? "")}</h3>
                    <h4 class="section__article__title">${article.title ?? ""}</h4>
                    <p class="section__article__paragraph">${article.description ?? ""}</p>
                    <a class="section__article__more" href="./${folder}/${subfolder}/index.html">Learn more</a>
                </article>`
            }).join('');
            return articleHTML;
        },
        getTags(array) {
            tagArray = array.map(tag => {
                return tag;
            });
            return tagArray.join(" / ");
        }
    };
    app.initialise();
})();