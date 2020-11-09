
const authWith = document.querySelector('.navbar__with');
const authWithout = document.querySelector('.navbar__without');

const authSignout = document.querySelector('.signout');

var userInfo;

firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    // si el usuario existe quiere decir que inició sesión, se registró o ya tenía sesión iniciada

    console.log(user);
    authWith.classList.remove('hidden');
    authWithout.classList.add('hidden');

    const db = firebase.firestore();
    const usersRef = db.collection('users');
    usersRef.doc(user.uid).get().then(function (doc) {
      if (doc.exists) {
        const data = doc.data();
        userInfo = data;

        if (data.admin) {
          const showAdmin = document.querySelectorAll('.showadmin');
          showAdmin.forEach(function (elem) {
            elem.classList.remove('hidden');
          });
        }
      }
    });
  } 
});

// cerrar sesión
authSignout.addEventListener('click', function (event) {

  console.log("aaaaaaaaa")

  event.preventDefault();
  firebase.auth().signOut();
  window.location.href = 'login.html';
});