/*let drawData = (data) => {
    data.forEach(category => {
      let parent = document.getElementsByTagName('ul')[0]
      let child = document.createElement('li')
      child.innerText = category.name
      parent.appendChild(child)
    })
  }*/ //Poner categorias en una lista
  import Swal from 'sweetalert2'

  fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(data => drawData(data))