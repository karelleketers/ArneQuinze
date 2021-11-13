(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.registerFilterListener();
            this.fetchArtsAndExhibitionsData();
        },
        cacheElements() {
            this.$works = document.querySelector(".art__main__works");
            this.$ulOfCategories = document.querySelector(".art__main__filter--category__list");
            this.$ulOfYears = document.querySelector(".art__main__filter--year__list");
            this.$ulOfView = document.querySelector(".art__main__filter--view__list");
            this.$viewOptions = document.querySelectorAll(".art__main__filter--view__listitem__link");
        },
        registerFilterListener() {
            //when child category is clicked on page 
            this.$ulOfCategories.addEventListener("click", (ev) => {
                ev.preventDefault();
                if (ev.target.tagName === "A") {
                    //adjust current URL without reloading the page
                    const currentURL = new URLSearchParams(window.location.search);
                    currentURL.set('category', ev.target.dataset.cat);
                    window.history.pushState({}, '', `index.html?${currentURL}`);
                    this.updatePageData();
                };
            }, false);
            this.$ulOfYears.addEventListener("click", (ev) => {
                //when child year is clicked 
                ev.preventDefault();
                if (ev.target.tagName === "A") {
                    const currentURL = new URLSearchParams(window.location.search);
                    currentURL.set('year', ev.target.dataset.year);
                    window.history.pushState({}, '', `index.html?${currentURL}`);
                    this.updatePageData();
                };
            }, false);
            this.$ulOfView.addEventListener("click", (ev) => {
                //when child view is clicked
                if (ev.target.tagName === "A") {
                    Array.from(this.$viewOptions).map(view => {
                        view.removeAttribute("id")
                    });
                    (ev.target).setAttribute("id", "selected--view");
                };
            });
        },
        async fetchArtsAndExhibitionsData() {
            //fetch data needed for Art page from local JSON file with Class
            try {
                const artAndExhibitionsdata = new ArtAndExhibitions();
                this.artsData = await artAndExhibitionsdata.getArtsAndExhibitionsData();
                this.cacheArtsAndExhibitionsData();
            } catch (error) {
                console.log(error);
            };
        },
        cacheArtsAndExhibitionsData() {
            this.arrayOfCategories = this.getArrayOfUniqueFilters(this.artsData, 'tags');
            this.arrayOfYears = this.getArrayOfUniqueFilters(this.artsData, 'year');
            this.updatePageData(this.artsData);
        },
        getArrayOfUniqueFilters(artsData, objectKey) {
            //create array for filters (tags and years) with each value unique through Set
            const setOfUniques = new Set();
            if (objectKey === "tags") {
                artsData.forEach(work => {
                    work[objectKey].map(tag => {
                        if (tag) {
                            setOfUniques.add(tag)
                        };
                    });
                });
            } else {
                artsData.forEach(work => {
                    setOfUniques.add(work[objectKey]);
                });
            };
            //turn Set into an array 
            filteredArray = Array.from(setOfUniques);
            //sort tags alphabetically 
            if (objectKey === "tags") {
                filteredArray.sort((work1, work2) => {
                    return work1.localeCompare(work2);
                });
            };
            return filteredArray;
        },
        updatePageData() {
            this.fetchParamData();
            this.createHTMLForPage(this.artsData);
        },
        fetchParamData() {
            //fetch search params of current URL
            const search = window.location.search;
            this.urlParams = new URLSearchParams(search);
            this.urlParamOfCategory = this.urlParams.get('category');
            this.urlParamOfYear = this.urlParams.get('year');
        },
        createHTMLForPage(artsData) {
            this.createHTMLForCategories(this.arrayOfCategories, this.urlParamOfCategory);
            this.createHTMLForYears(this.arrayOfYears, this.urlParamOfYear);
            filteredWorks = this.filterWorks(artsData);
            html = this.createHeaderHTMLOfArt(filteredWorks, this.arrayOfYears);
            //if random category or year is typed, throw error
            if (html) {
                this.$works.innerHTML = html
            } else {
                this.$works.innerHTML = `
            <p class="error__paragraph">Page not found. <span class="error__span"><a class="error__link" href="./index.html"> Go back</a><svg class="error__go-back" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 299.02 209.84"><path d="M292.87,254.43a6.14,6.14,0,0,1-5.5-3.4c-.36-.68-28.54-52.95-146.17-54.72v52a6.16,6.16,0,0,1-9.9,4.89L2.42,154.39a6.13,6.13,0,0,1,0-9.76L131.31,45.86a6.15,6.15,0,0,1,9.89,4.87V105.5c3.11-.19,7.17-.37,12-.37,43.86,0,145.87,14,145.87,143.14a6.14,6.14,0,0,1-4.75,6A5.59,5.59,0,0,1,292.87,254.43Z" transform="translate(0 -44.59)"/></svg></span></p>`
            };
        },
        createHTMLForCategories(arrayOfCategories, currentURLParamOfCategory) {
            //Based on category present in current search param this category will be selected on page
            let htmlForCategories = `<li class="art__main__filter--category__listitem art__main__filter__listitem"><a href="#" data-cat="show-all" id=${(currentURLParamOfCategory === "show-all" || !currentURLParamOfCategory) ? "selected--category": ""} class="art__main__filter__listitem__link art__main__filter--category__listitem__link">Show all</a></li>`;
            arrayOfCategories.map(category => {
                htmlForCategories += `
            <li class="art__main__filter--category__listitem art__main__filter__listitem">
                <a href="#" data-cat="${category}" id=${category === currentURLParamOfCategory ? "selected--category": ""} class="art__main__filter__listitem__link art__main__filter--category__listitem__link">${category}</a>
            </li>`
            }).join("");
            this.$ulOfCategories.innerHTML = htmlForCategories;
        },
        createHTMLForYears(arrayOfYears, currentURLParamOfYear) {
            //Based on year present in current search param this year will be selected on page
            let htmlForYears = `<li class="art__main__filter--year__listitem art__main__filter__listitem"><a href="#" data-year="show-all" id=${(currentURLParamOfYear === "show-all" || !currentURLParamOfYear) ? "selected--category": ""} class="art__main__filter--year__listitem__link art__main__filter__listitem__link">Show all</a></li>`;
            arrayOfYears.map(year => {
                htmlForYears += `
            <li class="art__main__filter--year__listitem art__main__filter__listitem"><a href="#" data-year=${year} id=${year === currentURLParamOfYear ? "selected--category": ""} class="art__main__filter--year__listitem__link art__main__filter__listitem__link">${year}</a></li>
            `
            }).join("");
            this.$ulOfYears.innerHTML = htmlForYears;
        },
        filterWorks(artsData) {
            //filter works displayed on page based on current search params 
            let filteredWorks = artsData;
            if (this.urlParams.has('category') && !this.urlParams.has('year')) {
                filteredWorks = this.filterWorksByCategories(artsData, this.urlParamOfCategory)
            } else if (!this.urlParams.has('category') && this.urlParams.has('year')) {
                filteredWorks = this.filterWorksByYears(artsData, this.urlParamOfYear)
            } else if (this.urlParams.has('category') && this.urlParams.has('year')) {
                filteredWorks = this.filterWorksByYears(this.filterWorksByCategories(artsData, this.urlParamOfCategory), this.urlParamOfYear)
            };
            return (filteredWorks);
        },
        filterWorksByCategories(artsData, currentURLParamOfCategory) {
            //filter works displayed on page based on category in current search params
            if (!(currentURLParamOfCategory === "show-all")) {
                const filteredWorks = artsData.filter(work => {
                    return (work.tags).indexOf(currentURLParamOfCategory) > -1
                });
                return filteredWorks;
            } else return artsData;
        },
        filterWorksByYears(artsData, currentURLParamOfYear) {
            //filter works displayed on page based on year in current search params
            if (!(currentURLParamOfYear === "show-all")) {
                const filteredWorks = artsData.filter(work => {
                    return (work.year).indexOf(currentURLParamOfYear) > -1
                });
                return filteredWorks;
            } else return artsData;
        },
        createHeaderHTMLOfArt(filteredWorks, filteredYears) {
            //HTML for artworks, listed on page by year
            let combinedHTML = "";
            filteredYears.map(year => {
                const arrOfWorks = filteredWorks.filter(work => {
                    return (work.year).indexOf(year) > -1
                });
                if (arrOfWorks.length) {
                    combinedHTML += `
            <section class="art__works__division">
                <div class="art__works__header">
                    <h3 class="art__works__year">${year}</h3>
                </div>
                ${this.CreateContentHTMLOfArt(arrOfWorks)}
            </section>`
                };
            });
            return combinedHTML;
        },
        CreateContentHTMLOfArt(arrayOfWorks) {
            let contentHTML = "";
            arrayOfWorks.map(work => {
                contentHTML += `
            <ul class="art__works__list">
                <li class="art__works__listitem">
                    <div class="art__works__info">
                        <h4 class="art__works__title"><a class="art__works__link" href="./in-dialogue-with-calatrava/index.html">${work.title ?? ""}</a></h4>
                        <h5 class="art__works__subtitle">${work.subtitle ?? ""}</h5>
                        <p class="art__works__description">${(work.tags) ? work.tags.join(" / ") : ""} ${(work.location) ? `— ${work.location}`: ""}</p>
                    </div>
                    <div class="art__works__images">
                        <div class="art__works__images__overflow">
                            <div class="art__works__images__scroll">
                                ${(work.images) ? this.createHTMLForImages(work.images) : ""}
                            </div>
                            <div class="art__works__scroll__hide">
                                <svg class="swipe__image" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448.01 490.65">
                                    <path class="cls-1" d="M437.33,42.65h-128a10.67,10.67,0,1,0,0,21.34h128a10.67,10.67,0,0,0,0-21.34Z" transform="translate(-21.32 0)"/>
                                    <path class="cls-1" d="M444.88,45.79,402.21,3.12A10.66,10.66,0,1,0,387.13,18.2l35.11,35.12L387.11,88.45a10.67,10.67,0,0,0,15.1,15.09l42.67-42.67A10.67,10.67,0,0,0,444.88,45.79Z" transform="translate(-21.32 0)"/>
                                    <path class="cls-1" d="M160,42.65H32A10.67,10.67,0,0,0,32,64H160a10.67,10.67,0,0,0,0-21.34Z" transform="translate(-21.32 0)"/>
                                    <path class="cls-1" d="M47.08,53.32,82.19,18.2A10.66,10.66,0,1,0,67.11,3.12L24.44,45.79a10.67,10.67,0,0,0,0,15.08l42.67,42.67a10.7,10.7,0,0,0,7.55,3.11,10.56,10.56,0,0,0,7.53-3.13,10.68,10.68,0,0,0,0-15.09Z" transform="translate(-21.32 0)"/>
                                    <path class="cls-1" d="M426.66,213.32a42.45,42.45,0,0,0-23.72,7.21,42.67,42.67,0,0,0-64-21.34,42.79,42.79,0,0,0-40.28-28.54,42.3,42.3,0,0,0-21.33,5.74V106.65a42.67,42.67,0,1,0-85.34,0V288l-37.07-27.79a55.93,55.93,0,0,0-72.73,5.16,32,32,0,0,0,0,45.25L234.11,462.53A95.38,95.38,0,0,0,302,490.65h50A117.47,117.47,0,0,0,469.33,373.32V256A42.71,42.71,0,0,0,426.66,213.32Zm21.33,160a96.12,96.12,0,0,1-96,96H302a74.19,74.19,0,0,1-52.82-21.87L97.28,295.52a10.68,10.68,0,0,1,0-15.09,34.53,34.53,0,0,1,44.86-3.18l54.12,40.6a10.67,10.67,0,0,0,17.07-8.53V106.65a21.34,21.34,0,0,1,42.67,0v160a10.67,10.67,0,1,0,21.33,0V213.32a21.34,21.34,0,1,1,42.67,0v53.33a10.67,10.67,0,1,0,21.33,0v-32a21.34,21.34,0,0,1,42.67,0v32a10.67,10.67,0,1,0,21.33,0V256A21.34,21.34,0,0,1,448,256V373.32Z" transform="translate(-21.32 0)"/>
                                </svg>
                            </div>
                        </div>
                    </div>    
                </li>
            </ul>`
            });
            return contentHTML;
        },
        createHTMLForImages(arrayOfWorkImages) {
            let imageHTML = "";
            arrayOfWorkImages.map(image => {
                imageHTML += `<a class="art__works__image__link" href="./in-dialogue-with-calatrava/index.html"><img class="art__works__image" src="./../static/img/images/${image}" loading="lazy" alt="Arne Quinze work"/></a>`
            });
            return imageHTML;
        },
    };
    app.initialise();
})();