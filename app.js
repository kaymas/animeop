const baseUrl = 'https://private-anon-4f43f68e5a-jikan.apiary-proxy.com/search/'
const searchInput = document.querySelector('.search')
const suggestions = document.querySelector('.suggestions')

//added to prevent page reload on pressing enter(submit)
document.querySelector('.searchForm').addEventListener('submit', event => event.preventDefault(), false)

searchInput.addEventListener('change', findMatches)

function findMatches(){
    wordToMatch = this.value
    if(wordToMatch.length < 3){
        alert("input more than 3 characters in the searchbox")
        return
    }
    let endpoint = baseUrl + `anime/${wordToMatch}/1`
    console.log(endpoint);

    fetch(endpoint)
        .then(res => res.json())
        .then(blob => blob.result)
        .then(data => {
            console.log(data);
            let htmlContent = data.map(anime => {
                let regex = new RegExp(this.value,'gi')
                let title = anime.title.replace(regex,`<span class="highlight">${this.value}</span>`)
                return `
                    <li>${title}</li>
                `
            }).join('')
            suggestions.innerHTML = htmlContent
        })
}