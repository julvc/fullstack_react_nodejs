const API_KEY = 'API_DEVELOPER_GIPHY'
const searchQuery = 'cats'

// Función para hacer fetch de los datos
async function fetchGifts() {
    const searchEndpoint = `http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchQuery}`
    try {
        // se hace un fetch al searchEnpoint
        const response = await fetch(searchEndpoint)
        // si no es no es positiva la respuesta arroja un error
        if (!response.ok) {
            throw new Error('error on service')
        }
        // espera la respuesta y almacena en data
        const data = await response.json()
       // console.log(data.data) 
        displayGifs(data.data)
    } catch (error) {
        console.error('there was an error:', error)
    }
}

// Función para mostrar los gifs en la web
function displayGifs(gifs) {
    // selecciona el elemento del html mediante su ID
    const gifsContainer = document.getElementById('gifs-container')
    // limpia el contenedor antes de mostrar los gifs
    gifsContainer.innerHTML = ''

    // Función que recorre todo el objeto de gifs
    gifs.forEach(gif => {
        // crea un elemento IMG en el DOM
        const img = document.createElement('img');
        // la url de la imagen del gif
        img.src = gif.images.fixed_height.url;
        // añade al final de cada elemento la imagen
        gifsContainer.appendChild(img)
    })
}

fetchGifts()