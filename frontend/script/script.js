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

document.getElementById("openModalButton").addEventListener("click", function() {
        document.getElementById("customModal").style.display = "flex";
    });
    
    document.getElementById("ridersignin").addEventListener("click", function() {
      window.location.href = "./view/login.html";
  });
  document.getElementById("driversignin").addEventListener("click", function() {
    window.location.href = "./view/driverlogin.html";
});
    
    document.querySelector(".modal .close").addEventListener("click", function() {
        document.getElementById("customModal").style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target.id === "customModal") {
            document.getElementById("customModal").style.display = "none";
        }
    });


function getData() {
    
  fetch("https://wild-jade-fish-cap.cyclic.app/carData/", {
    headers: {
      "Content-type": "application/json",
    //   authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayService(data);
    })
    .catch((err) => console.log(err));

}
const cardList = document.querySelector(".slide-track");

function displayService(data) {
  
  const cars = data.cars_data;
  console.log(cars)

  cars.forEach((service) => {
    const slide = document.createElement("div");
        slide.classList.add("slide");

        const innerTarrif = document.createElement("div");
        innerTarrif.classList.add("inner-tarrif");

        const tarrifContainer = document.createElement("div");
        tarrifContainer.classList.add("tarrif-container");

        const innerBox = document.createElement("div");
        innerBox.classList.add("inner-box");


    const image = document.createElement("img");
    image.src = service.image;
    image.alt = service.name;

    const name = document.createElement("h2");
    name.innerText = service.name;

    const description = document.createElement("p");
    description.innerText = service.description;


    const reason = document.createElement("h3");
    reason.classList.add("heading-yellow")
    reason.innerText = service.reason;


    const type = document.createElement("h3");
    type.classList.add("yellw-section")
    type.innerText = service.type;

    const booknow = document.createElement('a');
    booknow.classList.add("btn-yellow")
    booknow.innerText = 'Book Now'
    booknow.href = "./view/login.html"
    
    innerBox.append(name, image,  description, reason, type, booknow);
        tarrifContainer.append(innerBox);
        innerTarrif.append(tarrifContainer);
        slide.append(innerTarrif);
        cardList.append(slide);
  });
}

getData();
const slider = document.querySelector('.slider');

slider.addEventListener('mouseenter', () => {
    const slideTrack = document.querySelector('.slide-track');
    slideTrack.style.animationPlayState = 'paused';
});

slider.addEventListener('mouseleave', () => {
    const slideTrack = document.querySelector('.slide-track');
    slideTrack.style.animationPlayState = 'running';
});
