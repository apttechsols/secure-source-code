/*!
 * Bootstrap dropdown.js v5.0.0-beta1 (https://getbootstrap.com/)
 * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory(
        require('@popperjs/core'),
        require('./dom/data.js'),
        require('./dom/event-handler.js'),
        require('./dom/manipulator.js'),
        require('./dom/selector-engine.js')
      ))
    : typeof define === 'function' && define.amd
    ? define([
        '@popperjs/core',
        './dom/data',
        './dom/event-handler',
        './dom/manipulator',
        './dom/selector-engine',
      ], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      (global.Dropdown = factory(
        global.Popper,
        global.Data,
        global.EventHandler,
        global.Manipulator,
        global.SelectorEngine
      )));
})(this, function (Popper, Data, EventHandler, Manipulator, SelectorEngine) {
  'use strict';

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(
            n,
            k,
            d.get
              ? d
              : {
                  enumerable: true,
                  get: function () {
                    return e[k];
                  },
                }
          );
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var Popper__namespace = /*#__PURE__*/ _interopNamespace(Popper);
  var Data__default = /*#__PURE__*/ _interopDefaultLegacy(Data);
  var EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
  var Manipulator__default = /*#__PURE__*/ _interopDefaultLegacy(Manipulator);
  var SelectorEngine__default = /*#__PURE__*/ _interopDefaultLegacy(SelectorEngine);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  var toType = function toType(obj) {
    if (obj === null || obj === undefined) {
      return '' + obj;
    }

    return {}.toString
      .call(obj)
      .match(/\s([a-z]+)/i)[1]
      .toLowerCase();
  };

  var getSelector = function getSelector(element) {
    var selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      var hrefAttr = element.getAttribute('href');
      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  var getElementFromSelector = function getElementFromSelector(element) {
    var selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  var isElement = function isElement(obj) {
    return (obj[0] || obj).nodeType;
  };

  var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
    Object.keys(configTypes).forEach(function (property) {
      var expectedTypes = configTypes[property];
      var value = config[property];
      var valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new Error(
          componentName.toUpperCase() +
            ': ' +
            ('Option "' + property + '" provided type "' + valueType + '" ') +
            ('but expected type "' + expectedTypes + '".')
        );
      }
    });
  };

  var isVisible = function isVisible(element) {
    if (!element) {
      return false;
    }

    if (element.style && element.parentNode && element.parentNode.style) {
      var elementStyle = getComputedStyle(element);
      var parentNodeStyle = getComputedStyle(element.parentNode);
      return (
        elementStyle.display !== 'none' &&
        parentNodeStyle.display !== 'none' &&
        elementStyle.visibility !== 'hidden'
      );
    }

    return false;
  };

  var noop = function noop() {
    return function () {};
  };

  var getjQuery = function getjQuery() {
    var _window = window,
      jQuery = _window.jQuery;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  var onDOMContentLoaded = function onDOMContentLoaded(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  var isRTL = document.documentElement.dir === 'rtl';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var VERSION = '5.0.0-beta1';

  var BaseComponent = /*#__PURE__*/ (function () {
    function BaseComponent(element) {
      if (!element) {
        return;
      }

      this._element = element;
      Data__default['default'].setData(element, this.constructor.DATA_KEY, this);
    }

    var _proto = BaseComponent.prototype;

    _proto.dispose = function dispose() {
      Data__default['default'].removeData(this._element, this.constructor.DATA_KEY);
      this._element = null;
    };
    /** Static */

    BaseComponent.getInstance = function getInstance(element) {
      return Data__default['default'].getData(element, this.DATA_KEY);
    };

    _createClass(BaseComponent, null, [
      {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        },
      },
    ]);

    return BaseComponent;
  })();

  function _extends() {
    _extends =
      Object.assign ||
      function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
    return _extends.apply(this, arguments);
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'dropdown';
  var DATA_KEY = 'bs.dropdown';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_token = '.data-api';
  var ESCAPE_KEY = 'Escape';
  var SPACE_KEY = 'Space';
  var TAB_KEY = 'Tab';
  var ARROW_UP_KEY = 'ArrowUp';
  var ARROW_DOWN_KEY = 'ArrowDown';
  var RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEY + '|' + ARROW_DOWN_KEY + '|' + ESCAPE_KEY);
  var EVENT_HIDE = 'hide' + EVENT_KEY;
  var EVENT_HIDDEN = 'hidden' + EVENT_KEY;
  var EVENT_SHOW = 'show' + EVENT_KEY;
  var EVENT_SHOWN = 'shown' + EVENT_KEY;
  var EVENT_CLICK = 'click' + EVENT_KEY;
  var EVENT_CLICK_DATA_API = 'click' + EVENT_KEY + DATA_token;
  var EVENT_KEYDOWN_DATA_API = 'keydown' + EVENT_KEY + DATA_token;
  var EVENT_KEYUP_DATA_API = 'keyup' + EVENT_KEY + DATA_token;
  var CLASS_NAME_DISABLED = 'disabled';
  var CLASS_NAME_SHOW = 'show';
  var CLASS_NAME_DROPUP = 'dropup';
  var CLASS_NAME_DROPEND = 'dropend';
  var CLASS_NAME_DROPSTART = 'dropstart';
  var CLASS_NAME_NAVBAR = 'navbar';
  var SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]';
  var SELECTOR_FORM_CHILD = '.dropdown form';
  var SELECTOR_MENU = '.dropdown-menu';
  var SELECTOR_NAVBAR_NAV = '.navbar-nav';
  var SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  var PLACEMENT_TOP = isRTL ? 'top-end' : 'top-start';
  var PLACEMENT_TOPEND = isRTL ? 'top-start' : 'top-end';
  var PLACEMENT_BOTTOM = isRTL ? 'bottom-end' : 'bottom-start';
  var PLACEMENT_BOTTOMEND = isRTL ? 'bottom-start' : 'bottom-end';
  var PLACEMENT_RIGHT = isRTL ? 'left-start' : 'right-start';
  var PLACEMENT_LEFT = isRTL ? 'right-start' : 'left-start';
  var Default = {
    offset: 0,
    flip: true,
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
  };
  var DefaultType = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)',
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dropdown = /*#__PURE__*/ (function (_BaseComponent) {
    _inheritsLoose(Dropdown, _BaseComponent);

    function Dropdown(element, config) {
      var _this;

      _this = _BaseComponent.call(this, element) || this;
      _this._popper = null;
      _this._config = _this._getConfig(config);
      _this._menu = _this._getMenuElement();
      _this._inNavbar = _this._detectNavbar();

      _this._addEventListeners();

      return _this;
    } // Getters

    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
        return;
      }

      var isActive = this._element.classList.contains(CLASS_NAME_SHOW);

      Dropdown.clearMenus();

      if (isActive) {
        return;
      }

      this.show();
    };

    _proto.show = function show() {
      if (
        this._element.disabled ||
        this._element.classList.contains(CLASS_NAME_DISABLED) ||
        this._menu.classList.contains(CLASS_NAME_SHOW)
      ) {
        return;
      }

      var parent = Dropdown.getParentFromElement(this._element);
      var relatedTarget = {
        relatedTarget: this._element,
      };
      var showEvent = EventHandler__default['default'].trigger(
        this._element,
        EVENT_SHOW,
        relatedTarget
      );

      if (showEvent.defaultPrevented) {
        return;
      } // Totally disable Popper for Dropdowns in Navbar

      if (!this._inNavbar) {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        }

        this._popper = Popper.createPopper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        var _ref;

        (_ref = []).concat.apply(_ref, document.body.children).forEach(function (elem) {
          return EventHandler__default['default'].on(elem, 'mouseover', null, noop());
        });
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.toggle(CLASS_NAME_SHOW);

      this._element.classList.toggle(CLASS_NAME_SHOW);

      EventHandler__default['default'].trigger(parent, EVENT_SHOWN, relatedTarget);
    };

    _proto.hide = function hide() {
      if (
        this._element.disabled ||
        this._element.classList.contains(CLASS_NAME_DISABLED) ||
        !this._menu.classList.contains(CLASS_NAME_SHOW)
      ) {
        return;
      }

      var parent = Dropdown.getParentFromElement(this._element);
      var relatedTarget = {
        relatedTarget: this._element,
      };
      var hideEvent = EventHandler__default['default'].trigger(parent, EVENT_HIDE, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.toggle(CLASS_NAME_SHOW);

      this._element.classList.toggle(CLASS_NAME_SHOW);

      EventHandler__default['default'].trigger(parent, EVENT_HIDDEN, relatedTarget);
    };

    _proto.dispose = function dispose() {
      _BaseComponent.prototype.dispose.call(this);

      EventHandler__default['default'].off(this._element, EVENT_KEY);
      this._menu = null;

      if (this._popper) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    }; // Private

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      EventHandler__default['default'].on(this._element, EVENT_CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this2.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends(
        {},
        this.constructor.Default,
        Manipulator__default['default'].getDataAttributes(this._element),
        config
      );
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      return SelectorEngine__default['default'].next(this._element, SELECTOR_MENU)[0];
    };

    _proto._getPlacement = function _getPlacement() {
      var parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces

      var isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return this._element.closest('.' + CLASS_NAME_NAVBAR) !== null;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              altBoundary: this._config.flip,
              rootBoundary: this._config.boundary,
            },
          },
        ],
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        popperConfig.modifiers = [
          {
            name: 'applyStyles',
            enabled: false,
          },
        ];
      }

      return _extends({}, popperConfig, this._config.popperConfig);
    }; // Static

    Dropdown.dropdownInterface = function dropdownInterface(element, config) {
      var data = Data__default['default'].getData(element, DATA_KEY);

      var _config = typeof config === 'object' ? config : null;

      if (!data) {
        data = new Dropdown(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError('No method named "' + config + '"');
        }

        data[config]();
      }
    };

    Dropdown.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        Dropdown.dropdownInterface(this, config);
      });
    };

    Dropdown.clearMenus = function clearMenus(event) {
      if (
        event &&
        (event.button === RIGHT_MOUSE_BUTTON || (event.type === 'keyup' && event.key !== TAB_KEY))
      ) {
        return;
      }

      var toggles = SelectorEngine__default['default'].find(SELECTOR_DATA_TOGGLE);

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown.getParentFromElement(toggles[i]);
        var context = Data__default['default'].getData(toggles[i], DATA_KEY);
        var relatedTarget = {
          relatedTarget: toggles[i],
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!toggles[i].classList.contains(CLASS_NAME_SHOW)) {
          continue;
        }

        if (
          event &&
          ((event.type === 'click' && /input|textarea/i.test(event.target.tagName)) ||
            (event.type === 'keyup' && event.key === TAB_KEY)) &&
          dropdownMenu.contains(event.target)
        ) {
          continue;
        }

        var hideEvent = EventHandler__default['default'].trigger(parent, EVENT_HIDE, relatedTarget);

        if (hideEvent.defaultPrevented) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support

        if ('ontouchstart' in document.documentElement) {
          var _ref2;

          (_ref2 = []).concat.apply(_ref2, document.body.children).forEach(function (elem) {
            return EventHandler__default['default'].off(elem, 'mouseover', null, noop());
          });
        }

        toggles[i].setAttribute('aria-expanded', 'false');

        if (context._popper) {
          context._popper.destroy();
        }

        dropdownMenu.classList.remove(CLASS_NAME_SHOW);
        toggles[i].classList.remove(CLASS_NAME_SHOW);
        EventHandler__default['default'].trigger(parent, EVENT_HIDDEN, relatedTarget);
      }
    };

    Dropdown.getParentFromElement = function getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    };

    Dropdown.dataApiKeydownHandler = function dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (
        /input|textarea/i.test(event.target.tagName)
          ? event.key === SPACE_KEY ||
            (event.key !== ESCAPE_KEY &&
              ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
                event.target.closest(SELECTOR_MENU)))
          : !REGEXP_KEYDOWN.test(event.key)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
        return;
      }

      var parent = Dropdown.getParentFromElement(this);
      var isActive = this.classList.contains(CLASS_NAME_SHOW);

      if (event.key === ESCAPE_KEY) {
        var button = this.matches(SELECTOR_DATA_TOGGLE)
          ? this
          : SelectorEngine__default['default'].prev(this, SELECTOR_DATA_TOGGLE)[0];
        button.focus();
        Dropdown.clearMenus();
        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
        return;
      }

      var items = SelectorEngine__default['default']
        .find(SELECTOR_VISIBLE_ITEMS, parent)
        .filter(isVisible);

      if (!items.length) {
        return;
      }

      var index = items.indexOf(event.target); // Up

      if (event.key === ARROW_UP_KEY && index > 0) {
        index--;
      } // Down

      if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
        index++;
      } // index is -1 if the first keydown is an ArrowUp

      index = index === -1 ? 0 : index;
      items[index].focus();
    };

    _createClass$1(Dropdown, null, [
      {
        key: 'Default',
        get: function get() {
          return Default;
        },
      },
      {
        key: 'DefaultType',
        get: function get() {
          return DefaultType;
        },
      },
      {
        key: 'DATA_KEY',
        get: function get() {
          return DATA_KEY;
        },
      },
    ]);

    return Dropdown;
  })(BaseComponent);
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default['default'].on(
    document,
    EVENT_KEYDOWN_DATA_API,
    SELECTOR_DATA_TOGGLE,
    Dropdown.dataApiKeydownHandler
  );
  EventHandler__default['default'].on(
    document,
    EVENT_KEYDOWN_DATA_API,
    SELECTOR_MENU,
    Dropdown.dataApiKeydownHandler
  );
  EventHandler__default['default'].on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
  EventHandler__default['default'].on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler__default['default'].on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DATA_TOGGLE,
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      Dropdown.dropdownInterface(this, 'toggle');
    }
  );
  EventHandler__default['default'].on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_FORM_CHILD,
    function (e) {
      return e.stopPropagation();
    }
  );
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  onDOMContentLoaded(function () {
    var $ = getjQuery();
    /* istanbul ignore if */

    if ($) {
      var JQUERY_NO_CONFLICT = $.fn[NAME];
      $.fn[NAME] = Dropdown.jQueryInterface;
      $.fn[NAME].Constructor = Dropdown;

      $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Dropdown.jQueryInterface;
      };
    }
  });

  return Dropdown;
});
//# sourceMappingURL=dropdown.js.map
