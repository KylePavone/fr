// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";
import { removeClasses } from "./functions.js"


window.onload = function(){
    document.addEventListener("click", documentActions)
    function documentActions(e) {
        
        const targetElement = e.target
        if (window.innerWidth > 768 && isMobile.any()) {
            if(targetElement.classList.contains("menu__arrow")){
                targetElement.closest(".menu__item").classList.toggle("_hover")
            }
            if ( !targetElement.closest(".menu__item") && document.querySelectorAll(".menu__item._hover").length > 0){
                removeClasses(document.querySelectorAll(".menu__item._hover"), "_hover")
            }
        }
        if (targetElement.classList.contains("search-form__icon")) {
            document.querySelector(".search-form").classList.toggle("_active")
        } else if ( !targetElement.closest("search-form") && document.querySelector(".search-form._active")){
            document.querySelector(".search-form").classList.remove("_active")
        }

        if (targetElement.classList.contains("products__more")){
        getProducts(targetElement)
        e.preventDefault()
        }
        if (targetElement.classList.contains("actions-product__button")){
            const productId = targetElement.closest(".item-product").dataset.pid
            console.log(productId);
            
            addToCart(targetElement, productId)
            e.preventDefault()
        }
        if (targetElement.classList.contains("cart-header__icon") || targetElement.closest(".cart-header__icon")){
            if (document.querySelector(".cart-list").children.length > 0) {
                document.querySelector(".cart-header").classList.toggle("_active")
                
            } 
            e.preventDefault()
        } else if (!targetElement.closest(".cart-header") && !targetElement.classList.contains("action-product__button")){
            document.querySelector(".cart-header").classList.remove("_active")
        }
        if (targetElement.classList.contains("cart-list__delete")) {
            const productId = targetElement.closest(".cart-list__item").dataset.cartPid
            updateCart(targetElement, productId, false)
            e.preventDefault()
        }
    }
    const burger = document.querySelector(".icon-menu")
    if (burger) {
        const menuBody = document.querySelector(".menu__body")
        burger.addEventListener("click", function(){
            menuBody.classList.toggle("_active")
        })
    }
    const arrow_1 = document.querySelector(".title__1")
    arrow_1.addEventListener("click", function(e){
        arrow_1.classList.toggle("_active")
    })
    const arrow_2 = document.querySelector(".title__2")
    arrow_2.addEventListener("click", function(e){
        arrow_2.classList.toggle("_active")
    })
    const arrow_3 = document.querySelector(".title__3")
    arrow_3.addEventListener("click", function(e){
        arrow_3.classList.toggle("_active")
    })

    const headerElement = document.querySelector(".header")

    const callback = function(entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove("_scroll")
        } else {
            headerElement.classList.add("_scroll")
        }
    }


    const headerObserver = new IntersectionObserver(callback)
    headerObserver.observe(headerElement)



    

    // Load more products
    async function getProducts(button){
        if (!button.classList.contains("_hold")){
            button.classList.add("_hold")
            const url = "http://127.0.0.1:8000/articles/products"
            let response = await fetch(url, {
                method: "GET"
            })
            if (response.ok) {
                let result = await response.json()
                loadProducts(result)
                button.classList.remove("_hold")
                button.remove()
            } else {
                alert("Ошибка!")
            }
        }
    }

    function loadProducts(data){
        const productItems = document.querySelector(".products__items")
        data.forEach(item => {
            const productId = item.id
            const productUrl = item.url
            const productImage = item.image
            const productTitle = item.title
            const productText = item.text
            const productPrice = item.price
            const productOldPrice = item.priceOld
            const productShareUrl = item.shareUrl
            const productLikeUrl = item.likeUrl
            const productLabels = item.labels
            let brandNew = ""
            let brandNewType = ""
            let sale = ""
            let saleType = ""
            let itemFirstPart = ``
            if (productLabels){
                productLabels.forEach(label => {
                    if (label.type === "new"){
                        brandNew = label.value
                        brandNewType = label.type
                        itemFirstPart = `
                            <article data-pid="${productId}" class="product__item item-product">
                            <div class="item-product__labels">
                                <div class="item-product__label item-product__label-${brandNewType}">${brandNew}</div>
                            </div>`
                    } else if (label.type === "sale") {
                        sale = label.value
                        saleType = label.type
                        itemFirstPart = `
                            <article data-pid="${productId}" class="product__item item-product">
                            <div class="item-product__labels">
                                <div class="item-product__label item-product__label-${saleType}">${sale}</div>
                            </div>`
                    } else {
                        itemFirstPart = `
                        <article data-pid="${productId}" class="product__item item-product">
                        <div class="item-product__labels">
                            <div class="item-product__label item-product__label"></div>
                        </div>`
                    }
                })
            }
            

            let itemSecondpart = `
            <a href="" class="item-product__image">
                <img src="img/products/${productImage}" alt="">
            </a>
            <div class="item-product__body">
                <div class="item-product__content">
                    <h5 class="item-product__title">${productTitle}</h5>
                    <div class="item-product__text">${productText}</div>
                </div>
                <div class="item-product__prices">
                    <div class="item-product__price">${productPrice}</div>
                    <div class="item-product__price item-product__price-old">${productOldPrice}</div>
                </div>
                <div class="item-product__actions actions-product">
                    <div class="actions-product__body">
                        <a href="${productUrl}" class="actions-product__button btn btn_white">Add to cart</a>
                        <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
                        <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
                    </div>			
                </div>
            </div>
        </article>`

        let fullItem = itemFirstPart + itemSecondpart

            productItems.insertAdjacentHTML("beforeend", fullItem)
        });
    }


    function addToCart(productButton, productId) {
        if (!productButton.classList.contains("_hold")) {
            productButton.classList.add("_hold")
            productButton.classList.add("_fly")

            const cart = document.querySelector(".cart-header__icon")
            const product = document.querySelector(`[data-pid="${productId}"]`)
            
            const productImage = product.querySelector(".item-product__image")

            const productImageFly = productImage.cloneNode(true)

            let productImageFlyWidth = productImage.offsetWidth
            let productImageFlyHeight = productImage.offsetHeight
            const productImageFlyTop = productImage.getBoundingClientRect().top
            const productImageFlyLeft = productImage.getBoundingClientRect().left
   

            productImageFly.setAttribute("class", "_flyimage")
            productImageFly.style.cssText = `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
            `;

            document.body.append(productImageFly)

            
            const cartFlyLeft = cart.getBoundingClientRect().left
            const cartFlyTop = cart.getBoundingClientRect().top
            productImageFlyWidth = 0
            productImageFlyHeight = 0
            productImageFly.style.cssText = `
            left: ${cartFlyLeft}px;
            top: ${cartFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
            opacity: 0;
            `;


            productImageFly.addEventListener("transitionend", function() {
                if (productButton.classList.contains("_fly")) {
                    productImageFly.remove()
                    updateCart(productButton, productId)
                    productButton.classList.remove("_fly")
                }    
            })
        }
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector(".cart-header")
        const cartIcon = cart.querySelector(".cart-header__icon")
        const cartQuantity = cartIcon.querySelector("span")
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`)
        const cartList = document.querySelector(".cart-list")

        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML
            } else {
                cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`)
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`)
                const cartProductImage = product.querySelector(".item-product__image").innerHTML
                const cartProductTitle = product.querySelector(".item-product__title").innerHTML
                const cartProductContent = `
                <a href="" class="cart-list__image">${cartProductImage}</a>
                <div class="cart-list__body">
                    <a href="" class="cart-list__title">${cartProductTitle}</a>
                    <div class="cart-list__quantity">Quantity: <span>1</span></div>
                    <a href="" class="cart-list__delete">Delete</a>
                </div>
                `
                cartList.insertAdjacentHTML("beforeend", `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`)
            } else {
                const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span")
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML
            }
            productButton.classList.remove("_hold")
        } else {
            const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span")
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove()
            }
            const cartQuantityValue = --cartQuantity.innerHTML

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue
            } else {
                cartQuantity.remove()
                cart.classList.remove("_active")
            }
        }
    }


    //Gallery 
    const furniture = document.querySelector(".furniture__body")
    if (furniture && !isMobile.any()) {
        const furnitureItems = document.querySelector(".furniture__items")
        const furnitureColumn = document.querySelectorAll(".furtniture__column")
        
        const speed = furniture.dataset.speed
        let positionX = 0
        let coordXprocent = 0

        function setMouseGalleryStyle() {
            let furnitureItemWidth = 0
            furnitureColumn.forEach(element => {
                furnitureItemWidth += element.offsetWidth
            })
            const furnitureDifferent = furnitureItemWidth - furniture.offsetWidth
            const distX = Math.floor(coordXprocent - positionX)

            positionX = positionX + (distX * speed)
            let position = furnitureDifferent / 200 * positionX

            furnitureItems.style.cssText = `transform: translate3d(${position}px,0,0);`

            if (Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle)
            } else {
                furniture.classList.remove("_init")
            }
        }

        furniture.addEventListener("mousemove", function(e) {
            const furnitureWidth = furniture.offsetWidth

            const coordX = e.pageX - furnitureWidth / 2

            coordXprocent = coordX / furnitureWidth * 200
             if (!furniture.classList.contains("_init")) {
                requestAnimationFrame(setMouseGalleryStyle)
                furniture.classList.add("_init")
             }
        })
    }
}
