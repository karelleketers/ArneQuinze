(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.registerListeners();
        },
        cacheElements() {
            this.$closebttn = document.querySelector(".close__image");
            this.$modal = document.querySelector(".modal");
            this.$smallImage = document.querySelectorAll(".modal__image");
            this.$largeImage = document.querySelector(".large__image");
            this.$toTopButton = document.querySelector("#to-top");
        },
        registerListeners() {
            //check if smallImage exists on page 
            if (this.$smallImage.length) {
                Array.from(this.$smallImage).map(image => {
                    image.addEventListener("click", (ev) => {
                        this.$modal.style.display = "flex";
                        this.$largeImage.src = ev.target.src;
                    });
                });
                this.$closebttn.addEventListener("click", () => {
                    this.$modal.style.display = "none";
                });
            };
            //determine position as you scroll
            window.addEventListener("scroll", () => {
                this.getScrollPosition()
            });
            //scroll to top when go to top button is clicked
            this.$toTopButton.addEventListener("click", (ev) => {
                ev.preventDefault();
                this.scrollToTop();
            });
        },
        getScrollPosition() {
            this.$toTopButton = document.querySelector("#to-top");
            let scrollPosition = window.scrollY;
            //only show go to button at specific vertical position
            scrollPosition > 264 ? this.$toTopButton.className = "to-top-visible" : this.$toTopButton.className = "to-top-invisible";
        },
        scrollToTop() {
            //get position away from top
            const isAwayFromTop = document.documentElement.scrollTop || document.body.scrollTop;
            //As long as your position is not at the top scroll up in increments until you hit the top 
            if (isAwayFromTop) {
                window.requestAnimationFrame(() => {
                    this.scrollToTop();
                });
                window.scrollTo(0, isAwayFromTop - isAwayFromTop / 10);
            };
        },
    };
    app.initialise();
})();