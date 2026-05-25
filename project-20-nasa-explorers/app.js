const API_KEY = "n1MVBUAWnOnM3HDdZwfDLOm6XEKpeVGbukgivKkC";
const BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const nasaForm = document.getElementById('nasaForm');
const dateInput = document.getElementById('dateInput');
const nasaSpinner = document.getElementById('nasaSpinner');
const nasaDisplayCard = document.getElementById('nasaDisplayCard');
const mediaContainer = document.getElementById('mediaContainer');
const contentTitle = document.getElementById('contentTitle');
const contentDate = document.getElementById('contentDate');
const contentExplanation = document.getElementById('contentExplanation');
const nasaError = document.getElementById('nasaError');

window.addEventListener('DOMContentLoaded', () => {
    const todayStr = new Date().toISOString().split("T")[0];
    dateInput.max = todayStr;
    dateInput.value = todayStr;
    
    fetchSpacePayload(todayStr);
});

nasaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedDate = dateInput.value;
    if (selectedDate) {
        fetchSpacePayload(selectedDate);
    }
});


async function fetchSpacePayload(dateString) {
    // Structural Interface Reset
    nasaSpinner.classList.remove('d-none');
    nasaDisplayCard.classList.add('d-none');
    nasaError.classList.add('d-none');

    try {
        const response = await fetch(`${BASE_URL}&date=${dateString}`);
        
        if (!response.ok) {
            throw new Error("Unable to fetch data for the selected date range.");
        }

        const data = await response.json();
        
        nasaSpinner.classList.add('d-none');
        renderSpaceUI(data);

    } catch (error) {
        nasaSpinner.classList.add('d-none');
        nasaError.classList.remove('d-none');
        nasaError.innerText = `⚠️ Connection Error: ${error.message}`;
    }
}


function renderSpaceUI(payload) {
    contentTitle.innerText = payload.title;
    contentDate.innerText = payload.date;
    contentExplanation.innerText = payload.explanation;

    mediaContainer.innerHTML = '';

    if (payload.media_type === "image") {
        const imgNode = document.createElement('img');
        imgNode.src = payload.url;
        imgNode.className = "space-media";
        imgNode.alt = payload.title;
        mediaContainer.appendChild(imgNode);
    } else if (payload.media_type === "video") {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = "ratio ratio-16x9"; // Bootstrap responsive embed wrapper
        videoWrapper.innerHTML = `
            <iframe src="${payload.url}" title="${payload.title}" allowfullscreen></iframe>
        `;
        mediaContainer.appendChild(videoWrapper);
    }

    nasaDisplayCard.classList.remove('d-none');
}