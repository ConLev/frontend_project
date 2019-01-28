class Cart {
    constructor(source, container) {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; // Все товары
        this._init();
    }

    _init() {
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents) {
                    this.cartItems.push(product);
                    this._renderItem(product);
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum();
            })
    }

    _renderItem(product) {
        let $container = $('<div/>', {
            class: 'cart-drop-product',
            'data-product': product.id_product
        });
        // noinspection JSUnresolvedVariable
        $container.append($(`<img class="cart-drop-img" src="${product.product_img}" alt="img_product">`));
        let $contents = $('<div/>', {
            class: 'cart-drop-details'
        });
        $contents.append($(`<a class="cart-drop-details-name" href="#">${product.product_name}</a>`));
        // noinspection JSUnresolvedVariable
        $contents.append($(`<p class="cart-drop-details-comment">${product.product_rating}</p>`));
        $contents.append($(`<span class="cart-drop-details-quantity">${product.quantity}</span>`));
        $contents.append($(`<span class="cart-drop-details-factor"> x </span>`));
        $contents.append($(`<span class="cart-drop-details-price">$${product.price.toFixed(2)}</span>`));
        let $delBtn = $(`<button class="cart-drop-details-delBtn">&#10005;</button>`);
        $delBtn.click(() => {
            this._remove(product.id_product)
        });
        $container.append($contents);
        $container.append($delBtn);
        $container.appendTo(this.container);
    }

    _renderSum() {
        $('.header-cart-count_goods').text(`${this.countGoods}`);
        $('.cart-drop-total-value').text(`$${this.amount.toFixed(2)}`);
    }

    // noinspection JSMethodCanBeStatic
    _updateCart(product) {
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.cart-drop-details-quantity').text(product.quantity);
    }

    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: +$(element).data('id'),
                product_img: $(element).data('img'),
                product_name: $(element).data('name'),
                product_rating: $(element).data('rating'),
                price: +$(element).data('price'),
                quantity: 1
            };
            this.cartItems.push(product);
            console.log(this.cartItems);
            this._renderItem(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
        }
        this._renderSum();
    }

    _remove(id) {
        let find = this.cartItems.find(product => product.id_product === id);
        this.cartItems.splice(this.cartItems.indexOf(find), 1);
        $(`div[data-product="${id}"]`).remove();
        this.amount -= find.price * find.quantity;
        this.countGoods -= find.quantity;
        this._renderSum();
        console.log(this.cartItems);
    }
}