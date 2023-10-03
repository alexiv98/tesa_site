'use strict';
document.addEventListener('DOMContentLoaded', function () {
    // Фиксированное меню

const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
fixedMenu ();
window.addEventListener('scroll', fixedMenu);
function fixedMenu () {
    
    if (window.scrollY > 50) {
        header.classList.add('header-fixed');
        menu.classList.add('menu-fixed');
    } else {
        header.classList.remove('header-fixed');
        menu.classList.remove('menu-fixed');
    }
}
//

//pageup


    const pageUpElem = document.querySelector('#pageup');
    if (pageUpElem) {
        let counterScroll;
    pageUpElem.classList.add('hide');
    
    
    window.addEventListener('scroll', () => {
        counterScroll = document.documentElement.scrollTop;
        if (counterScroll > 1000) {
            pageUpElem.classList.add('show');
            pageUpElem.classList.remove('hide');
        } else {
            pageUpElem.classList.add('hide');
            pageUpElem.classList.remove('show');
        }
    })
    pageUpElem.addEventListener('click', (e) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    })


    }
    


// Загрузка каталога

class MenuCard {
    constructor(parentCards, parentTabs) {
        this.parentCards = document.querySelector(parentCards);
        this.parentTabs = document.querySelector(parentTabs);
    }
    renderCategory(titleText, idCategory) {
        this.category = document.createElement('div');
        this.category.classList.add('category');
        this.category.id = idCategory;
        this.parentCards.append(this.category);

        this.title = document.createElement('h3');
        this.title.classList.add('title', 'title_products', 'animate');
        this.title.innerHTML = titleText;
        this.category.append(this.title);

        this.itemWrapper = document.createElement('div');
        this.itemWrapper.classList.add('products__wrapper');
        this.category.append(this.itemWrapper);
    }
    renderElement(title, descr, scr, alt, price, link) {
        const element = document.createElement('div');
        element.classList.add('products__item', 'animate');
        element.innerHTML = `
            <a href="${link}" class="products__item-img"><img src="${scr}" alt="${alt}"></a>
            <div class="products__item-title">${title}</div>
            <div class="products__item-descr">${descr}</div>
            <div class="products__item-price">${price}</div>
            <a href="${link}" class="button button_products">Детальніше</a>
        `;
        this.itemWrapper.append(element);
    }
    renderTabs(titleText, dataTab) {
        this.tab = document.createElement('div');
        this.tab.innerHTML = titleText;
        this.tab.setAttribute('data-tab', dataTab);
        this.tab.classList.add('tabs__item');
        this.parentTabs.append(this.tab);
    }


}

// Асинхронная функция загруки данных с сервера
async function loadData() {
    try {
        const response = await fetch('js/catalog.json');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        const card = new MenuCard('.products', '.tabs__list');
        for (const category in data) {
            const products = data[category];
            card.renderCategory(category, data[category].id);
            card.renderTabs(category, data[category].id);
            for (const product of products.items) {
                card.renderElement(
                    product.title,
                    product.descr,
                    product.src,
                    product.alt,
                    product.price,
                    product.link
                );
            }
        }
        
        // Настройка табов после загрузки данных с сервера
        tabsSetup('.tabs__item', '.tabs__list', '.category', 'tabs__item_active');
        setDelayAnimation();
        setUpAnimate()
    } catch (error) {
        console.error('Ошибка при загрузке JSON файла:', error);
    }
}


// ТАБЫ

function tabsSetup(tabsClass, tabsParentClass, tabsContentClass, tabsActive) {
    const tabs = document.querySelectorAll(tabsClass),
          tabsParent = document.querySelector(tabsParentClass),
          tabsContent = document.querySelectorAll(tabsContentClass);

    function hideTabContent(){ 
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        })
        tabs.forEach(item => {
            item.classList.remove(tabsActive)
        })
    }
    hideTabContent();

    function showTabContent(atribute, item) {
        item.classList.add(tabsActive);
        tabsContent.forEach((tab) => {
            if (atribute === 'all') {
                tab.classList.add('show');
                tab.classList.remove('hide');  
            } else if (tab.id === atribute) {
                tab.classList.add('show');
                tab.classList.remove('hide');
            }
        })
    }
    showTabContent(tabs[0].getAttribute('data-tab'), tabs[0]);
    
    
    tabsParent.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains(tabsClass.slice(1))) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(item.getAttribute('data-tab'), item);
                }
            })
        } 
    })
}



if (window.location.href.includes('catalog.html')) {
    loadData();
}
if(document.querySelector('.card__tabs')) {
    tabsSetup('.card__tab', '.card__tabs', '.card__details-area', 'card__tab_active');
}
if (!window.location.href.includes('catalog.html')) {
    setDelayAnimation();
    setUpAnimate();
}


// Анимации
function setUpAnimate() {
    const option = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };
    
    function handleIntersection(entries, observer) {
        entries.forEach((item) => {
            if (item.isIntersecting) {
                const animatedElement = item.target;
                animatedElement.classList.add('animate_show');
                observer.unobserve(animatedElement) ;
            }
        });
    }
    
    let observer = new IntersectionObserver(handleIntersection, option);
    
    const testToAnimate = document.querySelectorAll('.animate');
    
    
    if (testToAnimate.length > 0) {
        testToAnimate.forEach((element) => {
            observer.observe(element);
        })
    }
} 


