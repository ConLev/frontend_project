"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cart =
/*#__PURE__*/
function () {
  function Cart(source, container) {
    _classCallCheck(this, Cart);

    this.source = source;
    this.container = container;
    this.countGoods = 0; // Общее кол-во товаров в корзине

    this.amount = 0; // Общая стоимость товаров в корзине

    this.cartItems = []; // Все товары

    this._init();
  }

  _createClass(Cart, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      fetch(this.source).then(function (result) {
        return result.json();
      }).then(function (data) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.contents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var product = _step.value;

            _this.cartItems.push(product);

            _this._renderItem(product);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this.countGoods = data.countGoods;
        _this.amount = data.amount;

        _this._renderSum();
      });
    }
  }, {
    key: "_renderItem",
    value: function _renderItem(product) {
      var _this2 = this;

      var $container = $('<div/>', {
        class: 'cart-drop-product',
        'data-product': product.id_product
      }); // noinspection JSUnresolvedVariable

      $container.append($("<img class=\"cart-drop-img\" src=\"".concat(product.product_img, "\" alt=\"img_product\">")));
      var $contents = $('<div/>', {
        class: 'cart-drop-details'
      });
      $contents.append($("<a class=\"cart-drop-details-name\" href=\"#\">".concat(product.product_name, "</a>"))); // noinspection JSUnresolvedVariable

      $contents.append($("<p class=\"cart-drop-details-comment\">".concat(product.product_rating, "</p>")));
      $contents.append($("<span class=\"cart-drop-details-quantity\">".concat(product.quantity, "</span>")));
      $contents.append($("<span class=\"cart-drop-details-factor\"> x </span>"));
      $contents.append($("<span class=\"cart-drop-details-price\">$".concat(product.price.toFixed(2), "</span>")));
      var $delBtn = $("<button class=\"cart-drop-details-delBtn\">&#10005;</button>");
      $delBtn.click(function () {
        _this2._remove(product.id_product);
      });
      $container.append($contents);
      $container.append($delBtn);
      $container.appendTo(this.container);
    }
  }, {
    key: "_renderSum",
    value: function _renderSum() {
      $('.header-cart-count_goods').text("".concat(this.countGoods));
      $('.cart-drop-total-value').text("$".concat(this.amount.toFixed(2)));
    } // noinspection JSMethodCanBeStatic

  }, {
    key: "_updateCart",
    value: function _updateCart(product) {
      var $container = $("div[data-product=\"".concat(product.id_product, "\"]"));
      $container.find('.cart-drop-details-quantity').text(product.quantity);
    }
  }, {
    key: "addProduct",
    value: function addProduct(element) {
      var productId = +$(element).data('id');
      var find = this.cartItems.find(function (product) {
        return product.id_product === productId;
      });

      if (find) {
        find.quantity++;
        this.countGoods++;
        this.amount += find.price;

        this._updateCart(find);
      } else {
        var product = {
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
  }, {
    key: "_remove",
    value: function _remove(id) {
      var find = this.cartItems.find(function (product) {
        return product.id_product === id;
      });
      this.cartItems.splice(this.cartItems.indexOf(find), 1);
      $("div[data-product=\"".concat(id, "\"]")).remove();
      this.amount -= find.price * find.quantity;
      this.countGoods -= find.quantity;

      this._renderSum();

      console.log(this.cartItems);
    }
  }]);

  return Cart;
}();