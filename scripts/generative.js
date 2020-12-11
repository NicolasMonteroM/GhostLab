const toInteraction = document.querySelector('.toInteraction');

toInteraction.addEventListener('click', function () {

    document.getElementById('interaction').style.height = '100vh';

    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

});