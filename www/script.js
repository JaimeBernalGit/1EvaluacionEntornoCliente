const boton_site = document.querySelectorAll(".btn-tab")[1]
boton_site.disabled = true

let drawData = (data) => {
    let parent = document.querySelector(".categories-list")
    parent.innerHTML = ""
    data.forEach(category => {
      let li = document.createElement("li")
      let button = document.createElement("button")
      button.innerText = category.name
      button.classList.add("category-btn")
      button.onclick = () => {
        loadCategorySites(category.id)
        document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")
        boton_site.disabled = false
        boton_site.dataset.categoryId = category.id
      }
      let deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = "Borrar " + category.name
      deleteBtn.classList.add("delete-btn")
      deleteBtn.onclick = (e) => {
        e.stopPropagation()
        deleteCategory(category.id)
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
const boton_categoria = document.querySelectorAll(".btn-tab")[0]
const modal_categoria = document.getElementById("modalCategory")

boton_categoria.addEventListener("click", () => {
  modal_categoria.style.display = "flex"
})
const boton_categoria_cancel = modal_categoria.querySelector(".btn-secondary")
boton_categoria_cancel.addEventListener("click", () => {
  modal_categoria.style.display = "none"
})

const boton_categoria_ok = modal_categoria.querySelector(".btn-primary")
boton_categoria_ok.addEventListener("click", (e) => {
  e.preventDefault()
  const cat_name = modal_categoria.querySelector("#categoryName").value
  if (!cat_name || cat_name.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "Categoría vacía",
    text: "Por favor introduzca un nombre para la categoría"
    })
  return
  }
  const categoryData = {
    name: cat_name
  }
  fetch("http://localhost:3000/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(categoryData)
  })
  .then( function (){
    modal_categoria.style.display = "none"
    modal_categoria.querySelector("#categoryName").value = ""
    fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(data => drawData(data))
    Swal.fire({
    title: "Categoría creada",
    icon: "success"
    })
  })
  .catch(error => {
    console.error("Error:", error)
    Swal.fire({
    icon: "error",
    title: "Error al crear la categoría",
    })
  })
})

//Borrar categorías
function deleteCategory(id) {
  Swal.fire({
  title: "¿Estás seguro de querer borrarla?",
  text: "Este cambio no se puede revertir",
  icon: "warning",
  showCancelButton: true,
  cancelButtonText: "Cancelar",
  confirmButtonColor: "red",
  confirmButtonText: "Borrar"
}).then((result) => {
  if (result.isConfirmed) {
    fetch("http://localhost:3000/categories/" + id, {
    method: "DELETE"
    })
    .then(() => {
      Swal.fire({
      title: "Categoría borrada",
      icon: "success"
    })
      fetch("http://localhost:3000/categories")
        .then(res => res.json())
        .then(data => drawData(data))
    })
    .catch(error => {
      console.error("Error:", error)
      Swal.fire({
        icon: "error",
        title: "Error al borrar la categoría",
      })
    })
  }
})
}

//Mostrar sites de categorias
function loadCategorySites(categoryId) {
  fetch("http://localhost:3000/sites")
  .then(res => res.json())
  .then(allSites => {
    const filteredSites = allSites.filter(site => site.categoryId === categoryId)
    drawSites(filteredSites)
  })
  .catch(error => {
    console.error("Error al cargar sites:", error)
    Swal.fire({
      icon: "error",
      title: "Error al cargar los sitios",
    })
  })
}

function drawSites(sites) {
  let tbody = document.getElementById("tabla")
  tbody.innerHTML = ""
  if (sites.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay sitios en esta categoría</td></tr>'
    return
  }
  sites.forEach(site => {
  let tr = document.createElement("tr")

  let tdName = document.createElement("td")
  tdName.innerText = site.name
  tr.appendChild(tdName)

  let tdUser = document.createElement("td")
  tdUser.innerText = site.user
  tr.appendChild(tdUser)

  let tdDate = document.createElement("td")
  tdDate.innerText = new Date().toLocaleDateString("es-ES")
  tr.appendChild(tdDate)

  let tdActions = document.createElement("td")
  tdActions.classList.add("actions")
  let btnDelete = document.createElement("button")
  btnDelete.classList.add("btn-icon")
  btnDelete.title = "Eliminar"
  btnDelete.innerHTML = "🗑️"
  btnDelete.onclick = () => {
      deleteSite(site.id)
  }
  tdActions.appendChild(btnDelete)
  tr.appendChild(tdActions)
    
  tbody.appendChild(tr)
  })
}

//Añadir site
const modal_site = document.getElementById("modalSite")

boton_site.addEventListener("click", () => {
  modal_site.style.display = "flex"
})
const boton_site_cancel = modal_site.querySelector(".btn-secondary")
boton_site_cancel.addEventListener("click", () => {
  modal_site.style.display = "none"
})
const boton_site_ok = modal_site.querySelector(".btn-primary")
boton_site_ok.addEventListener("click", (e) => {
  e.preventDefault()
  const site_name = modal_site.querySelector("#siteName").value
  if (!site_name || site_name.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "Nombre vacío",
    text: "Por favor introduzca un nombre para el sitio"
    })
  return
  }
  const site_url = modal_site.querySelector("#siteUrl").value
  if (!site_url || site_url.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "URL vacía",
    text: "Por favor introduzca una URL para el sitio"
    })
  return
  }
  const site_user = modal_site.querySelector("#siteUser").value
  if (!site_user || site_user.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "Usuario vacío",
    text: "Por favor introduzca un usuario para el sitio"
    })
  return
  }
  const site_password = modal_site.querySelector("#sitePassword").value
  if (!site_password || site_password.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "Contraseña vacía",
    text: "Por favor introduzca una contraseña para el sitio"
    })
  return
  }
  const site_description = modal_site.querySelector("#siteDescription").value
  if (!site_description || site_description.trim() === "") {
    Swal.fire({
    icon: "error",
    title: "Descripción vacía",
    text: "Por favor introduzca una descripción para el sitio"
    })
  return
  }
  const siteData = {
    name: site_name,
    url: site_url,
    user: site_user,
    password: site_password,
    description: site_description
  }
  fetch("http://localhost:3000/categories/" + boton_site.dataset.categoryId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(siteData)
  })
  .then(response => response.json())
  .then( function (){
    modal_site.style.display = "none"
    modal_site.querySelector("#siteName").value = ""
    modal_site.querySelector("#siteUrl").value = ""
    modal_site.querySelector("#siteUser").value = ""
    modal_site.querySelector("#sitePassword").value = ""
    modal_site.querySelector("#siteDescription").value = ""
    let activeCategory = document.querySelector(".category-btn.active")
    if (activeCategory) {
    activeCategory.click()
    }
    Swal.fire({
    title: "Sitio creado",
    icon: "success"
    })
  })
  .catch(error => {
    console.error("Error:", error)
    Swal.fire({
    icon: "error",
    title: "Error al crear el sitio",
    })
  })
})

//borrar Site
function deleteSite(siteId) {
  Swal.fire({
    title: "¿Estás seguro de querer borrar este sitio?",
    text: "Este cambio no se puede revertir",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "red",
    confirmButtonText: "Borrar"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("http://localhost:3000/sites/" + siteId, {
        method: "DELETE"
      })
      .then(() => {
        Swal.fire({
          title: "Sitio borrado",
          icon: "success"
        })
        let activeCategory = document.querySelector(".category-btn.active")
        if (activeCategory) {
          activeCategory.click()
        }
      })
      .catch(error => {
        console.error("Error:", error)
        Swal.fire({
          icon: "error",
          title: "Error al borrar el sitio",
        })
      })
    }
  })
}

// Generar contraseña segura
function generateSecurePassword(length = 12) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = "";

  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password;
}

const btnGeneratePassword = modal_site.querySelector(".btn-generate");
btnGeneratePassword.addEventListener("click", () => {
  const passwordInput = modal_site.querySelector("#sitePassword");
  const newPassword = generateSecurePassword(12); 
  passwordInput.value = newPassword;
  Swal.fire({
    title: "Contraseña generada",
    html: `<strong>${newPassword}</strong>`,
    icon: "success",
    showConfirmButton: false
  });
});