// задержка анимации для каталога.
function setDelayAnimation () {
    const delayStep = 120;
    const catalogItems = document.querySelectorAll('.products__item');
    
    if (catalogItems.length > 0) {
        let rowDelay = 0;
        let prevItemTop = 0;
        catalogItems.forEach((item, i) => {
                const itemTop = item.getBoundingClientRect().top;
                const topDifference = itemTop - prevItemTop;


                if (topDifference > 0) {
                    rowDelay = 0
                }
                item.style.transitionDelay = `${rowDelay}ms`;

                rowDelay += delayStep;
                prevItemTop = itemTop;
        });

    } 
}

const burgerBtn = document.querySelector('.burger'),
      burgerMenu = document.querySelector('.burger-menu'),
      burgerClose = document.querySelector('.burger-menu__close');

if (burgerBtn){
    burgerBtn.addEventListener('click', () => {
        burgerMenu.classList.add('active');
    })
    
    burgerMenu.addEventListener('click', (e) => {
            if (e.target === burgerClose || e.target.classList.contains('burger-menu__overlay')) {
            burgerMenu.classList.remove('active');
        }    
    })
}


//modal

function openModal(modalWindow) {
    modalWindow.classList.add('show');
    modalWindow.classList.remove('hide');
}

function closeModal(modalWindow) {
    modalWindow.classList.add('hide');
    modalWindow.classList.remove('show');
}

function modal() {
    const btnsOpen = document.querySelectorAll('[data-modal]');
    const modalWindow = document.querySelector('#modal');
    const closeBtn = document.querySelector('#modal__close');
    if (modalWindow) {
        btnsOpen.forEach(bntOpen => {
            bntOpen.addEventListener('click', event => {
                event.preventDefault();
                openModal(modalWindow);
            })
        });
    
        modalWindow.addEventListener('click', event => {
            if(event.target === modalWindow || event.target === closeBtn) {
                closeModal(modalWindow);
            }
        });
    }
    
}

function showThanksModal(thanksText, formAttribute) {
    const prevForms = document.querySelectorAll('.contact__item-form');
    prevForms.forEach(form => {
        if (form.getAttribute('data-form') === formAttribute) {
            form.classList.add('hide');
            let thanksModal = document.createElement('div');
            const parentElement = form.parentNode;
            const firstChild = parentElement.firstChild;
            thanksModal.innerHTML = `
                <div class="thanks__title">${thanksText}</div>
                <div class="thanks__subtitle"></div>
            `;
            thanksModal.classList.add('thanks-modal');
            parentElement.insertBefore(thanksModal, firstChild);
            setTimeout(() => {
                closeModal(document.querySelector('#modal'));
                thanksModal.remove();
                form.classList.add('show');
                form.classList.remove('hide');
            }, 4000);
        }
        
    })
    

   

}

modal();


// Form sending 

function forms() {
    const formsList = document.querySelectorAll('.contact-form');
    const formInputs = document.querySelectorAll('.contact-form__input');

    formsList.forEach(form => {
        form.addEventListener('submit', formSend);
        const formAttribute = form.getAttribute('data-form');
        async function formSend(e) {
            e.preventDefault();
            let error = validateForm(form);

            let formData = new FormData(form);
            formData.append('name', document.querySelector('#name').value);
            formData.append('email', document.querySelector('#email').value);
            formData.append('message', document.querySelector('#message').value);
            formData.append('item', document.querySelector('.title').textContent);


            if (error === 0) {
                const parentElement = form.parentElement;
                parentElement.classList.add('sending');
                let response = await fetch('sendmail.php', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    let result = await response.json()
                    showThanksModal(result.message, formAttribute);
                    form.reset();
                    parentElement.classList.remove('sending');


                } else {
                    showThanksModal('Помилка при надсиланні запиту на сервер', formAttribute);
                    parentElement.classList.remove('sending');
                }
            } else {
                alert('Заповніть усі поля');
            }

        }

        
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });
    });
}

function validateForm(form) {
    const formInputs = form.querySelectorAll('.contact-form__input');
    let error = 0;

    formInputs.forEach(input => {
        const inputValue = input.value.trim();

        if ((input.classList.contains('_email') && !validateEmail(inputValue)) ||
            (input.classList.contains('_name') && inputValue === '')) {
            toggleClass(input, false);
            error++;
        } else {
            toggleClass(input, true);
        }
    });

    return error;
}

function validateInput(input) {
    const inputValue = input.value.trim();

    if ((input.classList.contains('_email') && !validateEmail(inputValue)) ||
        (input.classList.contains('_name') && inputValue === '')) {
        toggleClass(input, false);
    } else {
        toggleClass(input, true);
    }
}

function toggleClass(input, isValid) {
    input.classList.toggle('invalid', !isValid);
}

function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}

forms();















});

