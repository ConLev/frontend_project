"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Feedback =
/*#__PURE__*/
function () {
  function Feedback(source, container, form) {
    _classCallCheck(this, Feedback);

    this.source = source;
    this.container = container;
    this.form = form;
    this.comments = []; // Все отзывы

    this.curID = 0;

    this._init();
  }

  _createClass(Feedback, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      fetch(this.source).then(function (result) {
        return result.json();
      }).then(function (data) {
        _this.curID = data.maxID;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.comments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var comment = _step.value;

            _this.comments.push(comment);

            _this._renderComment(comment);
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

        _this._initForm();
      });
    }
  }, {
    key: "_initForm",
    value: function _initForm() {
      var _this2 = this;

      $(this.form).submit(function (e) {
        e.preventDefault();

        if (!$('#author').val() && !$('#text').val()) {
          return;
        }

        var comment = {
          id: ++_this2.curID,
          author: $('#author').val(),
          text: $('#text').val(),
          approved: false
        };

        _this2.comments.push(comment);

        _this2._renderComment(comment);
      });
    }
  }, {
    key: "_renderComment",
    value: function _renderComment(comment) {
      var _this3 = this;

      var $wrapper = $('<div/>', {
        class: 'comment',
        'data-id': comment.id
      });
      var $author = $("<h3 class=\"author\">".concat(comment.author, "</h3>"));
      var $text = $("<p class=\"text\">".concat(comment.text, "</p>"));
      var $delBtn = $("<button class=\"remove-btn\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>");
      $wrapper.append($author);
      $wrapper.append($text);
      $wrapper.append($delBtn);
      $delBtn.click(function () {
        _this3._remove(comment.id);
      });

      if (!comment.approved) {
        var $approve = $("<button class=\"approve-btn\">\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C</button>");
        $wrapper.append($approve);
        $wrapper.addClass('not-approved');
        $approve.click(function () {
          _this3._approve(comment.id);
        });
      } else {
        $wrapper.addClass('approved');
      }

      $(this.container).append($wrapper);
    }
  }, {
    key: "_remove",
    value: function _remove(id) {
      var find = this.comments.find(function (comment) {
        return comment.id === id;
      });
      this.comments.splice(this.comments.indexOf(find), 1);
      $(".comment[data-id=\"".concat(id, "\"]")).remove();
    }
  }, {
    key: "_approve",
    value: function _approve(id) {
      var find = this.comments.find(function (comment) {
        return comment.id === id;
      });
      $(".comment[data-id=\"".concat(id, "\"]")).addClass('approved').removeClass('not-approved').find('.approve-btn').remove();
      find.approved = true;
    }
  }]);

  return Feedback;
}();