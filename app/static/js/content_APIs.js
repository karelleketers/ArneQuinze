function ArtAndExhibitions() {
  this.getArtsAndExhibitionsData = async () => {
    const ARTS_DATA_API = "https://www.pgm.gent/data/arnequinze/art.json";
    const response = await fetch(ARTS_DATA_API);
    const jsonData = await response.json();
    return jsonData;
  }
};

function Press() {
  this.getPressData = async () => {
    const PRESS_DATA_API = "./../data/data-press.json";
    const response = await fetch(PRESS_DATA_API);
    const jsonData = await response.json();
    return jsonData;
  }
};

function AtelierAndStudio(page) {
  this.getAtelierAndStudioData = async () => {
    const ATELIER_DATA_API = (page === "index") ? "./data/data-atelier.json" : "./../data/data-atelier.json";
    const response = await fetch(ATELIER_DATA_API);
    const jsonData = await response.json();
    return jsonData;
  }
};