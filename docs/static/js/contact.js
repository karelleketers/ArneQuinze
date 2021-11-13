(() => {
    const app = {
        initialise() {
            this.cacheElements();
            this.updateTime();
        },
        cacheElements() {
            this.$time = document.querySelectorAll(".contact--bottom__time");
        },
        getCurrentTime() {
            const currentTime = new Date();
            const adjustedHours = this.adjustNumber(currentTime.getHours());
            const adjustedMins = this.adjustNumber(currentTime.getMinutes());
            Array.from(this.$time).map(element => {
                element.innerHTML = `Time in belgium ${adjustedHours}:${adjustedMins}`;
            });
        },
        updateTime() {
            //get time live instead of refreshing page, updated every 30s
            this.getCurrentTime();
            setInterval(() => {
                this.getCurrentTime();
            }, 30000);
        },
        adjustNumber(time) {
            //if only one number present return two numbers for time
            if ((time.toString()).length < 2) {
                time = `0${time}`;
            };
            return time;
        }
    };
    app.initialise();
})();