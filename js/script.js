"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(element => {
            element.classList.add('hide');
            element.classList.remove('show', 'fade');
        });

        tabs.forEach(element => {
            element.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(chosen = 0) {
        tabsContent[chosen].classList.remove('hide');
        tabsContent[chosen].classList.add('show', 'fade');
        tabs[chosen].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        const targetCase = target.classList.contains('tabheader__item');

        if (target && targetCase) {
            tabs.forEach((element, number) => {
                if (target == element) {
                    hideTabContent();
                    showTabContent(number);
                }
            });
        }
    });

    // Timer

    const deadline = '2022-04-28';
    const diffSec = (Date.parse(deadline) - Date.parse(new Date()))/1000;

        function getTimeRemaining(endtime){
        const diffTotal = (Date.parse(endtime) - Date.parse(new Date()))/1000,
              diffDays = Math.floor(diffTotal/60/60/24),
              diffHours = Math.floor(diffTotal/60/60%24),
              diffMin = Math.floor(diffTotal/60%60),
              diffSec = Math.floor(diffTotal%60);

        return {
            'total': diffTotal > 0 ? diffTotal : 0,
            'seconds': diffSec > 0 ? diffSec : 0,
            'days': diffDays > 0 ? diffDays : 0,
            'hours': diffHours > 0 ? diffHours : 0,
            'minutes': diffMin > 0 ? diffMin : 0
        };
    }

    function addZero(num){

        if (num >= 0 && num < 10){
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateCLock, 1000);

        updateCLock();

        function updateCLock(){
            const myTime = getTimeRemaining(endtime);

            days.innerHTML = addZero(myTime.days);
            hours.innerHTML = addZero(myTime.hours);
            minutes.innerHTML = addZero(myTime.minutes);
            seconds.innerHTML = addZero(myTime.seconds);

            if(myTime.total<=0){
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalOpen   = document.querySelectorAll('[data-modalopen]'),
          modalClose  = document.querySelectorAll('[data-modalclose]'),
          modalWindow = document.querySelector('.modal');

    function openModal(){
            modalWindow.classList.add('show');
            modalWindow.classList.remove('hide');
            document.body.style.overflow = 'hidden';
    }

    function closeModal(){
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalOpen.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal();
        });
    });

    modalClose.forEach(btn => {
        btn.addEventListener('click', () =>{
            closeModal();
        });
    });

    modalWindow.addEventListener('click', (whereClick) => {
        if (whereClick.target === modalWindow || whereClick.target.getAttribute('data-close') == ''){
            closeModal();
        }
    });

    document.addEventListener('keydown', (pressedKey) => {
        if (pressedKey.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModal();
        }
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
        }
    },);


    // Classes

    class MenuElement {
        constructor (menuObject, parentElement, ...classes){
            this.src      = menuObject.img;
            this.alt      = menuObject.altimg;
            this.title    = menuObject.title;
            this.descr    = menuObject.descr;
            this.price    = menuObject.price;
            this.transRUB = 6;

            this.classes  = classes.length > 0 ? classes : ['menu__item'];
            
            this.parentElement = document.querySelector(parentElement);
        }

        changeToRub() {
            return this.price * this.transRUB;
        }

        render(){
            const element = document.createElement('div');
            
            this.classes.forEach(className => element.classList.add(className));

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.changeToRub()}</span> руб/день</div>
                </div>
            `;
            this.parentElement.append(element);
        }
    }

    // Forms

    const message = {
        loading: 'img/svg/spinner.svg',
        success: 'Спасибо, мы скоро свяжемся с вами',
        failure: 'Shit'
    };

    const forms = document.querySelectorAll('form');

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    const getData = async (url) => {
        const res = await fetch(url);
        
        if (!res.ok){
            throw new Error(`Не получилось: ${url}`);
        }
        return await res.json();
    };

    getData(`http://localhost:3000/menu`)
    .then(data => {
        data.forEach(obj => {
            //console.log(obj);
            new MenuElement(obj, '.menu .container').render();
        });
    });

    // axios.get(`http://localhost:3000/menu`)
    // .then(obj => {
    //     obj.data.forEach(obj => {
    //         console.log(obj);
    //         new MenuElement(obj, '.menu .container').render();
    //     });
    // });

    function bindPostData(form){
        form.addEventListener('submit', (element) => {
            element.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin:  0 auto;
                `;
                
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);
            const objSend = JSON.stringify(Object.fromEntries(formData.entries()));
            
            postData('http://localhost:3000/requests', JSON.stringify(objSend))
            .then(data => {
                //console.log(data);
                showThanksModal(message.success);
                form.reset();
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');

        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class = "modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class = "modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // SLider

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          slPrev = document.querySelector('.offer__slider-prev'),
          slNext = document.querySelector('.offer__slider-next'),
          slAll = document.querySelector('#total'),
          slCur = document.querySelector('#current'),
          slWrapper = document.querySelector('.offer__slider-wrapper'),
          slField = document.querySelector('.offer__slider-inner'),
          slWidth = window.getComputedStyle(slWrapper).width;
    
    let slIndex = 1,
        slOffset = 0;
    
    // Awesome
    if (slides.length < 10) {
        slAll.textContent = `0${slides.length}`;
        slCur.textContent =  `0${slIndex}`;
    } else {
        slAll.textContent = slides.length;
        slCur.textContent =  slIndex;
    }
    
    slides.forEach(slide => {
        slide.style.width = slWidth;
    });
    
    slider.style.position = 'relative';
    
    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.classList.add('dot');
        if (i == 0){
            dot.classList.add('dot-on');
        } else {
            dot.classList.add('dot-off');
        }

        indicators.append(dot);
    }

    const dotAll = document.querySelectorAll('.dot');

    slField.style.width = 100 * slides.length + '%';
    slField.style.display = 'flex';
    slField.style.transition = '1s all';

    slWrapper.style.overflow = 'hidden';

    function showIndex(){
        if (slIndex < 10) {
            slCur.textContent =  `0${slIndex}`;
        } else {
            slCur.textContent =  slIndex;
        }
    }

    function showDot() {
        dotAll.forEach((e) => {
            let curDot = Number(e.getAttribute('data-slide-to'));
            if (curDot == slIndex) {
                e.classList.add('dot-on');
                e.classList.remove('dot-off');
            } else {
                e.classList.remove('dot-on');
                e.classList.add('dot-off');
            }
        });
    }

    function deleteNonDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function nextClick() {
        // Slide
        if (slOffset == deleteNonDigits(slWidth) * (slides.length - 1)) {
            slOffset = 0;
        } else {
            slOffset += deleteNonDigits(slWidth); 
        }

        slField.style.transform = `translateX(-${slOffset}px)`;

        if (slIndex == slides.length) {
            slIndex = 1;
        } else {
            slIndex++;
        }

        // Index
        showIndex();

        // Dot
        showDot();

    }

    function prevClick(){
        if (slOffset == 0) {
            slOffset = deleteNonDigits(slWidth) * (slides.length - 1);
        } else {
            slOffset -= deleteNonDigits(slWidth);
        }

        slField.style.transform = `translateX(-${slOffset}px)`;

        if (slIndex == 1) {
            slIndex = slides.length;
        } else {
            slIndex--;
        }

        // Index
        showIndex();

        // Dot
        showDot();
    }
    
    function dotClick(curSlide){
        slIndex = curSlide;

        slOffset = deleteNonDigits(slWidth) * (slIndex - 1); 
        slField.style.transform = `translateX(-${slOffset}px)`;        
        
        // Index
        showIndex();

        // Dot
        showDot();
    }

    slNext.addEventListener('click', () => {
        nextClick();
    });

    slPrev.addEventListener('click', () => {
        prevClick();
    });

    dotAll.forEach((e)=> {
        e.addEventListener('click', () => {
            dotClick(Number(e.getAttribute('data-slide-to')));
        });
    });

    // Simple
    // showSlide(slIndex);

    // if (slides.length < 10){
    //     slAll.textContent = `0${slides.length}`;
    // }

    // function showSlide(n) {
    //     if (n > slides.length) {
    //         slIndex = 1;
    //     } else if (n < 1) {
    //         slIndex = slides.length;
    //     }

    //     slCur.textContent = slIndex < 10 ? `0${slIndex}` : slIndex;

    //     slides.forEach(item => item.style.display = 'none');

    //     slides[slIndex-1].style.display = 'block';
    // }

    // function nextSlide(){
    //     showSlide(slIndex += 1);
    // }

    // function prevSlide(){
    //     showSlide(slIndex -= 1);
    // }

    // slPrev.addEventListener('click', () =>{
    //     prevSlide();
    // });

    // slNext.addEventListener('click', () =>{
    //     nextSlide();
    // });

    // Calculator
    const result = document.querySelector('.calculating__result span');

    let sex = localStorage.getItem('sex') ? localStorage.getItem('sex') : 'female', 
        ratio = localStorage.getItem('ratio') ? localStorage.getItem('ratio') : 1.375,
        height, weight, age; 
        

    function calcTotal(){
        if (!sex || !height || !weight || !age || !ratio){
            result.textContent = '_____';
            return;
        }

        if (sex === 'female'){
            result.textContent = (447.6 + (9.2*weight) + (3.1*height) - (4.3*age))*ratio;
        }
        if (sex === 'male'){
            result.textContent = (88.36 + (13.4*weight) + (4.8*height) - (5.7*age))*ratio;
        }

        result.textContent = Math.round(result.textContent);
    }

    calcTotal();

    function initLocalSettings(selector, activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(e => {
            const chosenSex = e.getAttribute('id') === localStorage.getItem('sex'),
                chosenRatio = e.getAttribute('data-ratio') === localStorage.getItem('ratio');
            if (chosenSex || chosenRatio){
                e.classList.add(activeClass);        
            } else {
                e.classList.remove(activeClass);
            }

        });
    }


    function getStaticInfo(selector, activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(e =>{
            e.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                elements.forEach(e => {
                    e.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    initLocalSettings('#gender div', "calculating__choose-item_active");
    initLocalSettings('.calculating__choose_big div', "calculating__choose-item_active");

    getStaticInfo('#gender div', "calculating__choose-item_active");
    getStaticInfo('.calculating__choose_big div', "calculating__choose-item_active");


    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
                }
            calcTotal();
        });

    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});