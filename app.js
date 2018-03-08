const baseUrl = 'https://private-anon-4f43f68e5a-jikan.apiary-proxy.com/search/'
const searchInput = document.querySelector('.search')
const searchHelp = document.querySelector('.searchHelp')
const searchButton = document.querySelector('.searchButton')
const suggestions = document.querySelector('.suggestions')
const songWrap = document.querySelector('.songWrap')
const songCard = document.querySelector('.songCard')
const goBack = document.querySelector('.backBtnWrap')

//added to prevent page reload on pressing enter(submit)
document.querySelector('.searchForm').addEventListener('submit', event => event.preventDefault(), false)

searchInput.addEventListener('change', findMatches)
searchButton.addEventListener('click', () => {
    searchInput.dispatchEvent(new Event('change'))    
})

goBack.addEventListener('click', event => {
    songWrap.classList.add('is-removed')
    suggestions.classList.remove('is-removed')
})

function findMatches(){    
    wordToMatch = this.value
    if(wordToMatch.length < 3){
        searchInput.classList.add('is-danger')
        searchButton.classList.add('is-danger')
        searchHelp.classList.remove('is-invisible')
        return
    }else{
        searchInput.classList.remove('is-danger')
        searchButton.classList.remove('is-danger')
        searchHelp.classList.add('is-invisible')
        searchButton.classList.add('is-loading')
    }
    let endpoint = baseUrl + `anime/${wordToMatch}/1`

    fetch(endpoint)
        .then(res => res.json())
        .then(blob => blob.result)
        .then(data => {
            let htmlContent = data.map(anime => {
                // let regex = new RegExp(this.value,'gi')
                // let title = anime.title.replace(regex,`<span class="highlight">${this.value}</span>`)
                return `
                <div class="card module-card" animeId="${anime.id}" animeTitle="${anime.title}" >
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure>
                                    <img src="${anime.image_url}" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="media-content is-clipped">
                                <div class="field is-grouped is-grouped-multiline">
                                    <div class="control">
                                        <div class="tags has-addons">
                                            <span class="tag is-dark is-medium">Score</span>
                                            <span class="tag is-info is-medium">${anime.score}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="control">
                                        <div class="tags has-addons">
                                            <span class="tag is-dark is-medium">Episodes</span>
                                            <span class="tag is-success is-medium">${anime.episodes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <p class="title is-2">${anime.title}</p>
                            <p class="subtitle is-6">${anime.description}</p>
                        </div>
                    </div>
                </div>
                `
            }).join('')
            searchButton.classList.remove('is-loading')
            songWrap.classList.add('is-removed')
            suggestions.classList.remove('is-removed')
            suggestions.innerHTML = htmlContent

            let cards = document.querySelectorAll('.module-card')
            cards.forEach(card => {
                card.addEventListener('click', displaySongs)
            });
        })
}

function displaySongs(){

    songWrap.classList.remove('is-removed')
    suggestions.classList.add('is-removed')

    animeId = this.attributes.animeId.value    
    animeTitle = this.attributes.animeTitle.value    

    songCard.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-header-title">${animeTitle}</div>
            </div>
        </div>
    `

    let endpoint = `https://private-anon-4f43f68e5a-jikan.apiary-proxy.com/anime/${animeId}/episodes/parameter`

    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let title = data.title;
            songCard.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <div class="card-header-title">${title}</div>
                    </div>
                </div>
            `
        })
}