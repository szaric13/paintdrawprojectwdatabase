class ObjectDetails {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        const urlParams = new URLSearchParams(window.location.search);
        this.objectId = urlParams.get('objectId');
    }

    async fetchObjectDetails() {
        try {
            const response = await fetch(`${this.baseUrl}/objects/${this.objectId}`);
            const data = await response.json();
            this.displayObjectDetails(data);
        } catch (error) {
            console.error('Fetch error: ', error);
            this.displayError();
        }
    }

    displayObjectDetails(data) {
        document.getElementById('objectTitle').innerText = data.title || 'No title';
        document.getElementById('objectImage').src = data.primaryImage || 'noimg.png';
        document.getElementById('objectArtist').innerText = data.artistDisplayName || 'Unknown';
        document.getElementById('objectDate').innerText = data.objectDate || 'Not available';
        document.getElementById('objectMedium').innerText = data.medium || 'Not available';
        document.getElementById('objectDimensions').innerText = data.dimensions || 'Not available';
    }

    displayError() {
        document.getElementById('objectTitle').innerText = 'Fetch error';
        document.getElementById('objectImage').src = 'noimg.png'; 
    }

    init() {
        this.fetchObjectDetails();
    }
}

const objectDetails = new ObjectDetails('https://collectionapi.metmuseum.org/public/collection/v1');
objectDetails.init();
