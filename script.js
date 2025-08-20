const urlBase = 'https://jsonplaceholder.typicode.com/posts';// Definimos la URL base de la API
let posts = [];//Iniciamos un array vacío para almacenar los posts

function getData(){
    fetch(urlBase)
        .then(response => response.json())
        .then(data => {
            posts = data;
            renderPostsList()//Metodo para renderizar los posts en el HTML
        })
        .catch(error => console.error('Error al llamar la API:', error));
}
getData(); // Llamamos a la función para obtener los datos al cargar la página

function renderPostsList() {
    const postsList = document.getElementById('postList')
    postsList.innerHTML = ''; // Limpiamos la lista antes de renderizar

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
        
        <strong>${post.title}</strong><br>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Eliminar</button>

        <div id="editForm${post.id}" class="editForm" style="display:none;">
        <label for="editTitle${post.id}">Título:</label>
        <input type="text" id="editTitle${post.id}" value="${post.title}" required>
        <label for="editBody${post.id}">Comentar: :</label>
        <textarea id="editBody${post.id}" required>${post.body}</textarea>
        <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>

        `;

        postsList.appendChild(listItem);
    });
}

function postData(){
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if(!postTitle || !postBody) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        posts.unshift(data); // Agregamos el nuevo post al array de posts
        renderPostsList(); // Re-renderizamos la lista de posts
        postTitleInput.value = '';
        postBodyInput.value = '';
    })
    .catch(error => console.error('Error al crear el post:', error));
}   

const editPost = (id) => {
    const editForm = document.getElementById(`editForm${id}`);
    editForm.style.display = (editForm.style.display == 'none' ? 'block' : 'none'); // Mostramos el formulario de edición
}

const updatePost = (id) => {
    const editTitleInput = document.getElementById(`editTitle${id}`);
    const editBodyInput = document.getElementById(`editBody${id}`);
    const updatedTitle = editTitleInput.value;
    const updatedBody = editBodyInput.value;

    if(!updatedTitle || !updatedBody) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: updatedTitle,
            body: updatedBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === id);
        posts[index] = data; // Actualizamos el post en el array
        renderPostsList(); // Re-renderizamos la lista de posts
    })
    .catch(error => console.error('Error al actualizar el post:', error));
}


const deletePost = (id) => {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        posts = posts.filter(post => post.id !== id); // Eliminamos el post del array
        renderPostsList(); // Re-renderizamos la lista de posts
    })
    .catch(error => console.error('Error al eliminar el post:', error));
}