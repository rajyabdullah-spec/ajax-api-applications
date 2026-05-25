const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const gifsContainer = document.getElementById('gifs-container');


const API_KEY = "LIVDSRZULELA"; 


searchBtn.addEventListener('click', fetchGifs);


searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchGifs();
    }
});


function fetchGifs() {
    const query = searchInput.value.trim();

   
    if (query === "") {
        alert("Please enter a word to search!");
        return;
    }

    
    gifsContainer.innerHTML = `<div class="text-center w-100"><p class="text-muted">Loading amazing GIFs...</p></div>`;

    
    const url = `https://api.tenor.com/v1/search?q=${query}&key=${API_KEY}&limit=8`;

    
    const xhr = new XMLHttpRequest();

   
    xhr.open('GET', url, true);


    xhr.onreadystatechange = function() {
      
        if (xhr.readyState === 4 && xhr.status === 200) {
            
           
            const responseData = JSON.parse(xhr.responseText);
            
          
            displayGifs(responseData.results);
            
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
         
            gifsContainer.innerHTML = `<div class="text-center w-100"><p class="text-danger">Error loading data from server. (Status: ${xhr.status})</p></div>`;
        }
    };

  
    xhr.send();
}


function displayGifs(gifArray) {

    gifsContainer.innerHTML = "";

  
    if (gifArray.length === 0) {
        gifsContainer.innerHTML = `<div class="text-center w-100"><p class="text-warning">No GIFs found for this search. Try something else!</p></div>`;
        return;
    }

   
    gifArray.forEach(gif => {
  
        const gifUrl = gif.media[0].gif.url;
        const gifTitle = gif.title || "Tenor GIF";


        const cardCol = document.createElement('div');
        cardCol.className = 'col';

        cardCol.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${gifUrl}" class="card-img-top img-fluid rounded style-gif" alt="${gifTitle}" style="object-fit: cover; height: 200px;">
                <div class="card-body p-2 bg-white text-center">
                    <small class="text-muted text-truncate d-block">${gifTitle}</small>
                </div>
            </div>
        `;

        gifsContainer.innerHTML += cardCol.outerHTML;
    });
}