const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';

async function fetchSearchResults(query) {
    const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
    return await response.json();
}

async function loadDepartments() {
    const response = await fetch(`${baseUrl}/departments`);
    const data = await response.json();
    const departmentMenu = document.getElementById('departmentMenu');

    data.departments.forEach(department => {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';
        listItem.innerHTML = `<a class="nav-link" href="department.html?departmentId=${department.departmentId}">${department.displayName}</a>`;
        departmentMenu.appendChild(listItem);
    });
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        fetchSearchResults(query).then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';

            if (data.objectIDs && data.objectIDs.length > 0) {
                const limitedResults = data.objectIDs.slice(0, 10);

                limitedResults.forEach(objectId => {
                    fetch(`${baseUrl}/objects/${objectId}`)
                        .then(response => response.json())
                        .then(objectData => displaySearchResult(objectData, resultsContainer));
                });
            } else {
                resultsContainer.innerHTML = '<p>No results</p>';
            }
        });
    }
});

function displaySearchResult(objectData, resultsContainer) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="card">
            <img src="${objectData.primaryImageSmall || 'noimg.png'}" class="card-img-top" alt="${objectData.title}">
            <div class="card-body">
                <h5 class="card-title">${objectData.title}</h5>
                <a href="object.html?objectId=${objectData.objectID}" class="btn btn-primary">View object</a>
            </div>
        </div>
    `;
    resultsContainer.appendChild(card);
}

loadDepartments();
