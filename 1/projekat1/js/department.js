const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
const urlParams = new URLSearchParams(window.location.search);
const departmentId = urlParams.get('departmentId');


async function fetchDepartmentObjects(id) {
    const response = await fetch(`${baseUrl}/search?departmentId=${id}&q=*`);
    return await response.json();
}

async function fetchDepartmentName(id) {
    const response = await fetch(`${baseUrl}/departments`);
    const data = await response.json();
    
    const department = data.departments.find(dep => dep.departmentId == id);
    
    return department ? department.displayName : 'No department name';
}

async function loadDepartmentDetails(departmentId) {
    const departmentNameElement = document.getElementById('departmentName');
    const departmentObjects = document.getElementById('departmentObjects');

    try {
        const departmentName = await fetchDepartmentName(departmentId);
        departmentNameElement.innerText = departmentName; 

        const objectData = await fetchDepartmentObjects(departmentId);
        
        if (objectData.objectIDs && objectData.objectIDs.length > 0) {
            const limitedResults = objectData.objectIDs.slice(0, 10);
            limitedResults.forEach(async (objectId) => {
                const objectResponse = await fetch(`${baseUrl}/objects/${objectId}`);
                const objectDetails = await objectResponse.json();

                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card">
                        <img src="${objectDetails.primaryImageSmall || 'noimg.png'}" class="card-img-top" alt="${objectDetails.title}">
                        <div class="card-body">
                            <h5 class="card-title">${objectDetails.title}</h5>
                            <a href="object.html?objectId=${objectDetails.objectID}" class="btn btn-primary">View object</a>
                        </div>
                    </div>
                `;
                departmentObjects.appendChild(card);
            });
        } else {
            departmentObjects.innerHTML = '<p>No objects</p>';
        }
    } catch (error) {
        departmentNameElement.innerText = 'Loading details error';
        departmentObjects.innerHTML = '<p>Loading objects error</p>';
    }
}

if (departmentId) {
    loadDepartmentDetails(departmentId);
}

async function loadDepartments() {
    const response = await fetch(`${baseUrl}/departments`);
    const data = await response.json();
    const departmentMenu = document.getElementById('departmentMenu');

    data.departments.forEach(department => {
        const listItem = document.createElement('a');
        listItem.className = 'dropdown-item';
        listItem.href = `department.html?departmentId=${department.departmentId}`;
        listItem.innerText = department.displayName;
        departmentMenu.appendChild(listItem);
    });
}

loadDepartments();
