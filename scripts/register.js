const db = firebase.firestore();
const usersRef = db.collection('users');
const register = document.querySelector('.register');

register.addEventListener('submit', function (event) {
  event.preventDefault();
  const email = register.email.value;
  const password = register.password.value;
  const name = register.name.value;
  const lastname = register.lastname.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function (credentials) {

    const uid = credentials.user.uid;

    usersRef.doc(uid).set({
      name: name,
      lastname: lastname,
      email: email,
    }).then(function () {
      window.location.href = 'index.html';
    });

  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error)

    register.querySelector('.form__error').classList.remove('hidden');
    // ...
  });
});