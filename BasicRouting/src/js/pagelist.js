import PageDetail from "./pagedetail";

const PageList = (argument) => {
  const preparePage = () => {

    let displayCards = 9;

    let webDescription = document.querySelector(".webdescription");
    if (webDescription.classList.contains("hidden")){
      webDescription.classList.remove("hidden");
    }

    if (argument.length==0){
      argument = "&dates=2024-01-01,2024-12-31&ordering=-added&page_size=27";
    }

    const cleanedArgument = argument.trim().replace(" ", "+");

    const displayResults = (articles) => {
      const resultsContent = articles.map((article, i) => {
        return `${putContent(article, i, articles.length)}`;
      });
      const resultsContainer = document.querySelector('.page-list .articles');
      resultsContainer.innerHTML = '';

      resultsContainer.innerHTML = resultsContent.join("");
      resultsContainer.innerHTML+= `<center><button id = "showmore" class = "showmore-button">En voir davantage</button></center>`

      document.getElementById("showmore").addEventListener("click",()=>{
        if (displayCards<27) displayCards+=9;
        displayMore();
        if (displayCards==27){
          document.getElementById("showmore").classList.add("hidden");
        }
      });

      displayMore();
    };

    const displayMore = () => {
      let cards = document.querySelectorAll(".cardGame");
      for(let i = 0 ; i < displayCards ; i++){
        if (cards[i]!=null){
          if (cards[i].classList.contains("hidden")){
            cards[i].classList.remove("hidden");
          }
        }
      }
    }

    const fetchList = (url, argument) => {
      const finalURL = argument ? `${url}&search=${argument}` : url;
      fetch(finalURL)
        .then((response) => response.json())
        .then((responseData) => {
          displayResults(responseData.results);
          let cards = document.querySelectorAll(".cardGame");
          cards.forEach(card=>{
            card.addEventListener("click", ()=>{
              window.location = `#pagedetail/${card.getAttribute("name")}`;
            });
            card.addEventListener("mouseover", ()=>{
              card.querySelector(".content").classList.add("hidden");
              card.querySelector(".contenthover").classList.remove("hidden");
            });
            card.addEventListener("mouseleave", ()=>{
              card.querySelector(".content").classList.remove("hidden");
              card.querySelector(".contenthover").classList.add("hidden");
            });
          });
        });
    };
    fetchList(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`, cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles"><p class = "loadtext">Chargement...</p></div>
      </section>
    `;

    preparePage();
  };

  render();
};

function putContent(article, index, alength) {
  let content = "";

  if (index % 3 === 0) {
    content += '<div class="flex-row">';
  }

  let imgSource = (article.background_image!=null) ? 
      article.background_image :
      "https://image.noelshack.com/fichiers/2023/30/1/1690204228-noavailable.png";

  let platforms = article.platforms;
  let imgPlatforms = '';

  if (platforms !=null){
    for(let i = 0 ; i < platforms.length ; i++){

      if (platforms[i].platform.slug.includes("xbox") && !imgPlatforms.includes("xbox")){
        imgPlatforms += `<img src = ${"./assets/images/xbox.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("playstation") && !imgPlatforms.includes("playstation")){
        imgPlatforms += `<img src = ${"./assets/images/playstation.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("pc") && !imgPlatforms.includes("pc")){
        imgPlatforms += `<img src = ${"./assets/images/pc.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("ios") && !imgPlatforms.includes("ios")){
        imgPlatforms += `<img src = ${"./assets/images/ios.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("android") && !imgPlatforms.includes("android")){
        imgPlatforms += `<img src = ${"./assets/images/android.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("macos") && !imgPlatforms.includes("macos")){
        imgPlatforms += `<img src = ${"./assets/images/macos.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("switch") && !imgPlatforms.includes("switch")){
        imgPlatforms += `<img src = ${"./assets/images/switch.png"} class = "platformlogo"/>`;
      }
      if (platforms[i].platform.slug.includes("linux") && !imgPlatforms.includes("linux")){
        imgPlatforms += `<img src = ${"./assets/images/linux.png"} class = "platformlogo"/>`;
      }
    }
  }

    let dev = '';
  fetch(`https://api.rawg.io/api/games/${article.slug}?key=${process.env.API_KEY}`).then
    (resp=>resp.json()).then(data=>{
      if (data.developers.length!=0){
        dev = data.developers[0].name;
        console.log(dev);
        let c = document.getElementsByName(article.slug);
        c[0].querySelector(".dev").textContent = "Développeur : "+dev;
      }
    });
    
  content += `
    <article class="cardGame hidden" name = ${article.slug}>
    <h4>${article.name}</h4>
    <div class = "content">
      <img class="picture" src="${imgSource}">
      ${imgPlatforms}
    </div>
    <div class = "contenthover hidden">
      <h4>Date de sortie : ${article.released}</h4>
      <h4 class = "dev"></h4>
      <h4>Note : ${article.rating}/5 - ${article.ratings_count} votes</h4>
    </div>
    </article>
  `;

  if ((index + 1) % 3 === 0 || index === alength - 1) {
    content += "</div>";
  }

  return content;
}

export default PageList;