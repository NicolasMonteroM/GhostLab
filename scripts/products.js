const db = firebase.firestore();
const productsRef = db.collection('products');
const storageRef = firebase.storage().ref();

const productsList = document.querySelector('.products');

let selectedItem = null;
const imagePath = [];

// creación de nuevos productos a partir de la lista
function renderProducts(list) {
    productsList.innerHTML = '';
    list.forEach(function (elem) {
        const newProduct = document.createElement('div');
        newProduct.classList.add('product');

        const url = `product.html?${elem.id}-${elem.title}`;
        newProduct.setAttribute('href', url);

        newProduct.innerHTML = `
        <a href="${url}">
        <div class="products__info">
            <div>
                <img class="products__img" style="background-image: url("${elem.img}")">
            </div>
            <div class="products__things">
                <h3 class="products__title">${elem.title}</h3>
                <p class="products__price">$${elem.price}</p>
            </div>
            <div>
                <button class="products__delete btn hidden showadmin">Eliminar</button>
                <button class="products__edit btn hidden showadmin">Editar</button>
            </div>
        </div>
        </a>
        `;

        if (elem.storageImgs) {
            elem.storageImgs.forEach(function (imageRef) {
                storageRef.child(imageRef).getDownloadURL().then(function (url) {
                    // Or inserted into an <img> element:
                    var img = newProduct.querySelector('img');
                    img.src = url;
                }).catch(function (error) {
                    // Handle any errors
                });
            })
        }

        // seleccionamos el botón "Eliminar" que se acaba de crear en este elemento
        const deleteBtn = newProduct.querySelector('.products__delete');
        deleteBtn.addEventListener('click', function () {
            //  loader.classList.add('loader--show');
            productsRef // referencia de la colección
                .doc(elem.id) // referencia de un documento específico en esa colección
                .delete() // elimine el documento asociado a esa referencia
                .then(function () {
                    // debería entrar si todo sale bien
                    console.log("Document successfully deleted!");
                    getProducts(); // traiga los productos cuando estemos seguros de que ya eliminó el que le dijimos
                })
                .catch(function (error) {
                    // debería entrar si ocurre algún error
                    console.error("Error removing document: ", error);
                });
        });

        // seleccionar el botón de editar
        // al hacer click al botón de editar
        const editBtn = newProduct.querySelector('.products__edit');
        editBtn.addEventListener('click', function () {
            form.title.value = elem.title;
            form.image.value = elem.img;
            form.info.value = elem.info;
            form.tech.value = elem.tech;
            form.price.value = elem.price;
            selectedItem = elem;
        });

        productsList.appendChild(newProduct);

    });

}

let objectsList = [];

function getProducts() {
    productsRef.get() // pide todos los documentos de la colección
        .then((querySnapshot) => {
            objectsList = [];
            querySnapshot.forEach((doc) => {
                const obj = doc.data();
                obj.id = doc.id;
                objectsList.push(obj);
                console.log(`${doc.id} => ${doc.data()}`);
            });
            renderProducts(objectsList);
        });
}

// render inicial con todos los productos
getProducts();

//Aqui es donde agregamos un producto
const form = document.querySelector('.form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newProduct = {
        title: form.title.value,
        img: form.image.value,
        price: form.price.value,
        info: form.info.value,
        tech: form.tech.value,
        storageImgs: imagePath,
    };

    function handleThen(docRef) {
        // console.log("Document written with ID: ", docRef.id);
        getProducts();
        form.title.value = '';
        form.price.value = '';
        form.image.value = '';
        form.info.value = '';
        form.tech.value = '';
        selectedItem = null;
    }

    function handleCatch(error) {
        console.error("Error adding document: ", error);
    }

    if (selectedItem) {
        // si existe selectedItem quiere decir que va a editar
        productsRef
            .doc(selectedItem.id) // seleccione el documento con ese id
            .set(newProduct) // sobreescriba la información existente
            .then(handleThen)
            .catch(handleCatch);

    } else {
        // si no existe es porque es un nuevo producto
        productsRef // referencia de la colección
            .add(newProduct) // cree un nuevo elemento en la colección
            .then(handleThen)
            .catch(handleCatch);
    }
});

// input file single, repeated
const images = form.querySelectorAll('.form__imginput');
images.forEach(function (group, index) {
    const input = group.querySelector('input');
    const img = group.querySelector('img');
    input.addEventListener('change', function () {

        // Create a reference to 'mountains.jpg'
        var newImageRef = storageRef.child(`products/${Math.floor(Math.random() * 999999999)}.jpg`);

        var file = input.files[0]; // use the Blob or File API

        var reader = new FileReader();
        reader.readAsDataURL(file); // convert to base64 string
        reader.onload = function (e) {
            img.src = e.target.result;
        }

        newImageRef.put(file).then(function (snapshot) {
            console.log(snapshot)
            console.log('Uploaded a blob or file!');
            imagePath[index] = snapshot.metadata.fullPath;
        });
    });
});

// input file multiple
const fileMulti = document.querySelector('.filemulti');
fileMulti.addEventListener('change', function () {

    Array.from(fileMulti.files).forEach(function (file, index) {

        console.log(file);
        var newImageRef = storageRef.child(`products/${Math.floor(Math.random() * 999999999)}.jpg`);

        newImageRef.put(file).then(function (snapshot) {
            console.log(snapshot)
            console.log('Uploaded a blob or file!');
            imagePath[index] = snapshot.metadata.fullPath;
        });
    })
});