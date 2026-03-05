const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/departments';


async function loadDepartments() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error('error');
        }
        
        const data = await response.json();
        console.log(data.departments);
        const departmentMenu = document.getElementById('departmentMenu');
        data.departments.forEach(department => {
            const listItem = document.createElement('li');
            listItem.className = 'nav-item';
            listItem.innerHTML = `
                <a class="nav-link" href="department.html?departmentId=${department.departmentId}">
                    ${department.displayName}
                </a>
            `;
            departmentMenu.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});





loadDepartments();

