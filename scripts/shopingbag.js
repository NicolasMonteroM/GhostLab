const db = firebase.firestore();
const bagRef = db.collection('bag');

const storageRef = firebase.storage().ref();

const productsList = document.querySelector('.bagProducts');

function renderProducts(list) {
    productsList.innerHTML = '';
    list.forEach(function (elem) {
        const newProduct = document.createElement('div');
        newProduct.classList.add('bag');

        const url = `product.html?${elem.id}-${elem.title}`;
        newProduct.setAttribute('href', url);

        newProduct.innerHTML = `

        <div class="bagProducts__info">
            <div class="bagProducts__things">
                <h2 class="bagProducts__title">${elem.title}</h2>
                <p class="bagProducts__price">$${elem.price}</p>
            </div>
   
            <div>
                <button class="bagProducts__delete btn">Eliminar</button>
            </div>
        </div>
        `;

        const deleteBtn = newProduct.querySelector('.bagProducts__delete');
        deleteBtn.addEventListener('click', function () {
            bagRef.doc(elem.id).delete().then(function () {
                console.log("Document successfully deleted!");
                getProducts();
            })
                .catch(function (error) {
                    console.error("Error removing document: ", error);
                });
        });

        productsList.appendChild(newProduct);

    });

}

let objectsList = [];

function getProducts() {
    bagRef.get().then((querySnapshot) => {
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
