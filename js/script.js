import tabs   from './modules/tabs';
import modal  from './modules/modal';
import timer  from './modules/timer';
import cards  from './modules/cards';
import calc   from './modules/calc';
import forms  from './modules/forms';
import slider from './modules/slider';

import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', function() {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000);

    tabs({
        tabsSelector: '.tabheader__item',
        contentSelector: '.tabcontent',
        parentSelector: '.tabheader__items',
        classActive: 'tabheader__item_active',
        classTab: 'tabheader__item'
    });
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2022-09-22');
    cards();
    calc();
    forms('form', modalTimerId);
    slider({
        slides: '.offer__slide',
        slider: '.offer__slider',
        prev: '.offer__slider-prev',
        next: '.offer__slider-next',
        total: '#total',
        current: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});