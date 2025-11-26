
let drawData = (data) => {
    let parent = document.querySelector(".categories-list")
    parent.innerHTML = '';
    data.forEach(category => {
      let li = document.createElement("li")
      let button = document.createElement("button")
      button.innerText = category.name
      button.classList.add("category-btn")
      let deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = "Borrar " + category.name
      deleteBtn.classList.add("delete-btn")
      deleteBtn.onclick = () => {
        deleteCategory(category.id);
      }
      li.appendChild(button)
      li.appendChild(deleteBtn)
      parent.appendChild(li)
    })
  }

  fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(data => drawData(data))

//Añadir categorias
const boton_categoria = document.querySelectorAll('.btn-tab')[0];
const modal_categoria = document.getElementById('modalCategory');

boton_categoria.addEventListener('click', () => {
  modal_categoria.style.display = 'flex';
});
const boton_categoria_cancel = modal_categoria.querySelector('.btn-secondary');
boton_categoria_cancel.addEventListener('click', () => {
  modal_categoria.style.display = 'none';
});

const boton_categoria_ok = modal_categoria.querySelector('.btn-primary');
boton_categoria_ok.addEventListener('click', (e) => {
  e.preventDefault();
  const cat_name = modal_categoria.querySelector("#categoryName").value
  if (!cat_name || cat_name.trim() === '') {
    Swal.fire({
    icon: "error",
    title: "Categoría vacía",
    text: "Por favor introduzca un nombre para la categoría",
    });
  return;
  }
  const categoryData = {
    name: cat_name
  };
  fetch('http://localhost:3000/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryData)
  })
  .then( function (){
    modal_categoria.style.display = 'none';
    modal_categoria.querySelector("#categoryName").value = '';
    fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(data => drawData(data))
    Swal.fire({
    title: "Categoría creada",
    icon: "success"
});
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire({
    icon: "error",
    title: "Error al crear la categoría",
    });
  });
});

//Borrar categorías
function deleteCategory(id) {
  Swal.fire({
  title: "¿Estás seguro de querer borrarla?",
  text: "Este cambio no se puede revertir",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Borrar"
}).then((result) => {
  if (result.isConfirmed) {
    fetch("http://localhost:3000/categories/" + id, {
    method: 'DELETE'
    })
    .then(() => {
      fetch("http://localhost:3000/categories")
        .then(res => res.json())
        .then(data => drawData(data));
    })
    .catch(error => {
      console.error('Error:', error);
       Swal.fire({
      icon: "error",
      title: "Error al borrar la categoría",
      });
    });
    Swal.fire({
      title: "Categoría borrada",
      icon: "success"
    });
  }
});
}