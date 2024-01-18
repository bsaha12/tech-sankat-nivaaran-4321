let menubar = document.querySelector('#menu-bars');
let mynav = document.querySelector('.navbar');
let buttonbar = document.querySelector('#button-bar');
let mynav1 = document.querySelector('.navbar1');

menubar.onclick = () => {
    menubar.classList.toggle('fa-times');
    mynav.classList.toggle('active');
    mynav1.classList.remove('active'); // Close the other menu if open
};


buttonbar.onclick = () => {
    menubar.classList.toggle('fa-times');
    mynav1.classList.toggle('active');
    mynav.classList.remove('active'); // Close the other menu if open
};