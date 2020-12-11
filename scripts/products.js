const db = firebase.firestore();
const productsRef = db.collection('products');
const bagRef = db.collection('bag');

const storageRef = firebase.storage().ref();

const productsList = document.querySelector('.products');

let selectedItem = null;
const imagePath = [];

function renderProducts(list) {
    productsList.innerHTML = '';
    list.forEach(function (elem) {
        const newProduct = document.createElement('div');
        newProduct.classList.add('product');

        const url = `product.html?${elem.id}-${elem.title}`;
        newProduct.setAttribute('href', url);

        newProduct.innerHTML = `

        <div class="products__info">
            <div class="products__preview">
            <div>
            <a href="${url}">
                <img class="products__img" style="background-image: url("${elem.img}")">
            </a>
            </div>
            <div class="products__preview icon">
                <p class="products__addText">Add product</p>
                <svg width="32" height="32" viewBox="0 0 79 89" width:"32" height:"32" xmlns="http://www.w3.org/2000/svg">
                <path class="addToBag bagIcon showuser" fill-rule="evenodd" clip-rule="evenodd" d="M73.6214 23.2536L78.711 86.2372C78.7298 86.3577 78.7394 86.4815 78.7394 86.6075C78.7394 87.9291 77.6685 89 76.3469 89H76.3406H2.65239C1.98473 89 1.34674 88.7206 0.893761 88.2296C0.440786 87.7387 0.213661 87.0809 0.267571 86.4149L5.37151 23.2536C5.472 22.0111 6.50969 21.0538 7.75633 21.0538H21.2075V18.0249C21.2075 8.08592 29.3996 0 39.3386 0H39.6544C49.5937 0 57.573 8.08592 57.573 18.0249V21.0538H71.2366C72.4833 21.0538 73.521 22.0111 73.6214 23.2536ZM39.3386 4.78495C32.038 4.78495 25.9924 10.7243 25.9924 18.0249V21.0538H52.7881V18.0249C52.7881 10.7243 46.9549 4.78495 39.6544 4.78495H39.3386ZM41.5 44C41.5 42.8954 40.6046 42 39.5 42C38.3954 42 37.5 42.8954 37.5 44V55.5H26C24.8954 55.5 24 56.3954 24 57.5C24 58.6046 24.8954 59.5 26 59.5H37.5V71C37.5 72.1046 38.3954 73 39.5 73C40.6046 73 41.5 72.1046 41.5 71V59.5H53C54.1046 59.5 55 58.6046 55 57.5C55 56.3954 54.1046 55.5 53 55.5H41.5V44Z"/>
                </svg>
                </div>
            </div>

            <div class="products__things">
                <h3 class="products__title">${elem.title}</h3>
                <p class="products__price">$${elem.price}</p>
            </div>
   
            <div>
                <button class="products__delete btn hidden showadmin">Delete</button>
                <button class="products__edit btn hidden showadmin"><a href="#formdiv">Edit</a></button>
            </div>
        </div>
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

            productsRef.doc(elem.id).delete().then(function () {
                console.log("Document successfully deleted!");
                getProducts();
            })
                .catch(function (error) {
                    console.error("Error removing document: ", error);
                });
        });

        const editBtn = newProduct.querySelector('.products__edit');
        editBtn.addEventListener('click', function () {
            form.title.value = elem.title;
            form.info.value = elem.info;
            form.tech.value = elem.tech;
            form.price.value = elem.price;
            form.largeInfo.value = elem.largeInfo;
            selectedItem = elem;

        });

        const addBtn = newProduct.querySelector('.addToBag');
        addBtn.addEventListener('click', function (event) {
            event.preventDefault();

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    const bagProductRef = bagRef.doc();
                    const bagProduct = {
                        title: elem.title,
                        info: elem.info,
                        tech: elem.tech,
                        price: elem.price,
                        largeInfo: elem.largeInfo,

                    }

                    bagProductRef.set(bagProduct);
                }
            });
        });

/*
        gsap.to('.addToBag', {
            opacity: 1,
            duration: 5
        });*/

        productsList.appendChild(newProduct);

    });

}

let objectsList = [];

function getProducts() {
    productsRef.get()
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

getProducts();

const form = document.querySelector('.form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newProduct = {
        title: form.title.value,
        img: form.image.value,
        price: form.price.value,
        largeInfo: form.largeInfo.value,
        info: form.info.value,
        tech: form.tech.value,
        storageImgs: imagePath,
    };

    function handleThen(docRef) {
        getProducts();
        form.title.value = '';
        form.price.value = '';
        form.image.value = '';
        form.largeInfo.value = '';
        form.info.value = '';
        form.tech.value = '';
        selectedItem = null;
    }

    function handleCatch(error) {
        console.error("Error adding document: ", error);
    }

    if (selectedItem) {
        productsRef.doc(selectedItem.id).set(newProduct).then(handleThen).catch(handleCatch);

    } else {
        productsRef.add(newProduct).then(handleThen).catch(handleCatch);
    }
});

const images = form.querySelectorAll('.form__imginput');
images.forEach(function (group, index) {
    const input = group.querySelector('input');
    const img = group.querySelector('img');
    input.addEventListener('change', function () {

        var newImageRef = storageRef.child(`products/${Math.floor(Math.random() * 999999999)}.jpg`);

        var file = input.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);
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

const filterForm = document.querySelector('.filters');

filterForm.addEventListener('input', function () {

    let copy = objectsList.slice();

    const order = filterForm.order.value;

    switch (order) {
        case 'price_asc':
            copy.sort(function (a, b) {
                return a.price - b.price;
            });
            break;
        case 'price_desc':
            copy.sort(function (a, b) {
                return b.price - a.price;
            });
            break;
    }

    const pricefilter = filterForm.pricefilter.value;

    if (pricefilter != '') {
        copy = copy.filter(function (elem) {

            if (elem.price < parseInt(pricefilter)) {
                return true;
            }
            return false;
        });
    }

    const techfilter = filterForm.techfilter.value;

    if (techfilter != '') {
        copy = copy.filter(function (elem) {

            if (elem.tech.toLowerCase().includes(techfilter)) {
                return true;
            }
            return false;
        });
    }

    renderProducts(copy);
});