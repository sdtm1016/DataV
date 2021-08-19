(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vue'), require('@jiaminghi/charts/lib/util/index'), require('@jiaminghi/charts/lib/util'), require('@jiaminghi/charts'), require('@jiaminghi/charts/lib/extend/index')) :
  typeof define === 'function' && define.amd ? define(['vue', '@jiaminghi/charts/lib/util/index', '@jiaminghi/charts/lib/util', '@jiaminghi/charts', '@jiaminghi/charts/lib/extend/index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue, global.index, global.util$1, global.Charts));
}(this, (function (Vue, index, util$1, Charts) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);
  var Charts__default = /*#__PURE__*/_interopDefaultLegacy(Charts);

  function randomExtend(minNum, maxNum) {
    if (arguments.length === 1) {
      return parseInt(Math.random() * minNum + 1, 10);
    } else {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
  }
  function debounce(delay, callback) {
    let lastTime;
    return function () {
      clearTimeout(lastTime);
      const [that, args] = [this, arguments];
      lastTime = setTimeout(() => {
        callback.apply(that, args);
      }, delay);
    };
  }
  function observerDomResize(dom, callback) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const observer = new MutationObserver(callback);
    observer.observe(dom, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true
    });
    return observer;
  }
  function getPointDistance(pointOne, pointTwo) {
    const minusX = Math.abs(pointOne[0] - pointTwo[0]);
    const minusY = Math.abs(pointOne[1] - pointTwo[1]);
    return Math.sqrt(minusX * minusX + minusY * minusY);
  }
  function uuid(hasHyphen) {
    return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  var autoResize = {
    data() {
      return {
        dom: '',
        width: 0,
        height: 0,
        debounceInitWHFun: '',
        domObserver: ''
      };
    },

    methods: {
      async autoResizeMixinInit() {
        const {
          initWH,
          getDebounceInitWHFun,
          bindDomResizeCallback,
          afterAutoResizeMixinInit
        } = this;
        await initWH(false);
        getDebounceInitWHFun();
        bindDomResizeCallback();
        if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit();
      },

      initWH(resize = true) {
        const {
          $nextTick,
          $refs,
          ref,
          onResize
        } = this;
        return new Promise(resolve => {
          $nextTick(_ => {
            const dom = this.dom = $refs[ref];
            this.width = dom ? dom.clientWidth : 0;
            this.height = dom ? dom.clientHeight : 0;

            if (!dom) {
              console.warn('DataV: Failed to get dom node, component rendering may be abnormal!');
            } else if (!this.width || !this.height) {
              console.warn('DataV: Component width or height is 0px, rendering abnormality may occur!');
            }

            if (typeof onResize === 'function' && resize) onResize();
            resolve();
          });
        });
      },

      getDebounceInitWHFun() {
        const {
          initWH
        } = this;
        this.debounceInitWHFun = debounce(100, initWH);
      },

      bindDomResizeCallback() {
        const {
          dom,
          debounceInitWHFun
        } = this;
        this.domObserver = observerDomResize(dom, debounceInitWHFun);
        window.addEventListener('resize', debounceInitWHFun);
      },

      unbindDomResizeCallback() {
        let {
          domObserver,
          debounceInitWHFun
        } = this;
        if (!domObserver) return;
        domObserver.disconnect();
        domObserver.takeRecords();
        domObserver = null;
        window.removeEventListener('resize', debounceInitWHFun);
      }

    },

    mounted() {
      const {
        autoResizeMixinInit
      } = this;
      autoResizeMixinInit();
    },

    beforeDestroy() {
      const {
        unbindDomResizeCallback
      } = this;
      unbindDomResizeCallback();
    }

  };

  //
  var script = {
    name: 'DvFullScreenContainer',
    mixins: [autoResize],

    data() {
      return {
        ref: 'full-screen-container',
        allWidth: 0,
        scale: 0,
        datavRoot: '',
        ready: false
      };
    },

    methods: {
      afterAutoResizeMixinInit() {
        const {
          initConfig,
          setAppScale
        } = this;
        initConfig();
        setAppScale();
        this.ready = true;
      },

      initConfig() {
        const {
          dom
        } = this;
        const {
          width,
          height
        } = screen;
        this.allWidth = width;
        dom.style.width = `${width}px`;
        dom.style.height = `${height}px`;
      },

      setAppScale() {
        const {
          allWidth,
          dom
        } = this;
        const currentWidth = document.body.clientWidth;
        dom.style.transform = `scale(${currentWidth / allWidth})`;
      },

      onResize() {
        const {
          setAppScale
        } = this;
        setAppScale();
      }

    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, attrs: { id: "dv-full-screen-container" } },
      [_vm.ready ? [_vm._t("default")] : _vm._e()],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-3fbdbd28_0", { source: "#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,QAAQ;EACR,SAAS;EACT,gBAAgB;EAChB,0BAA0B;EAC1B,YAAY;AACd","file":"main.vue","sourcesContent":["#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  function fullScreenContainer (Vue) {
    Vue.component(__vue_component__.name, __vue_component__);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$1 = {
    name: 'DvLoading'
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-loading" }, [
      _c("svg", { attrs: { width: "50px", height: "50px" } }, [
        _c(
          "circle",
          {
            attrs: {
              cx: "25",
              cy: "25",
              r: "20",
              fill: "transparent",
              "stroke-width": "3",
              "stroke-dasharray": "31.415, 31.415",
              stroke: "#02bcfe",
              "stroke-linecap": "round"
            }
          },
          [
            _c("animateTransform", {
              attrs: {
                attributeName: "transform",
                type: "rotate",
                values: "0, 25 25;360, 25 25",
                dur: "1.5s",
                repeatCount: "indefinite"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke",
                values: "#02bcfe;#3be6cb;#02bcfe",
                dur: "3s",
                repeatCount: "indefinite"
              }
            })
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: "25",
              cy: "25",
              r: "10",
              fill: "transparent",
              "stroke-width": "3",
              "stroke-dasharray": "15.7, 15.7",
              stroke: "#3be6cb",
              "stroke-linecap": "round"
            }
          },
          [
            _c("animateTransform", {
              attrs: {
                attributeName: "transform",
                type: "rotate",
                values: "360, 25 25;0, 25 25",
                dur: "1.5s",
                repeatCount: "indefinite"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke",
                values: "#3be6cb;#02bcfe;#3be6cb",
                dur: "3s",
                repeatCount: "indefinite"
              }
            })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "loading-tip" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-3eee5942_0", { source: ".dv-loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-loading .loading-tip {\n  font-size: 15px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB","file":"main.vue","sourcesContent":[".dv-loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-loading .loading-tip {\n  font-size: 15px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  function loading (Vue) {
    Vue.component(__vue_component__$1.name, __vue_component__$1);
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var interopRequireDefault = createCommonjsModule(function (module) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  module.exports = _interopRequireDefault;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(interopRequireDefault);

  var arrayLikeToArray = createCommonjsModule(function (module) {
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  module.exports = _arrayLikeToArray;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(arrayLikeToArray);

  var arrayWithoutHoles = createCommonjsModule(function (module) {
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  module.exports = _arrayWithoutHoles;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(arrayWithoutHoles);

  var iterableToArray = createCommonjsModule(function (module) {
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  module.exports = _iterableToArray;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(iterableToArray);

  var unsupportedIterableToArray = createCommonjsModule(function (module) {
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  module.exports = _unsupportedIterableToArray;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(unsupportedIterableToArray);

  var nonIterableSpread = createCommonjsModule(function (module) {
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  module.exports = _nonIterableSpread;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(nonIterableSpread);

  var toConsumableArray = createCommonjsModule(function (module) {
  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  module.exports = _toConsumableArray;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(toConsumableArray);

  var arrayWithHoles = createCommonjsModule(function (module) {
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  module.exports = _arrayWithHoles;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(arrayWithHoles);

  var iterableToArrayLimit = createCommonjsModule(function (module) {
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  module.exports = _iterableToArrayLimit;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(iterableToArrayLimit);

  var nonIterableRest = createCommonjsModule(function (module) {
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  module.exports = _nonIterableRest;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(nonIterableRest);

  var slicedToArray = createCommonjsModule(function (module) {
  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
  }

  module.exports = _slicedToArray;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(slicedToArray);

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };

      module.exports["default"] = module.exports, module.exports.__esModule = true;
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      module.exports["default"] = module.exports, module.exports.__esModule = true;
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(_typeof_1);

  var util = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.deepClone = deepClone;
  exports.eliminateBlur = eliminateBlur;
  exports.checkPointIsInCircle = checkPointIsInCircle;
  exports.getTwoPointDistance = getTwoPointDistance;
  exports.checkPointIsInPolygon = checkPointIsInPolygon;
  exports.checkPointIsInSector = checkPointIsInSector;
  exports.checkPointIsNearPolyline = checkPointIsNearPolyline;
  exports.checkPointIsInRect = checkPointIsInRect;
  exports.getRotatePointPos = getRotatePointPos;
  exports.getScalePointPos = getScalePointPos;
  exports.getTranslatePointPos = getTranslatePointPos;
  exports.getDistanceBetweenPointAndLine = getDistanceBetweenPointAndLine;
  exports.getCircleRadianPoint = getCircleRadianPoint;
  exports.getRegularPolygonPoints = getRegularPolygonPoints;
  exports["default"] = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _typeof2 = interopRequireDefault(_typeof_1);

  var abs = Math.abs,
      sqrt = Math.sqrt,
      sin = Math.sin,
      cos = Math.cos,
      max = Math.max,
      min = Math.min,
      PI = Math.PI;
  /**
   * @description Clone an object or array
   * @param {Object|Array} object Cloned object
   * @param {Boolean} recursion   Whether to use recursive cloning
   * @return {Object|Array} Clone object
   */

  function deepClone(object) {
    var recursion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!object) return object;
    var parse = JSON.parse,
        stringify = JSON.stringify;
    if (!recursion) return parse(stringify(object));
    var clonedObj = object instanceof Array ? [] : {};

    if (object && (0, _typeof2["default"])(object) === 'object') {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          if (object[key] && (0, _typeof2["default"])(object[key]) === 'object') {
            clonedObj[key] = deepClone(object[key], true);
          } else {
            clonedObj[key] = object[key];
          }
        }
      }
    }

    return clonedObj;
  }
  /**
   * @description Eliminate line blur due to 1px line width
   * @param {Array} points Line points
   * @return {Array} Line points after processed
   */


  function eliminateBlur(points) {
    return points.map(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return [parseInt(x) + 0.5, parseInt(y) + 0.5];
    });
  }
  /**
   * @description Check if the point is inside the circle
   * @param {Array} point Postion of point
   * @param {Number} rx   Circle x coordinate
   * @param {Number} ry   Circle y coordinate
   * @param {Number} r    Circle radius
   * @return {Boolean} Result of check
   */


  function checkPointIsInCircle(point, rx, ry, r) {
    return getTwoPointDistance(point, [rx, ry]) <= r;
  }
  /**
   * @description Get the distance between two points
   * @param {Array} point1 point1
   * @param {Array} point2 point2
   * @return {Number} Distance between two points
   */


  function getTwoPointDistance(_ref3, _ref4) {
    var _ref5 = (0, _slicedToArray2["default"])(_ref3, 2),
        xa = _ref5[0],
        ya = _ref5[1];

    var _ref6 = (0, _slicedToArray2["default"])(_ref4, 2),
        xb = _ref6[0],
        yb = _ref6[1];

    var minusX = abs(xa - xb);
    var minusY = abs(ya - yb);
    return sqrt(minusX * minusX + minusY * minusY);
  }
  /**
   * @description Check if the point is inside the polygon
   * @param {Array} point  Postion of point
   * @param {Array} points The points that makes up a polyline
   * @return {Boolean} Result of check
   */


  function checkPointIsInPolygon(point, polygon) {
    var counter = 0;

    var _point = (0, _slicedToArray2["default"])(point, 2),
        x = _point[0],
        y = _point[1];

    var pointNum = polygon.length;

    for (var i = 1, p1 = polygon[0]; i <= pointNum; i++) {
      var p2 = polygon[i % pointNum];

      if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
        if (y <= max(p1[1], p2[1])) {
          if (p1[0] !== p2[0]) {
            var xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1];

            if (p1[1] === p2[1] || y <= xinters) {
              counter++;
            }
          }
        }
      }

      p1 = p2;
    }

    return counter % 2 === 1;
  }
  /**
   * @description Check if the point is inside the sector
   * @param {Array} point       Postion of point
   * @param {Number} rx         Sector x coordinate
   * @param {Number} ry         Sector y coordinate
   * @param {Number} r          Sector radius
   * @param {Number} startAngle Sector start angle
   * @param {Number} endAngle   Sector end angle
   * @param {Boolean} clockWise Whether the sector angle is clockwise
   * @return {Boolean} Result of check
   */


  function checkPointIsInSector(point, rx, ry, r, startAngle, endAngle, clockWise) {
    if (!point) return false;
    if (getTwoPointDistance(point, [rx, ry]) > r) return false;

    if (!clockWise) {
      var _deepClone = deepClone([endAngle, startAngle]);

      var _deepClone2 = (0, _slicedToArray2["default"])(_deepClone, 2);

      startAngle = _deepClone2[0];
      endAngle = _deepClone2[1];
    }

    var reverseBE = startAngle > endAngle;

    if (reverseBE) {
      var _ref7 = [endAngle, startAngle];
      startAngle = _ref7[0];
      endAngle = _ref7[1];
    }

    var minus = endAngle - startAngle;
    if (minus >= PI * 2) return true;

    var _point2 = (0, _slicedToArray2["default"])(point, 2),
        x = _point2[0],
        y = _point2[1];

    var _getCircleRadianPoint = getCircleRadianPoint(rx, ry, r, startAngle),
        _getCircleRadianPoint2 = (0, _slicedToArray2["default"])(_getCircleRadianPoint, 2),
        bx = _getCircleRadianPoint2[0],
        by = _getCircleRadianPoint2[1];

    var _getCircleRadianPoint3 = getCircleRadianPoint(rx, ry, r, endAngle),
        _getCircleRadianPoint4 = (0, _slicedToArray2["default"])(_getCircleRadianPoint3, 2),
        ex = _getCircleRadianPoint4[0],
        ey = _getCircleRadianPoint4[1];

    var vPoint = [x - rx, y - ry];
    var vBArm = [bx - rx, by - ry];
    var vEArm = [ex - rx, ey - ry];
    var reverse = minus > PI;

    if (reverse) {
      var _deepClone3 = deepClone([vEArm, vBArm]);

      var _deepClone4 = (0, _slicedToArray2["default"])(_deepClone3, 2);

      vBArm = _deepClone4[0];
      vEArm = _deepClone4[1];
    }

    var inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint);
    if (reverse) inSector = !inSector;
    if (reverseBE) inSector = !inSector;
    return inSector;
  }
  /**
   * @description Determine if the point is in the clockwise direction of the vector
   * @param {Array} vArm   Vector
   * @param {Array} vPoint Point
   * @return {Boolean} Result of check
   */


  function isClockWise(vArm, vPoint) {
    var _vArm = (0, _slicedToArray2["default"])(vArm, 2),
        ax = _vArm[0],
        ay = _vArm[1];

    var _vPoint = (0, _slicedToArray2["default"])(vPoint, 2),
        px = _vPoint[0],
        py = _vPoint[1];

    return -ay * px + ax * py > 0;
  }
  /**
   * @description Check if the point is inside the polyline
   * @param {Array} point      Postion of point
   * @param {Array} polyline   The points that makes up a polyline
   * @param {Number} lineWidth Polyline linewidth
   * @return {Boolean} Result of check
   */


  function checkPointIsNearPolyline(point, polyline, lineWidth) {
    var halfLineWidth = lineWidth / 2;
    var moveUpPolyline = polyline.map(function (_ref8) {
      var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
          x = _ref9[0],
          y = _ref9[1];

      return [x, y - halfLineWidth];
    });
    var moveDownPolyline = polyline.map(function (_ref10) {
      var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
          x = _ref11[0],
          y = _ref11[1];

      return [x, y + halfLineWidth];
    });
    var polygon = [].concat((0, _toConsumableArray2["default"])(moveUpPolyline), (0, _toConsumableArray2["default"])(moveDownPolyline.reverse()));
    return checkPointIsInPolygon(point, polygon);
  }
  /**
   * @description Check if the point is inside the rect
   * @param {Array} point   Postion of point
   * @param {Number} x      Rect start x coordinate
   * @param {Number} y      Rect start y coordinate
   * @param {Number} width  Rect width
   * @param {Number} height Rect height
   * @return {Boolean} Result of check
   */


  function checkPointIsInRect(_ref12, x, y, width, height) {
    var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
        px = _ref13[0],
        py = _ref13[1];

    if (px < x) return false;
    if (py < y) return false;
    if (px > x + width) return false;
    if (py > y + height) return false;
    return true;
  }
  /**
   * @description Get the coordinates of the rotated point
   * @param {Number} rotate Degree of rotation
   * @param {Array} point   Postion of point
   * @param {Array} origin  Rotation center
   * @param {Array} origin  Rotation center
   * @return {Number} Coordinates after rotation
   */


  function getRotatePointPos() {
    var rotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var point = arguments.length > 1 ? arguments[1] : undefined;
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    if (!point) return false;
    if (rotate % 360 === 0) return point;

    var _point3 = (0, _slicedToArray2["default"])(point, 2),
        x = _point3[0],
        y = _point3[1];

    var _origin = (0, _slicedToArray2["default"])(origin, 2),
        ox = _origin[0],
        oy = _origin[1];

    rotate *= PI / 180;
    return [(x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox, (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy];
  }
  /**
   * @description Get the coordinates of the scaled point
   * @param {Array} scale  Scale factor
   * @param {Array} point  Postion of point
   * @param {Array} origin Scale center
   * @return {Number} Coordinates after scale
   */


  function getScalePointPos() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1];
    var point = arguments.length > 1 ? arguments[1] : undefined;
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    if (!point) return false;
    if (scale === 1) return point;

    var _point4 = (0, _slicedToArray2["default"])(point, 2),
        x = _point4[0],
        y = _point4[1];

    var _origin2 = (0, _slicedToArray2["default"])(origin, 2),
        ox = _origin2[0],
        oy = _origin2[1];

    var _scale = (0, _slicedToArray2["default"])(scale, 2),
        xs = _scale[0],
        ys = _scale[1];

    var relativePosX = x - ox;
    var relativePosY = y - oy;
    return [relativePosX * xs + ox, relativePosY * ys + oy];
  }
  /**
   * @description Get the coordinates of the scaled point
   * @param {Array} translate Translation distance
   * @param {Array} point     Postion of point
   * @return {Number} Coordinates after translation
   */


  function getTranslatePointPos(translate, point) {
    if (!translate || !point) return false;

    var _point5 = (0, _slicedToArray2["default"])(point, 2),
        x = _point5[0],
        y = _point5[1];

    var _translate = (0, _slicedToArray2["default"])(translate, 2),
        tx = _translate[0],
        ty = _translate[1];

    return [x + tx, y + ty];
  }
  /**
   * @description Get the distance from the point to the line
   * @param {Array} point     Postion of point
   * @param {Array} lineBegin Line start position
   * @param {Array} lineEnd   Line end position
   * @return {Number} Distance between point and line
   */


  function getDistanceBetweenPointAndLine(point, lineBegin, lineEnd) {
    if (!point || !lineBegin || !lineEnd) return false;

    var _point6 = (0, _slicedToArray2["default"])(point, 2),
        x = _point6[0],
        y = _point6[1];

    var _lineBegin = (0, _slicedToArray2["default"])(lineBegin, 2),
        x1 = _lineBegin[0],
        y1 = _lineBegin[1];

    var _lineEnd = (0, _slicedToArray2["default"])(lineEnd, 2),
        x2 = _lineEnd[0],
        y2 = _lineEnd[1];

    var a = y2 - y1;
    var b = x1 - x2;
    var c = y1 * (x2 - x1) - x1 * (y2 - y1);
    var molecule = abs(a * x + b * y + c);
    var denominator = sqrt(a * a + b * b);
    return molecule / denominator;
  }
  /**
   * @description Get the coordinates of the specified radian on the circle
   * @param {Number} x      Circle x coordinate
   * @param {Number} y      Circle y coordinate
   * @param {Number} radius Circle radius
   * @param {Number} radian Specfied radian
   * @return {Array} Postion of point
   */


  function getCircleRadianPoint(x, y, radius, radian) {
    return [x + cos(radian) * radius, y + sin(radian) * radius];
  }
  /**
   * @description Get the points that make up a regular polygon
   * @param {Number} x     X coordinate of the polygon inscribed circle
   * @param {Number} y     Y coordinate of the polygon inscribed circle
   * @param {Number} r     Radius of the polygon inscribed circle
   * @param {Number} side  Side number
   * @param {Number} minus Radian offset
   * @return {Array} Points that make up a regular polygon
   */


  function getRegularPolygonPoints(rx, ry, r, side) {
    var minus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PI * -0.5;
    var radianGap = PI * 2 / side;
    var radians = new Array(side).fill('').map(function (t, i) {
      return i * radianGap + minus;
    });
    return radians.map(function (radian) {
      return getCircleRadianPoint(rx, ry, r, radian);
    });
  }

  var _default = {
    deepClone: deepClone,
    eliminateBlur: eliminateBlur,
    checkPointIsInCircle: checkPointIsInCircle,
    checkPointIsInPolygon: checkPointIsInPolygon,
    checkPointIsInSector: checkPointIsInSector,
    checkPointIsNearPolyline: checkPointIsNearPolyline,
    getTwoPointDistance: getTwoPointDistance,
    getRotatePointPos: getRotatePointPos,
    getScalePointPos: getScalePointPos,
    getTranslatePointPos: getTranslatePointPos,
    getCircleRadianPoint: getCircleRadianPoint,
    getRegularPolygonPoints: getRegularPolygonPoints,
    getDistanceBetweenPointAndLine: getDistanceBetweenPointAndLine
  };
  exports["default"] = _default;
  });

  unwrapExports(util);
  var util_1 = util.deepClone;
  var util_2 = util.eliminateBlur;
  var util_3 = util.checkPointIsInCircle;
  var util_4 = util.getTwoPointDistance;
  var util_5 = util.checkPointIsInPolygon;
  var util_6 = util.checkPointIsInSector;
  var util_7 = util.checkPointIsNearPolyline;
  var util_8 = util.checkPointIsInRect;
  var util_9 = util.getRotatePointPos;
  var util_10 = util.getScalePointPos;
  var util_11 = util.getTranslatePointPos;
  var util_12 = util.getDistanceBetweenPointAndLine;
  var util_13 = util.getCircleRadianPoint;
  var util_14 = util.getRegularPolygonPoints;

  //
  var script$2 = {
    name: 'DvBorderBox1',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-1',
        border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
        defaultColor: ['#4fd2dd', '#235fa7'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, staticClass: "dv-border-box-1" },
      [
        _c(
          "svg",
          {
            staticClass: "border",
            attrs: { width: _vm.width, height: _vm.height }
          },
          [
            _c("polygon", {
              attrs: {
                fill: _vm.backgroundColor,
                points:
                  "10, 27 10, " +
                  (_vm.height - 27) +
                  " 13, " +
                  (_vm.height - 24) +
                  " 13, " +
                  (_vm.height - 21) +
                  " 24, " +
                  (_vm.height - 11) +
                  "\n    38, " +
                  (_vm.height - 11) +
                  " 41, " +
                  (_vm.height - 8) +
                  " 73, " +
                  (_vm.height - 8) +
                  " 75, " +
                  (_vm.height - 10) +
                  " 81, " +
                  (_vm.height - 10) +
                  "\n    85, " +
                  (_vm.height - 6) +
                  " " +
                  (_vm.width - 85) +
                  ", " +
                  (_vm.height - 6) +
                  " " +
                  (_vm.width - 81) +
                  ", " +
                  (_vm.height - 10) +
                  " " +
                  (_vm.width - 75) +
                  ", " +
                  (_vm.height - 10) +
                  "\n    " +
                  (_vm.width - 73) +
                  ", " +
                  (_vm.height - 8) +
                  " " +
                  (_vm.width - 41) +
                  ", " +
                  (_vm.height - 8) +
                  " " +
                  (_vm.width - 38) +
                  ", " +
                  (_vm.height - 11) +
                  "\n    " +
                  (_vm.width - 24) +
                  ", " +
                  (_vm.height - 11) +
                  " " +
                  (_vm.width - 13) +
                  ", " +
                  (_vm.height - 21) +
                  " " +
                  (_vm.width - 13) +
                  ", " +
                  (_vm.height - 24) +
                  "\n    " +
                  (_vm.width - 10) +
                  ", " +
                  (_vm.height - 27) +
                  " " +
                  (_vm.width - 10) +
                  ", 27 " +
                  (_vm.width - 13) +
                  ", 25 " +
                  (_vm.width - 13) +
                  ", 21\n    " +
                  (_vm.width - 24) +
                  ", 11 " +
                  (_vm.width - 38) +
                  ", 11 " +
                  (_vm.width - 41) +
                  ", 8 " +
                  (_vm.width - 73) +
                  ", 8 " +
                  (_vm.width - 75) +
                  ", 10\n    " +
                  (_vm.width - 81) +
                  ", 10 " +
                  (_vm.width - 85) +
                  ", 6 85, 6 81, 10 75, 10 73, 8 41, 8 38, 11 24, 11 13, 21 13, 24"
              }
            })
          ]
        ),
        _vm._v(" "),
        _vm._l(_vm.border, function(item) {
          return _c(
            "svg",
            {
              key: item,
              class: item + " border",
              attrs: { width: "150px", height: "150px" }
            },
            [
              _c(
                "polygon",
                {
                  attrs: {
                    fill: _vm.mergedColor[0],
                    points:
                      "6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values:
                        _vm.mergedColor[0] +
                        ";" +
                        _vm.mergedColor[1] +
                        ";" +
                        _vm.mergedColor[0],
                      dur: "0.5s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "polygon",
                {
                  attrs: {
                    fill: _vm.mergedColor[1],
                    points:
                      "27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values:
                        _vm.mergedColor[1] +
                        ";" +
                        _vm.mergedColor[0] +
                        ";" +
                        _vm.mergedColor[1],
                      dur: "0.5s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "polygon",
                {
                  attrs: {
                    fill: _vm.mergedColor[0],
                    points:
                      "9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "fill",
                      values:
                        _vm.mergedColor[0] +
                        ";" +
                        _vm.mergedColor[1] +
                        ";transparent",
                      dur: "1s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            ]
          )
        }),
        _vm._v(" "),
        _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
      ],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-225422ac_0", { source: ".dv-border-box-1 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-1 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-1 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-1 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-1 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-1 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,UAAU;EACV,0BAA0B;AAC5B;AACA;EACE,WAAW;EACX,0BAA0B;AAC5B;AACA;EACE,UAAU;EACV,WAAW;EACX,0CAA0C;AAC5C;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-1 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-1 .border {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-1 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-1 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-1 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-1 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox1 (Vue) {
    Vue.component(__vue_component__$2.name, __vue_component__$2);
  }

  //
  var script$3 = {
    name: 'DvBorderBox2',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-2',
        defaultColor: ['#fff', 'rgba(255, 255, 255, 0.6)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-2" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      7, 7 " +
                (_vm.width - 7) +
                ", 7 " +
                (_vm.width - 7) +
                ", " +
                (_vm.height - 7) +
                " 7, " +
                (_vm.height - 7) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                "2, 2 " +
                (_vm.width - 2) +
                " ,2 " +
                (_vm.width - 2) +
                ", " +
                (_vm.height - 2) +
                " 2, " +
                (_vm.height - 2) +
                " 2, 2"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "6, 6 " +
                (_vm.width - 6) +
                ", 6 " +
                (_vm.width - 6) +
                ", " +
                (_vm.height - 6) +
                " 6, " +
                (_vm.height - 6) +
                " 6, 6"
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: { fill: _vm.mergedColor[0], cx: "11", cy: "11", r: "1" }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[0],
              cx: _vm.width - 11,
              cy: "11",
              r: "1"
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[0],
              cx: _vm.width - 11,
              cy: _vm.height - 11,
              r: "1"
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[0],
              cx: "11",
              cy: _vm.height - 11,
              r: "1"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-b499b408_0", { source: ".dv-border-box-2 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-2 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-2 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-2 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-2 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-2 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-2 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-2 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox2 (Vue) {
    Vue.component(__vue_component__$3.name, __vue_component__$3);
  }

  //
  var script$4 = {
    name: 'DvBorderBox3',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-3',
        defaultColor: ['#2862b7', '#2862b7'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-3" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      23, 23 " +
                (_vm.width - 24) +
                ", 23 " +
                (_vm.width - 24) +
                ", " +
                (_vm.height - 24) +
                " 23, " +
                (_vm.height - 24) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line1",
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                "4, 4 " +
                (_vm.width - 22) +
                " ,4 " +
                (_vm.width - 22) +
                ", " +
                (_vm.height - 22) +
                " 4, " +
                (_vm.height - 22) +
                " 4, 4"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "10, 10 " +
                (_vm.width - 16) +
                ", 10 " +
                (_vm.width - 16) +
                ", " +
                (_vm.height - 16) +
                " 10, " +
                (_vm.height - 16) +
                " 10, 10"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "16, 16 " +
                (_vm.width - 10) +
                ", 16 " +
                (_vm.width - 10) +
                ", " +
                (_vm.height - 10) +
                " 16, " +
                (_vm.height - 10) +
                " 16, 16"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb3-line2",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "22, 22 " +
                (_vm.width - 4) +
                ", 22 " +
                (_vm.width - 4) +
                ", " +
                (_vm.height - 4) +
                " 22, " +
                (_vm.height - 4) +
                " 22, 22"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-f7786dce_0", { source: ".dv-border-box-3 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-3 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-3 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-3 .dv-bb3-line1 {\n  stroke-width: 3;\n}\n.dv-border-box-3 .dv-bb3-line2 {\n  stroke-width: 1;\n}\n.dv-border-box-3 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;AACZ;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-3 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-3 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-3 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-3 .dv-bb3-line1 {\n  stroke-width: 3;\n}\n.dv-border-box-3 .dv-bb3-line2 {\n  stroke-width: 1;\n}\n.dv-border-box-3 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox3 (Vue) {
    Vue.component(__vue_component__$4.name, __vue_component__$4);
  }

  //
  var script$5 = {
    name: 'DvBorderBox4',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      reverse: {
        type: Boolean,
        default: false
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-4',
        defaultColor: ['red', 'rgba(0,0,255,0.8)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-4" }, [
      _c(
        "svg",
        {
          class: "dv-border-svg-container " + (_vm.reverse && "dv-reverse"),
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      " +
                (_vm.width - 15) +
                ", 22 170, 22 150, 7 40, 7 28, 21 32, 24\n      16, 42 16, " +
                (_vm.height - 32) +
                " 41, " +
                (_vm.height - 7) +
                " " +
                (_vm.width - 15) +
                ", " +
                (_vm.height - 7) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-1",
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                "145, " +
                (_vm.height - 5) +
                " 40, " +
                (_vm.height - 5) +
                " 10, " +
                (_vm.height - 35) +
                "\n        10, 40 40, 5 150, 5 170, 20 " +
                (_vm.width - 15) +
                ", 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-2",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "245, " +
                (_vm.height - 1) +
                " 36, " +
                (_vm.height - 1) +
                " 14, " +
                (_vm.height - 23) +
                "\n        14, " +
                (_vm.height - 100)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-3",
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "7, " + (_vm.height - 40) + " 7, " + (_vm.height - 75)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-4",
            attrs: { stroke: _vm.mergedColor[0], points: "28, 24 13, 41 13, 64" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-5",
            attrs: { stroke: _vm.mergedColor[0], points: "5, 45 5, 140" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-6",
            attrs: { stroke: _vm.mergedColor[1], points: "14, 75 14, 180" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-7",
            attrs: {
              stroke: _vm.mergedColor[1],
              points: "55, 11 147, 11 167, 26 250, 26"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-8",
            attrs: { stroke: _vm.mergedColor[1], points: "158, 5 173, 16" }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-9",
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "200, 17 " + (_vm.width - 10) + ", 17"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb4-line-10",
            attrs: {
              stroke: _vm.mergedColor[1],
              points: "385, 17 " + (_vm.width - 10) + ", 17"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-162c50db_0", { source: ".dv-border-box-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-4 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-4 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-4 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-4 .sw1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .sw3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-4 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-5 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-6 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-7 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-8 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-9 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n  stroke-dasharray: 100 250;\n}\n.dv-border-box-4 .dv-bb4-line-10 {\n  stroke-width: 1;\n  stroke-dasharray: 80 270;\n}\n.dv-border-box-4 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;AACZ;AACA;EACE,eAAe;AACjB;AACA;EACE,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,iBAAiB;EACjB,qBAAqB;EACrB,yBAAyB;AAC3B;AACA;EACE,eAAe;EACf,wBAAwB;AAC1B;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-4 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-4 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-4 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-4 .sw1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .sw3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-1 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-3 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-4 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-5 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-6 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-7 {\n  stroke-width: 1;\n}\n.dv-border-box-4 .dv-bb4-line-8 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n}\n.dv-border-box-4 .dv-bb4-line-9 {\n  stroke-width: 3px;\n  stroke-linecap: round;\n  stroke-dasharray: 100 250;\n}\n.dv-border-box-4 .dv-bb4-line-10 {\n  stroke-width: 1;\n  stroke-dasharray: 80 270;\n}\n.dv-border-box-4 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox4 (Vue) {
    Vue.component(__vue_component__$5.name, __vue_component__$5);
  }

  //
  var script$6 = {
    name: 'DvBorderBox5',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      reverse: {
        type: Boolean,
        default: false
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-5',
        defaultColor: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.20)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-5" }, [
      _c(
        "svg",
        {
          class: "dv-border-svg-container  " + (_vm.reverse && "dv-reverse"),
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      10, 22 " +
                (_vm.width - 22) +
                ", 22 " +
                (_vm.width - 22) +
                ", " +
                (_vm.height - 86) +
                " " +
                (_vm.width - 84) +
                ", " +
                (_vm.height - 24) +
                " 10, " +
                (_vm.height - 24) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-1",
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                "8, 5 " +
                (_vm.width - 5) +
                ", 5 " +
                (_vm.width - 5) +
                ", " +
                (_vm.height - 100) +
                "\n        " +
                (_vm.width - 100) +
                ", " +
                (_vm.height - 5) +
                " 8, " +
                (_vm.height - 5) +
                " 8, 5"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-2",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "3, 5 " +
                (_vm.width - 20) +
                ", 5 " +
                (_vm.width - 20) +
                ", " +
                (_vm.height - 60) +
                "\n        " +
                (_vm.width - 74) +
                ", " +
                (_vm.height - 5) +
                " 3, " +
                (_vm.height - 5) +
                " 3, 5"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-3",
            attrs: {
              stroke: _vm.mergedColor[1],
              points: "50, 13 " + (_vm.width - 35) + ", 13"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-4",
            attrs: {
              stroke: _vm.mergedColor[1],
              points: "15, 20 " + (_vm.width - 35) + ", 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-5",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "15, " +
                (_vm.height - 20) +
                " " +
                (_vm.width - 110) +
                ", " +
                (_vm.height - 20)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            staticClass: "dv-bb5-line-6",
            attrs: {
              stroke: _vm.mergedColor[1],
              points:
                "15, " +
                (_vm.height - 13) +
                " " +
                (_vm.width - 110) +
                ", " +
                (_vm.height - 13)
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-04716733_0", { source: ".dv-border-box-5 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-5 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-5 .dv-bb5-line-1,\n.dv-border-box-5 .dv-bb5-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-5 .dv-bb5-line-3,\n.dv-border-box-5 .dv-bb5-line-6 {\n  stroke-width: 5;\n}\n.dv-border-box-5 .dv-bb5-line-4,\n.dv-border-box-5 .dv-bb5-line-5 {\n  stroke-width: 2;\n}\n.dv-border-box-5 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;AACZ;AACA;;EAEE,eAAe;AACjB;AACA;;EAEE,eAAe;AACjB;AACA;;EAEE,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-5 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-reverse {\n  transform: rotate(180deg);\n}\n.dv-border-box-5 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-5 .dv-border-svg-container > polyline {\n  fill: none;\n}\n.dv-border-box-5 .dv-bb5-line-1,\n.dv-border-box-5 .dv-bb5-line-2 {\n  stroke-width: 1;\n}\n.dv-border-box-5 .dv-bb5-line-3,\n.dv-border-box-5 .dv-bb5-line-6 {\n  stroke-width: 5;\n}\n.dv-border-box-5 .dv-bb5-line-4,\n.dv-border-box-5 .dv-bb5-line-5 {\n  stroke-width: 2;\n}\n.dv-border-box-5 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox5 (Vue) {
    Vue.component(__vue_component__$6.name, __vue_component__$6);
  }

  //
  var script$7 = {
    name: 'DvBorderBox6',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-6',
        defaultColor: ['rgba(255, 255, 255, 0.35)', 'gray'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-6" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      9, 7 " +
                (_vm.width - 9) +
                ", 7 " +
                (_vm.width - 9) +
                ", " +
                (_vm.height - 7) +
                " 9, " +
                (_vm.height - 7) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: { fill: _vm.mergedColor[1], cx: "5", cy: "5", r: "2" }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[1],
              cx: _vm.width - 5,
              cy: "5",
              r: "2"
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[1],
              cx: _vm.width - 5,
              cy: _vm.height - 5,
              r: "2"
            }
          }),
          _vm._v(" "),
          _c("circle", {
            attrs: {
              fill: _vm.mergedColor[1],
              cx: "5",
              cy: _vm.height - 5,
              r: "2"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "10, 4 " + (_vm.width - 10) + ", 4"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                "10, " +
                (_vm.height - 4) +
                " " +
                (_vm.width - 10) +
                ", " +
                (_vm.height - 4)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "5, 70 5, " + (_vm.height - 70)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                _vm.width -
                5 +
                ", 70 " +
                (_vm.width - 5) +
                ", " +
                (_vm.height - 70)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: { stroke: _vm.mergedColor[0], points: "3, 10, 3, 50" }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: { stroke: _vm.mergedColor[0], points: "7, 30 7, 80" }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: _vm.width - 3 + ", 10 " + (_vm.width - 3) + ", 50"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: _vm.width - 7 + ", 30 " + (_vm.width - 7) + ", 80"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "3, " + (_vm.height - 10) + " 3, " + (_vm.height - 50)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points: "7, " + (_vm.height - 30) + " 7, " + (_vm.height - 80)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                _vm.width -
                3 +
                ", " +
                (_vm.height - 10) +
                " " +
                (_vm.width - 3) +
                ", " +
                (_vm.height - 50)
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              points:
                _vm.width -
                7 +
                ", " +
                (_vm.height - 30) +
                " " +
                (_vm.width - 7) +
                ", " +
                (_vm.height - 80)
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-f88abd14_0", { source: ".dv-border-box-6 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-6 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-6 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-6 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-6 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = undefined;
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$7 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox6 (Vue) {
    Vue.component(__vue_component__$7.name, __vue_component__$7);
  }

  //
  var script$8 = {
    name: 'DvBorderBox7',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-7',
        defaultColor: ['rgba(128,128,128,0.3)', 'rgba(128,128,128,0.5)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: _vm.ref,
        staticClass: "dv-border-box-7",
        style:
          "box-shadow: inset 0 0 40px " +
          _vm.mergedColor[0] +
          "; border: 1px solid " +
          _vm.mergedColor[0] +
          "; background-color: " +
          _vm.backgroundColor
      },
      [
        _c(
          "svg",
          {
            staticClass: "dv-border-svg-container",
            attrs: { width: _vm.width, height: _vm.height }
          },
          [
            _c("polyline", {
              staticClass: "dv-bb7-line-width-2",
              attrs: { stroke: _vm.mergedColor[0], points: "0, 25 0, 0 25, 0" }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-2",
              attrs: {
                stroke: _vm.mergedColor[0],
                points:
                  _vm.width -
                  25 +
                  ", 0 " +
                  _vm.width +
                  ", 0 " +
                  _vm.width +
                  ", 25"
              }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-2",
              attrs: {
                stroke: _vm.mergedColor[0],
                points:
                  _vm.width -
                  25 +
                  ", " +
                  _vm.height +
                  " " +
                  _vm.width +
                  ", " +
                  _vm.height +
                  " " +
                  _vm.width +
                  ", " +
                  (_vm.height - 25)
              }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-2",
              attrs: {
                stroke: _vm.mergedColor[0],
                points:
                  "0, " +
                  (_vm.height - 25) +
                  " 0, " +
                  _vm.height +
                  " 25, " +
                  _vm.height
              }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-5",
              attrs: { stroke: _vm.mergedColor[1], points: "0, 10 0, 0 10, 0" }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-5",
              attrs: {
                stroke: _vm.mergedColor[1],
                points:
                  _vm.width -
                  10 +
                  ", 0 " +
                  _vm.width +
                  ", 0 " +
                  _vm.width +
                  ", 10"
              }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-5",
              attrs: {
                stroke: _vm.mergedColor[1],
                points:
                  _vm.width -
                  10 +
                  ", " +
                  _vm.height +
                  " " +
                  _vm.width +
                  ", " +
                  _vm.height +
                  " " +
                  _vm.width +
                  ", " +
                  (_vm.height - 10)
              }
            }),
            _vm._v(" "),
            _c("polyline", {
              staticClass: "dv-bb7-line-width-5",
              attrs: {
                stroke: _vm.mergedColor[1],
                points:
                  "0, " +
                  (_vm.height - 10) +
                  " 0, " +
                  _vm.height +
                  " 10, " +
                  _vm.height
              }
            })
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
      ]
    )
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = function (inject) {
      if (!inject) return
      inject("data-v-585841de_0", { source: ".dv-border-box-7 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-linecap: round;\n}\n.dv-border-box-7 .dv-bb7-line-width-2 {\n  stroke-width: 2;\n}\n.dv-border-box-7 .dv-bb7-line-width-5 {\n  stroke-width: 5;\n}\n.dv-border-box-7 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;AACd;AACA;EACE,UAAU;EACV,qBAAqB;AACvB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-7 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-7 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-linecap: round;\n}\n.dv-border-box-7 .dv-bb7-line-width-2 {\n  stroke-width: 2;\n}\n.dv-border-box-7 .dv-bb7-line-width-5 {\n  stroke-width: 5;\n}\n.dv-border-box-7 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$8 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox7 (Vue) {
    Vue.component(__vue_component__$8.name, __vue_component__$8);
  }

  //
  var script$9 = {
    name: 'DvBorderBox8',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      dur: {
        type: Number,
        default: 3
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      },
      reverse: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'border-box-8',
        path: `border-box-8-path-${id}`,
        gradient: `border-box-8-gradient-${id}`,
        mask: `border-box-8-mask-${id}`,
        defaultColor: ['#235fa7', '#4fd2dd'],
        mergedColor: []
      };
    },

    computed: {
      length() {
        const {
          width,
          height
        } = this;
        return (width + height - 5) * 2;
      },

      pathD() {
        const {
          reverse,
          width,
          height
        } = this;
        if (reverse) return `M 2.5, 2.5 L 2.5, ${height - 2.5} L ${width - 2.5}, ${height - 2.5} L ${width - 2.5}, 2.5 L 2.5, 2.5`;
        return `M2.5, 2.5 L${width - 2.5}, 2.5 L${width - 2.5}, ${height - 2.5} L2.5, ${height - 2.5} L2.5, 2.5`;
      }

    },
    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-8" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c(
            "defs",
            [
              _c("path", {
                attrs: { id: _vm.path, d: _vm.pathD, fill: "transparent" }
              }),
              _vm._v(" "),
              _c(
                "radialGradient",
                { attrs: { id: _vm.gradient, cx: "50%", cy: "50%", r: "50%" } },
                [
                  _c("stop", {
                    attrs: {
                      offset: "0%",
                      "stop-color": "#fff",
                      "stop-opacity": "1"
                    }
                  }),
                  _vm._v(" "),
                  _c("stop", {
                    attrs: {
                      offset: "100%",
                      "stop-color": "#fff",
                      "stop-opacity": "0"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("mask", { attrs: { id: _vm.mask } }, [
                _c(
                  "circle",
                  {
                    attrs: {
                      cx: "0",
                      cy: "0",
                      r: "150",
                      fill: "url(#" + _vm.gradient + ")"
                    }
                  },
                  [
                    _c("animateMotion", {
                      attrs: {
                        dur: _vm.dur + "s",
                        path: _vm.pathD,
                        rotate: "auto",
                        repeatCount: "indefinite"
                      }
                    })
                  ],
                  1
                )
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "5, 5 " +
                (_vm.width - 5) +
                ", 5 " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 5) +
                " 5, " +
                (_vm.height - 5)
            }
          }),
          _vm._v(" "),
          _c("use", {
            attrs: {
              stroke: _vm.mergedColor[0],
              "stroke-width": "1",
              "xlink:href": "#" + _vm.path
            }
          }),
          _vm._v(" "),
          _c(
            "use",
            {
              attrs: {
                stroke: _vm.mergedColor[1],
                "stroke-width": "3",
                "xlink:href": "#" + _vm.path,
                mask: "url(#" + _vm.mask + ")"
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "stroke-dasharray",
                  from: "0, " + _vm.length,
                  to: _vm.length + ", 0",
                  dur: _vm.dur + "s",
                  repeatCount: "indefinite"
                }
              })
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-0da3412d_0", { source: ".dv-border-box-8 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-8 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-8 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;AACV;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-8 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-8 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-8 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = undefined;
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$9 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox8 (Vue) {
    Vue.component(__vue_component__$9.name, __vue_component__$9);
  }

  //
  var script$a = {
    name: 'DvBorderBox9',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'border-box-9',
        gradientId: `border-box-9-gradient-${id}`,
        maskId: `border-box-9-mask-${id}`,
        defaultColor: ['#11eefd', '#0078d2'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-9" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c(
            "defs",
            [
              _c(
                "linearGradient",
                {
                  attrs: {
                    id: _vm.gradientId,
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "100%"
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "x1",
                      values: "0%;100%;0%",
                      dur: "10s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "x2",
                      values: "100%;0%;100%",
                      dur: "10s",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "stop",
                    { attrs: { offset: "0%", "stop-color": _vm.mergedColor[0] } },
                    [
                      _c("animate", {
                        attrs: {
                          attributeName: "stop-color",
                          values:
                            _vm.mergedColor[0] +
                            ";" +
                            _vm.mergedColor[1] +
                            ";" +
                            _vm.mergedColor[0],
                          dur: "10s",
                          begin: "0s",
                          repeatCount: "indefinite"
                        }
                      })
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "stop",
                    {
                      attrs: { offset: "100%", "stop-color": _vm.mergedColor[1] }
                    },
                    [
                      _c("animate", {
                        attrs: {
                          attributeName: "stop-color",
                          values:
                            _vm.mergedColor[1] +
                            ";" +
                            _vm.mergedColor[0] +
                            ";" +
                            _vm.mergedColor[1],
                          dur: "10s",
                          begin: "0s",
                          repeatCount: "indefinite"
                        }
                      })
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("mask", { attrs: { id: _vm.maskId } }, [
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      "8, " +
                      _vm.height * 0.4 +
                      " 8, 3, " +
                      (_vm.width * 0.4 + 7) +
                      ", 3"
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "8, " +
                      _vm.height * 0.15 +
                      " 8, 3, " +
                      (_vm.width * 0.1 + 7) +
                      ", 3\n            " +
                      _vm.width * 0.1 +
                      ", 8 14, 8 14, " +
                      (_vm.height * 0.15 - 7) +
                      "\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      _vm.width * 0.5 +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", 3, " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.25
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.52 +
                      ", 3 " +
                      _vm.width * 0.58 +
                      ", 3\n            " +
                      (_vm.width * 0.58 - 7) +
                      ", 9 " +
                      (_vm.width * 0.52 + 7) +
                      ", 9\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.9 +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", 3 " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.1 +
                      "\n            " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height * 0.1 - 7) +
                      " " +
                      (_vm.width - 9) +
                      ", 9 " +
                      (_vm.width * 0.9 + 7) +
                      ", 9\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      "8, " +
                      _vm.height * 0.5 +
                      " 8, " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width * 0.3 + 7) +
                      ", " +
                      (_vm.height - 3)
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            8, " +
                      _vm.height * 0.55 +
                      " 8, " +
                      _vm.height * 0.7 +
                      "\n            2, " +
                      (_vm.height * 0.7 - 7) +
                      " 2, " +
                      (_vm.height * 0.55 + 7) +
                      "\n          "
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    stroke: "#fff",
                    "stroke-width": "3",
                    fill: "transparent",
                    points:
                      _vm.width * 0.35 +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.35
                  }
                }),
                _vm._v(" "),
                _c("polyline", {
                  attrs: {
                    fill: "#fff",
                    points:
                      "\n            " +
                      _vm.width * 0.92 +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      (_vm.height - 3) +
                      " " +
                      (_vm.width - 3) +
                      ", " +
                      _vm.height * 0.8 +
                      "\n            " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height * 0.8 + 7) +
                      " " +
                      (_vm.width - 9) +
                      ", " +
                      (_vm.height - 9) +
                      " " +
                      (_vm.width * 0.92 + 7) +
                      ", " +
                      (_vm.height - 9) +
                      "\n          "
                  }
                })
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      15, 9 " +
                (_vm.width * 0.1 + 1) +
                ", 9 " +
                (_vm.width * 0.1 + 4) +
                ", 6 " +
                (_vm.width * 0.52 + 2) +
                ", 6\n      " +
                (_vm.width * 0.52 + 6) +
                ", 10 " +
                (_vm.width * 0.58 - 7) +
                ", 10 " +
                (_vm.width * 0.58 - 2) +
                ", 6\n      " +
                (_vm.width * 0.9 + 2) +
                ", 6 " +
                (_vm.width * 0.9 + 6) +
                ", 10 " +
                (_vm.width - 10) +
                ", 10 " +
                (_vm.width - 10) +
                ", " +
                (_vm.height * 0.1 - 6) +
                "\n      " +
                (_vm.width - 6) +
                ", " +
                (_vm.height * 0.1 - 1) +
                " " +
                (_vm.width - 6) +
                ", " +
                (_vm.height * 0.8 + 1) +
                " " +
                (_vm.width - 10) +
                ", " +
                (_vm.height * 0.8 + 6) +
                "\n      " +
                (_vm.width - 10) +
                ", " +
                (_vm.height - 10) +
                " " +
                (_vm.width * 0.92 + 7) +
                ", " +
                (_vm.height - 10) +
                "  " +
                (_vm.width * 0.92 + 2) +
                ", " +
                (_vm.height - 6) +
                "\n      11, " +
                (_vm.height - 6) +
                " 11, " +
                (_vm.height * 0.15 - 2) +
                " 15, " +
                (_vm.height * 0.15 - 7) +
                "\n    "
            }
          }),
          _vm._v(" "),
          _c("rect", {
            attrs: {
              x: "0",
              y: "0",
              width: _vm.width,
              height: _vm.height,
              fill: "url(#" + _vm.gradientId + ")",
              mask: "url(#" + _vm.maskId + ")"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = function (inject) {
      if (!inject) return
      inject("data-v-4b4232cc_0", { source: ".dv-border-box-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-9 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-9 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;AACV;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-9 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n}\n.dv-border-box-9 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$a = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox9 (Vue) {
    Vue.component(__vue_component__$a.name, __vue_component__$a);
  }

  //
  var script$b = {
    name: 'DvBorderBox10',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-10',
        border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
        defaultColor: ['#1d48c4', '#d3e1f8'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: _vm.ref,
        staticClass: "dv-border-box-10",
        style: "box-shadow: inset 0 0 25px 3px " + _vm.mergedColor[0]
      },
      [
        _c(
          "svg",
          {
            staticClass: "dv-border-svg-container",
            attrs: { width: _vm.width, height: _vm.height }
          },
          [
            _c("polygon", {
              attrs: {
                fill: _vm.backgroundColor,
                points:
                  "\n      4, 0 " +
                  (_vm.width - 4) +
                  ", 0 " +
                  _vm.width +
                  ", 4 " +
                  _vm.width +
                  ", " +
                  (_vm.height - 4) +
                  " " +
                  (_vm.width - 4) +
                  ", " +
                  _vm.height +
                  "\n      4, " +
                  _vm.height +
                  " 0, " +
                  (_vm.height - 4) +
                  " 0, 4\n    "
              }
            })
          ]
        ),
        _vm._v(" "),
        _vm._l(_vm.border, function(item) {
          return _c(
            "svg",
            {
              key: item,
              class: item + " dv-border-svg-container",
              attrs: { width: "150px", height: "150px" }
            },
            [
              _c("polygon", {
                attrs: {
                  fill: _vm.mergedColor[1],
                  points: "40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
                }
              })
            ]
          )
        }),
        _vm._v(" "),
        _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
      ],
      2
    )
  };
  var __vue_staticRenderFns__$b = [];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = function (inject) {
      if (!inject) return
      inject("data-v-40d6d2fe_0", { source: ".dv-border-box-10 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 6px;\n}\n.dv-border-box-10 .dv-border-svg-container {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-10 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-10 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-10 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-10 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,UAAU;EACV,0BAA0B;AAC5B;AACA;EACE,WAAW;EACX,0BAA0B;AAC5B;AACA;EACE,UAAU;EACV,WAAW;EACX,0CAA0C;AAC5C;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-10 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 6px;\n}\n.dv-border-box-10 .dv-border-svg-container {\n  position: absolute;\n  display: block;\n}\n.dv-border-box-10 .right-top {\n  right: 0px;\n  transform: rotateY(180deg);\n}\n.dv-border-box-10 .left-bottom {\n  bottom: 0px;\n  transform: rotateX(180deg);\n}\n.dv-border-box-10 .right-bottom {\n  right: 0px;\n  bottom: 0px;\n  transform: rotateX(180deg) rotateY(180deg);\n}\n.dv-border-box-10 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$b = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox10 (Vue) {
    Vue.component(__vue_component__$b.name, __vue_component__$b);
  }

  var keywords = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _default = new Map([['transparent', 'rgba(0,0,0,0)'], ['black', '#000000'], ['silver', '#C0C0C0'], ['gray', '#808080'], ['white', '#FFFFFF'], ['maroon', '#800000'], ['red', '#FF0000'], ['purple', '#800080'], ['fuchsia', '#FF00FF'], ['green', '#008000'], ['lime', '#00FF00'], ['olive', '#808000'], ['yellow', '#FFFF00'], ['navy', '#000080'], ['blue', '#0000FF'], ['teal', '#008080'], ['aqua', '#00FFFF'], ['aliceblue', '#f0f8ff'], ['antiquewhite', '#faebd7'], ['aquamarine', '#7fffd4'], ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['blanchedalmond', '#ffebcd'], ['blueviolet', '#8a2be2'], ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadetblue', '#5f9ea0'], ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'], ['cornflowerblue', '#6495ed'], ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'], ['cyan', '#00ffff'], ['darkblue', '#00008b'], ['darkcyan', '#008b8b'], ['darkgoldenrod', '#b8860b'], ['darkgray', '#a9a9a9'], ['darkgreen', '#006400'], ['darkgrey', '#a9a9a9'], ['darkkhaki', '#bdb76b'], ['darkmagenta', '#8b008b'], ['darkolivegreen', '#556b2f'], ['darkorange', '#ff8c00'], ['darkorchid', '#9932cc'], ['darkred', '#8b0000'], ['darksalmon', '#e9967a'], ['darkseagreen', '#8fbc8f'], ['darkslateblue', '#483d8b'], ['darkslategray', '#2f4f4f'], ['darkslategrey', '#2f4f4f'], ['darkturquoise', '#00ced1'], ['darkviolet', '#9400d3'], ['deeppink', '#ff1493'], ['deepskyblue', '#00bfff'], ['dimgray', '#696969'], ['dimgrey', '#696969'], ['dodgerblue', '#1e90ff'], ['firebrick', '#b22222'], ['floralwhite', '#fffaf0'], ['forestgreen', '#228b22'], ['gainsboro', '#dcdcdc'], ['ghostwhite', '#f8f8ff'], ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['greenyellow', '#adff2f'], ['grey', '#808080'], ['honeydew', '#f0fff0'], ['hotpink', '#ff69b4'], ['indianred', '#cd5c5c'], ['indigo', '#4b0082'], ['ivory', '#fffff0'], ['khaki', '#f0e68c'], ['lavender', '#e6e6fa'], ['lavenderblush', '#fff0f5'], ['lawngreen', '#7cfc00'], ['lemonchiffon', '#fffacd'], ['lightblue', '#add8e6'], ['lightcoral', '#f08080'], ['lightcyan', '#e0ffff'], ['lightgoldenrodyellow', '#fafad2'], ['lightgray', '#d3d3d3'], ['lightgreen', '#90ee90'], ['lightgrey', '#d3d3d3'], ['lightpink', '#ffb6c1'], ['lightsalmon', '#ffa07a'], ['lightseagreen', '#20b2aa'], ['lightskyblue', '#87cefa'], ['lightslategray', '#778899'], ['lightslategrey', '#778899'], ['lightsteelblue', '#b0c4de'], ['lightyellow', '#ffffe0'], ['limegreen', '#32cd32'], ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['mediumaquamarine', '#66cdaa'], ['mediumblue', '#0000cd'], ['mediumorchid', '#ba55d3'], ['mediumpurple', '#9370db'], ['mediumseagreen', '#3cb371'], ['mediumslateblue', '#7b68ee'], ['mediumspringgreen', '#00fa9a'], ['mediumturquoise', '#48d1cc'], ['mediumvioletred', '#c71585'], ['midnightblue', '#191970'], ['mintcream', '#f5fffa'], ['mistyrose', '#ffe4e1'], ['moccasin', '#ffe4b5'], ['navajowhite', '#ffdead'], ['oldlace', '#fdf5e6'], ['olivedrab', '#6b8e23'], ['orange', '#ffa500'], ['orangered', '#ff4500'], ['orchid', '#da70d6'], ['palegoldenrod', '#eee8aa'], ['palegreen', '#98fb98'], ['paleturquoise', '#afeeee'], ['palevioletred', '#db7093'], ['papayawhip', '#ffefd5'], ['peachpuff', '#ffdab9'], ['peru', '#cd853f'], ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powderblue', '#b0e0e6'], ['rosybrown', '#bc8f8f'], ['royalblue', '#4169e1'], ['saddlebrown', '#8b4513'], ['salmon', '#fa8072'], ['sandybrown', '#f4a460'], ['seagreen', '#2e8b57'], ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['skyblue', '#87ceeb'], ['slateblue', '#6a5acd'], ['slategray', '#708090'], ['slategrey', '#708090'], ['snow', '#fffafa'], ['springgreen', '#00ff7f'], ['steelblue', '#4682b4'], ['tan', '#d2b48c'], ['thistle', '#d8bfd8'], ['tomato', '#ff6347'], ['turquoise', '#40e0d0'], ['violet', '#ee82ee'], ['wheat', '#f5deb3'], ['whitesmoke', '#f5f5f5'], ['yellowgreen', '#9acd32']]);

  exports["default"] = _default;
  });

  unwrapExports(keywords);

  var lib = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getRgbValue = getRgbValue;
  exports.getRgbaValue = getRgbaValue;
  exports.getOpacity = getOpacity;
  exports.toRgb = toRgb;
  exports.toHex = toHex;
  exports.getColorFromRgbValue = getColorFromRgbValue;
  exports.darken = darken;
  exports.lighten = lighten;
  exports.fade = fade;
  exports["default"] = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _keywords = interopRequireDefault(keywords);

  var hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  var rgbReg = /^(rgb|rgba|RGB|RGBA)/;
  var rgbaReg = /^(rgba|RGBA)/;
  /**
   * @description Color validator
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {String|Boolean} Valid color Or false
   */

  function validator(color) {
    var isHex = hexReg.test(color);
    var isRgb = rgbReg.test(color);
    if (isHex || isRgb) return color;
    color = getColorByKeyword(color);

    if (!color) {
      console.error('Color: Invalid color!');
      return false;
    }

    return color;
  }
  /**
   * @description Get color by keyword
   * @param {String} keyword Color keyword like red, green and etc.
   * @return {String|Boolean} Hex or rgba color (Invalid keyword will return false)
   */


  function getColorByKeyword(keyword) {
    if (!keyword) {
      console.error('getColorByKeywords: Missing parameters!');
      return false;
    }

    if (!_keywords["default"].has(keyword)) return false;
    return _keywords["default"].get(keyword);
  }
  /**
   * @description Get the Rgb value of the color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Array<Number>|Boolean} Rgb value of the color (Invalid input will return false)
   */


  function getRgbValue(color) {
    if (!color) {
      console.error('getRgbValue: Missing parameters!');
      return false;
    }

    color = validator(color);
    if (!color) return false;
    var isHex = hexReg.test(color);
    var isRgb = rgbReg.test(color);
    var lowerColor = color.toLowerCase();
    if (isHex) return getRgbValueFromHex(lowerColor);
    if (isRgb) return getRgbValueFromRgb(lowerColor);
  }
  /**
   * @description Get the rgb value of the hex color
   * @param {String} color Hex color
   * @return {Array<Number>} Rgb value of the color
   */


  function getRgbValueFromHex(color) {
    color = color.replace('#', '');
    if (color.length === 3) color = Array.from(color).map(function (hexNum) {
      return hexNum + hexNum;
    }).join('');
    color = color.split('');
    return new Array(3).fill(0).map(function (t, i) {
      return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
    });
  }
  /**
   * @description Get the rgb value of the rgb/rgba color
   * @param {String} color Hex color
   * @return {Array} Rgb value of the color
   */


  function getRgbValueFromRgb(color) {
    return color.replace(/rgb\(|rgba\(|\)/g, '').split(',').slice(0, 3).map(function (n) {
      return parseInt(n);
    });
  }
  /**
   * @description Get the Rgba value of the color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Array<Number>|Boolean} Rgba value of the color (Invalid input will return false)
   */


  function getRgbaValue(color) {
    if (!color) {
      console.error('getRgbaValue: Missing parameters!');
      return false;
    }

    var colorValue = getRgbValue(color);
    if (!colorValue) return false;
    colorValue.push(getOpacity(color));
    return colorValue;
  }
  /**
   * @description Get the opacity of color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number|Boolean} Color opacity (Invalid input will return false)
   */


  function getOpacity(color) {
    if (!color) {
      console.error('getOpacity: Missing parameters!');
      return false;
    }

    color = validator(color);
    if (!color) return false;
    var isRgba = rgbaReg.test(color);
    if (!isRgba) return 1;
    color = color.toLowerCase();
    return Number(color.split(',').slice(-1)[0].replace(/[)|\s]/g, ''));
  }
  /**
   * @description Convert color to Rgb|Rgba color
   * @param {String} color   Hex|Rgb|Rgba color or color keyword
   * @param {Number} opacity The opacity of color
   * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
   */


  function toRgb(color, opacity) {
    if (!color) {
      console.error('toRgb: Missing parameters!');
      return false;
    }

    var rgbValue = getRgbValue(color);
    if (!rgbValue) return false;
    var addOpacity = typeof opacity === 'number';
    if (addOpacity) return 'rgba(' + rgbValue.join(',') + ",".concat(opacity, ")");
    return 'rgb(' + rgbValue.join(',') + ')';
  }
  /**
   * @description Convert color to Hex color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {String|Boolean} Hex color (Invalid input will return false)
   */


  function toHex(color) {
    if (!color) {
      console.error('toHex: Missing parameters!');
      return false;
    }

    if (hexReg.test(color)) return color;
    color = getRgbValue(color);
    if (!color) return false;
    return '#' + color.map(function (n) {
      return Number(n).toString(16);
    }).map(function (n) {
      return n === '0' ? '00' : n;
    }).join('');
  }
  /**
   * @description Get Color from Rgb|Rgba value
   * @param {Array<Number>} value Rgb|Rgba color value
   * @return {String|Boolean} Rgb|Rgba color (Invalid input will return false)
   */


  function getColorFromRgbValue(value) {
    if (!value) {
      console.error('getColorFromRgbValue: Missing parameters!');
      return false;
    }

    var valueLength = value.length;

    if (valueLength !== 3 && valueLength !== 4) {
      console.error('getColorFromRgbValue: Value is illegal!');
      return false;
    }

    var color = valueLength === 3 ? 'rgb(' : 'rgba(';
    color += value.join(',') + ')';
    return color;
  }
  /**
   * @description Deepen color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number} Percent of Deepen (1-100)
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function darken(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!color) {
      console.error('darken: Missing parameters!');
      return false;
    }

    var rgbaValue = getRgbaValue(color);
    if (!rgbaValue) return false;
    rgbaValue = rgbaValue.map(function (v, i) {
      return i === 3 ? v : v - Math.ceil(2.55 * percent);
    }).map(function (v) {
      return v < 0 ? 0 : v;
    });
    return getColorFromRgbValue(rgbaValue);
  }
  /**
   * @description Brighten color
   * @param {String} color Hex|Rgb|Rgba color or color keyword
   * @return {Number} Percent of brighten (1-100)
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function lighten(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!color) {
      console.error('lighten: Missing parameters!');
      return false;
    }

    var rgbaValue = getRgbaValue(color);
    if (!rgbaValue) return false;
    rgbaValue = rgbaValue.map(function (v, i) {
      return i === 3 ? v : v + Math.ceil(2.55 * percent);
    }).map(function (v) {
      return v > 255 ? 255 : v;
    });
    return getColorFromRgbValue(rgbaValue);
  }
  /**
   * @description Adjust color opacity
   * @param {String} color   Hex|Rgb|Rgba color or color keyword
   * @param {Number} Percent of opacity
   * @return {String|Boolean} Rgba color (Invalid input will return false)
   */


  function fade(color) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    if (!color) {
      console.error('fade: Missing parameters!');
      return false;
    }

    var rgbValue = getRgbValue(color);
    if (!rgbValue) return false;
    var rgbaValue = [].concat((0, _toConsumableArray2["default"])(rgbValue), [percent / 100]);
    return getColorFromRgbValue(rgbaValue);
  }

  var _default = {
    fade: fade,
    toHex: toHex,
    toRgb: toRgb,
    darken: darken,
    lighten: lighten,
    getOpacity: getOpacity,
    getRgbValue: getRgbValue,
    getRgbaValue: getRgbaValue,
    getColorFromRgbValue: getColorFromRgbValue
  };
  exports["default"] = _default;
  });

  unwrapExports(lib);
  var lib_1 = lib.getRgbValue;
  var lib_2 = lib.getRgbaValue;
  var lib_3 = lib.getOpacity;
  var lib_4 = lib.toRgb;
  var lib_5 = lib.toHex;
  var lib_6 = lib.getColorFromRgbValue;
  var lib_7 = lib.darken;
  var lib_8 = lib.lighten;
  var lib_9 = lib.fade;

  //
  var script$c = {
    name: 'DvBorderBox11',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      titleWidth: {
        type: Number,
        default: 250
      },
      title: {
        type: String,
        default: ''
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'border-box-11',
        filterId: `border-box-11-filterId-${id}`,
        defaultColor: ['#8aaafb', '#1f33a2'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      },

      fade: lib_9
    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-11" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("defs", [
            _c(
              "filter",
              {
                attrs: {
                  id: _vm.filterId,
                  height: "150%",
                  width: "150%",
                  x: "-25%",
                  y: "-25%"
                }
              },
              [
                _c("feMorphology", {
                  attrs: {
                    operator: "dilate",
                    radius: "2",
                    in: "SourceAlpha",
                    result: "thicken"
                  }
                }),
                _vm._v(" "),
                _c("feGaussianBlur", {
                  attrs: { in: "thicken", stdDeviation: "3", result: "blurred" }
                }),
                _vm._v(" "),
                _c("feFlood", {
                  attrs: {
                    "flood-color": _vm.mergedColor[1],
                    result: "glowColor"
                  }
                }),
                _vm._v(" "),
                _c("feComposite", {
                  attrs: {
                    in: "glowColor",
                    in2: "blurred",
                    operator: "in",
                    result: "softGlowColored"
                  }
                }),
                _vm._v(" "),
                _c(
                  "feMerge",
                  [
                    _c("feMergeNode", { attrs: { in: "softGlowColored" } }),
                    _vm._v(" "),
                    _c("feMergeNode", { attrs: { in: "SourceGraphic" } })
                  ],
                  1
                )
              ],
              1
            )
          ]),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              fill: _vm.backgroundColor,
              points:
                "\n      20, 32 " +
                (_vm.width * 0.5 - _vm.titleWidth / 2) +
                ", 32 " +
                (_vm.width * 0.5 - _vm.titleWidth / 2 + 20) +
                ", 53\n      " +
                (_vm.width * 0.5 + _vm.titleWidth / 2 - 20) +
                ", 53 " +
                (_vm.width * 0.5 + _vm.titleWidth / 2) +
                ", 32\n      " +
                (_vm.width - 20) +
                ", 32 " +
                (_vm.width - 8) +
                ", 48 " +
                (_vm.width - 8) +
                ", " +
                (_vm.height - 25) +
                " " +
                (_vm.width - 20) +
                ", " +
                (_vm.height - 8) +
                "\n      20, " +
                (_vm.height - 8) +
                " 8, " +
                (_vm.height - 25) +
                " 8, 50\n    "
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              stroke: _vm.mergedColor[0],
              filter: "url(#" + _vm.filterId + ")",
              points:
                "\n        " +
                (_vm.width - _vm.titleWidth) / 2 +
                ", 30\n        20, 30 7, 50 7, " +
                (50 + (_vm.height - 167) / 2) +
                "\n        13, " +
                (55 + (_vm.height - 167) / 2) +
                " 13, " +
                (135 + (_vm.height - 167) / 2) +
                "\n        7, " +
                (140 + (_vm.height - 167) / 2) +
                " 7, " +
                (_vm.height - 27) +
                "\n        20, " +
                (_vm.height - 7) +
                " " +
                (_vm.width - 20) +
                ", " +
                (_vm.height - 7) +
                " " +
                (_vm.width - 7) +
                ", " +
                (_vm.height - 27) +
                "\n        " +
                (_vm.width - 7) +
                ", " +
                (140 + (_vm.height - 167) / 2) +
                " " +
                (_vm.width - 13) +
                ", " +
                (135 + (_vm.height - 167) / 2) +
                "\n        " +
                (_vm.width - 13) +
                ", " +
                (55 + (_vm.height - 167) / 2) +
                " " +
                (_vm.width - 7) +
                ", " +
                (50 + (_vm.height - 167) / 2) +
                "\n        " +
                (_vm.width - 7) +
                ", 50 " +
                (_vm.width - 20) +
                ", 30 " +
                (_vm.width + _vm.titleWidth) / 2 +
                ", 30\n        " +
                ((_vm.width + _vm.titleWidth) / 2 - 20) +
                ", 7 " +
                ((_vm.width - _vm.titleWidth) / 2 + 20) +
                ", 7\n        " +
                (_vm.width - _vm.titleWidth) / 2 +
                ", 30 " +
                ((_vm.width - _vm.titleWidth) / 2 + 20) +
                ", 52\n        " +
                ((_vm.width + _vm.titleWidth) / 2 - 20) +
                ", 52 " +
                (_vm.width + _vm.titleWidth) / 2 +
                ", 30\n      "
            }
          }),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              stroke: _vm.mergedColor[0],
              fill: "transparent",
              points:
                "\n        " +
                ((_vm.width + _vm.titleWidth) / 2 - 5) +
                ", 30 " +
                ((_vm.width + _vm.titleWidth) / 2 - 21) +
                ", 11\n        " +
                ((_vm.width + _vm.titleWidth) / 2 - 27) +
                ", 11 " +
                ((_vm.width + _vm.titleWidth) / 2 - 8) +
                ", 34\n      "
            }
          }),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              stroke: _vm.mergedColor[0],
              fill: "transparent",
              points:
                "\n        " +
                ((_vm.width - _vm.titleWidth) / 2 + 5) +
                ", 30 " +
                ((_vm.width - _vm.titleWidth) / 2 + 22) +
                ", 49\n        " +
                ((_vm.width - _vm.titleWidth) / 2 + 28) +
                ", 49 " +
                ((_vm.width - _vm.titleWidth) / 2 + 8) +
                ", 26\n      "
            }
          }),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              stroke: _vm.mergedColor[0],
              fill: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 30),
              filter: "url(#" + _vm.filterId + ")",
              points:
                "\n        " +
                ((_vm.width + _vm.titleWidth) / 2 - 11) +
                ", 37 " +
                ((_vm.width + _vm.titleWidth) / 2 - 32) +
                ", 11\n        " +
                ((_vm.width - _vm.titleWidth) / 2 + 23) +
                ", 11 " +
                ((_vm.width - _vm.titleWidth) / 2 + 11) +
                ", 23\n        " +
                ((_vm.width - _vm.titleWidth) / 2 + 33) +
                ", 49 " +
                ((_vm.width + _vm.titleWidth) / 2 - 22) +
                ", 49\n      "
            }
          }),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "1",
                points:
                  "\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 10) +
                  ", 37 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 31) +
                  ", 37\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 25) +
                  ", 46 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 4) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "1;0.7;1",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "0.7",
                points:
                  "\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 40) +
                  ", 37 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 61) +
                  ", 37\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 55) +
                  ", 46 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 34) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "0.7;0.4;0.7",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "0.5",
                points:
                  "\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 70) +
                  ", 37 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 91) +
                  ", 37\n        " +
                  ((_vm.width - _vm.titleWidth) / 2 - 85) +
                  ", 46 " +
                  ((_vm.width - _vm.titleWidth) / 2 - 64) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "0.5;0.2;0.5",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "1",
                points:
                  "\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 30) +
                  ", 37 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 9) +
                  ", 37\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 3) +
                  ", 46 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 24) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "1;0.7;1",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "0.7",
                points:
                  "\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 60) +
                  ", 37 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 39) +
                  ", 37\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 33) +
                  ", 46 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 54) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "0.7;0.4;0.7",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "polygon",
            {
              attrs: {
                filter: "url(#" + _vm.filterId + ")",
                fill: _vm.mergedColor[0],
                opacity: "0.5",
                points:
                  "\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 90) +
                  ", 37 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 69) +
                  ", 37\n        " +
                  ((_vm.width + _vm.titleWidth) / 2 + 63) +
                  ", 46 " +
                  ((_vm.width + _vm.titleWidth) / 2 + 84) +
                  ", 46\n      "
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "0.5;0.2;0.5",
                  dur: "2s",
                  begin: "0s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "text",
            {
              staticClass: "dv-border-box-11-title",
              attrs: {
                x: "" + _vm.width / 2,
                y: "32",
                fill: "#fff",
                "font-size": "18",
                "text-anchor": "middle",
                "dominant-baseline": "middle"
              }
            },
            [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")]
          ),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              fill: _vm.mergedColor[0],
              filter: "url(#" + _vm.filterId + ")",
              points:
                "\n        7, " +
                (53 + (_vm.height - 167) / 2) +
                " 11, " +
                (57 + (_vm.height - 167) / 2) +
                "\n        11, " +
                (133 + (_vm.height - 167) / 2) +
                " 7, " +
                (137 + (_vm.height - 167) / 2) +
                "\n      "
            }
          }),
          _vm._v(" "),
          _c("polygon", {
            attrs: {
              fill: _vm.mergedColor[0],
              filter: "url(#" + _vm.filterId + ")",
              points:
                "\n        " +
                (_vm.width - 7) +
                ", " +
                (53 + (_vm.height - 167) / 2) +
                " " +
                (_vm.width - 11) +
                ", " +
                (57 + (_vm.height - 167) / 2) +
                "\n        " +
                (_vm.width - 11) +
                ", " +
                (133 + (_vm.height - 167) / 2) +
                " " +
                (_vm.width - 7) +
                ", " +
                (137 + (_vm.height - 167) / 2) +
                "\n      "
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = function (inject) {
      if (!inject) return
      inject("data-v-191b64b9_0", { source: ".dv-border-box-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-11 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-11 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-11 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-11 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-11 .dv-border-svg-container > polyline {\n  fill: none;\n  stroke-width: 1;\n}\n.dv-border-box-11 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$c = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox11 (Vue) {
    Vue.component(__vue_component__$c.name, __vue_component__$c);
  }

  //
  var script$d = {
    name: 'DvBorderBox12',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'border-box-12',
        filterId: `borderr-box-12-filterId-${id}`,
        defaultColor: ['#2e6099', '#7ce7fd'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      },

      fade: lib_9
    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$d = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-12" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("defs", [
            _c(
              "filter",
              {
                attrs: {
                  id: _vm.filterId,
                  height: "150%",
                  width: "150%",
                  x: "-25%",
                  y: "-25%"
                }
              },
              [
                _c("feMorphology", {
                  attrs: {
                    operator: "dilate",
                    radius: "1",
                    in: "SourceAlpha",
                    result: "thicken"
                  }
                }),
                _vm._v(" "),
                _c("feGaussianBlur", {
                  attrs: { in: "thicken", stdDeviation: "2", result: "blurred" }
                }),
                _vm._v(" "),
                _c(
                  "feFlood",
                  {
                    attrs: {
                      "flood-color": _vm.fade(
                        _vm.mergedColor[1] || _vm.defaultColor[1],
                        70
                      ),
                      result: "glowColor"
                    }
                  },
                  [
                    _c("animate", {
                      attrs: {
                        attributeName: "flood-color",
                        values:
                          "\n              " +
                          _vm.fade(
                            _vm.mergedColor[1] || _vm.defaultColor[1],
                            70
                          ) +
                          ";\n              " +
                          _vm.fade(
                            _vm.mergedColor[1] || _vm.defaultColor[1],
                            30
                          ) +
                          ";\n              " +
                          _vm.fade(
                            _vm.mergedColor[1] || _vm.defaultColor[1],
                            70
                          ) +
                          ";\n            ",
                        dur: "3s",
                        begin: "0s",
                        repeatCount: "indefinite"
                      }
                    })
                  ]
                ),
                _vm._v(" "),
                _c("feComposite", {
                  attrs: {
                    in: "glowColor",
                    in2: "blurred",
                    operator: "in",
                    result: "softGlowColored"
                  }
                }),
                _vm._v(" "),
                _c(
                  "feMerge",
                  [
                    _c("feMergeNode", { attrs: { in: "softGlowColored" } }),
                    _vm._v(" "),
                    _c("feMergeNode", { attrs: { in: "SourceGraphic" } })
                  ],
                  1
                )
              ],
              1
            )
          ]),
          _vm._v(" "),
          _vm.width && _vm.height
            ? _c("path", {
                attrs: {
                  fill: _vm.backgroundColor,
                  "stroke-width": "2",
                  stroke: _vm.mergedColor[0],
                  d:
                    "\n        M15 5 L " +
                    (_vm.width - 15) +
                    " 5 Q " +
                    (_vm.width - 5) +
                    " 5, " +
                    (_vm.width - 5) +
                    " 15\n        L " +
                    (_vm.width - 5) +
                    " " +
                    (_vm.height - 15) +
                    " Q " +
                    (_vm.width - 5) +
                    " " +
                    (_vm.height - 5) +
                    ", " +
                    (_vm.width - 15) +
                    " " +
                    (_vm.height - 5) +
                    "\n        L 15, " +
                    (_vm.height - 5) +
                    " Q 5 " +
                    (_vm.height - 5) +
                    " 5 " +
                    (_vm.height - 15) +
                    " L 5 15\n        Q 5 5 15 5\n      "
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _c("path", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              "stroke-linecap": "round",
              filter: "url(#" + _vm.filterId + ")",
              stroke: _vm.mergedColor[1],
              d: "M 20 5 L 15 5 Q 5 5 5 15 L 5 20"
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              "stroke-linecap": "round",
              filter: "url(#" + _vm.filterId + ")",
              stroke: _vm.mergedColor[1],
              d:
                "M " +
                (_vm.width - 20) +
                " 5 L " +
                (_vm.width - 15) +
                " 5 Q " +
                (_vm.width - 5) +
                " 5 " +
                (_vm.width - 5) +
                " 15 L " +
                (_vm.width - 5) +
                " 20"
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              "stroke-linecap": "round",
              filter: "url(#" + _vm.filterId + ")",
              stroke: _vm.mergedColor[1],
              d:
                "\n        M " +
                (_vm.width - 20) +
                " " +
                (_vm.height - 5) +
                " L " +
                (_vm.width - 15) +
                " " +
                (_vm.height - 5) +
                "\n        Q " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 5) +
                " " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 15) +
                "\n        L " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 20) +
                "\n      "
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              "stroke-linecap": "round",
              filter: "url(#" + _vm.filterId + ")",
              stroke: _vm.mergedColor[1],
              d:
                "\n        M 20 " +
                (_vm.height - 5) +
                " L 15 " +
                (_vm.height - 5) +
                "\n        Q 5 " +
                (_vm.height - 5) +
                " 5 " +
                (_vm.height - 15) +
                "\n        L 5 " +
                (_vm.height - 20) +
                "\n      "
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$d = [];
  __vue_render__$d._withStripped = true;

    /* style */
    const __vue_inject_styles__$d = function (inject) {
      if (!inject) return
      inject("data-v-37e49230_0", { source: ".dv-border-box-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-12 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-12 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-12 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-12 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$d = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox12 (Vue) {
    Vue.component(__vue_component__$d.name, __vue_component__$d);
  }

  //
  var script$e = {
    name: 'DvBorderBox13',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      }
    },

    data() {
      return {
        ref: 'border-box-13',
        defaultColor: ['#6586ec', '#2cf7fe'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */
  var __vue_render__$e = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-border-box-13" }, [
      _c(
        "svg",
        {
          staticClass: "dv-border-svg-container",
          attrs: { width: _vm.width, height: _vm.height }
        },
        [
          _c("path", {
            attrs: {
              fill: _vm.backgroundColor,
              stroke: _vm.mergedColor[0],
              d:
                "\n        M 5 20 L 5 10 L 12 3  L 60 3 L 68 10\n        L " +
                (_vm.width - 20) +
                " 10 L " +
                (_vm.width - 5) +
                " 25\n        L " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 5) +
                " L 20 " +
                (_vm.height - 5) +
                "\n        L 5 " +
                (_vm.height - 20) +
                " L 5 20\n      "
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              fill: "transparent",
              "stroke-width": "3",
              "stroke-linecap": "round",
              "stroke-dasharray": "10, 5",
              stroke: _vm.mergedColor[0],
              d: "M 16 9 L 61 9"
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              fill: "transparent",
              stroke: _vm.mergedColor[1],
              d: "M 5 20 L 5 10 L 12 3  L 60 3 L 68 10"
            }
          }),
          _vm._v(" "),
          _c("path", {
            attrs: {
              fill: "transparent",
              stroke: _vm.mergedColor[1],
              d:
                "M " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 30) +
                " L " +
                (_vm.width - 5) +
                " " +
                (_vm.height - 5) +
                " L " +
                (_vm.width - 30) +
                " " +
                (_vm.height - 5)
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "border-box-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$e = [];
  __vue_render__$e._withStripped = true;

    /* style */
    const __vue_inject_styles__$e = function (inject) {
      if (!inject) return
      inject("data-v-38738595_0", { source: ".dv-border-box-13 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-13 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-13 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-border-box-13 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-border-box-13 .dv-border-svg-container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-border-box-13 .border-box-content {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$e = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      false,
      createInjector,
      undefined,
      undefined
    );

  function borderBox13 (Vue) {
    Vue.component(__vue_component__$e.name, __vue_component__$e);
  }

  //
  var script$f = {
    name: 'DvDecoration1',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      const pointSideLength = 2.5;
      return {
        ref: 'decoration-1',
        svgWH: [200, 50],
        svgScale: [1, 1],
        rowNum: 4,
        rowPoints: 20,
        pointSideLength,
        halfPointSideLength: pointSideLength / 2,
        points: [],
        rects: [],
        defaultColor: ['#fff', '#0de7c2'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcRectsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcRectsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
      },

      calcRectsPosition() {
        const {
          points,
          rowPoints
        } = this;
        const rect1 = points[rowPoints * 2 - 1];
        const rect2 = points[rowPoints * 2 - 3];
        this.rects = [rect1, rect2];
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$f = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-1" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              Math.random() > 0.6
                ? _c(
                    "rect",
                    {
                      key: i,
                      attrs: {
                        fill: _vm.mergedColor[0],
                        x: point[0] - _vm.halfPointSideLength,
                        y: point[1] - _vm.halfPointSideLength,
                        width: _vm.pointSideLength,
                        height: _vm.pointSideLength
                      }
                    },
                    [
                      Math.random() > 0.6
                        ? _c("animate", {
                            attrs: {
                              attributeName: "fill",
                              values: _vm.mergedColor[0] + ";transparent",
                              dur: "1s",
                              begin: Math.random() * 2,
                              repeatCount: "indefinite"
                            }
                          })
                        : _vm._e()
                    ]
                  )
                : _vm._e()
            ]
          }),
          _vm._v(" "),
          _vm.rects[0]
            ? _c(
                "rect",
                {
                  attrs: {
                    fill: _vm.mergedColor[1],
                    x: _vm.rects[0][0] - _vm.pointSideLength,
                    y: _vm.rects[0][1] - _vm.pointSideLength,
                    width: _vm.pointSideLength * 2,
                    height: _vm.pointSideLength * 2
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "width",
                      values: "0;" + _vm.pointSideLength * 2,
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "height",
                      values: "0;" + _vm.pointSideLength * 2,
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "x",
                      values:
                        _vm.rects[0][0] +
                        ";" +
                        (_vm.rects[0][0] - _vm.pointSideLength),
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "y",
                      values:
                        _vm.rects[0][1] +
                        ";" +
                        (_vm.rects[0][1] - _vm.pointSideLength),
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.rects[1]
            ? _c(
                "rect",
                {
                  attrs: {
                    fill: _vm.mergedColor[1],
                    x: _vm.rects[1][0] - 40,
                    y: _vm.rects[1][1] - _vm.pointSideLength,
                    width: 40,
                    height: _vm.pointSideLength * 2
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "width",
                      values: "0;40;0",
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "x",
                      values:
                        _vm.rects[1][0] +
                        ";" +
                        (_vm.rects[1][0] - 40) +
                        ";" +
                        _vm.rects[1][0],
                      dur: "2s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            : _vm._e()
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$f = [];
  __vue_render__$f._withStripped = true;

    /* style */
    const __vue_inject_styles__$f = function (inject) {
      if (!inject) return
      inject("data-v-556c1ca8_0", { source: ".dv-decoration-1 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-1 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-1 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-1 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$f = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration1 (Vue) {
    Vue.component(__vue_component__$f.name, __vue_component__$f);
  }

  //
  var script$g = {
    name: 'DvDecoration2',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      reverse: {
        type: Boolean,
        default: false
      },
      dur: {
        type: Number,
        default: 6
      }
    },

    data() {
      return {
        ref: 'decoration-2',
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        defaultColor: ['#3faacb', '#fff'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      },

      reverse() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          reverse,
          width,
          height
        } = this;

        if (reverse) {
          this.w = 1;
          this.h = height;
          this.x = width / 2;
          this.y = 0;
        } else {
          this.w = width;
          this.h = 1;
          this.x = 0;
          this.y = height / 2;
        }
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$g = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-2" }, [
      _c(
        "svg",
        { attrs: { width: _vm.width + "px", height: _vm.height + "px" } },
        [
          _c(
            "rect",
            {
              attrs: {
                x: _vm.x,
                y: _vm.y,
                width: _vm.w,
                height: _vm.h,
                fill: _vm.mergedColor[0]
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: _vm.reverse ? "height" : "width",
                  from: "0",
                  to: _vm.reverse ? _vm.height : _vm.width,
                  dur: _vm.dur + "s",
                  calcMode: "spline",
                  keyTimes: "0;1",
                  keySplines: ".42,0,.58,1",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "rect",
            {
              attrs: {
                x: _vm.x,
                y: _vm.y,
                width: "1",
                height: "1",
                fill: _vm.mergedColor[1]
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: _vm.reverse ? "y" : "x",
                  from: "0",
                  to: _vm.reverse ? _vm.height : _vm.width,
                  dur: _vm.dur + "s",
                  calcMode: "spline",
                  keyTimes: "0;1",
                  keySplines: "0.42,0,0.58,1",
                  repeatCount: "indefinite"
                }
              })
            ]
          )
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$g = [];
  __vue_render__$g._withStripped = true;

    /* style */
    const __vue_inject_styles__$g = function (inject) {
      if (!inject) return
      inject("data-v-4661df88_0", { source: ".dv-decoration-2 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-decoration-2 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$g = undefined;
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$g = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration2 (Vue) {
    Vue.component(__vue_component__$g.name, __vue_component__$g);
  }

  //
  var script$h = {
    name: 'DvDecoration3',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      const pointSideLength = 7;
      return {
        ref: 'decoration-3',
        svgWH: [300, 35],
        svgScale: [1, 1],
        rowNum: 2,
        rowPoints: 25,
        pointSideLength,
        halfPointSideLength: pointSideLength / 2,
        points: [],
        defaultColor: ['#7acaec', 'transparent'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$h = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-3" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              _c(
                "rect",
                {
                  key: i,
                  attrs: {
                    fill: _vm.mergedColor[0],
                    x: point[0] - _vm.halfPointSideLength,
                    y: point[1] - _vm.halfPointSideLength,
                    width: _vm.pointSideLength,
                    height: _vm.pointSideLength
                  }
                },
                [
                  Math.random() > 0.6
                    ? _c("animate", {
                        attrs: {
                          attributeName: "fill",
                          values: "" + _vm.mergedColor.join(";"),
                          dur: Math.random() + 1 + "s",
                          begin: Math.random() * 2,
                          repeatCount: "indefinite"
                        }
                      })
                    : _vm._e()
                ]
              )
            ]
          })
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$h = [];
  __vue_render__$h._withStripped = true;

    /* style */
    const __vue_inject_styles__$h = function (inject) {
      if (!inject) return
      inject("data-v-8fa34a94_0", { source: ".dv-decoration-3 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-3 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-3 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-3 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$h = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration3 (Vue) {
    Vue.component(__vue_component__$h.name, __vue_component__$h);
  }

  //
  var script$i = {
    name: 'DvDecoration4',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      reverse: {
        type: Boolean,
        default: false
      },
      dur: {
        type: Number,
        default: 3
      }
    },

    data() {
      return {
        ref: 'decoration-4',
        defaultColor: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$i = script$i;

  /* template */
  var __vue_render__$i = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-4" }, [
      _c(
        "div",
        {
          class: "container " + (_vm.reverse ? "reverse" : "normal"),
          style: _vm.reverse
            ? "width:" +
              _vm.width +
              "px;height:5px;animation-duration:" +
              _vm.dur +
              "s"
            : "width:5px;height:" +
              _vm.height +
              "px;animation-duration:" +
              _vm.dur +
              "s"
        },
        [
          _c(
            "svg",
            {
              attrs: {
                width: _vm.reverse ? _vm.width : 5,
                height: _vm.reverse ? 5 : _vm.height
              }
            },
            [
              _c("polyline", {
                attrs: {
                  stroke: _vm.mergedColor[0],
                  points: _vm.reverse
                    ? "0, 2.5 " + _vm.width + ", 2.5"
                    : "2.5, 0 2.5, " + _vm.height
                }
              }),
              _vm._v(" "),
              _c("polyline", {
                staticClass: "bold-line",
                attrs: {
                  stroke: _vm.mergedColor[1],
                  "stroke-width": "3",
                  "stroke-dasharray": "20, 80",
                  "stroke-dashoffset": "-30",
                  points: _vm.reverse
                    ? "0, 2.5 " + _vm.width + ", 2.5"
                    : "2.5, 0 2.5, " + _vm.height
                }
              })
            ]
          )
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$i = [];
  __vue_render__$i._withStripped = true;

    /* style */
    const __vue_inject_styles__$i = function (inject) {
      if (!inject) return
      inject("data-v-a1c4c28a_0", { source: ".dv-decoration-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-4 .container {\n  display: flex;\n  overflow: hidden;\n  position: absolute;\n  flex: 1;\n}\n.dv-decoration-4 .normal {\n  animation: ani-height ease-in-out infinite;\n  left: 50%;\n  margin-left: -2px;\n}\n.dv-decoration-4 .reverse {\n  animation: ani-width ease-in-out infinite;\n  top: 50%;\n  margin-top: -2px;\n}\n@keyframes ani-height {\n0% {\n    height: 0%;\n}\n70% {\n    height: 100%;\n}\n100% {\n    height: 100%;\n}\n}\n@keyframes ani-width {\n0% {\n    width: 0%;\n}\n70% {\n    width: 100%;\n}\n100% {\n    width: 100%;\n}\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,kBAAkB;EAClB,OAAO;AACT;AACA;EACE,0CAA0C;EAC1C,SAAS;EACT,iBAAiB;AACnB;AACA;EACE,yCAAyC;EACzC,QAAQ;EACR,gBAAgB;AAClB;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,YAAY;AACd;AACA;IACE,YAAY;AACd;AACF;AACA;AACE;IACE,SAAS;AACX;AACA;IACE,WAAW;AACb;AACA;IACE,WAAW;AACb;AACF","file":"main.vue","sourcesContent":[".dv-decoration-4 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-4 .container {\n  display: flex;\n  overflow: hidden;\n  position: absolute;\n  flex: 1;\n}\n.dv-decoration-4 .normal {\n  animation: ani-height ease-in-out infinite;\n  left: 50%;\n  margin-left: -2px;\n}\n.dv-decoration-4 .reverse {\n  animation: ani-width ease-in-out infinite;\n  top: 50%;\n  margin-top: -2px;\n}\n@keyframes ani-height {\n  0% {\n    height: 0%;\n  }\n  70% {\n    height: 100%;\n  }\n  100% {\n    height: 100%;\n  }\n}\n@keyframes ani-width {\n  0% {\n    width: 0%;\n  }\n  70% {\n    width: 100%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$i = undefined;
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$i = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$i,
      __vue_script__$i,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration4 (Vue) {
    Vue.component(__vue_component__$i.name, __vue_component__$i);
  }

  //
  var script$j = {
    name: 'DvDecoration5',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      dur: {
        type: Number,
        default: 1.2
      }
    },

    data() {
      return {
        ref: 'decoration-5',
        line1Points: '',
        line2Points: '',
        line1Length: 0,
        line2Length: 0,
        defaultColor: ['#3f96a5', '#3f96a5'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          width,
          height
        } = this;
        let line1Points = [[0, height * 0.2], [width * 0.18, height * 0.2], [width * 0.2, height * 0.4], [width * 0.25, height * 0.4], [width * 0.27, height * 0.6], [width * 0.72, height * 0.6], [width * 0.75, height * 0.4], [width * 0.8, height * 0.4], [width * 0.82, height * 0.2], [width, height * 0.2]];
        let line2Points = [[width * 0.3, height * 0.8], [width * 0.7, height * 0.8]];
        const line1Length = util$1.getPolylineLength(line1Points);
        const line2Length = util$1.getPolylineLength(line2Points);
        line1Points = line1Points.map(point => point.join(',')).join(' ');
        line2Points = line2Points.map(point => point.join(',')).join(' ');
        this.line1Points = line1Points;
        this.line2Points = line2Points;
        this.line1Length = line1Length;
        this.line2Length = line2Length;
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$j = script$j;

  /* template */
  var __vue_render__$j = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-5" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c(
          "polyline",
          {
            attrs: {
              fill: "transparent",
              stroke: _vm.mergedColor[0],
              "stroke-width": "3",
              points: _vm.line1Points
            }
          },
          [
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                attributeType: "XML",
                from: "0, " + _vm.line1Length / 2 + ", 0, " + _vm.line1Length / 2,
                to: "0, 0, " + _vm.line1Length + ", 0",
                dur: _vm.dur + "s",
                begin: "0s",
                calcMode: "spline",
                keyTimes: "0;1",
                keySplines: "0.4,1,0.49,0.98",
                repeatCount: "indefinite"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              fill: "transparent",
              stroke: _vm.mergedColor[1],
              "stroke-width": "2",
              points: _vm.line2Points
            }
          },
          [
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                attributeType: "XML",
                from: "0, " + _vm.line2Length / 2 + ", 0, " + _vm.line2Length / 2,
                to: "0, 0, " + _vm.line2Length + ", 0",
                dur: _vm.dur + "s",
                begin: "0s",
                calcMode: "spline",
                keyTimes: "0;1",
                keySplines: ".4,1,.49,.98",
                repeatCount: "indefinite"
              }
            })
          ]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$j = [];
  __vue_render__$j._withStripped = true;

    /* style */
    const __vue_inject_styles__$j = function (inject) {
      if (!inject) return
      inject("data-v-79b4bdd9_0", { source: ".dv-decoration-5 {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-decoration-5 {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$j = undefined;
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$j = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
      __vue_inject_styles__$j,
      __vue_script__$j,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration5 (Vue) {
    Vue.component(__vue_component__$j.name, __vue_component__$j);
  }

  //
  var script$k = {
    name: 'DvDecoration6',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      const rectWidth = 7;
      return {
        ref: 'decoration-6',
        svgWH: [300, 35],
        svgScale: [1, 1],
        rowNum: 1,
        rowPoints: 40,
        rectWidth,
        halfRectWidth: rectWidth / 2,
        points: [],
        heights: [],
        minHeights: [],
        randoms: [],
        defaultColor: ['#7acaec', '#7acaec'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      calcSVGData() {
        const {
          calcPointsPosition,
          calcScale
        } = this;
        calcPointsPosition();
        calcScale();
      },

      calcPointsPosition() {
        const {
          svgWH,
          rowNum,
          rowPoints
        } = this;
        const [w, h] = svgWH;
        const horizontalGap = w / (rowPoints + 1);
        const verticalGap = h / (rowNum + 1);
        let points = new Array(rowNum).fill(0).map((foo, i) => new Array(rowPoints).fill(0).map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)]));
        this.points = points.reduce((all, item) => [...all, ...item], []);
        const heights = this.heights = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() > 0.8 ? randomExtend(0.7 * h, h) : randomExtend(0.2 * h, 0.5 * h));
        this.minHeights = new Array(rowNum * rowPoints).fill(0).map((foo, i) => heights[i] * Math.random());
        this.randoms = new Array(rowNum * rowPoints).fill(0).map(foo => Math.random() + 1.5);
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcSVGData
        } = this;
        calcSVGData();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$k = script$k;

  /* template */
  var __vue_render__$k = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-6" }, [
      _c(
        "svg",
        {
          style:
            "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
          attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
        },
        [
          _vm._l(_vm.points, function(point, i) {
            return [
              _c(
                "rect",
                {
                  key: i,
                  attrs: {
                    fill: _vm.mergedColor[Math.random() > 0.5 ? 0 : 1],
                    x: point[0] - _vm.halfRectWidth,
                    y: point[1] - _vm.heights[i] / 2,
                    width: _vm.rectWidth,
                    height: _vm.heights[i]
                  }
                },
                [
                  _c("animate", {
                    attrs: {
                      attributeName: "y",
                      values:
                        point[1] -
                        _vm.minHeights[i] / 2 +
                        ";" +
                        (point[1] - _vm.heights[i] / 2) +
                        ";" +
                        (point[1] - _vm.minHeights[i] / 2),
                      dur: _vm.randoms[i] + "s",
                      keyTimes: "0;0.5;1",
                      calcMode: "spline",
                      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  }),
                  _vm._v(" "),
                  _c("animate", {
                    attrs: {
                      attributeName: "height",
                      values:
                        _vm.minHeights[i] +
                        ";" +
                        _vm.heights[i] +
                        ";" +
                        _vm.minHeights[i],
                      dur: _vm.randoms[i] + "s",
                      keyTimes: "0;0.5;1",
                      calcMode: "spline",
                      keySplines: "0.42,0,0.58,1;0.42,0,0.58,1",
                      begin: "0s",
                      repeatCount: "indefinite"
                    }
                  })
                ]
              )
            ]
          })
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$k = [];
  __vue_render__$k._withStripped = true;

    /* style */
    const __vue_inject_styles__$k = function (inject) {
      if (!inject) return
      inject("data-v-01717fed_0", { source: ".dv-decoration-6 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-6 svg {\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-6 {\n  width: 100%;\n  height: 100%;\n}\n.dv-decoration-6 svg {\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$k = undefined;
    /* module identifier */
    const __vue_module_identifier__$k = undefined;
    /* functional template */
    const __vue_is_functional_template__$k = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$k = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
      __vue_inject_styles__$k,
      __vue_script__$k,
      __vue_scope_id__$k,
      __vue_is_functional_template__$k,
      __vue_module_identifier__$k,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration6 (Vue) {
    Vue.component(__vue_component__$k.name, __vue_component__$k);
  }

  //
  var script$l = {
    name: 'DvDecoration7',
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        defaultColor: ['#1dc1f5', '#1dc1f5'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$l = script$l;

  /* template */
  var __vue_render__$l = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-decoration-7" },
      [
        _c("svg", { attrs: { width: "21px", height: "20px" } }, [
          _c("polyline", {
            attrs: {
              "stroke-width": "4",
              fill: "transparent",
              stroke: _vm.mergedColor[0],
              points: "10, 0 19, 10 10, 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              stroke: _vm.mergedColor[1],
              points: "2, 0 11, 10 2, 20"
            }
          })
        ]),
        _vm._v(" "),
        _vm._t("default"),
        _vm._v(" "),
        _c("svg", { attrs: { width: "21px", height: "20px" } }, [
          _c("polyline", {
            attrs: {
              "stroke-width": "4",
              fill: "transparent",
              stroke: _vm.mergedColor[0],
              points: "11, 0 2, 10 11, 20"
            }
          }),
          _vm._v(" "),
          _c("polyline", {
            attrs: {
              "stroke-width": "2",
              fill: "transparent",
              stroke: _vm.mergedColor[1],
              points: "19, 0 10, 10 19, 20"
            }
          })
        ])
      ],
      2
    )
  };
  var __vue_staticRenderFns__$l = [];
  __vue_render__$l._withStripped = true;

    /* style */
    const __vue_inject_styles__$l = function (inject) {
      if (!inject) return
      inject("data-v-af40fef0_0", { source: ".dv-decoration-7 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-decoration-7 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$l = undefined;
    /* module identifier */
    const __vue_module_identifier__$l = undefined;
    /* functional template */
    const __vue_is_functional_template__$l = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$l = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
      __vue_inject_styles__$l,
      __vue_script__$l,
      __vue_scope_id__$l,
      __vue_is_functional_template__$l,
      __vue_module_identifier__$l,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration7 (Vue) {
    Vue.component(__vue_component__$l.name, __vue_component__$l);
  }

  //
  var script$m = {
    name: 'DvDecoration8',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      reverse: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        ref: 'decoration-8',
        defaultColor: ['#3f96a5', '#3f96a5'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      xPos(pos) {
        const {
          reverse,
          width
        } = this;
        if (!reverse) return pos;
        return width - pos;
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$m = script$m;

  /* template */
  var __vue_render__$m = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-8" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c("polyline", {
          attrs: {
            stroke: _vm.mergedColor[0],
            "stroke-width": "2",
            fill: "transparent",
            points: _vm.xPos(0) + ", 0 " + _vm.xPos(30) + ", " + _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            stroke: _vm.mergedColor[0],
            "stroke-width": "2",
            fill: "transparent",
            points:
              _vm.xPos(20) +
              ", 0 " +
              _vm.xPos(50) +
              ", " +
              _vm.height / 2 +
              " " +
              _vm.xPos(_vm.width) +
              ", " +
              _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            stroke: _vm.mergedColor[1],
            fill: "transparent",
            "stroke-width": "3",
            points:
              _vm.xPos(0) +
              ", " +
              (_vm.height - 3) +
              ", " +
              _vm.xPos(200) +
              ", " +
              (_vm.height - 3)
          }
        })
      ])
    ])
  };
  var __vue_staticRenderFns__$m = [];
  __vue_render__$m._withStripped = true;

    /* style */
    const __vue_inject_styles__$m = function (inject) {
      if (!inject) return
      inject("data-v-03ec2ce7_0", { source: ".dv-decoration-8 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-decoration-8 {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$m = undefined;
    /* module identifier */
    const __vue_module_identifier__$m = undefined;
    /* functional template */
    const __vue_is_functional_template__$m = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$m = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
      __vue_inject_styles__$m,
      __vue_script__$m,
      __vue_scope_id__$m,
      __vue_is_functional_template__$m,
      __vue_module_identifier__$m,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration8 (Vue) {
    Vue.component(__vue_component__$m.name, __vue_component__$m);
  }

  //
  var script$n = {
    name: 'DvDecoration9',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },
      dur: {
        type: Number,
        default: 3
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'decoration-9',
        polygonId: `decoration-9-polygon-${id}`,
        svgWH: [100, 100],
        svgScale: [1, 1],
        defaultColor: ['rgba(3, 166, 224, 0.8)', 'rgba(3, 166, 224, 0.5)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcScale
        } = this;
        calcScale();
      },

      calcScale() {
        const {
          width,
          height,
          svgWH
        } = this;
        const [w, h] = svgWH;
        this.svgScale = [width / w, height / h];
      },

      onResize() {
        const {
          calcScale
        } = this;
        calcScale();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      },

      fade: lib_9
    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$n = script$n;

  /* template */
  var __vue_render__$n = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, staticClass: "dv-decoration-9" },
      [
        _c(
          "svg",
          {
            style:
              "transform:scale(" + _vm.svgScale[0] + "," + _vm.svgScale[1] + ");",
            attrs: { width: _vm.svgWH[0] + "px", height: _vm.svgWH[1] + "px" }
          },
          [
            _c("defs", [
              _c("polygon", {
                attrs: {
                  id: _vm.polygonId,
                  points: "15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5"
                }
              })
            ]),
            _vm._v(" "),
            _c(
              "circle",
              {
                attrs: {
                  cx: "50",
                  cy: "50",
                  r: "45",
                  fill: "transparent",
                  stroke: _vm.mergedColor[1],
                  "stroke-width": "10",
                  "stroke-dasharray": "80, 100, 30, 100"
                }
              },
              [
                _c("animateTransform", {
                  attrs: {
                    attributeName: "transform",
                    type: "rotate",
                    values: "0 50 50;360 50 50",
                    dur: _vm.dur + "s",
                    repeatCount: "indefinite"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "circle",
              {
                attrs: {
                  cx: "50",
                  cy: "50",
                  r: "45",
                  fill: "transparent",
                  stroke: _vm.mergedColor[0],
                  "stroke-width": "6",
                  "stroke-dasharray": "50, 66, 100, 66"
                }
              },
              [
                _c("animateTransform", {
                  attrs: {
                    attributeName: "transform",
                    type: "rotate",
                    values: "0 50 50;-360 50 50",
                    dur: _vm.dur + "s",
                    repeatCount: "indefinite"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c("circle", {
              attrs: {
                cx: "50",
                cy: "50",
                r: "38",
                fill: "transparent",
                stroke: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 30),
                "stroke-width": "1",
                "stroke-dasharray": "5, 1"
              }
            }),
            _vm._v(" "),
            _vm._l(new Array(20).fill(0), function(foo, i) {
              return _c(
                "use",
                {
                  key: i,
                  attrs: {
                    "xlink:href": "#" + _vm.polygonId,
                    stroke: _vm.mergedColor[1],
                    fill: Math.random() > 0.4 ? "transparent" : _vm.mergedColor[0]
                  }
                },
                [
                  _c("animateTransform", {
                    attrs: {
                      attributeName: "transform",
                      type: "rotate",
                      values: "0 50 50;360 50 50",
                      dur: _vm.dur + "s",
                      begin: (i * _vm.dur) / 20 + "s",
                      repeatCount: "indefinite"
                    }
                  })
                ],
                1
              )
            }),
            _vm._v(" "),
            _c("circle", {
              attrs: {
                cx: "50",
                cy: "50",
                r: "26",
                fill: "transparent",
                stroke: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 30),
                "stroke-width": "1",
                "stroke-dasharray": "5, 1"
              }
            })
          ],
          2
        ),
        _vm._v(" "),
        _vm._t("default")
      ],
      2
    )
  };
  var __vue_staticRenderFns__$n = [];
  __vue_render__$n._withStripped = true;

    /* style */
    const __vue_inject_styles__$n = function (inject) {
      if (!inject) return
      inject("data-v-1fdf97fa_0", { source: ".dv-decoration-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dv-decoration-9 svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  transform-origin: left top;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,0BAA0B;AAC5B","file":"main.vue","sourcesContent":[".dv-decoration-9 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dv-decoration-9 svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  transform-origin: left top;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$n = undefined;
    /* module identifier */
    const __vue_module_identifier__$n = undefined;
    /* functional template */
    const __vue_is_functional_template__$n = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$n = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
      __vue_inject_styles__$n,
      __vue_script__$n,
      __vue_scope_id__$n,
      __vue_is_functional_template__$n,
      __vue_module_identifier__$n,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration9 (Vue) {
    Vue.component(__vue_component__$n.name, __vue_component__$n);
  }

  //
  var script$o = {
    name: 'DvDecoration10',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'decoration-10',
        animationId1: `d10ani1${id}`,
        animationId2: `d10ani2${id}`,
        animationId3: `d10ani3${id}`,
        animationId4: `d10ani4${id}`,
        animationId5: `d10ani5${id}`,
        animationId6: `d10ani6${id}`,
        animationId7: `d10ani7${id}`,
        defaultColor: ['#00c2ff', 'rgba(0, 194, 255, 0.3)'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      }

    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$o = script$o;

  /* template */
  var __vue_render__$o = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-10" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c("polyline", {
          attrs: {
            stroke: _vm.mergedColor[1],
            "stroke-width": "2",
            points:
              "0, " + _vm.height / 2 + " " + _vm.width + ", " + _vm.height / 2
          }
        }),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: _vm.mergedColor[0],
              "stroke-width": "2",
              points:
                "5, " +
                _vm.height / 2 +
                " " +
                (_vm.width * 0.2 - 3) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.2,
              fill: "freeze"
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId2,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.2 + ";" + _vm.width * 0.2 + ", 0;",
                dur: "3s",
                begin: _vm.animationId1 + ".end",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.2 + ", 0;0, " + _vm.width * 0.2,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: _vm.mergedColor[0],
              "stroke-width": "2",
              points:
                _vm.width * 0.2 +
                3 +
                ", " +
                _vm.height / 2 +
                " " +
                (_vm.width * 0.8 - 3) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.6
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId4,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.6 + ";" + _vm.width * 0.6 + ", 0",
                dur: "3s",
                begin: _vm.animationId3 + ".end + 1s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.6 + ", 0;0, " + _vm.width * 0.6,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "polyline",
          {
            attrs: {
              stroke: _vm.mergedColor[0],
              "stroke-width": "2",
              points:
                _vm.width * 0.8 +
                3 +
                ", " +
                _vm.height / 2 +
                " " +
                (_vm.width - 5) +
                ", " +
                _vm.height / 2,
              "stroke-dasharray": "0, " + _vm.width * 0.2
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId6,
                attributeName: "stroke-dasharray",
                values: "0, " + _vm.width * 0.2 + ";" + _vm.width * 0.2 + ", 0",
                dur: "3s",
                begin: _vm.animationId5 + ".end + 1s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "stroke-dasharray",
                values: _vm.width * 0.2 + ", 0;0, " + _vm.width * 0.3,
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: "2",
              cy: _vm.height / 2,
              r: "2",
              fill: _vm.mergedColor[1]
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId1,
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[0],
                begin: "0s;" + _vm.animationId7 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width * 0.2,
              cy: _vm.height / 2,
              r: "2",
              fill: _vm.mergedColor[1]
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId3,
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[0],
                begin: _vm.animationId2 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[1],
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width * 0.8,
              cy: _vm.height / 2,
              r: "2",
              fill: _vm.mergedColor[1]
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId5,
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[0],
                begin: _vm.animationId4 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[1],
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "circle",
          {
            attrs: {
              cx: _vm.width - 2,
              cy: _vm.height / 2,
              r: "2",
              fill: _vm.mergedColor[1]
            }
          },
          [
            _c("animate", {
              attrs: {
                id: _vm.animationId7,
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[0],
                begin: _vm.animationId6 + ".end",
                dur: "0.3s",
                fill: "freeze"
              }
            }),
            _vm._v(" "),
            _c("animate", {
              attrs: {
                attributeName: "fill",
                values: _vm.mergedColor[1] + ";" + _vm.mergedColor[1],
                dur: "0.01s",
                begin: _vm.animationId7 + ".end",
                fill: "freeze"
              }
            })
          ]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$o = [];
  __vue_render__$o._withStripped = true;

    /* style */
    const __vue_inject_styles__$o = function (inject) {
      if (!inject) return
      inject("data-v-5b95ab54_0", { source: ".dv-decoration-10 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;AACf","file":"main.vue","sourcesContent":[".dv-decoration-10 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$o = undefined;
    /* module identifier */
    const __vue_module_identifier__$o = undefined;
    /* functional template */
    const __vue_is_functional_template__$o = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$o = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
      __vue_inject_styles__$o,
      __vue_script__$o,
      __vue_scope_id__$o,
      __vue_is_functional_template__$o,
      __vue_module_identifier__$o,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration10 (Vue) {
    Vue.component(__vue_component__$o.name, __vue_component__$o);
  }

  //
  var script$p = {
    name: 'DvDecoration11',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        ref: 'decoration-11',
        defaultColor: ['#1a98fc', '#2cf7fe'],
        mergedColor: []
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    methods: {
      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      },

      fade: lib_9
    },

    mounted() {
      const {
        mergeColor
      } = this;
      mergeColor();
    }

  };

  /* script */
  const __vue_script__$p = script$p;

  /* template */
  var __vue_render__$p = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-11" }, [
      _c("svg", { attrs: { width: _vm.width, height: _vm.height } }, [
        _c("polygon", {
          attrs: {
            fill: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 10),
            stroke: _vm.mergedColor[1],
            points: "20 10, 25 4, 55 4 60 10"
          }
        }),
        _vm._v(" "),
        _c("polygon", {
          attrs: {
            fill: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 10),
            stroke: _vm.mergedColor[1],
            points:
              "20 " +
              (_vm.height - 10) +
              ", 25 " +
              (_vm.height - 4) +
              ", 55 " +
              (_vm.height - 4) +
              " 60 " +
              (_vm.height - 10)
          }
        }),
        _vm._v(" "),
        _c("polygon", {
          attrs: {
            fill: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 10),
            stroke: _vm.mergedColor[1],
            points:
              _vm.width -
              20 +
              " 10, " +
              (_vm.width - 25) +
              " 4, " +
              (_vm.width - 55) +
              " 4 " +
              (_vm.width - 60) +
              " 10"
          }
        }),
        _vm._v(" "),
        _c("polygon", {
          attrs: {
            fill: _vm.fade(_vm.mergedColor[1] || _vm.defaultColor[1], 10),
            stroke: _vm.mergedColor[1],
            points:
              _vm.width -
              20 +
              " " +
              (_vm.height - 10) +
              ", " +
              (_vm.width - 25) +
              " " +
              (_vm.height - 4) +
              ", " +
              (_vm.width - 55) +
              " " +
              (_vm.height - 4) +
              " " +
              (_vm.width - 60) +
              " " +
              (_vm.height - 10)
          }
        }),
        _vm._v(" "),
        _c("polygon", {
          attrs: {
            fill: _vm.fade(_vm.mergedColor[0] || _vm.defaultColor[0], 20),
            stroke: _vm.mergedColor[0],
            points:
              "\n        20 10, 5 " +
              _vm.height / 2 +
              " 20 " +
              (_vm.height - 10) +
              "\n        " +
              (_vm.width - 20) +
              " " +
              (_vm.height - 10) +
              " " +
              (_vm.width - 5) +
              " " +
              _vm.height / 2 +
              " " +
              (_vm.width - 20) +
              " 10\n      "
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            fill: "transparent",
            stroke: _vm.fade(_vm.mergedColor[0] || _vm.defaultColor[0], 70),
            points: "25 18, 15 " + _vm.height / 2 + " 25 " + (_vm.height - 18)
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            fill: "transparent",
            stroke: _vm.fade(_vm.mergedColor[0] || _vm.defaultColor[0], 70),
            points:
              _vm.width -
              25 +
              " 18, " +
              (_vm.width - 15) +
              " " +
              _vm.height / 2 +
              " " +
              (_vm.width - 25) +
              " " +
              (_vm.height - 18)
          }
        })
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "decoration-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$p = [];
  __vue_render__$p._withStripped = true;

    /* style */
    const __vue_inject_styles__$p = function (inject) {
      if (!inject) return
      inject("data-v-71604718_0", { source: ".dv-decoration-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-11 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB","file":"main.vue","sourcesContent":[".dv-decoration-11 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-11 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$p = undefined;
    /* module identifier */
    const __vue_module_identifier__$p = undefined;
    /* functional template */
    const __vue_is_functional_template__$p = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$p = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
      __vue_inject_styles__$p,
      __vue_script__$p,
      __vue_scope_id__$p,
      __vue_is_functional_template__$p,
      __vue_module_identifier__$p,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration11 (Vue) {
    Vue.component(__vue_component__$p.name, __vue_component__$p);
  }

  //
  var script$q = {
    name: 'DvDecoration12',
    mixins: [autoResize],
    props: {
      color: {
        type: Array,
        default: () => []
      },

      /**
       * @description Scan animation dur
       */
      scanDur: {
        type: Number,
        default: 3
      },

      /**
       * @description Halo animation dur
       */
      haloDur: {
        type: Number,
        default: 2
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'decoration-12',
        gId: `decoration-12-g-${id}`,
        gradientId: `decoration-12-gradient-${id}`,
        defaultColor: ['#2783ce', '#2cf7fe'],
        mergedColor: [],
        pathD: [],
        pathColor: [],
        circleR: [],
        splitLinePoints: [],
        arcD: [],
        segment: 30,
        sectorAngle: Math.PI / 3,
        ringNum: 3,
        ringWidth: 1,
        showSplitLine: true
      };
    },

    watch: {
      color() {
        const {
          mergeColor
        } = this;
        mergeColor();
      }

    },
    computed: {
      x() {
        const {
          width
        } = this;
        return width / 2;
      },

      y() {
        const {
          height
        } = this;
        return height / 2;
      }

    },
    methods: {
      init() {
        const {
          mergeColor,
          calcPathD,
          calcPathColor,
          calcCircleR,
          calcSplitLinePoints,
          calcArcD
        } = this;
        mergeColor();
        calcPathD();
        calcPathColor();
        calcCircleR();
        calcSplitLinePoints();
        calcArcD();
      },

      mergeColor() {
        const {
          color,
          defaultColor
        } = this;
        this.mergedColor = index.deepMerge(util_1(defaultColor, true), color || []);
      },

      calcPathD() {
        const {
          x,
          y,
          width,
          segment,
          sectorAngle
        } = this;
        const startAngle = -Math.PI / 2;
        const angleGap = sectorAngle / segment;
        const r = width / 4;
        let lastEndPoints = util_13(x, y, r, startAngle);
        this.pathD = new Array(segment).fill('').map((_, i) => {
          const endPoints = util_13(x, y, r, startAngle - (i + 1) * angleGap).map(_ => _.toFixed(5));
          const d = `M${lastEndPoints.join(',')} A${r}, ${r} 0 0 0 ${endPoints.join(',')}`;
          lastEndPoints = endPoints;
          return d;
        });
      },

      calcPathColor() {
        const {
          mergedColor: [color],
          segment
        } = this;
        const colorGap = 100 / (segment - 1);
        this.pathColor = new Array(segment).fill(color).map((_, i) => lib_9(color, 100 - i * colorGap));
      },

      calcCircleR() {
        const {
          segment,
          ringNum,
          width,
          ringWidth
        } = this;
        const radiusGap = (width / 2 - ringWidth / 2) / ringNum;
        this.circleR = new Array(ringNum).fill(0).map((_, i) => radiusGap * (i + 1));
      },

      calcSplitLinePoints() {
        const {
          x,
          y,
          width
        } = this;
        const angleGap = Math.PI / 6;
        const r = width / 2;
        this.splitLinePoints = new Array(6).fill('').map((_, i) => {
          const startAngle = angleGap * (i + 1);
          const endAngle = startAngle + Math.PI;
          const startPoint = util_13(x, y, r, startAngle);
          const endPoint = util_13(x, y, r, endAngle);
          return `${startPoint.join(',')} ${endPoint.join(',')}`;
        });
      },

      calcArcD() {
        const {
          x,
          y,
          width
        } = this;
        const angleGap = Math.PI / 6;
        const r = width / 2 - 1;
        this.arcD = new Array(4).fill('').map((_, i) => {
          const startAngle = angleGap * (3 * i + 1);
          const endAngle = startAngle + angleGap;
          const startPoint = util_13(x, y, r, startAngle);
          const endPoint = util_13(x, y, r, endAngle);
          return `M${startPoint.join(',')} A${x}, ${y} 0 0 1 ${endPoint.join(',')}`;
        });
      },

      afterAutoResizeMixinInit() {
        const {
          init
        } = this;
        init();
      },

      fade: lib_9
    }
  };

  /* script */
  const __vue_script__$q = script$q;

  /* template */
  var __vue_render__$q = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-decoration-12" }, [
      _c(
        "svg",
        { attrs: { width: _vm.width, height: _vm.height } },
        [
          _c(
            "defs",
            [
              _c(
                "g",
                { attrs: { id: _vm.gId } },
                _vm._l(_vm.pathD, function(d, i) {
                  return _c("path", {
                    key: d,
                    attrs: {
                      stroke: _vm.pathColor[i],
                      "stroke-width": _vm.width / 2,
                      fill: "transparent",
                      d: d
                    }
                  })
                }),
                0
              ),
              _vm._v(" "),
              _c(
                "radialGradient",
                { attrs: { id: _vm.gradientId, cx: "50%", cy: "50%", r: "50%" } },
                [
                  _c("stop", {
                    attrs: {
                      offset: "0%",
                      "stop-color": "transparent",
                      "stop-opacity": "1"
                    }
                  }),
                  _vm._v(" "),
                  _c("stop", {
                    attrs: {
                      offset: "100%",
                      "stop-color": _vm.fade(
                        _vm.mergedColor[1] || _vm.defaultColor[1],
                        30
                      ),
                      "stop-opacity": "1"
                    }
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _vm._l(_vm.circleR, function(r) {
            return _c("circle", {
              key: r,
              attrs: {
                r: r,
                cx: _vm.x,
                cy: _vm.y,
                stroke: _vm.mergedColor[1],
                "stroke-width": 0.5,
                fill: "transparent"
              }
            })
          }),
          _vm._v(" "),
          _c(
            "circle",
            {
              attrs: {
                r: "1",
                cx: _vm.x,
                cy: _vm.y,
                stroke: "transparent",
                fill: "url(#" + _vm.gradientId + ")"
              }
            },
            [
              _c("animate", {
                attrs: {
                  attributeName: "r",
                  values: "1;" + _vm.width / 2,
                  dur: _vm.haloDur + "s",
                  repeatCount: "indefinite"
                }
              }),
              _vm._v(" "),
              _c("animate", {
                attrs: {
                  attributeName: "opacity",
                  values: "1;0",
                  dur: _vm.haloDur + "s",
                  repeatCount: "indefinite"
                }
              })
            ]
          ),
          _vm._v(" "),
          _c("circle", {
            attrs: { r: "2", cx: _vm.x, cy: _vm.y, fill: _vm.mergedColor[1] }
          }),
          _vm._v(" "),
          _vm.showSplitLine
            ? _c(
                "g",
                _vm._l(_vm.splitLinePoints, function(p) {
                  return _c("polyline", {
                    key: p,
                    attrs: {
                      points: p,
                      stroke: _vm.mergedColor[1],
                      "stroke-width": 0.5,
                      opacity: "0.5"
                    }
                  })
                }),
                0
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._l(_vm.arcD, function(d) {
            return _c("path", {
              key: d,
              attrs: {
                d: d,
                stroke: _vm.mergedColor[1],
                "stroke-width": "2",
                fill: "transparent"
              }
            })
          }),
          _vm._v(" "),
          _c(
            "use",
            { attrs: { "xlink:href": "#" + _vm.gId } },
            [
              _c("animateTransform", {
                attrs: {
                  attributeName: "transform",
                  type: "rotate",
                  values:
                    "0, " + _vm.x + " " + _vm.y + ";360, " + _vm.x + " " + _vm.y,
                  dur: _vm.scanDur + "s",
                  repeatCount: "indefinite"
                }
              })
            ],
            1
          )
        ],
        2
      ),
      _vm._v(" "),
      _c("div", { staticClass: "decoration-content" }, [_vm._t("default")], 2)
    ])
  };
  var __vue_staticRenderFns__$q = [];
  __vue_render__$q._withStripped = true;

    /* style */
    const __vue_inject_styles__$q = function (inject) {
      if (!inject) return
      inject("data-v-0c590f3e_0", { source: ".dv-decoration-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-12 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,uBAAuB;AACzB","file":"main.vue","sourcesContent":[".dv-decoration-12 {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n}\n.dv-decoration-12 .decoration-content {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$q = undefined;
    /* module identifier */
    const __vue_module_identifier__$q = undefined;
    /* functional template */
    const __vue_is_functional_template__$q = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$q = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
      __vue_inject_styles__$q,
      __vue_script__$q,
      __vue_scope_id__$q,
      __vue_is_functional_template__$q,
      __vue_module_identifier__$q,
      false,
      createInjector,
      undefined,
      undefined
    );

  function decoration12 (Vue) {
    Vue.component(__vue_component__$q.name, __vue_component__$q);
  }

  //
  var script$r = {
    name: 'DvCharts',
    mixins: [autoResize],
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      const id = uuid();
      return {
        ref: `charts-container-${id}`,
        chartRef: `chart-${id}`,
        chart: null
      };
    },

    watch: {
      option() {
        let {
          chart,
          option
        } = this;
        if (!chart) return;
        if (!option) option = {};
        chart.setOption(option, true);
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          initChart
        } = this;
        initChart();
      },

      initChart() {
        const {
          $refs,
          chartRef,
          option
        } = this;
        const chart = this.chart = new Charts__default['default']($refs[chartRef]);
        if (!option) return;
        chart.setOption(option);
      },

      onResize() {
        const {
          chart
        } = this;
        if (!chart) return;
        chart.resize();
      }

    }
  };

  /* script */
  const __vue_script__$r = script$r;

  /* template */
  var __vue_render__$r = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-charts-container" }, [
      _c("div", { ref: _vm.chartRef, staticClass: "charts-canvas-container" })
    ])
  };
  var __vue_staticRenderFns__$r = [];
  __vue_render__$r._withStripped = true;

    /* style */
    const __vue_inject_styles__$r = function (inject) {
      if (!inject) return
      inject("data-v-51a927bc_0", { source: ".dv-charts-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-charts-container .charts-canvas-container {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;AACd;AACA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-charts-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dv-charts-container .charts-canvas-container {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$r = undefined;
    /* module identifier */
    const __vue_module_identifier__$r = undefined;
    /* functional template */
    const __vue_is_functional_template__$r = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$r = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
      __vue_inject_styles__$r,
      __vue_script__$r,
      __vue_scope_id__$r,
      __vue_is_functional_template__$r,
      __vue_module_identifier__$r,
      false,
      createInjector,
      undefined,
      undefined
    );

  function charts (Vue) {
    Vue.component(__vue_component__$r.name, __vue_component__$r);
  }

  var defineProperty = createCommonjsModule(function (module) {
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  module.exports = _defineProperty;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(defineProperty);

  var classCallCheck = createCommonjsModule(function (module) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  module.exports = _classCallCheck;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(classCallCheck);

  var bezierCurveToPolyline_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bezierCurveToPolyline = bezierCurveToPolyline;
  exports.getBezierCurveLength = getBezierCurveLength;
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var sqrt = Math.sqrt,
      pow = Math.pow,
      ceil = Math.ceil,
      abs = Math.abs; // Initialize the number of points per curve

  var defaultSegmentPointsNum = 50;
  /**
   * @example data structure of bezierCurve
   * bezierCurve = [
   *  // Starting point of the curve
   *  [10, 10],
   *  // BezierCurve segment data (controlPoint1, controlPoint2, endPoint)
   *  [
   *    [20, 20], [40, 20], [50, 10]
   *  ],
   *  ...
   * ]
   */

  /**
   * @description               Abstract the curve as a polyline consisting of N points
   * @param {Array} bezierCurve bezierCurve data
   * @param {Number} precision  calculation accuracy. Recommended for 1-20. Default = 5
   * @return {Object}           Calculation results and related data
   * @return {Array}            Option.segmentPoints Point data that constitutes a polyline after calculation
   * @return {Number}           Option.cycles Number of iterations
   * @return {Number}           Option.rounds The number of recursions for the last iteration
   */

  function abstractBezierCurveToPolyline(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var segmentsNum = bezierCurve.length - 1;
    var startPoint = bezierCurve[0];
    var endPoint = bezierCurve[segmentsNum][2];
    var segments = bezierCurve.slice(1);
    var getSegmentTPointFuns = segments.map(function (seg, i) {
      var beginPoint = i === 0 ? startPoint : segments[i - 1][2];
      return createGetBezierCurveTPointFun.apply(void 0, [beginPoint].concat((0, _toConsumableArray2["default"])(seg)));
    }); // Initialize the curve to a polyline

    var segmentPointsNum = new Array(segmentsNum).fill(defaultSegmentPointsNum);
    var segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum); // Calculate uniformly distributed points by iteratively

    var result = calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision);
    result.segmentPoints.push(endPoint);
    return result;
  }
  /**
   * @description  Generate a method for obtaining corresponding point by t according to curve data
   * @param {Array} beginPoint    BezierCurve begin point. [x, y]
   * @param {Array} controlPoint1 BezierCurve controlPoint1. [x, y]
   * @param {Array} controlPoint2 BezierCurve controlPoint2. [x, y]
   * @param {Array} endPoint      BezierCurve end point. [x, y]
   * @return {Function} Expected function
   */


  function createGetBezierCurveTPointFun(beginPoint, controlPoint1, controlPoint2, endPoint) {
    return function (t) {
      var tSubed1 = 1 - t;
      var tSubed1Pow3 = pow(tSubed1, 3);
      var tSubed1Pow2 = pow(tSubed1, 2);
      var tPow3 = pow(t, 3);
      var tPow2 = pow(t, 2);
      return [beginPoint[0] * tSubed1Pow3 + 3 * controlPoint1[0] * t * tSubed1Pow2 + 3 * controlPoint2[0] * tPow2 * tSubed1 + endPoint[0] * tPow3, beginPoint[1] * tSubed1Pow3 + 3 * controlPoint1[1] * t * tSubed1Pow2 + 3 * controlPoint2[1] * tPow2 * tSubed1 + endPoint[1] * tPow3];
    };
  }
  /**
   * @description Get the distance between two points
   * @param {Array} point1 BezierCurve begin point. [x, y]
   * @param {Array} point2 BezierCurve controlPoint1. [x, y]
   * @return {Number} Expected distance
   */


  function getTwoPointDistance(_ref, _ref2) {
    var _ref3 = (0, _slicedToArray2["default"])(_ref, 2),
        ax = _ref3[0],
        ay = _ref3[1];

    var _ref4 = (0, _slicedToArray2["default"])(_ref2, 2),
        bx = _ref4[0],
        by = _ref4[1];

    return sqrt(pow(ax - bx, 2) + pow(ay - by, 2));
  }
  /**
   * @description Get the sum of the array of numbers
   * @param {Array} nums An array of numbers
   * @return {Number} Expected sum
   */


  function getNumsSum(nums) {
    return nums.reduce(function (sum, num) {
      return sum + num;
    }, 0);
  }
  /**
   * @description Get the distance of multiple sets of points
   * @param {Array} segmentPoints Multiple sets of point data
   * @return {Array} Distance of multiple sets of point data
   */


  function getSegmentPointsDistance(segmentPoints) {
    return segmentPoints.map(function (points, i) {
      return new Array(points.length - 1).fill(0).map(function (temp, j) {
        return getTwoPointDistance(points[j], points[j + 1]);
      });
    });
  }
  /**
   * @description Get the distance of multiple sets of points
   * @param {Array} segmentPoints Multiple sets of point data
   * @return {Array} Distance of multiple sets of point data
   */


  function getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum) {
    return getSegmentTPointFuns.map(function (getSegmentTPointFun, i) {
      var tGap = 1 / segmentPointsNum[i];
      return new Array(segmentPointsNum[i]).fill('').map(function (foo, j) {
        return getSegmentTPointFun(j * tGap);
      });
    });
  }
  /**
   * @description Get the sum of deviations between line segment and the average length
   * @param {Array} segmentPointsDistance Segment length of polyline
   * @param {Number} avgLength            Average length of the line segment
   * @return {Number} Deviations
   */


  function getAllDeviations(segmentPointsDistance, avgLength) {
    return segmentPointsDistance.map(function (seg) {
      return seg.map(function (s) {
        return abs(s - avgLength);
      });
    }).map(function (seg) {
      return getNumsSum(seg);
    }).reduce(function (total, v) {
      return total + v;
    }, 0);
  }
  /**
   * @description Calculate uniformly distributed points by iteratively
   * @param {Array} segmentPoints        Multiple setd of points that make up a polyline
   * @param {Array} getSegmentTPointFuns Functions of get a point on the curve with t
   * @param {Array} segments             BezierCurve data
   * @param {Number} precision           Calculation accuracy
   * @return {Object} Calculation results and related data
   * @return {Array}  Option.segmentPoints Point data that constitutes a polyline after calculation
   * @return {Number} Option.cycles Number of iterations
   * @return {Number} Option.rounds The number of recursions for the last iteration
   */


  function calcUniformPointsByIteration(segmentPoints, getSegmentTPointFuns, segments, precision) {
    // The number of loops for the current iteration
    var rounds = 4; // Number of iterations

    var cycles = 1;

    var _loop = function _loop() {
      // Recalculate the number of points per curve based on the last iteration data
      var totalPointsNum = segmentPoints.reduce(function (total, seg) {
        return total + seg.length;
      }, 0); // Add last points of segment to calc exact segment length

      segmentPoints.forEach(function (seg, i) {
        return seg.push(segments[i][2]);
      });
      var segmentPointsDistance = getSegmentPointsDistance(segmentPoints);
      var lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      var segmentlength = segmentPointsDistance.map(function (seg) {
        return getNumsSum(seg);
      });
      var totalLength = getNumsSum(segmentlength);
      var avgLength = totalLength / lineSegmentNum; // Check if precision is reached

      var allDeviations = getAllDeviations(segmentPointsDistance, avgLength);
      if (allDeviations <= precision) return "break";
      totalPointsNum = ceil(avgLength / precision * totalPointsNum * 1.1);
      var segmentPointsNum = segmentlength.map(function (length) {
        return ceil(length / totalLength * totalPointsNum);
      }); // Calculate the points after redistribution

      segmentPoints = getSegmentPointsByNum(getSegmentTPointFuns, segmentPointsNum);
      totalPointsNum = segmentPoints.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      var segmentPointsForLength = JSON.parse(JSON.stringify(segmentPoints));
      segmentPointsForLength.forEach(function (seg, i) {
        return seg.push(segments[i][2]);
      });
      segmentPointsDistance = getSegmentPointsDistance(segmentPointsForLength);
      lineSegmentNum = segmentPointsDistance.reduce(function (total, seg) {
        return total + seg.length;
      }, 0);
      segmentlength = segmentPointsDistance.map(function (seg) {
        return getNumsSum(seg);
      });
      totalLength = getNumsSum(segmentlength);
      avgLength = totalLength / lineSegmentNum;
      var stepSize = 1 / totalPointsNum / 10; // Recursively for each segment of the polyline

      getSegmentTPointFuns.forEach(function (getSegmentTPointFun, i) {
        var currentSegmentPointsNum = segmentPointsNum[i];
        var t = new Array(currentSegmentPointsNum).fill('').map(function (foo, j) {
          return j / segmentPointsNum[i];
        }); // Repeated recursive offset

        for (var r = 0; r < rounds; r++) {
          var distance = getSegmentPointsDistance([segmentPoints[i]])[0];
          var deviations = distance.map(function (d) {
            return d - avgLength;
          });
          var offset = 0;

          for (var j = 0; j < currentSegmentPointsNum; j++) {
            if (j === 0) return;
            offset += deviations[j - 1];
            t[j] -= stepSize * offset;
            if (t[j] > 1) t[j] = 1;
            if (t[j] < 0) t[j] = 0;
            segmentPoints[i][j] = getSegmentTPointFun(t[j]);
          }
        }
      });
      rounds *= 4;
      cycles++;
    };

    do {
      var _ret = _loop();

      if (_ret === "break") break;
    } while (rounds <= 1025);

    segmentPoints = segmentPoints.reduce(function (all, seg) {
      return all.concat(seg);
    }, []);
    return {
      segmentPoints: segmentPoints,
      cycles: cycles,
      rounds: rounds
    };
  }
  /**
   * @description Get the polyline corresponding to the Bezier curve
   * @param {Array} bezierCurve BezierCurve data
   * @param {Number} precision  Calculation accuracy. Recommended for 1-20. Default = 5
   * @return {Array|Boolean} Point data that constitutes a polyline after calculation (Invalid input will return false)
   */


  function bezierCurveToPolyline(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    if (!bezierCurve) {
      console.error('bezierCurveToPolyline: Missing parameters!');
      return false;
    }

    if (!(bezierCurve instanceof Array)) {
      console.error('bezierCurveToPolyline: Parameter bezierCurve must be an array!');
      return false;
    }

    if (typeof precision !== 'number') {
      console.error('bezierCurveToPolyline: Parameter precision must be a number!');
      return false;
    }

    var _abstractBezierCurveT = abstractBezierCurveToPolyline(bezierCurve, precision),
        segmentPoints = _abstractBezierCurveT.segmentPoints;

    return segmentPoints;
  }
  /**
   * @description Get the bezier curve length
   * @param {Array} bezierCurve bezierCurve data
   * @param {Number} precision  calculation accuracy. Recommended for 5-10. Default = 5
   * @return {Number|Boolean} BezierCurve length (Invalid input will return false)
   */


  function getBezierCurveLength(bezierCurve) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    if (!bezierCurve) {
      console.error('getBezierCurveLength: Missing parameters!');
      return false;
    }

    if (!(bezierCurve instanceof Array)) {
      console.error('getBezierCurveLength: Parameter bezierCurve must be an array!');
      return false;
    }

    if (typeof precision !== 'number') {
      console.error('getBezierCurveLength: Parameter precision must be a number!');
      return false;
    }

    var _abstractBezierCurveT2 = abstractBezierCurveToPolyline(bezierCurve, precision),
        segmentPoints = _abstractBezierCurveT2.segmentPoints; // Calculate the total length of the points that make up the polyline


    var pointsDistance = getSegmentPointsDistance([segmentPoints])[0];
    var length = getNumsSum(pointsDistance);
    return length;
  }

  var _default = bezierCurveToPolyline;
  exports["default"] = _default;
  });

  unwrapExports(bezierCurveToPolyline_1);
  var bezierCurveToPolyline_2 = bezierCurveToPolyline_1.bezierCurveToPolyline;
  var bezierCurveToPolyline_3 = bezierCurveToPolyline_1.getBezierCurveLength;

  var polylineToBezierCurve_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  /**
   * @description Abstract the polyline formed by N points into a set of bezier curve
   * @param {Array} polyline A set of points that make up a polyline
   * @param {Boolean} close  Closed curve
   * @param {Number} offsetA Smoothness
   * @param {Number} offsetB Smoothness
   * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
   */
  function polylineToBezierCurve(polyline) {
    var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
    var offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;

    if (!(polyline instanceof Array)) {
      console.error('polylineToBezierCurve: Parameter polyline must be an array!');
      return false;
    }

    if (polyline.length <= 2) {
      console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!');
      return false;
    }

    var startPoint = polyline[0];
    var bezierCurveLineNum = polyline.length - 1;
    var bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
      return [].concat((0, _toConsumableArray2["default"])(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]]);
    });
    if (close) closeBezierCurve(bezierCurvePoints, startPoint);
    bezierCurvePoints.unshift(polyline[0]);
    return bezierCurvePoints;
  }
  /**
   * @description Get the control points of the Bezier curve
   * @param {Array} polyline A set of points that make up a polyline
   * @param {Number} index   The index of which get controls points's point in polyline
   * @param {Boolean} close  Closed curve
   * @param {Number} offsetA Smoothness
   * @param {Number} offsetB Smoothness
   * @return {Array} Control points
   */


  function getBezierCurveLineControlPoints(polyline, index) {
    var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25;
    var offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;
    var pointNum = polyline.length;
    if (pointNum < 3 || index >= pointNum) return;
    var beforePointIndex = index - 1;
    if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0;
    var afterPointIndex = index + 1;
    if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1;
    var afterNextPointIndex = index + 2;
    if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1;
    var pointBefore = polyline[beforePointIndex];
    var pointMiddle = polyline[index];
    var pointAfter = polyline[afterPointIndex];
    var pointAfterNext = polyline[afterNextPointIndex];
    return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]];
  }
  /**
   * @description Get the last curve of the closure
   * @param {Array} bezierCurve A set of sub-curve
   * @param {Array} startPoint  Start point
   * @return {Array} The last curve for closure
   */


  function closeBezierCurve(bezierCurve, startPoint) {
    var firstSubCurve = bezierCurve[0];
    var lastSubCurve = bezierCurve.slice(-1)[0];
    bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint]);
    return bezierCurve;
  }
  /**
   * @description Get the symmetry point
   * @param {Array} point       Symmetric point
   * @param {Array} centerPoint Symmetric center
   * @return {Array} Symmetric point
   */


  function getSymmetryPoint(point, centerPoint) {
    var _point = (0, _slicedToArray2["default"])(point, 2),
        px = _point[0],
        py = _point[1];

    var _centerPoint = (0, _slicedToArray2["default"])(centerPoint, 2),
        cx = _centerPoint[0],
        cy = _centerPoint[1];

    var minusX = cx - px;
    var minusY = cy - py;
    return [cx + minusX, cy + minusY];
  }

  var _default = polylineToBezierCurve;
  exports["default"] = _default;
  });

  unwrapExports(polylineToBezierCurve_1);

  var lib$1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "bezierCurveToPolyline", {
    enumerable: true,
    get: function get() {
      return bezierCurveToPolyline_1.bezierCurveToPolyline;
    }
  });
  Object.defineProperty(exports, "getBezierCurveLength", {
    enumerable: true,
    get: function get() {
      return bezierCurveToPolyline_1.getBezierCurveLength;
    }
  });
  Object.defineProperty(exports, "polylineToBezierCurve", {
    enumerable: true,
    get: function get() {
      return _polylineToBezierCurve["default"];
    }
  });
  exports["default"] = void 0;



  var _polylineToBezierCurve = interopRequireDefault(polylineToBezierCurve_1);

  var _default = {
    bezierCurveToPolyline: bezierCurveToPolyline_1.bezierCurveToPolyline,
    getBezierCurveLength: bezierCurveToPolyline_1.getBezierCurveLength,
    polylineToBezierCurve: _polylineToBezierCurve["default"]
  };
  exports["default"] = _default;
  });

  unwrapExports(lib$1);

  var canvas = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.drawPolylinePath = drawPolylinePath;
  exports.drawBezierCurvePath = drawBezierCurvePath;
  exports["default"] = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  /**
   * @description Draw a polyline path
   * @param {Object} ctx        Canvas 2d context
   * @param {Array} points      The points that makes up a polyline
   * @param {Boolean} beginPath Whether to execute beginPath
   * @param {Boolean} closePath Whether to execute closePath
   * @return {Undefined} Void
   */
  function drawPolylinePath(ctx, points) {
    var beginPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var closePath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!ctx || points.length < 2) return false;
    if (beginPath) ctx.beginPath();
    points.forEach(function (point, i) {
      return point && (i === 0 ? ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(point)) : ctx.lineTo.apply(ctx, (0, _toConsumableArray2["default"])(point)));
    });
    if (closePath) ctx.closePath();
  }
  /**
   * @description Draw a bezier curve path
   * @param {Object} ctx        Canvas 2d context
   * @param {Array} points      The points that makes up a bezier curve
   * @param {Array} moveTo      The point need to excute moveTo
   * @param {Boolean} beginPath Whether to execute beginPath
   * @param {Boolean} closePath Whether to execute closePath
   * @return {Undefined} Void
   */


  function drawBezierCurvePath(ctx, points) {
    var moveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var beginPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var closePath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (!ctx || !points) return false;
    if (beginPath) ctx.beginPath();
    if (moveTo) ctx.moveTo.apply(ctx, (0, _toConsumableArray2["default"])(moveTo));
    points.forEach(function (item) {
      return item && ctx.bezierCurveTo.apply(ctx, (0, _toConsumableArray2["default"])(item[0]).concat((0, _toConsumableArray2["default"])(item[1]), (0, _toConsumableArray2["default"])(item[2])));
    });
    if (closePath) ctx.closePath();
  }

  var _default = {
    drawPolylinePath: drawPolylinePath,
    drawBezierCurvePath: drawBezierCurvePath
  };
  exports["default"] = _default;
  });

  unwrapExports(canvas);
  var canvas_1 = canvas.drawPolylinePath;
  var canvas_2 = canvas.drawBezierCurvePath;

  var graphs_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.extendNewGraph = extendNewGraph;
  exports["default"] = exports.text = exports.bezierCurve = exports.smoothline = exports.polyline = exports.regPolygon = exports.sector = exports.arc = exports.ring = exports.rect = exports.ellipse = exports.circle = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _bezierCurve2 = interopRequireDefault(lib$1);





  var polylineToBezierCurve = _bezierCurve2["default"].polylineToBezierCurve,
      bezierCurveToPolyline = _bezierCurve2["default"].bezierCurveToPolyline;
  var circle = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0
    },
    validator: function validator(_ref) {
      var shape = _ref.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
        console.error('Circle shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref2, _ref3) {
      var ctx = _ref2.ctx;
      var shape = _ref3.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref4) {
      var shape = _ref4.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      return (0, util.checkPointIsInCircle)(position, rx, ry, r);
    },
    setGraphCenter: function setGraphCenter(e, _ref5) {
      var shape = _ref5.shape,
          style = _ref5.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref6, _ref7) {
      var movementX = _ref6.movementX,
          movementY = _ref6.movementY;
      var shape = _ref7.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.circle = circle;
  var ellipse = {
    shape: {
      rx: 0,
      ry: 0,
      hr: 0,
      vr: 0
    },
    validator: function validator(_ref8) {
      var shape = _ref8.shape;
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
        console.error('Ellipse shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref9, _ref10) {
      var ctx = _ref9.ctx;
      var shape = _ref10.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;
      ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref11) {
      var shape = _ref11.shape;
      var rx = shape.rx,
          ry = shape.ry,
          hr = shape.hr,
          vr = shape.vr;
      var a = Math.max(hr, vr);
      var b = Math.min(hr, vr);
      var c = Math.sqrt(a * a - b * b);
      var leftFocusPoint = [rx - c, ry];
      var rightFocusPoint = [rx + c, ry];
      var distance = (0, util.getTwoPointDistance)(position, leftFocusPoint) + (0, util.getTwoPointDistance)(position, rightFocusPoint);
      return distance <= 2 * a;
    },
    setGraphCenter: function setGraphCenter(e, _ref12) {
      var shape = _ref12.shape,
          style = _ref12.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref13, _ref14) {
      var movementX = _ref13.movementX,
          movementY = _ref13.movementY;
      var shape = _ref14.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.ellipse = ellipse;
  var rect = {
    shape: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    validator: function validator(_ref15) {
      var shape = _ref15.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;

      if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
        console.error('Rect shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref16, _ref17) {
      var ctx = _ref16.ctx;
      var shape = _ref17.shape;
      ctx.beginPath();
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref18) {
      var shape = _ref18.shape;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      return (0, util.checkPointIsInRect)(position, x, y, w, h);
    },
    setGraphCenter: function setGraphCenter(e, _ref19) {
      var shape = _ref19.shape,
          style = _ref19.style;
      var x = shape.x,
          y = shape.y,
          w = shape.w,
          h = shape.h;
      style.graphCenter = [x + w / 2, y + h / 2];
    },
    move: function move(_ref20, _ref21) {
      var movementX = _ref20.movementX,
          movementY = _ref20.movementY;
      var shape = _ref21.shape;
      this.attr('shape', {
        x: shape.x + movementX,
        y: shape.y + movementY
      });
    }
  };
  exports.rect = rect;
  var ring = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0
    },
    validator: function validator(_ref22) {
      var shape = _ref22.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;

      if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
        console.error('Ring shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref23, _ref24) {
      var ctx = _ref23.ctx;
      var shape = _ref24.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref25) {
      var shape = _ref25.shape,
          style = _ref25.style;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r;
      var lineWidth = style.lineWidth;
      var halfLineWidth = lineWidth / 2;
      var minDistance = r - halfLineWidth;
      var maxDistance = r + halfLineWidth;
      var distance = (0, util.getTwoPointDistance)(position, [rx, ry]);
      return distance >= minDistance && distance <= maxDistance;
    },
    setGraphCenter: function setGraphCenter(e, _ref26) {
      var shape = _ref26.shape,
          style = _ref26.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref27, _ref28) {
      var movementX = _ref27.movementX,
          movementY = _ref27.movementY;
      var shape = _ref28.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.ring = ring;
  var arc = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      clockWise: true
    },
    validator: function validator(_ref29) {
      var shape = _ref29.shape;
      var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('Arc shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref30, _ref31) {
      var ctx = _ref30.ctx;
      var shape = _ref31.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise);
      ctx.stroke();
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref32) {
      var shape = _ref32.shape,
          style = _ref32.style;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      var lineWidth = style.lineWidth;
      var halfLineWidth = lineWidth / 2;
      var insideRadius = r - halfLineWidth;
      var outsideRadius = r + halfLineWidth;
      return !(0, util.checkPointIsInSector)(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) && (0, util.checkPointIsInSector)(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise);
    },
    setGraphCenter: function setGraphCenter(e, _ref33) {
      var shape = _ref33.shape,
          style = _ref33.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref34, _ref35) {
      var movementX = _ref34.movementX,
          movementY = _ref34.movementY;
      var shape = _ref35.shape;
      this.attr('shape', {
        rx: shape.rx + movementX,
        ry: shape.ry + movementY
      });
    }
  };
  exports.arc = arc;
  var sector = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      startAngle: 0,
      endAngle: 0,
      clockWise: true
    },
    validator: function validator(_ref36) {
      var shape = _ref36.shape;
      var keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('Sector shape configuration is abnormal!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref37, _ref38) {
      var ctx = _ref37.ctx;
      var shape = _ref38.shape;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise);
      ctx.lineTo(rx, ry);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    hoverCheck: function hoverCheck(position, _ref39) {
      var shape = _ref39.shape;
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          startAngle = shape.startAngle,
          endAngle = shape.endAngle,
          clockWise = shape.clockWise;
      return (0, util.checkPointIsInSector)(position, rx, ry, r, startAngle, endAngle, clockWise);
    },
    setGraphCenter: function setGraphCenter(e, _ref40) {
      var shape = _ref40.shape,
          style = _ref40.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref41, _ref42) {
      var movementX = _ref41.movementX,
          movementY = _ref41.movementY;
      var shape = _ref42.shape;
      var rx = shape.rx,
          ry = shape.ry;
      this.attr('shape', {
        rx: rx + movementX,
        ry: ry + movementY
      });
    }
  };
  exports.sector = sector;
  var regPolygon = {
    shape: {
      rx: 0,
      ry: 0,
      r: 0,
      side: 0
    },
    validator: function validator(_ref43) {
      var shape = _ref43.shape;
      var side = shape.side;
      var keys = ['rx', 'ry', 'r', 'side'];

      if (keys.find(function (key) {
        return typeof shape[key] !== 'number';
      })) {
        console.error('RegPolygon shape configuration is abnormal!');
        return false;
      }

      if (side < 3) {
        console.error('RegPolygon at least trigon!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref44, _ref45) {
      var ctx = _ref44.ctx;
      var shape = _ref45.shape,
          cache = _ref45.cache;
      ctx.beginPath();
      var rx = shape.rx,
          ry = shape.ry,
          r = shape.r,
          side = shape.side;

      if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
        var _points = (0, util.getRegularPolygonPoints)(rx, ry, r, side);

        Object.assign(cache, {
          points: _points,
          rx: rx,
          ry: ry,
          r: r,
          side: side
        });
      }

      var points = cache.points;
      (0, canvas.drawPolylinePath)(ctx, points);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    hoverCheck: function hoverCheck(position, _ref46) {
      var cache = _ref46.cache;
      var points = cache.points;
      return (0, util.checkPointIsInPolygon)(position, points);
    },
    setGraphCenter: function setGraphCenter(e, _ref47) {
      var shape = _ref47.shape,
          style = _ref47.style;
      var rx = shape.rx,
          ry = shape.ry;
      style.graphCenter = [rx, ry];
    },
    move: function move(_ref48, _ref49) {
      var movementX = _ref48.movementX,
          movementY = _ref48.movementY;
      var shape = _ref49.shape,
          cache = _ref49.cache;
      var rx = shape.rx,
          ry = shape.ry;
      cache.rx += movementX;
      cache.ry += movementY;
      this.attr('shape', {
        rx: rx + movementX,
        ry: ry + movementY
      });
      cache.points = cache.points.map(function (_ref50) {
        var _ref51 = (0, _slicedToArray2["default"])(_ref50, 2),
            x = _ref51[0],
            y = _ref51[1];

        return [x + movementX, y + movementY];
      });
    }
  };
  exports.regPolygon = regPolygon;
  var polyline = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref52) {
      var shape = _ref52.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('Polyline points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref53, _ref54) {
      var ctx = _ref53.ctx;
      var shape = _ref54.shape,
          lineWidth = _ref54.style.lineWidth;
      ctx.beginPath();
      var points = shape.points,
          close = shape.close;
      if (lineWidth === 1) points = (0, util.eliminateBlur)(points);
      (0, canvas.drawPolylinePath)(ctx, points);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref55) {
      var shape = _ref55.shape,
          style = _ref55.style;
      var points = shape.points,
          close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, points);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, points, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref56) {
      var shape = _ref56.shape,
          style = _ref56.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref57, _ref58) {
      var movementX = _ref57.movementX,
          movementY = _ref57.movementY;
      var shape = _ref58.shape;
      var points = shape.points;
      var moveAfterPoints = points.map(function (_ref59) {
        var _ref60 = (0, _slicedToArray2["default"])(_ref59, 2),
            x = _ref60[0],
            y = _ref60[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: moveAfterPoints
      });
    }
  };
  exports.polyline = polyline;
  var smoothline = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref61) {
      var shape = _ref61.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('Smoothline points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref62, _ref63) {
      var ctx = _ref62.ctx;
      var shape = _ref63.shape,
          cache = _ref63.cache;
      var points = shape.points,
          close = shape.close;

      if (!cache.points || cache.points.toString() !== points.toString()) {
        var _bezierCurve = polylineToBezierCurve(points, close);

        var hoverPoints = bezierCurveToPolyline(_bezierCurve);
        Object.assign(cache, {
          points: (0, util.deepClone)(points, true),
          bezierCurve: _bezierCurve,
          hoverPoints: hoverPoints
        });
      }

      var bezierCurve = cache.bezierCurve;
      ctx.beginPath();
      (0, canvas.drawBezierCurvePath)(ctx, bezierCurve.slice(1), bezierCurve[0]);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref64) {
      var cache = _ref64.cache,
          shape = _ref64.shape,
          style = _ref64.style;
      var hoverPoints = cache.hoverPoints;
      var close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, hoverPoints);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref65) {
      var shape = _ref65.shape,
          style = _ref65.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref66, _ref67) {
      var movementX = _ref66.movementX,
          movementY = _ref66.movementY;
      var shape = _ref67.shape,
          cache = _ref67.cache;
      var points = shape.points;
      var moveAfterPoints = points.map(function (_ref68) {
        var _ref69 = (0, _slicedToArray2["default"])(_ref68, 2),
            x = _ref69[0],
            y = _ref69[1];

        return [x + movementX, y + movementY];
      });
      cache.points = moveAfterPoints;

      var _cache$bezierCurve$ = (0, _slicedToArray2["default"])(cache.bezierCurve[0], 2),
          fx = _cache$bezierCurve$[0],
          fy = _cache$bezierCurve$[1];

      var curves = cache.bezierCurve.slice(1);
      cache.bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
        return curve.map(function (_ref70) {
          var _ref71 = (0, _slicedToArray2["default"])(_ref70, 2),
              x = _ref71[0],
              y = _ref71[1];

          return [x + movementX, y + movementY];
        });
      })));
      cache.hoverPoints = cache.hoverPoints.map(function (_ref72) {
        var _ref73 = (0, _slicedToArray2["default"])(_ref72, 2),
            x = _ref73[0],
            y = _ref73[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: moveAfterPoints
      });
    }
  };
  exports.smoothline = smoothline;
  var bezierCurve = {
    shape: {
      points: [],
      close: false
    },
    validator: function validator(_ref74) {
      var shape = _ref74.shape;
      var points = shape.points;

      if (!(points instanceof Array)) {
        console.error('BezierCurve points should be an array!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref75, _ref76) {
      var ctx = _ref75.ctx;
      var shape = _ref76.shape,
          cache = _ref76.cache;
      var points = shape.points,
          close = shape.close;

      if (!cache.points || cache.points.toString() !== points.toString()) {
        var hoverPoints = bezierCurveToPolyline(points, 20);
        Object.assign(cache, {
          points: (0, util.deepClone)(points, true),
          hoverPoints: hoverPoints
        });
      }

      ctx.beginPath();
      (0, canvas.drawBezierCurvePath)(ctx, points.slice(1), points[0]);

      if (close) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.stroke();
      }
    },
    hoverCheck: function hoverCheck(position, _ref77) {
      var cache = _ref77.cache,
          shape = _ref77.shape,
          style = _ref77.style;
      var hoverPoints = cache.hoverPoints;
      var close = shape.close;
      var lineWidth = style.lineWidth;

      if (close) {
        return (0, util.checkPointIsInPolygon)(position, hoverPoints);
      } else {
        return (0, util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth);
      }
    },
    setGraphCenter: function setGraphCenter(e, _ref78) {
      var shape = _ref78.shape,
          style = _ref78.style;
      var points = shape.points;
      style.graphCenter = points[0];
    },
    move: function move(_ref79, _ref80) {
      var movementX = _ref79.movementX,
          movementY = _ref79.movementY;
      var shape = _ref80.shape,
          cache = _ref80.cache;
      var points = shape.points;

      var _points$ = (0, _slicedToArray2["default"])(points[0], 2),
          fx = _points$[0],
          fy = _points$[1];

      var curves = points.slice(1);
      var bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2["default"])(curves.map(function (curve) {
        return curve.map(function (_ref81) {
          var _ref82 = (0, _slicedToArray2["default"])(_ref81, 2),
              x = _ref82[0],
              y = _ref82[1];

          return [x + movementX, y + movementY];
        });
      })));
      cache.points = bezierCurve;
      cache.hoverPoints = cache.hoverPoints.map(function (_ref83) {
        var _ref84 = (0, _slicedToArray2["default"])(_ref83, 2),
            x = _ref84[0],
            y = _ref84[1];

        return [x + movementX, y + movementY];
      });
      this.attr('shape', {
        points: bezierCurve
      });
    }
  };
  exports.bezierCurve = bezierCurve;
  var text = {
    shape: {
      content: '',
      position: [],
      maxWidth: undefined,
      rowGap: 0
    },
    validator: function validator(_ref85) {
      var shape = _ref85.shape;
      var content = shape.content,
          position = shape.position,
          rowGap = shape.rowGap;

      if (typeof content !== 'string') {
        console.error('Text content should be a string!');
        return false;
      }

      if (!(position instanceof Array)) {
        console.error('Text position should be an array!');
        return false;
      }

      if (typeof rowGap !== 'number') {
        console.error('Text rowGap should be a number!');
        return false;
      }

      return true;
    },
    draw: function draw(_ref86, _ref87) {
      var ctx = _ref86.ctx;
      var shape = _ref87.shape;
      var content = shape.content,
          position = shape.position,
          maxWidth = shape.maxWidth,
          rowGap = shape.rowGap;
      var textBaseline = ctx.textBaseline,
          font = ctx.font;
      var fontSize = parseInt(font.replace(/\D/g, ''));

      var _position = position,
          _position2 = (0, _slicedToArray2["default"])(_position, 2),
          x = _position2[0],
          y = _position2[1];

      content = content.split('\n');
      var rowNum = content.length;
      var lineHeight = fontSize + rowGap;
      var allHeight = rowNum * lineHeight - rowGap;
      var offset = 0;

      if (textBaseline === 'middle') {
        offset = allHeight / 2;
        y += fontSize / 2;
      }

      if (textBaseline === 'bottom') {
        offset = allHeight;
        y += fontSize;
      }

      position = new Array(rowNum).fill(0).map(function (foo, i) {
        return [x, y + i * lineHeight - offset];
      });
      ctx.beginPath();
      content.forEach(function (text, i) {
        ctx.fillText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
        ctx.strokeText.apply(ctx, [text].concat((0, _toConsumableArray2["default"])(position[i]), [maxWidth]));
      });
      ctx.closePath();
    },
    hoverCheck: function hoverCheck(position, _ref88) {
      var shape = _ref88.shape,
          style = _ref88.style;
      return false;
    },
    setGraphCenter: function setGraphCenter(e, _ref89) {
      var shape = _ref89.shape,
          style = _ref89.style;
      var position = shape.position;
      style.graphCenter = (0, _toConsumableArray2["default"])(position);
    },
    move: function move(_ref90, _ref91) {
      var movementX = _ref90.movementX,
          movementY = _ref90.movementY;
      var shape = _ref91.shape;

      var _shape$position = (0, _slicedToArray2["default"])(shape.position, 2),
          x = _shape$position[0],
          y = _shape$position[1];

      this.attr('shape', {
        position: [x + movementX, y + movementY]
      });
    }
  };
  exports.text = text;
  var graphs = new Map([['circle', circle], ['ellipse', ellipse], ['rect', rect], ['ring', ring], ['arc', arc], ['sector', sector], ['regPolygon', regPolygon], ['polyline', polyline], ['smoothline', smoothline], ['bezierCurve', bezierCurve], ['text', text]]);
  var _default = graphs;
  /**
   * @description Extend new graph
   * @param {String} name   Name of Graph
   * @param {Object} config Configuration of Graph
   * @return {Undefined} Void
   */

  exports["default"] = _default;

  function extendNewGraph(name, config) {
    if (!name || !config) {
      console.error('ExtendNewGraph Missing Parameters!');
      return;
    }

    if (!config.shape) {
      console.error('Required attribute of shape to extendNewGraph!');
      return;
    }

    if (!config.validator) {
      console.error('Required function of validator to extendNewGraph!');
      return;
    }

    if (!config.draw) {
      console.error('Required function of draw to extendNewGraph!');
      return;
    }

    graphs.set(name, config);
  }
  });

  unwrapExports(graphs_1);
  var graphs_2 = graphs_1.extendNewGraph;
  var graphs_3 = graphs_1.text;
  var graphs_4 = graphs_1.bezierCurve;
  var graphs_5 = graphs_1.smoothline;
  var graphs_6 = graphs_1.polyline;
  var graphs_7 = graphs_1.regPolygon;
  var graphs_8 = graphs_1.sector;
  var graphs_9 = graphs_1.arc;
  var graphs_10 = graphs_1.ring;
  var graphs_11 = graphs_1.rect;
  var graphs_12 = graphs_1.ellipse;
  var graphs_13 = graphs_1.circle;

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  var asyncToGenerator = createCommonjsModule(function (module) {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  module.exports = _asyncToGenerator;
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  });

  unwrapExports(asyncToGenerator);

  var style_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _classCallCheck2 = interopRequireDefault(classCallCheck);





  /**
   * @description Class Style
   * @param {Object} style  Style configuration
   * @return {Style} Instance of Style
   */
  var Style = function Style(style) {
    (0, _classCallCheck2["default"])(this, Style);
    this.colorProcessor(style);
    var defaultStyle = {
      /**
       * @description Rgba value of graph fill color
       * @type {Array}
       * @default fill = [0, 0, 0, 1]
       */
      fill: [0, 0, 0, 1],

      /**
       * @description Rgba value of graph stroke color
       * @type {Array}
       * @default stroke = [0, 0, 0, 1]
       */
      stroke: [0, 0, 0, 0],

      /**
       * @description Opacity of graph
       * @type {Number}
       * @default opacity = 1
       */
      opacity: 1,

      /**
       * @description LineCap of Ctx
       * @type {String}
       * @default lineCap = null
       * @example lineCap = 'butt'|'round'|'square'
       */
      lineCap: null,

      /**
       * @description Linejoin of Ctx
       * @type {String}
       * @default lineJoin = null
       * @example lineJoin = 'round'|'bevel'|'miter'
       */
      lineJoin: null,

      /**
       * @description LineDash of Ctx
       * @type {Array}
       * @default lineDash = null
       * @example lineDash = [10, 10]
       */
      lineDash: null,

      /**
       * @description LineDashOffset of Ctx
       * @type {Number}
       * @default lineDashOffset = null
       * @example lineDashOffset = 10
       */
      lineDashOffset: null,

      /**
       * @description ShadowBlur of Ctx
       * @type {Number}
       * @default shadowBlur = 0
       */
      shadowBlur: 0,

      /**
       * @description Rgba value of graph shadow color
       * @type {Array}
       * @default shadowColor = [0, 0, 0, 0]
       */
      shadowColor: [0, 0, 0, 0],

      /**
       * @description ShadowOffsetX of Ctx
       * @type {Number}
       * @default shadowOffsetX = 0
       */
      shadowOffsetX: 0,

      /**
       * @description ShadowOffsetY of Ctx
       * @type {Number}
       * @default shadowOffsetY = 0
       */
      shadowOffsetY: 0,

      /**
       * @description LineWidth of Ctx
       * @type {Number}
       * @default lineWidth = 0
       */
      lineWidth: 0,

      /**
       * @description Center point of the graph
       * @type {Array}
       * @default graphCenter = null
       * @example graphCenter = [10, 10]
       */
      graphCenter: null,

      /**
       * @description Graph scale
       * @type {Array}
       * @default scale = null
       * @example scale = [1.5, 1.5]
       */
      scale: null,

      /**
       * @description Graph rotation degree
       * @type {Number}
       * @default rotate = null
       * @example rotate = 10
       */
      rotate: null,

      /**
       * @description Graph translate distance
       * @type {Array}
       * @default translate = null
       * @example translate = [10, 10]
       */
      translate: null,

      /**
       * @description Cursor status when hover
       * @type {String}
       * @default hoverCursor = 'pointer'
       * @example hoverCursor = 'default'|'pointer'|'auto'|'crosshair'|'move'|'wait'|...
       */
      hoverCursor: 'pointer',

      /**
       * @description Font style of Ctx
       * @type {String}
       * @default fontStyle = 'normal'
       * @example fontStyle = 'normal'|'italic'|'oblique'
       */
      fontStyle: 'normal',

      /**
       * @description Font varient of Ctx
       * @type {String}
       * @default fontVarient = 'normal'
       * @example fontVarient = 'normal'|'small-caps'
       */
      fontVarient: 'normal',

      /**
       * @description Font weight of Ctx
       * @type {String|Number}
       * @default fontWeight = 'normal'
       * @example fontWeight = 'normal'|'bold'|'bolder'|'lighter'|Number
       */
      fontWeight: 'normal',

      /**
       * @description Font size of Ctx
       * @type {Number}
       * @default fontSize = 10
       */
      fontSize: 10,

      /**
       * @description Font family of Ctx
       * @type {String}
       * @default fontFamily = 'Arial'
       */
      fontFamily: 'Arial',

      /**
       * @description TextAlign of Ctx
       * @type {String}
       * @default textAlign = 'center'
       * @example textAlign = 'start'|'end'|'left'|'right'|'center'
       */
      textAlign: 'center',

      /**
       * @description TextBaseline of Ctx
       * @type {String}
       * @default textBaseline = 'middle'
       * @example textBaseline = 'top'|'bottom'|'middle'|'alphabetic'|'hanging'
       */
      textBaseline: 'middle',

      /**
       * @description The color used to create the gradient
       * @type {Array}
       * @default gradientColor = null
       * @example gradientColor = ['#000', '#111', '#222']
       */
      gradientColor: null,

      /**
       * @description Gradient type
       * @type {String}
       * @default gradientType = 'linear'
       * @example gradientType = 'linear' | 'radial'
       */
      gradientType: 'linear',

      /**
       * @description Gradient params
       * @type {Array}
       * @default gradientParams = null
       * @example gradientParams = [x0, y0, x1, y1] (Linear Gradient)
       * @example gradientParams = [x0, y0, r0, x1, y1, r1] (Radial Gradient)
       */
      gradientParams: null,

      /**
       * @description When to use gradients
       * @type {String}
       * @default gradientWith = 'stroke'
       * @example gradientWith = 'stroke' | 'fill'
       */
      gradientWith: 'stroke',

      /**
       * @description Gradient color stops
       * @type {String}
       * @default gradientStops = 'auto'
       * @example gradientStops = 'auto' | [0, .2, .3, 1]
       */
      gradientStops: 'auto',

      /**
       * @description Extended color that supports animation transition
       * @type {Array|Object}
       * @default colors = null
       * @example colors = ['#000', '#111', '#222', 'red' ]
       * @example colors = { a: '#000', b: '#111' }
       */
      colors: null
    };
    Object.assign(this, defaultStyle, style);
  };
  /**
   * @description Set colors to rgba value
   * @param {Object} style style config
   * @param {Boolean} reverse Whether to perform reverse operation
   * @return {Undefined} Void
   */


  exports["default"] = Style;

  Style.prototype.colorProcessor = function (style) {
    var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var processor = reverse ? lib.getColorFromRgbValue : lib.getRgbaValue;
    var colorProcessorKeys = ['fill', 'stroke', 'shadowColor'];
    var allKeys = Object.keys(style);
    var colorKeys = allKeys.filter(function (key) {
      return colorProcessorKeys.find(function (k) {
        return k === key;
      });
    });
    colorKeys.forEach(function (key) {
      return style[key] = processor(style[key]);
    });
    var gradientColor = style.gradientColor,
        colors = style.colors;
    if (gradientColor) style.gradientColor = gradientColor.map(function (c) {
      return processor(c);
    });

    if (colors) {
      var colorsKeys = Object.keys(colors);
      colorsKeys.forEach(function (key) {
        return colors[key] = processor(colors[key]);
      });
    }
  };
  /**
   * @description Init graph style
   * @param {Object} ctx Context of canvas
   * @return {Undefined} Void
   */


  Style.prototype.initStyle = function (ctx) {
    initTransform(ctx, this);
    initGraphStyle(ctx, this);
    initGradient(ctx, this);
  };
  /**
   * @description Init canvas transform
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */


  function initTransform(ctx, style) {
    ctx.save();
    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;
    if (!(graphCenter instanceof Array)) return;
    ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(graphCenter));
    if (rotate) ctx.rotate(rotate * Math.PI / 180);
    if (scale instanceof Array) ctx.scale.apply(ctx, (0, _toConsumableArray2["default"])(scale));
    if (translate) ctx.translate.apply(ctx, (0, _toConsumableArray2["default"])(translate));
    ctx.translate(-graphCenter[0], -graphCenter[1]);
  }

  var autoSetStyleKeys = ['lineCap', 'lineJoin', 'lineDashOffset', 'shadowOffsetX', 'shadowOffsetY', 'lineWidth', 'textAlign', 'textBaseline'];
  /**
   * @description Set the style of canvas ctx
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */

  function initGraphStyle(ctx, style) {
    var fill = style.fill,
        stroke = style.stroke,
        shadowColor = style.shadowColor,
        opacity = style.opacity;
    autoSetStyleKeys.forEach(function (key) {
      if (key || typeof key === 'number') ctx[key] = style[key];
    });
    fill = (0, _toConsumableArray2["default"])(fill);
    stroke = (0, _toConsumableArray2["default"])(stroke);
    shadowColor = (0, _toConsumableArray2["default"])(shadowColor);
    fill[3] *= opacity;
    stroke[3] *= opacity;
    shadowColor[3] *= opacity;
    ctx.fillStyle = (0, lib.getColorFromRgbValue)(fill);
    ctx.strokeStyle = (0, lib.getColorFromRgbValue)(stroke);
    ctx.shadowColor = (0, lib.getColorFromRgbValue)(shadowColor);
    var lineDash = style.lineDash,
        shadowBlur = style.shadowBlur;

    if (lineDash) {
      lineDash = lineDash.map(function (v) {
        return v >= 0 ? v : 0;
      });
      ctx.setLineDash(lineDash);
    }

    if (typeof shadowBlur === 'number') ctx.shadowBlur = shadowBlur > 0 ? shadowBlur : 0.001;
    var fontStyle = style.fontStyle,
        fontVarient = style.fontVarient,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    ctx.font = fontStyle + ' ' + fontVarient + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily;
  }
  /**
   * @description Set the gradient color of canvas ctx
   * @param {Object} ctx  Context of canvas
   * @param {Style} style Instance of Style
   * @return {Undefined} Void
   */


  function initGradient(ctx, style) {
    if (!gradientValidator(style)) return;
    var gradientColor = style.gradientColor,
        gradientParams = style.gradientParams,
        gradientType = style.gradientType,
        gradientWith = style.gradientWith,
        gradientStops = style.gradientStops,
        opacity = style.opacity;
    gradientColor = gradientColor.map(function (color) {
      var colorOpacity = color[3] * opacity;
      var clonedColor = (0, _toConsumableArray2["default"])(color);
      clonedColor[3] = colorOpacity;
      return clonedColor;
    });
    gradientColor = gradientColor.map(function (c) {
      return (0, lib.getColorFromRgbValue)(c);
    });
    if (gradientStops === 'auto') gradientStops = getAutoColorStops(gradientColor);
    var gradient = ctx["create".concat(gradientType.slice(0, 1).toUpperCase() + gradientType.slice(1), "Gradient")].apply(ctx, (0, _toConsumableArray2["default"])(gradientParams));
    gradientStops.forEach(function (stop, i) {
      return gradient.addColorStop(stop, gradientColor[i]);
    });
    ctx["".concat(gradientWith, "Style")] = gradient;
  }
  /**
   * @description Check if the gradient configuration is legal
   * @param {Style} style Instance of Style
   * @return {Boolean} Check Result
   */


  function gradientValidator(style) {
    var gradientColor = style.gradientColor,
        gradientParams = style.gradientParams,
        gradientType = style.gradientType,
        gradientWith = style.gradientWith,
        gradientStops = style.gradientStops;
    if (!gradientColor || !gradientParams) return false;

    if (gradientColor.length === 1) {
      console.warn('The gradient needs to provide at least two colors');
      return false;
    }

    if (gradientType !== 'linear' && gradientType !== 'radial') {
      console.warn('GradientType only supports linear or radial, current value is ' + gradientType);
      return false;
    }

    var gradientParamsLength = gradientParams.length;

    if (gradientType === 'linear' && gradientParamsLength !== 4 || gradientType === 'radial' && gradientParamsLength !== 6) {
      console.warn('The expected length of gradientParams is ' + (gradientType === 'linear' ? '4' : '6'));
      return false;
    }

    if (gradientWith !== 'fill' && gradientWith !== 'stroke') {
      console.warn('GradientWith only supports fill or stroke, current value is ' + gradientWith);
      return false;
    }

    if (gradientStops !== 'auto' && !(gradientStops instanceof Array)) {
      console.warn("gradientStops only supports 'auto' or Number Array ([0, .5, 1]), current value is " + gradientStops);
      return false;
    }

    return true;
  }
  /**
   * @description Get a uniform gradient color stop
   * @param {Array} color Gradient color
   * @return {Array} Gradient color stop
   */


  function getAutoColorStops(color) {
    var stopGap = 1 / (color.length - 1);
    return color.map(function (foo, i) {
      return stopGap * i;
    });
  }
  /**
   * @description Restore canvas ctx transform
   * @param {Object} ctx  Context of canvas
   * @return {Undefined} Void
   */


  Style.prototype.restoreTransform = function (ctx) {
    ctx.restore();
  };
  /**
   * @description Update style data
   * @param {Object} change Changed data
   * @return {Undefined} Void
   */


  Style.prototype.update = function (change) {
    this.colorProcessor(change);
    Object.assign(this, change);
  };
  /**
   * @description Get the current style configuration
   * @return {Object} Style configuration
   */


  Style.prototype.getStyle = function () {
    var clonedStyle = (0, util.deepClone)(this, true);
    this.colorProcessor(clonedStyle, true);
    return clonedStyle;
  };
  });

  unwrapExports(style_class);

  var curves = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = exports.easeInOutBounce = exports.easeOutBounce = exports.easeInBounce = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutBack = exports.easeOutBack = exports.easeInBack = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.linear = void 0;
  var linear = [[[0, 1], '', [0.33, 0.67]], [[1, 0], [0.67, 0.33]]];
  /**
   * @description Sine
   */

  exports.linear = linear;
  var easeInSine = [[[0, 1]], [[0.538, 0.564], [0.169, 0.912], [0.880, 0.196]], [[1, 0]]];
  exports.easeInSine = easeInSine;
  var easeOutSine = [[[0, 1]], [[0.444, 0.448], [0.169, 0.736], [0.718, 0.16]], [[1, 0]]];
  exports.easeOutSine = easeOutSine;
  var easeInOutSine = [[[0, 1]], [[0.5, 0.5], [0.2, 1], [0.8, 0]], [[1, 0]]];
  /**
   * @description Quad
   */

  exports.easeInOutSine = easeInOutSine;
  var easeInQuad = [[[0, 1]], [[0.550, 0.584], [0.231, 0.904], [0.868, 0.264]], [[1, 0]]];
  exports.easeInQuad = easeInQuad;
  var easeOutQuad = [[[0, 1]], [[0.413, 0.428], [0.065, 0.816], [0.760, 0.04]], [[1, 0]]];
  exports.easeOutQuad = easeOutQuad;
  var easeInOutQuad = [[[0, 1]], [[0.5, 0.5], [0.3, 0.9], [0.7, 0.1]], [[1, 0]]];
  /**
   * @description Cubic
   */

  exports.easeInOutQuad = easeInOutQuad;
  var easeInCubic = [[[0, 1]], [[0.679, 0.688], [0.366, 0.992], [0.992, 0.384]], [[1, 0]]];
  exports.easeInCubic = easeInCubic;
  var easeOutCubic = [[[0, 1]], [[0.321, 0.312], [0.008, 0.616], [0.634, 0.008]], [[1, 0]]];
  exports.easeOutCubic = easeOutCubic;
  var easeInOutCubic = [[[0, 1]], [[0.5, 0.5], [0.3, 1], [0.7, 0]], [[1, 0]]];
  /**
   * @description Quart
   */

  exports.easeInOutCubic = easeInOutCubic;
  var easeInQuart = [[[0, 1]], [[0.812, 0.74], [0.611, 0.988], [1.013, 0.492]], [[1, 0]]];
  exports.easeInQuart = easeInQuart;
  var easeOutQuart = [[[0, 1]], [[0.152, 0.244], [0.001, 0.448], [0.285, -0.02]], [[1, 0]]];
  exports.easeOutQuart = easeOutQuart;
  var easeInOutQuart = [[[0, 1]], [[0.5, 0.5], [0.4, 1], [0.6, 0]], [[1, 0]]];
  /**
   * @description Quint
   */

  exports.easeInOutQuart = easeInOutQuart;
  var easeInQuint = [[[0, 1]], [[0.857, 0.856], [0.714, 1], [1, 0.712]], [[1, 0]]];
  exports.easeInQuint = easeInQuint;
  var easeOutQuint = [[[0, 1]], [[0.108, 0.2], [0.001, 0.4], [0.214, -0.012]], [[1, 0]]];
  exports.easeOutQuint = easeOutQuint;
  var easeInOutQuint = [[[0, 1]], [[0.5, 0.5], [0.5, 1], [0.5, 0]], [[1, 0]]];
  /**
   * @description Back
   */

  exports.easeInOutQuint = easeInOutQuint;
  var easeInBack = [[[0, 1]], [[0.667, 0.896], [0.380, 1.184], [0.955, 0.616]], [[1, 0]]];
  exports.easeInBack = easeInBack;
  var easeOutBack = [[[0, 1]], [[0.335, 0.028], [0.061, 0.22], [0.631, -0.18]], [[1, 0]]];
  exports.easeOutBack = easeOutBack;
  var easeInOutBack = [[[0, 1]], [[0.5, 0.5], [0.4, 1.4], [0.6, -0.4]], [[1, 0]]];
  /**
   * @description Elastic
   */

  exports.easeInOutBack = easeInOutBack;
  var easeInElastic = [[[0, 1]], [[0.474, 0.964], [0.382, 0.988], [0.557, 0.952]], [[0.619, 1.076], [0.565, 1.088], [0.669, 1.08]], [[0.770, 0.916], [0.712, 0.924], [0.847, 0.904]], [[0.911, 1.304], [0.872, 1.316], [0.961, 1.34]], [[1, 0]]];
  exports.easeInElastic = easeInElastic;
  var easeOutElastic = [[[0, 1]], [[0.073, -0.32], [0.034, -0.328], [0.104, -0.344]], [[0.191, 0.092], [0.110, 0.06], [0.256, 0.08]], [[0.310, -0.076], [0.260, -0.068], [0.357, -0.076]], [[0.432, 0.032], [0.362, 0.028], [0.683, -0.004]], [[1, 0]]];
  exports.easeOutElastic = easeOutElastic;
  var easeInOutElastic = [[[0, 1]], [[0.210, 0.94], [0.167, 0.884], [0.252, 0.98]], [[0.299, 1.104], [0.256, 1.092], [0.347, 1.108]], [[0.5, 0.496], [0.451, 0.672], [0.548, 0.324]], [[0.696, -0.108], [0.652, -0.112], [0.741, -0.124]], [[0.805, 0.064], [0.756, 0.012], [0.866, 0.096]], [[1, 0]]];
  /**
   * @description Bounce
   */

  exports.easeInOutElastic = easeInOutElastic;
  var easeInBounce = [[[0, 1]], [[0.148, 1], [0.075, 0.868], [0.193, 0.848]], [[0.326, 1], [0.276, 0.836], [0.405, 0.712]], [[0.600, 1], [0.511, 0.708], [0.671, 0.348]], [[1, 0]]];
  exports.easeInBounce = easeInBounce;
  var easeOutBounce = [[[0, 1]], [[0.357, 0.004], [0.270, 0.592], [0.376, 0.252]], [[0.604, -0.004], [0.548, 0.312], [0.669, 0.184]], [[0.820, 0], [0.749, 0.184], [0.905, 0.132]], [[1, 0]]];
  exports.easeOutBounce = easeOutBounce;
  var easeInOutBounce = [[[0, 1]], [[0.102, 1], [0.050, 0.864], [0.117, 0.86]], [[0.216, 0.996], [0.208, 0.844], [0.227, 0.808]], [[0.347, 0.996], [0.343, 0.8], [0.480, 0.292]], [[0.635, 0.004], [0.511, 0.676], [0.656, 0.208]], [[0.787, 0], [0.760, 0.2], [0.795, 0.144]], [[0.905, -0.004], [0.899, 0.164], [0.944, 0.144]], [[1, 0]]];
  exports.easeInOutBounce = easeInOutBounce;

  var _default = new Map([['linear', linear], ['easeInSine', easeInSine], ['easeOutSine', easeOutSine], ['easeInOutSine', easeInOutSine], ['easeInQuad', easeInQuad], ['easeOutQuad', easeOutQuad], ['easeInOutQuad', easeInOutQuad], ['easeInCubic', easeInCubic], ['easeOutCubic', easeOutCubic], ['easeInOutCubic', easeInOutCubic], ['easeInQuart', easeInQuart], ['easeOutQuart', easeOutQuart], ['easeInOutQuart', easeInOutQuart], ['easeInQuint', easeInQuint], ['easeOutQuint', easeOutQuint], ['easeInOutQuint', easeInOutQuint], ['easeInBack', easeInBack], ['easeOutBack', easeOutBack], ['easeInOutBack', easeInOutBack], ['easeInElastic', easeInElastic], ['easeOutElastic', easeOutElastic], ['easeInOutElastic', easeInOutElastic], ['easeInBounce', easeInBounce], ['easeOutBounce', easeOutBounce], ['easeInOutBounce', easeInOutBounce]]);

  exports["default"] = _default;
  });

  unwrapExports(curves);
  var curves_1 = curves.easeInOutBounce;
  var curves_2 = curves.easeOutBounce;
  var curves_3 = curves.easeInBounce;
  var curves_4 = curves.easeInOutElastic;
  var curves_5 = curves.easeOutElastic;
  var curves_6 = curves.easeInElastic;
  var curves_7 = curves.easeInOutBack;
  var curves_8 = curves.easeOutBack;
  var curves_9 = curves.easeInBack;
  var curves_10 = curves.easeInOutQuint;
  var curves_11 = curves.easeOutQuint;
  var curves_12 = curves.easeInQuint;
  var curves_13 = curves.easeInOutQuart;
  var curves_14 = curves.easeOutQuart;
  var curves_15 = curves.easeInQuart;
  var curves_16 = curves.easeInOutCubic;
  var curves_17 = curves.easeOutCubic;
  var curves_18 = curves.easeInCubic;
  var curves_19 = curves.easeInOutQuad;
  var curves_20 = curves.easeOutQuad;
  var curves_21 = curves.easeInQuad;
  var curves_22 = curves.easeInOutSine;
  var curves_23 = curves.easeOutSine;
  var curves_24 = curves.easeInSine;
  var curves_25 = curves.linear;

  var lib$2 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.transition = transition;
  exports.injectNewCurve = injectNewCurve;
  exports["default"] = void 0;

  var _slicedToArray2 = interopRequireDefault(slicedToArray);

  var _typeof2 = interopRequireDefault(_typeof_1);

  var _curves = interopRequireDefault(curves);

  var defaultTransitionBC = 'linear';
  /**
   * @description Get the N-frame animation state by the start and end state
   *              of the animation and the easing curve
   * @param {String|Array} tBC               Easing curve name or data
   * @param {Number|Array|Object} startState Animation start state
   * @param {Number|Array|Object} endState   Animation end state
   * @param {Number} frameNum                Number of Animation frames
   * @param {Boolean} deep                   Whether to use recursive mode
   * @return {Array|Boolean} State of each frame of the animation (Invalid input will return false)
   */

  function transition(tBC) {
    var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
    var deep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (!checkParams.apply(void 0, arguments)) return false;

    try {
      // Get the transition bezier curve
      var bezierCurve = getBezierCurve(tBC); // Get the progress of each frame state

      var frameStateProgress = getFrameStateProgress(bezierCurve, frameNum); // If the recursion mode is not enabled or the state type is Number, the shallow state calculation is performed directly.

      if (!deep || typeof endState === 'number') return getTransitionState(startState, endState, frameStateProgress);
      return recursionTransitionState(startState, endState, frameStateProgress);
    } catch (_unused) {
      console.warn('Transition parameter may be abnormal!');
      return [endState];
    }
  }
  /**
   * @description Check if the parameters are legal
   * @param {String} tBC      Name of transition bezier curve
   * @param {Any} startState  Transition start state
   * @param {Any} endState    Transition end state
   * @param {Number} frameNum Number of transition frames
   * @return {Boolean} Is the parameter legal
   */


  function checkParams(tBC) {
    var startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;

    if (!tBC || startState === false || endState === false || !frameNum) {
      console.error('transition: Missing Parameters!');
      return false;
    }

    if ((0, _typeof2["default"])(startState) !== (0, _typeof2["default"])(endState)) {
      console.error('transition: Inconsistent Status Types!');
      return false;
    }

    var stateType = (0, _typeof2["default"])(endState);

    if (stateType === 'string' || stateType === 'boolean' || !tBC.length) {
      console.error('transition: Unsupported Data Type of State!');
      return false;
    }

    if (!_curves["default"].has(tBC) && !(tBC instanceof Array)) {
      console.warn('transition: Transition curve not found, default curve will be used!');
    }

    return true;
  }
  /**
   * @description Get the transition bezier curve
   * @param {String} tBC Name of transition bezier curve
   * @return {Array} Bezier curve data
   */


  function getBezierCurve(tBC) {
    var bezierCurve = '';

    if (_curves["default"].has(tBC)) {
      bezierCurve = _curves["default"].get(tBC);
    } else if (tBC instanceof Array) {
      bezierCurve = tBC;
    } else {
      bezierCurve = _curves["default"].get(defaultTransitionBC);
    }

    return bezierCurve;
  }
  /**
   * @description Get the progress of each frame state
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} frameNum   Number of transition frames
   * @return {Array} Progress of each frame state
   */


  function getFrameStateProgress(bezierCurve, frameNum) {
    var tMinus = 1 / (frameNum - 1);
    var tState = new Array(frameNum).fill(0).map(function (t, i) {
      return i * tMinus;
    });
    var frameState = tState.map(function (t) {
      return getFrameStateFromT(bezierCurve, t);
    });
    return frameState;
  }
  /**
   * @description Get the progress of the corresponding frame according to t
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} t          Current frame t
   * @return {Number} Progress of current frame
   */


  function getFrameStateFromT(bezierCurve, t) {
    var tBezierCurvePoint = getBezierCurvePointFromT(bezierCurve, t);
    var bezierCurvePointT = getBezierCurvePointTFromReT(tBezierCurvePoint, t);
    return getBezierCurveTState(tBezierCurvePoint, bezierCurvePointT);
  }
  /**
   * @description Get the corresponding sub-curve according to t
   * @param {Array} bezierCurve Transition bezier curve
   * @param {Number} t          Current frame t
   * @return {Array} Sub-curve of t
   */


  function getBezierCurvePointFromT(bezierCurve, t) {
    var lastIndex = bezierCurve.length - 1;
    var begin = '',
        end = '';
    bezierCurve.findIndex(function (item, i) {
      if (i === lastIndex) return;
      begin = item;
      end = bezierCurve[i + 1];
      var currentMainPointX = begin[0][0];
      var nextMainPointX = end[0][0];
      return t >= currentMainPointX && t < nextMainPointX;
    });
    var p0 = begin[0];
    var p1 = begin[2] || begin[0];
    var p2 = end[1] || end[0];
    var p3 = end[0];
    return [p0, p1, p2, p3];
  }
  /**
   * @description Get local t based on t and sub-curve
   * @param {Array} bezierCurve Sub-curve
   * @param {Number} t          Current frame t
   * @return {Number} local t of sub-curve
   */


  function getBezierCurvePointTFromReT(bezierCurve, t) {
    var reBeginX = bezierCurve[0][0];
    var reEndX = bezierCurve[3][0];
    var xMinus = reEndX - reBeginX;
    var tMinus = t - reBeginX;
    return tMinus / xMinus;
  }
  /**
   * @description Get the curve progress of t
   * @param {Array} bezierCurve Sub-curve
   * @param {Number} t          Current frame t
   * @return {Number} Progress of current frame
   */


  function getBezierCurveTState(_ref, t) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 4),
        _ref2$ = (0, _slicedToArray2["default"])(_ref2[0], 2),
        p0 = _ref2$[1],
        _ref2$2 = (0, _slicedToArray2["default"])(_ref2[1], 2),
        p1 = _ref2$2[1],
        _ref2$3 = (0, _slicedToArray2["default"])(_ref2[2], 2),
        p2 = _ref2$3[1],
        _ref2$4 = (0, _slicedToArray2["default"])(_ref2[3], 2),
        p3 = _ref2$4[1];

    var pow = Math.pow;
    var tMinus = 1 - t;
    var result1 = p0 * pow(tMinus, 3);
    var result2 = 3 * p1 * t * pow(tMinus, 2);
    var result3 = 3 * p2 * pow(t, 2) * tMinus;
    var result4 = p3 * pow(t, 3);
    return 1 - (result1 + result2 + result3 + result4);
  }
  /**
   * @description Get transition state according to frame progress
   * @param {Any} startState   Transition start state
   * @param {Any} endState     Transition end state
   * @param {Array} frameState Frame state progress
   * @return {Array} Transition frame state
   */


  function getTransitionState(begin, end, frameState) {
    var stateType = 'object';
    if (typeof begin === 'number') stateType = 'number';
    if (begin instanceof Array) stateType = 'array';
    if (stateType === 'number') return getNumberTransitionState(begin, end, frameState);
    if (stateType === 'array') return getArrayTransitionState(begin, end, frameState);
    if (stateType === 'object') return getObjectTransitionState(begin, end, frameState);
    return frameState.map(function (t) {
      return end;
    });
  }
  /**
   * @description Get the transition data of the number type
   * @param {Number} startState Transition start state
   * @param {Number} endState   Transition end state
   * @param {Array} frameState  Frame state progress
   * @return {Array} Transition frame state
   */


  function getNumberTransitionState(begin, end, frameState) {
    var minus = end - begin;
    return frameState.map(function (s) {
      return begin + minus * s;
    });
  }
  /**
   * @description Get the transition data of the array type
   * @param {Array} startState Transition start state
   * @param {Array} endState   Transition end state
   * @param {Array} frameState Frame state progress
   * @return {Array} Transition frame state
   */


  function getArrayTransitionState(begin, end, frameState) {
    var minus = end.map(function (v, i) {
      if (typeof v !== 'number') return false;
      return v - begin[i];
    });
    return frameState.map(function (s) {
      return minus.map(function (v, i) {
        if (v === false) return end[i];
        return begin[i] + v * s;
      });
    });
  }
  /**
   * @description Get the transition data of the object type
   * @param {Object} startState Transition start state
   * @param {Object} endState   Transition end state
   * @param {Array} frameState  Frame state progress
   * @return {Array} Transition frame state
   */


  function getObjectTransitionState(begin, end, frameState) {
    var keys = Object.keys(end);
    var beginValue = keys.map(function (k) {
      return begin[k];
    });
    var endValue = keys.map(function (k) {
      return end[k];
    });
    var arrayState = getArrayTransitionState(beginValue, endValue, frameState);
    return arrayState.map(function (item) {
      var frameData = {};
      item.forEach(function (v, i) {
        return frameData[keys[i]] = v;
      });
      return frameData;
    });
  }
  /**
   * @description Get the transition state data by recursion
   * @param {Array|Object} startState Transition start state
   * @param {Array|Object} endState   Transition end state
   * @param {Array} frameState        Frame state progress
   * @return {Array} Transition frame state
   */


  function recursionTransitionState(begin, end, frameState) {
    var state = getTransitionState(begin, end, frameState);

    var _loop = function _loop(key) {
      var bTemp = begin[key];
      var eTemp = end[key];
      if ((0, _typeof2["default"])(eTemp) !== 'object') return "continue";
      var data = recursionTransitionState(bTemp, eTemp, frameState);
      state.forEach(function (fs, i) {
        return fs[key] = data[i];
      });
    };

    for (var key in end) {
      var _ret = _loop(key);

      if (_ret === "continue") continue;
    }

    return state;
  }
  /**
   * @description Inject new curve into curves as config
   * @param {Any} key     The key of curve
   * @param {Array} curve Bezier curve data
   * @return {Undefined} No return
   */


  function injectNewCurve(key, curve) {
    if (!key || !curve) {
      console.error('InjectNewCurve Missing Parameters!');
      return;
    }

    _curves["default"].set(key, curve);
  }

  var _default = transition;
  exports["default"] = _default;
  });

  unwrapExports(lib$2);
  var lib_1$1 = lib$2.transition;
  var lib_2$1 = lib$2.injectNewCurve;

  var graph_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _regenerator = interopRequireDefault(regenerator);

  var _asyncToGenerator2 = interopRequireDefault(asyncToGenerator);

  var _typeof2 = interopRequireDefault(_typeof_1);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _classCallCheck2 = interopRequireDefault(classCallCheck);

  var _style = interopRequireDefault(style_class);

  var _transition = interopRequireDefault(lib$2);



  /**
   * @description Class Graph
   * @param {Object} graph  Graph default configuration
   * @param {Object} config Graph config
   * @return {Graph} Instance of Graph
   */
  var Graph = function Graph(graph, config) {
    (0, _classCallCheck2["default"])(this, Graph);
    config = (0, util.deepClone)(config, true);
    var defaultConfig = {
      /**
       * @description Weather to render graph
       * @type {Boolean}
       * @default visible = true
       */
      visible: true,

      /**
       * @description Whether to enable drag
       * @type {Boolean}
       * @default drag = false
       */
      drag: false,

      /**
       * @description Whether to enable hover
       * @type {Boolean}
       * @default hover = false
       */
      hover: false,

      /**
       * @description Graph rendering index
       *  Give priority to index high graph in rendering
       * @type {Number}
       * @example index = 1
       */
      index: 1,

      /**
       * @description Animation delay time(ms)
       * @type {Number}
       * @default animationDelay = 0
       */
      animationDelay: 0,

      /**
       * @description Number of animation frames
       * @type {Number}
       * @default animationFrame = 30
       */
      animationFrame: 30,

      /**
       * @description Animation dynamic curve (Supported by transition)
       * @type {String}
       * @default animationCurve = 'linear'
       * @link https://github.com/jiaming743/Transition
       */
      animationCurve: 'linear',

      /**
       * @description Weather to pause graph animation
       * @type {Boolean}
       * @default animationPause = false
       */
      animationPause: false,

      /**
       * @description Rectangular hover detection zone
       *  Use this method for hover detection first
       * @type {Null|Array}
       * @default hoverRect = null
       * @example hoverRect = [0, 0, 100, 100] // [Rect start x, y, Rect width, height]
       */
      hoverRect: null,

      /**
       * @description Mouse enter event handler
       * @type {Function|Null}
       * @default mouseEnter = null
       */
      mouseEnter: null,

      /**
       * @description Mouse outer event handler
       * @type {Function|Null}
       * @default mouseOuter = null
       */
      mouseOuter: null,

      /**
       * @description Mouse click event handler
       * @type {Function|Null}
       * @default click = null
       */
      click: null
    };
    var configAbleNot = {
      status: 'static',
      animationRoot: [],
      animationKeys: [],
      animationFrameState: [],
      cache: {}
    };
    if (!config.shape) config.shape = {};
    if (!config.style) config.style = {};
    var shape = Object.assign({}, graph.shape, config.shape);
    Object.assign(defaultConfig, config, configAbleNot);
    Object.assign(this, graph, defaultConfig);
    this.shape = shape;
    this.style = new _style["default"](config.style);
    this.addedProcessor();
  };
  /**
   * @description Processor of added
   * @return {Undefined} Void
   */


  exports["default"] = Graph;

  Graph.prototype.addedProcessor = function () {
    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(null, this); // The life cycle 'added"

    if (typeof this.added === 'function') this.added(this);
  };
  /**
   * @description Processor of draw
   * @param {CRender} render Instance of CRender
   * @param {Graph} graph    Instance of Graph
   * @return {Undefined} Void
   */


  Graph.prototype.drawProcessor = function (render, graph) {
    var ctx = render.ctx;
    graph.style.initStyle(ctx);
    if (typeof this.beforeDraw === 'function') this.beforeDraw(this, render);
    graph.draw(render, graph);
    if (typeof this.drawed === 'function') this.drawed(this, render);
    graph.style.restoreTransform(ctx);
  };
  /**
   * @description Processor of hover check
   * @param {Array} position Mouse Position
   * @param {Graph} graph    Instance of Graph
   * @return {Boolean} Result of hover check
   */


  Graph.prototype.hoverCheckProcessor = function (position, _ref) {
    var hoverRect = _ref.hoverRect,
        style = _ref.style,
        hoverCheck = _ref.hoverCheck;
    var graphCenter = style.graphCenter,
        rotate = style.rotate,
        scale = style.scale,
        translate = style.translate;

    if (graphCenter) {
      if (rotate) position = (0, util.getRotatePointPos)(-rotate, position, graphCenter);
      if (scale) position = (0, util.getScalePointPos)(scale.map(function (s) {
        return 1 / s;
      }), position, graphCenter);
      if (translate) position = (0, util.getTranslatePointPos)(translate.map(function (v) {
        return v * -1;
      }), position);
    }

    if (hoverRect) return util.checkPointIsInRect.apply(void 0, [position].concat((0, _toConsumableArray2["default"])(hoverRect)));
    return hoverCheck(position, this);
  };
  /**
   * @description Processor of move
   * @param {Event} e Mouse movement event
   * @return {Undefined} Void
   */


  Graph.prototype.moveProcessor = function (e) {
    this.move(e, this);
    if (typeof this.beforeMove === 'function') this.beforeMove(e, this);
    if (typeof this.setGraphCenter === 'function') this.setGraphCenter(e, this);
    if (typeof this.moved === 'function') this.moved(e, this);
  };
  /**
   * @description Update graph state
   * @param {String} attrName Updated attribute name
   * @param {Any} change      Updated value
   * @return {Undefined} Void
   */


  Graph.prototype.attr = function (attrName) {
    var change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    if (!attrName || change === undefined) return false;
    var isObject = (0, _typeof2["default"])(this[attrName]) === 'object';
    if (isObject) change = (0, util.deepClone)(change, true);
    var render = this.render;

    if (attrName === 'style') {
      this.style.update(change);
    } else if (isObject) {
      Object.assign(this[attrName], change);
    } else {
      this[attrName] = change;
    }

    if (attrName === 'index') render.sortGraphsByIndex();
    render.drawAllGraph();
  };
  /**
   * @description Update graphics state (with animation)
   *  Only shape and style attributes are supported
   * @param {String} attrName Updated attribute name
   * @param {Any} change      Updated value
   * @param {Boolean} wait    Whether to store the animation waiting
   *                          for the next animation request
   * @return {Promise} Animation Promise
   */


  Graph.prototype.animation =
  /*#__PURE__*/
  function () {
    var _ref2 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(attrName, change) {
      var wait,
          changeRoot,
          changeKeys,
          beforeState,
          animationFrame,
          animationCurve,
          animationDelay,
          animationFrameState,
          render,
          _args2 = arguments;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              wait = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

              if (!(attrName !== 'shape' && attrName !== 'style')) {
                _context2.next = 4;
                break;
              }

              console.error('Only supported shape and style animation!');
              return _context2.abrupt("return");

            case 4:
              change = (0, util.deepClone)(change, true);
              if (attrName === 'style') this.style.colorProcessor(change);
              changeRoot = this[attrName];
              changeKeys = Object.keys(change);
              beforeState = {};
              changeKeys.forEach(function (key) {
                return beforeState[key] = changeRoot[key];
              });
              animationFrame = this.animationFrame, animationCurve = this.animationCurve, animationDelay = this.animationDelay;
              animationFrameState = (0, _transition["default"])(animationCurve, beforeState, change, animationFrame, true);
              this.animationRoot.push(changeRoot);
              this.animationKeys.push(changeKeys);
              this.animationFrameState.push(animationFrameState);

              if (!wait) {
                _context2.next = 17;
                break;
              }

              return _context2.abrupt("return");

            case 17:
              if (!(animationDelay > 0)) {
                _context2.next = 20;
                break;
              }

              _context2.next = 20;
              return delay(animationDelay);

            case 20:
              render = this.render;
              return _context2.abrupt("return", new Promise(
              /*#__PURE__*/
              function () {
                var _ref3 = (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee(resolve) {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return render.launchAnimation();

                        case 2:
                          resolve();

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }()));

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * @description Extract the next frame of data from the animation queue
   *              and update the graph state
   * @return {Undefined} Void
   */


  Graph.prototype.turnNextAnimationFrame = function (timeStamp) {
    var animationDelay = this.animationDelay,
        animationRoot = this.animationRoot,
        animationKeys = this.animationKeys,
        animationFrameState = this.animationFrameState,
        animationPause = this.animationPause;
    if (animationPause) return;
    if (Date.now() - timeStamp < animationDelay) return;
    animationRoot.forEach(function (root, i) {
      animationKeys[i].forEach(function (key) {
        root[key] = animationFrameState[i][0][key];
      });
    });
    animationFrameState.forEach(function (stateItem, i) {
      stateItem.shift();
      var noFrame = stateItem.length === 0;
      if (noFrame) animationRoot[i] = null;
      if (noFrame) animationKeys[i] = null;
    });
    this.animationFrameState = animationFrameState.filter(function (state) {
      return state.length;
    });
    this.animationRoot = animationRoot.filter(function (root) {
      return root;
    });
    this.animationKeys = animationKeys.filter(function (keys) {
      return keys;
    });
  };
  /**
   * @description Skip to the last frame of animation
   * @return {Undefined} Void
   */


  Graph.prototype.animationEnd = function () {
    var animationFrameState = this.animationFrameState,
        animationKeys = this.animationKeys,
        animationRoot = this.animationRoot,
        render = this.render;
    animationRoot.forEach(function (root, i) {
      var currentKeys = animationKeys[i];
      var lastState = animationFrameState[i].pop();
      currentKeys.forEach(function (key) {
        return root[key] = lastState[key];
      });
    });
    this.animationFrameState = [];
    this.animationKeys = [];
    this.animationRoot = [];
    return render.drawAllGraph();
  };
  /**
   * @description Pause animation behavior
   * @return {Undefined} Void
   */


  Graph.prototype.pauseAnimation = function () {
    this.attr('animationPause', true);
  };
  /**
   * @description Try animation behavior
   * @return {Undefined} Void
   */


  Graph.prototype.playAnimation = function () {
    var render = this.render;
    this.attr('animationPause', false);
    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref4 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(resolve) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return render.launchAnimation();

              case 2:
                resolve();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
  };
  /**
   * @description Processor of delete
   * @param {CRender} render Instance of CRender
   * @return {Undefined} Void
   */


  Graph.prototype.delProcessor = function (render) {
    var _this = this;

    var graphs = render.graphs;
    var index = graphs.findIndex(function (graph) {
      return graph === _this;
    });
    if (index === -1) return;
    if (typeof this.beforeDelete === 'function') this.beforeDelete(this);
    graphs.splice(index, 1, null);
    if (typeof this.deleted === 'function') this.deleted(this);
  };
  /**
   * @description Return a timed release Promise
   * @param {Number} time Release time
   * @return {Promise} A timed release Promise
   */


  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  });

  unwrapExports(graph_class);

  var crender_class = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _defineProperty2 = interopRequireDefault(defineProperty);

  var _toConsumableArray2 = interopRequireDefault(toConsumableArray);

  var _classCallCheck2 = interopRequireDefault(classCallCheck);

  var _color = interopRequireDefault(lib);

  var _bezierCurve = interopRequireDefault(lib$1);



  var _graphs = interopRequireDefault(graphs_1);

  var _graph = interopRequireDefault(graph_class);

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  /**
   * @description           Class of CRender
   * @param {Object} canvas Canvas DOM
   * @return {CRender}      Instance of CRender
   */
  var CRender = function CRender(canvas) {
    (0, _classCallCheck2["default"])(this, CRender);

    if (!canvas) {
      console.error('CRender Missing parameters!');
      return;
    }

    var ctx = canvas.getContext('2d');
    var clientWidth = canvas.clientWidth,
        clientHeight = canvas.clientHeight;
    var area = [clientWidth, clientHeight];
    canvas.setAttribute('width', clientWidth);
    canvas.setAttribute('height', clientHeight);
    /**
     * @description Context of the canvas
     * @type {Object}
     * @example ctx = canvas.getContext('2d')
     */

    this.ctx = ctx;
    /**
     * @description Width and height of the canvas
     * @type {Array}
     * @example area = [300，100]
     */

    this.area = area;
    /**
     * @description Whether render is in animation rendering
     * @type {Boolean}
     * @example animationStatus = true|false
     */

    this.animationStatus = false;
    /**
     * @description Added graph
     * @type {[Graph]}
     * @example graphs = [Graph, Graph, ...]
     */

    this.graphs = [];
    /**
     * @description Color plugin
     * @type {Object}
     * @link https://github.com/jiaming743/color
     */

    this.color = _color["default"];
    /**
     * @description Bezier Curve plugin
     * @type {Object}
     * @link https://github.com/jiaming743/BezierCurve
     */

    this.bezierCurve = _bezierCurve["default"]; // bind event handler

    canvas.addEventListener('mousedown', mouseDown.bind(this));
    canvas.addEventListener('mousemove', mouseMove.bind(this));
    canvas.addEventListener('mouseup', mouseUp.bind(this));
  };
  /**
   * @description        Clear canvas drawing area
   * @return {Undefined} Void
   */


  exports["default"] = CRender;

  CRender.prototype.clearArea = function () {
    var _this$ctx;

    var area = this.area;

    (_this$ctx = this.ctx).clearRect.apply(_this$ctx, [0, 0].concat((0, _toConsumableArray2["default"])(area)));
  };
  /**
   * @description           Add graph to render
   * @param {Object} config Graph configuration
   * @return {Graph}        Graph instance
   */


  CRender.prototype.add = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = config.name;

    if (!name) {
      console.error('add Missing parameters!');
      return;
    }

    var graphConfig = _graphs["default"].get(name);

    if (!graphConfig) {
      console.warn('No corresponding graph configuration found!');
      return;
    }

    var graph = new _graph["default"](graphConfig, config);
    if (!graph.validator(graph)) return;
    graph.render = this;
    this.graphs.push(graph);
    this.sortGraphsByIndex();
    this.drawAllGraph();
    return graph;
  };
  /**
   * @description Sort the graph by index
   * @return {Undefined} Void
   */


  CRender.prototype.sortGraphsByIndex = function () {
    var graphs = this.graphs;
    graphs.sort(function (a, b) {
      if (a.index > b.index) return 1;
      if (a.index === b.index) return 0;
      if (a.index < b.index) return -1;
    });
  };
  /**
   * @description         Delete graph in render
   * @param {Graph} graph The graph to be deleted
   * @return {Undefined}  Void
   */


  CRender.prototype.delGraph = function (graph) {
    if (typeof graph.delProcessor !== 'function') return;
    graph.delProcessor(this);
    this.graphs = this.graphs.filter(function (graph) {
      return graph;
    });
    this.drawAllGraph();
  };
  /**
   * @description        Delete all graph in render
   * @return {Undefined} Void
   */


  CRender.prototype.delAllGraph = function () {
    var _this = this;

    this.graphs.forEach(function (graph) {
      return graph.delProcessor(_this);
    });
    this.graphs = this.graphs.filter(function (graph) {
      return graph;
    });
    this.drawAllGraph();
  };
  /**
   * @description        Draw all the graphs in the render
   * @return {Undefined} Void
   */


  CRender.prototype.drawAllGraph = function () {
    var _this2 = this;

    this.clearArea();
    this.graphs.filter(function (graph) {
      return graph && graph.visible;
    }).forEach(function (graph) {
      return graph.drawProcessor(_this2, graph);
    });
  };
  /**
   * @description      Animate the graph whose animation queue is not empty
   *                   and the animationPause is equal to false
   * @return {Promise} Animation Promise
   */


  CRender.prototype.launchAnimation = function () {
    var _this3 = this;

    var animationStatus = this.animationStatus;
    if (animationStatus) return;
    this.animationStatus = true;
    return new Promise(function (resolve) {
      animation.call(_this3, function () {
        _this3.animationStatus = false;
        resolve();
      }, Date.now());
    });
  };
  /**
   * @description Try to animate every graph
   * @param {Function} callback Callback in animation end
   * @param {Number} timeStamp  Time stamp of animation start
   * @return {Undefined} Void
   */


  function animation(callback, timeStamp) {
    var graphs = this.graphs;

    if (!animationAble(graphs)) {
      callback();
      return;
    }

    graphs.forEach(function (graph) {
      return graph.turnNextAnimationFrame(timeStamp);
    });
    this.drawAllGraph();
    requestAnimationFrame(animation.bind(this, callback, timeStamp));
  }
  /**
   * @description Find if there are graph that can be animated
   * @param {[Graph]} graphs
   * @return {Boolean}
   */


  function animationAble(graphs) {
    return graphs.find(function (graph) {
      return !graph.animationPause && graph.animationFrameState.length;
    });
  }
  /**
   * @description Handler of CRender mousedown event
   * @return {Undefined} Void
   */


  function mouseDown(e) {
    var graphs = this.graphs;
    var hoverGraph = graphs.find(function (graph) {
      return graph.status === 'hover';
    });
    if (!hoverGraph) return;
    hoverGraph.status = 'active';
  }
  /**
   * @description Handler of CRender mousemove event
   * @return {Undefined} Void
   */


  function mouseMove(e) {
    var offsetX = e.offsetX,
        offsetY = e.offsetY;
    var position = [offsetX, offsetY];
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === 'active' || graph.status === 'drag';
    });

    if (activeGraph) {
      if (!activeGraph.drag) return;

      if (typeof activeGraph.move !== 'function') {
        console.error('No move method is provided, cannot be dragged!');
        return;
      }

      activeGraph.moveProcessor(e);
      activeGraph.status = 'drag';
      return;
    }

    var hoverGraph = graphs.find(function (graph) {
      return graph.status === 'hover';
    });
    var hoverAbleGraphs = graphs.filter(function (graph) {
      return graph.hover && (typeof graph.hoverCheck === 'function' || graph.hoverRect);
    });
    var hoveredGraph = hoverAbleGraphs.find(function (graph) {
      return graph.hoverCheckProcessor(position, graph);
    });

    if (hoveredGraph) {
      document.body.style.cursor = hoveredGraph.style.hoverCursor;
    } else {
      document.body.style.cursor = 'default';
    }

    var hoverGraphMouseOuterIsFun = false,
        hoveredGraphMouseEnterIsFun = false;
    if (hoverGraph) hoverGraphMouseOuterIsFun = typeof hoverGraph.mouseOuter === 'function';
    if (hoveredGraph) hoveredGraphMouseEnterIsFun = typeof hoveredGraph.mouseEnter === 'function';
    if (!hoveredGraph && !hoverGraph) return;

    if (!hoveredGraph && hoverGraph) {
      if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
      hoverGraph.status = 'static';
      return;
    }

    if (hoveredGraph && hoveredGraph === hoverGraph) return;

    if (hoveredGraph && !hoverGraph) {
      if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
      hoveredGraph.status = 'hover';
      return;
    }

    if (hoveredGraph && hoverGraph && hoveredGraph !== hoverGraph) {
      if (hoverGraphMouseOuterIsFun) hoverGraph.mouseOuter(e, hoverGraph);
      hoverGraph.status = 'static';
      if (hoveredGraphMouseEnterIsFun) hoveredGraph.mouseEnter(e, hoveredGraph);
      hoveredGraph.status = 'hover';
    }
  }
  /**
   * @description Handler of CRender mouseup event
   * @return {Undefined} Void
   */


  function mouseUp(e) {
    var graphs = this.graphs;
    var activeGraph = graphs.find(function (graph) {
      return graph.status === 'active';
    });
    var dragGraph = graphs.find(function (graph) {
      return graph.status === 'drag';
    });
    if (activeGraph && typeof activeGraph.click === 'function') activeGraph.click(e, activeGraph);
    graphs.forEach(function (graph) {
      return graph && (graph.status = 'static');
    });
    if (activeGraph) activeGraph.status = 'hover';
    if (dragGraph) dragGraph.status = 'hover';
  }
  /**
   * @description         Clone Graph
   * @param {Graph} graph The target to be cloned
   * @return {Graph}      Cloned graph
   */


  CRender.prototype.clone = function (graph) {
    var style = graph.style.getStyle();

    var clonedGraph = _objectSpread({}, graph, {
      style: style
    });

    delete clonedGraph.render;
    clonedGraph = (0, util.deepClone)(clonedGraph, true);
    return this.add(clonedGraph);
  };
  });

  unwrapExports(crender_class);

  var lib$3 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "CRender", {
    enumerable: true,
    get: function get() {
      return _crender["default"];
    }
  });
  Object.defineProperty(exports, "extendNewGraph", {
    enumerable: true,
    get: function get() {
      return graphs_1.extendNewGraph;
    }
  });
  exports["default"] = void 0;

  var _crender = interopRequireDefault(crender_class);



  var _default = _crender["default"];
  exports["default"] = _default;
  });

  var CRender = unwrapExports(lib$3);

  //
  var script$s = {
    name: 'DvDigitalFlop',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        renderer: null,
        defaultConfig: {
          /**
           * @description Number for digital flop
           * @type {Array<Number>}
           * @default number = []
           * @example number = [10]
           */
          number: [],

          /**
           * @description Content formatter
           * @type {String}
           * @default content = ''
           * @example content = '{nt}个'
           */
          content: '',

          /**
           * @description Number toFixed
           * @type {Number}
           * @default toFixed = 0
           */
          toFixed: 0,

          /**
           * @description Text align
           * @type {String}
           * @default textAlign = 'center'
           * @example textAlign = 'center' | 'left' | 'right'
           */
          textAlign: 'center',

          /**
           * @description rowGap
           * @type {Number}
           @default rowGap = 0
           */
          rowGap: 0,

          /**
           * @description Text style configuration
           * @type {Object} {CRender Class Style}
           */
          style: {
            fontSize: 30,
            fill: '#3de7c9'
          },

          /**
           * @description Number formatter
           * @type {Null|Function}
           */
          formatter: undefined,

          /**
           * @description CRender animationCurve
           * @type {String}
           * @default animationCurve = 'easeOutCubic'
           */
          animationCurve: 'easeOutCubic',

          /**
           * @description CRender animationFrame
           * @type {String}
           * @default animationFrame = 50
           */
          animationFrame: 50
        },
        mergedConfig: null,
        graph: null
      };
    },

    watch: {
      config() {
        const {
          update
        } = this;
        update();
      }

    },
    methods: {
      init() {
        const {
          initRender,
          mergeConfig,
          initGraph
        } = this;
        initRender();
        mergeConfig();
        initGraph();
      },

      initRender() {
        const {
          $refs
        } = this;
        this.renderer = new CRender($refs['digital-flop']);
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      initGraph() {
        const {
          getShape,
          getStyle,
          renderer,
          mergedConfig
        } = this;
        const {
          animationCurve,
          animationFrame
        } = mergedConfig;
        const shape = getShape();
        const style = getStyle();
        this.graph = renderer.add({
          name: 'numberText',
          animationCurve,
          animationFrame,
          shape,
          style
        });
      },

      getShape() {
        const {
          number,
          content,
          toFixed,
          textAlign,
          rowGap,
          formatter
        } = this.mergedConfig;
        const [w, h] = this.renderer.area;
        const position = [w / 2, h / 2];
        if (textAlign === 'left') position[0] = 0;
        if (textAlign === 'right') position[0] = w;
        return {
          number,
          content,
          toFixed,
          position,
          rowGap,
          formatter
        };
      },

      getStyle() {
        const {
          style,
          textAlign
        } = this.mergedConfig;
        return index.deepMerge(style, {
          textAlign,
          textBaseline: 'middle'
        });
      },

      update() {
        const {
          mergeConfig,
          mergeShape,
          getShape,
          getStyle,
          graph,
          mergedConfig
        } = this;
        graph.animationEnd();
        mergeConfig();
        if (!graph) return;
        const {
          animationCurve,
          animationFrame
        } = mergedConfig;
        const shape = getShape();
        const style = getStyle();
        mergeShape(graph, shape);
        graph.animationCurve = animationCurve;
        graph.animationFrame = animationFrame;
        graph.animation('style', style, true);
        graph.animation('shape', shape);
      },

      mergeShape(graph, shape) {
        const cacheNum = graph.shape.number.length;
        const shapeNum = shape.number.length;
        if (cacheNum !== shapeNum) graph.shape.number = shape.number;
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    }

  };

  /* script */
  const __vue_script__$s = script$s;

  /* template */
  var __vue_render__$s = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-digital-flop" }, [
      _c("canvas", { ref: "digital-flop" })
    ])
  };
  var __vue_staticRenderFns__$s = [];
  __vue_render__$s._withStripped = true;

    /* style */
    const __vue_inject_styles__$s = function (inject) {
      if (!inject) return
      inject("data-v-1d805fec_0", { source: ".dv-digital-flop canvas {\n  width: 100%;\n  height: 100%;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd","file":"main.vue","sourcesContent":[".dv-digital-flop canvas {\n  width: 100%;\n  height: 100%;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$s = undefined;
    /* module identifier */
    const __vue_module_identifier__$s = undefined;
    /* functional template */
    const __vue_is_functional_template__$s = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$s = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
      __vue_inject_styles__$s,
      __vue_script__$s,
      __vue_scope_id__$s,
      __vue_is_functional_template__$s,
      __vue_module_identifier__$s,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$t = {
    name: 'DvActiveRingChart',
    components: {
      dvDigitalFlop: __vue_component__$s
    },
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        defaultConfig: {
          /**
           * @description Ring radius
           * @type {String|Number}
           * @default radius = '50%'
           * @example radius = '50%' | 100
           */
          radius: '50%',

          /**
           * @description Active ring radius
           * @type {String|Number}
           * @default activeRadius = '55%'
           * @example activeRadius = '55%' | 110
           */
          activeRadius: '55%',

          /**
           * @description Ring data
           * @type {Array<Object>}
           * @default data = [{ name: '', value: 0 }]
           */
          data: [{
            name: '',
            value: 0
          }],

          /**
           * @description Ring line width
           * @type {Number}
           * @default lineWidth = 20
           */
          lineWidth: 20,

          /**
           * @description Active time gap (ms)
           * @type {Number}
           * @default activeTimeGap = 3000
           */
          activeTimeGap: 3000,

          /**
           * @description Ring color (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default color = [Charts Default Color]
           * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          color: [],

          /**
           * @description Digital flop style
           * @type {Object}
           */
          digitalFlopStyle: {
            fontSize: 25,
            fill: '#fff'
          },

          /**
           * @description Digital flop toFixed
           * @type {Number}
           */
          digitalFlopToFixed: 0,

          /**
           * @description Digital flop unit
           * @type {String}
           */
          digitalFlopUnit: '',

          /**
           * @description CRender animationCurve
           * @type {String}
           * @default animationCurve = 'easeOutCubic'
           */
          animationCurve: 'easeOutCubic',

          /**
           * @description CRender animationFrame
           * @type {String}
           * @default animationFrame = 50
           */
          animationFrame: 50,

          /**
           * @description showOriginValue
           * @type {Boolean}
           * @default showOriginValue = false
           */
          showOriginValue: false
        },
        mergedConfig: null,
        chart: null,
        activeIndex: 0,
        animationHandler: ''
      };
    },

    computed: {
      digitalFlop() {
        const {
          mergedConfig,
          activeIndex
        } = this;
        if (!mergedConfig) return {};
        const {
          digitalFlopStyle,
          digitalFlopToFixed,
          data,
          showOriginValue,
          digitalFlopUnit
        } = mergedConfig;
        const value = data.map(({
          value
        }) => value);
        const sum = value.reduce((all, v) => all + v, 0);
        let tatalDiaplsyValue = 0;

        for (let i = 0; i < data.length; i++) {
          let currentValue = data[i].value; //非最后一个

          if (i < data.length - 1) {
            //四舍五入取整数
            const percent = Math.round(parseFloat(currentValue / sum * 100) || 0);
            data[i]["cusTomDisplayValue"] = percent;
            tatalDiaplsyValue = tatalDiaplsyValue + percent;
          } else {
            let v = 100 - tatalDiaplsyValue;

            if (v < 0) {
              let lastSecodItem = i - 1;
              data[lastSecodItem]["cusTomDisplayValue"] = data[lastSecodItem]["cusTomDisplayValue"] + v;
            }

            data[i]["cusTomDisplayValue"] = v > 0 ? v : 0;
          }
        }

        let displayValue;

        if (showOriginValue) {
          displayValue = value[activeIndex];
        } else {
          // const sum = value.reduce((all, v) => all + v, 0)
          // const percent = parseFloat((value[activeIndex] / sum) * 100) || 0
          // displayValue = percent
          //自定义显示
          displayValue = data[activeIndex]["cusTomDisplayValue"];
        }

        return {
          content: showOriginValue ? `{nt}${digitalFlopUnit}` : `{nt}${digitalFlopUnit || '%'}`,
          number: [displayValue],
          style: digitalFlopStyle,
          toFixed: digitalFlopToFixed
        };
      },

      ringName() {
        const {
          mergedConfig,
          activeIndex
        } = this;
        if (!mergedConfig) return '';
        return mergedConfig.data[activeIndex].name;
      },

      fontSize() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '';
        return `font-size: ${mergedConfig.digitalFlopStyle.fontSize}px;`;
      }

    },
    watch: {
      config() {
        const {
          animationHandler,
          mergeConfig,
          setRingOption
        } = this;
        clearTimeout(animationHandler);
        this.activeIndex = 0;
        mergeConfig();
        setRingOption();
      }

    },
    methods: {
      init() {
        const {
          initChart,
          mergeConfig,
          setRingOption
        } = this;
        initChart();
        mergeConfig();
        setRingOption();
      },

      initChart() {
        const {
          $refs
        } = this;
        this.chart = new Charts__default['default']($refs['active-ring-chart']);
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      setRingOption() {
        const {
          getRingOption,
          chart,
          ringAnimation
        } = this;
        const option = getRingOption();
        chart.setOption(option, true);
        ringAnimation();
      },

      getRingOption() {
        const {
          mergedConfig,
          getRealRadius
        } = this;
        const radius = getRealRadius();
        mergedConfig.data.forEach(dataItem => {
          dataItem.radius = radius;
        });
        return {
          series: [{
            type: 'pie',
            ...mergedConfig,
            outsideLabel: {
              show: false
            }
          }],
          color: mergedConfig.color
        };
      },

      getRealRadius(active = false) {
        const {
          mergedConfig,
          chart
        } = this;
        const {
          radius,
          activeRadius,
          lineWidth
        } = mergedConfig;
        const maxRadius = Math.min(...chart.render.area) / 2;
        const halfLineWidth = lineWidth / 2;
        let realRadius = active ? activeRadius : radius;
        if (typeof realRadius !== 'number') realRadius = parseInt(realRadius) / 100 * maxRadius;
        const insideRadius = realRadius - halfLineWidth;
        const outSideRadius = realRadius + halfLineWidth;
        return [insideRadius, outSideRadius];
      },

      ringAnimation() {
        let {
          activeIndex,
          getRingOption,
          chart,
          getRealRadius
        } = this;
        const radius = getRealRadius();
        const active = getRealRadius(true);
        const option = getRingOption();
        const {
          data
        } = option.series[0];
        data.forEach((dataItem, i) => {
          if (i === activeIndex) {
            dataItem.radius = active;
          } else {
            dataItem.radius = radius;
          }
        });
        chart.setOption(option, true);
        const {
          activeTimeGap
        } = option.series[0];
        this.animationHandler = setTimeout(foo => {
          activeIndex += 1;
          if (activeIndex >= data.length) activeIndex = 0;
          this.activeIndex = activeIndex;
          this.ringAnimation();
        }, activeTimeGap);
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    },

    beforeDestroy() {
      const {
        animationHandler
      } = this;
      clearTimeout(animationHandler);
    }

  };

  /* script */
  const __vue_script__$t = script$t;

  /* template */
  var __vue_render__$t = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-active-ring-chart" }, [
      _c("div", {
        ref: "active-ring-chart",
        staticClass: "active-ring-chart-container"
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "active-ring-info" },
        [
          _c("dv-digital-flop", { attrs: { config: _vm.digitalFlop } }),
          _vm._v(" "),
          _c("div", { staticClass: "active-ring-name", style: _vm.fontSize }, [
            _vm._v(_vm._s(_vm.ringName))
          ])
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$t = [];
  __vue_render__$t._withStripped = true;

    /* style */
    const __vue_inject_styles__$t = function (inject) {
      if (!inject) return
      inject("data-v-9e69f838_0", { source: ".dv-active-ring-chart {\n  position: relative;\n}\n.dv-active-ring-chart .active-ring-chart-container {\n  width: 100%;\n  height: 100%;\n}\n.dv-active-ring-chart .active-ring-info {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-active-ring-chart .active-ring-info .dv-digital-flop {\n  width: 100px;\n  height: 30px;\n}\n.dv-active-ring-chart .active-ring-info .active-ring-name {\n  width: 100px;\n  height: 30px;\n  color: #fff;\n  text-align: center;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;EACT,QAAQ;EACR,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,YAAY;AACd;AACA;EACE,YAAY;EACZ,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,sBAAsB;EACtB,uBAAuB;EACvB,gBAAgB;EAChB,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-active-ring-chart {\n  position: relative;\n}\n.dv-active-ring-chart .active-ring-chart-container {\n  width: 100%;\n  height: 100%;\n}\n.dv-active-ring-chart .active-ring-info {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0px;\n  top: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.dv-active-ring-chart .active-ring-info .dv-digital-flop {\n  width: 100px;\n  height: 30px;\n}\n.dv-active-ring-chart .active-ring-info .active-ring-name {\n  width: 100px;\n  height: 30px;\n  color: #fff;\n  text-align: center;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$t = undefined;
    /* module identifier */
    const __vue_module_identifier__$t = undefined;
    /* functional template */
    const __vue_is_functional_template__$t = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$t = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
      __vue_inject_styles__$t,
      __vue_script__$t,
      __vue_scope_id__$t,
      __vue_is_functional_template__$t,
      __vue_module_identifier__$t,
      false,
      createInjector,
      undefined,
      undefined
    );

  function activeRingChart (Vue) {
    Vue.component(__vue_component__$t.name, __vue_component__$t);
  }

  //
  var script$u = {
    name: 'DvCapsuleChart',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        defaultConfig: {
          /**
           * @description Capsule chart data
           * @type {Array<Object>}
           * @default data = []
           * @example data = [{ name: 'foo1', value: 100 }, { name: 'foo2', value: 100 }]
           */
          data: [],

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default color = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']
           * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],

          /**
           * @description Chart unit
           * @type {String}
           * @default unit = ''
           */
          unit: '',

          /**
           * @description Show item value
           * @type {Boolean}
           * @default showValue = false
           */
          showValue: false
        },
        mergedConfig: null,
        capsuleLength: [],
        capsuleValue: [],
        labelData: [],
        labelDataLength: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      calcData() {
        const {
          mergeConfig,
          calcCapsuleLengthAndLabelData
        } = this;
        mergeConfig();
        calcCapsuleLengthAndLabelData();
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      calcCapsuleLengthAndLabelData() {
        const {
          data
        } = this.mergedConfig;
        if (!data.length) return;
        const capsuleValue = data.map(({
          value
        }) => value);
        const maxValue = Math.max(...capsuleValue);
        this.capsuleValue = capsuleValue;
        this.capsuleLength = capsuleValue.map(v => maxValue ? v / maxValue : 0);
        const oneFifth = maxValue / 5;
        const labelData = Array.from(new Set(new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth))));
        this.labelData = labelData;
        this.labelDataLength = Array.from(labelData).map(v => maxValue ? v / maxValue : 0);
      }

    },

    mounted() {
      const {
        calcData
      } = this;
      calcData();
    }

  };

  /* script */
  const __vue_script__$u = script$u;

  /* template */
  var __vue_render__$u = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "dv-capsule-chart" },
      [
        _vm.mergedConfig
          ? [
              _c(
                "div",
                { staticClass: "label-column" },
                [
                  _vm._l(_vm.mergedConfig.data, function(item) {
                    return _c("div", { key: item.name }, [
                      _vm._v(_vm._s(item.name))
                    ])
                  }),
                  _vm._v(" "),
                  _c("div", [_vm._v(" ")])
                ],
                2
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "capsule-container" },
                [
                  _vm._l(_vm.capsuleLength, function(capsule, index) {
                    return _c(
                      "div",
                      { key: index, staticClass: "capsule-item" },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "capsule-item-column",
                            style:
                              "width: " +
                              capsule * 100 +
                              "%; background-color: " +
                              _vm.mergedConfig.colors[
                                index % _vm.mergedConfig.colors.length
                              ] +
                              ";"
                          },
                          [
                            _vm.mergedConfig.showValue
                              ? _c("div", { staticClass: "capsule-item-value" }, [
                                  _vm._v(_vm._s(_vm.capsuleValue[index]))
                                ])
                              : _vm._e()
                          ]
                        )
                      ]
                    )
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "unit-label" },
                    _vm._l(_vm.labelData, function(label, index) {
                      return _c("div", { key: label + index }, [
                        _vm._v(_vm._s(label))
                      ])
                    }),
                    0
                  )
                ],
                2
              ),
              _vm._v(" "),
              _vm.mergedConfig.unit
                ? _c("div", { staticClass: "unit-text" }, [
                    _vm._v(_vm._s(_vm.mergedConfig.unit))
                  ])
                : _vm._e()
            ]
          : _vm._e()
      ],
      2
    )
  };
  var __vue_staticRenderFns__$u = [];
  __vue_render__$u._withStripped = true;

    /* style */
    const __vue_inject_styles__$u = function (inject) {
      if (!inject) return
      inject("data-v-2c3978f2_0", { source: ".dv-capsule-chart {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 10px;\n  color: #fff;\n}\n.dv-capsule-chart .label-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding-right: 10px;\n  text-align: right;\n  font-size: 12px;\n}\n.dv-capsule-chart .label-column div {\n  height: 20px;\n  line-height: 20px;\n}\n.dv-capsule-chart .capsule-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dv-capsule-chart .capsule-item {\n  box-shadow: 0 0 3px #999;\n  height: 10px;\n  margin: 5px 0px;\n  border-radius: 5px;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column {\n  position: relative;\n  height: 8px;\n  margin-top: 1px;\n  border-radius: 5px;\n  transition: all 0.3s;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column .capsule-item-value {\n  font-size: 12px;\n  transform: translateX(100%);\n}\n.dv-capsule-chart .unit-label {\n  height: 20px;\n  font-size: 12px;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.dv-capsule-chart .unit-text {\n  text-align: right;\n  display: flex;\n  align-items: flex-end;\n  font-size: 12px;\n  line-height: 20px;\n  margin-left: 10px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;EACb,mBAAmB;EACnB,sBAAsB;EACtB,aAAa;EACb,WAAW;AACb;AACA;EACE,aAAa;EACb,sBAAsB;EACtB,8BAA8B;EAC9B,sBAAsB;EACtB,mBAAmB;EACnB,iBAAiB;EACjB,eAAe;AACjB;AACA;EACE,YAAY;EACZ,iBAAiB;AACnB;AACA;EACE,OAAO;EACP,aAAa;EACb,sBAAsB;EACtB,8BAA8B;AAChC;AACA;EACE,wBAAwB;EACxB,YAAY;EACZ,eAAe;EACf,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,eAAe;EACf,kBAAkB;EAClB,oBAAoB;EACpB,aAAa;EACb,yBAAyB;EACzB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,2BAA2B;AAC7B;AACA;EACE,YAAY;EACZ,eAAe;EACf,kBAAkB;EAClB,aAAa;EACb,8BAA8B;EAC9B,mBAAmB;AACrB;AACA;EACE,iBAAiB;EACjB,aAAa;EACb,qBAAqB;EACrB,eAAe;EACf,iBAAiB;EACjB,iBAAiB;AACnB","file":"main.vue","sourcesContent":[".dv-capsule-chart {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 10px;\n  color: #fff;\n}\n.dv-capsule-chart .label-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  box-sizing: border-box;\n  padding-right: 10px;\n  text-align: right;\n  font-size: 12px;\n}\n.dv-capsule-chart .label-column div {\n  height: 20px;\n  line-height: 20px;\n}\n.dv-capsule-chart .capsule-container {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dv-capsule-chart .capsule-item {\n  box-shadow: 0 0 3px #999;\n  height: 10px;\n  margin: 5px 0px;\n  border-radius: 5px;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column {\n  position: relative;\n  height: 8px;\n  margin-top: 1px;\n  border-radius: 5px;\n  transition: all 0.3s;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n.dv-capsule-chart .capsule-item .capsule-item-column .capsule-item-value {\n  font-size: 12px;\n  transform: translateX(100%);\n}\n.dv-capsule-chart .unit-label {\n  height: 20px;\n  font-size: 12px;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.dv-capsule-chart .unit-text {\n  text-align: right;\n  display: flex;\n  align-items: flex-end;\n  font-size: 12px;\n  line-height: 20px;\n  margin-left: 10px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$u = undefined;
    /* module identifier */
    const __vue_module_identifier__$u = undefined;
    /* functional template */
    const __vue_is_functional_template__$u = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$u = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
      __vue_inject_styles__$u,
      __vue_script__$u,
      __vue_scope_id__$u,
      __vue_is_functional_template__$u,
      __vue_module_identifier__$u,
      false,
      createInjector,
      undefined,
      undefined
    );

  function capsuleChart (Vue) {
    Vue.component(__vue_component__$u.name, __vue_component__$u);
  }

  //
  var script$v = {
    name: 'DvWaterLevelPond',
    props: {
      config: Object,
      default: () => ({})
    },

    data() {
      const id = uuid();
      return {
        gradientId: `water-level-pond-${id}`,
        defaultConfig: {
          /**
           * @description Data
           * @type {Array<Number>}
           * @default data = []
           * @example data = [60, 40]
           */
          data: [],

          /**
           * @description Shape of wanter level pond
           * @type {String}
           * @default shape = 'rect'
           * @example shape = 'rect' | 'roundRect' | 'round'
           */
          shape: 'rect',

          /**
           * @description Water wave number
           * @type {Number}
           * @default waveNum = 3
           */
          waveNum: 3,

          /**
           * @description Water wave height (px)
           * @type {Number}
           * @default waveHeight = 40
           */
          waveHeight: 40,

          /**
           * @description Wave opacity
           * @type {Number}
           * @default waveOpacity = 0.4
           */
          waveOpacity: 0.4,

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default colors = ['#00BAFF', '#3DE7C9']
           * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#3DE7C9', '#00BAFF'],

          /**
           * @description Formatter
           * @type {String}
           * @default formatter = '{value}%'
           */
          formatter: '{value}%'
        },
        mergedConfig: {},
        renderer: null,
        svgBorderGradient: [],
        details: '',
        waves: [],
        animation: false
      };
    },

    computed: {
      radius() {
        const {
          shape
        } = this.mergedConfig;
        if (shape === 'round') return '50%';
        if (shape === 'rect') return '0';
        if (shape === 'roundRect') return '10px';
        return '0';
      },

      shape() {
        const {
          shape
        } = this.mergedConfig;
        if (!shape) return 'rect';
        return shape;
      }

    },
    watch: {
      config() {
        const {
          calcData,
          renderer
        } = this;
        renderer.delAllGraph();
        this.waves = [];
        setTimeout(calcData, 0);
      }

    },
    methods: {
      init() {
        const {
          initRender,
          config,
          calcData
        } = this;
        initRender();
        if (!config) return;
        calcData();
      },

      initRender() {
        const {
          $refs
        } = this;
        this.renderer = new CRender($refs['water-pond-level']);
      },

      calcData() {
        const {
          mergeConfig,
          calcSvgBorderGradient,
          calcDetails
        } = this;
        mergeConfig();
        calcSvgBorderGradient();
        calcDetails();
        const {
          addWave,
          animationWave
        } = this;
        addWave();
        animationWave();
      },

      mergeConfig() {
        const {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config);
      },

      calcSvgBorderGradient() {
        const {
          colors
        } = this.mergedConfig;
        const colorNum = colors.length;
        const colorOffsetGap = 100 / (colorNum - 1);
        this.svgBorderGradient = colors.map((c, i) => [colorOffsetGap * i, c]);
      },

      calcDetails() {
        const {
          data,
          formatter
        } = this.mergedConfig;

        if (!data.length) {
          this.details = '';
          return;
        }

        const maxValue = Math.max(...data);
        this.details = formatter.replace('{value}', maxValue);
      },

      addWave() {
        const {
          renderer,
          getWaveShapes,
          getWaveStyle,
          drawed
        } = this;
        const shapes = getWaveShapes();
        const style = getWaveStyle();
        this.waves = shapes.map(shape => renderer.add({
          name: 'smoothline',
          animationFrame: 300,
          shape,
          style,
          drawed
        }));
      },

      getWaveShapes() {
        const {
          mergedConfig,
          renderer,
          mergeOffset
        } = this;
        const {
          waveNum,
          waveHeight,
          data
        } = mergedConfig;
        const [w, h] = renderer.area;
        const pointsNum = waveNum * 4 + 4;
        const pointXGap = w / waveNum / 2;
        return data.map(v => {
          let points = new Array(pointsNum).fill(0).map((foo, j) => {
            const x = w - pointXGap * j;
            const startY = (1 - v / 100) * h;
            const y = j % 2 === 0 ? startY : startY - waveHeight;
            return [x, y];
          });
          points = points.map(p => mergeOffset(p, [pointXGap * 2, 0]));
          return {
            points
          };
        });
      },

      mergeOffset([x, y], [ox, oy]) {
        return [x + ox, y + oy];
      },

      getWaveStyle() {
        const {
          renderer,
          mergedConfig
        } = this;
        const h = renderer.area[1];
        return {
          gradientColor: mergedConfig.colors,
          gradientType: 'linear',
          gradientParams: [0, 0, 0, h],
          gradientWith: 'fill',
          opacity: mergedConfig.waveOpacity,
          translate: [0, 0]
        };
      },

      drawed({
        shape: {
          points
        }
      }, {
        ctx,
        area
      }) {
        const firstPoint = points[0];
        const lastPoint = points.slice(-1)[0];
        const h = area[1];
        ctx.lineTo(lastPoint[0], h);
        ctx.lineTo(firstPoint[0], h);
        ctx.closePath();
        ctx.fill();
      },

      async animationWave(repeat = 1) {
        const {
          waves,
          renderer,
          animation
        } = this;
        if (animation) return;
        this.animation = true;
        const w = renderer.area[0];
        waves.forEach(graph => {
          graph.attr('style', {
            translate: [0, 0]
          });
          graph.animation('style', {
            translate: [w, 0]
          }, true);
        });
        await renderer.launchAnimation();
        this.animation = false;
        if (!renderer.graphs.length) return;
        this.animationWave(repeat + 1);
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    },

    beforeDestroy() {
      const {
        renderer
      } = this;
      renderer.delAllGraph();
      this.waves = [];
    }

  };

  /* script */
  const __vue_script__$v = script$v;

  /* template */
  var __vue_render__$v = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "dv-water-pond-level" }, [
      _vm.renderer
        ? _c("svg", [
            _c(
              "defs",
              [
                _c(
                  "linearGradient",
                  {
                    attrs: {
                      id: _vm.gradientId,
                      x1: "0%",
                      y1: "0%",
                      x2: "0%",
                      y2: "100%"
                    }
                  },
                  _vm._l(_vm.svgBorderGradient, function(lc) {
                    return _c("stop", {
                      key: lc[0],
                      attrs: { offset: lc[0], "stop-color": lc[1] }
                    })
                  }),
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _vm.renderer
              ? _c(
                  "text",
                  {
                    attrs: {
                      stroke: "url(#" + _vm.gradientId + ")",
                      fill: "url(#" + _vm.gradientId + ")",
                      x: _vm.renderer.area[0] / 2 + 8,
                      y: _vm.renderer.area[1] / 2 + 8
                    }
                  },
                  [_vm._v("\n      " + _vm._s(_vm.details) + "\n    ")]
                )
              : _vm._e(),
            _vm._v(" "),
            !_vm.shape || _vm.shape === "round"
              ? _c("ellipse", {
                  attrs: {
                    cx: _vm.renderer.area[0] / 2 + 8,
                    cy: _vm.renderer.area[1] / 2 + 8,
                    rx: _vm.renderer.area[0] / 2 + 5,
                    ry: _vm.renderer.area[1] / 2 + 5,
                    stroke: "url(#" + _vm.gradientId + ")"
                  }
                })
              : _c("rect", {
                  attrs: {
                    x: "2",
                    y: "2",
                    rx: _vm.shape === "roundRect" ? 10 : 0,
                    ry: _vm.shape === "roundRect" ? 10 : 0,
                    width: _vm.renderer.area[0] + 12,
                    height: _vm.renderer.area[1] + 12,
                    stroke: "url(#" + _vm.gradientId + ")"
                  }
                })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("canvas", {
        ref: "water-pond-level",
        style: "border-radius: " + _vm.radius + ";"
      })
    ])
  };
  var __vue_staticRenderFns__$v = [];
  __vue_render__$v._withStripped = true;

    /* style */
    const __vue_inject_styles__$v = function (inject) {
      if (!inject) return
      inject("data-v-e355b98a_0", { source: ".dv-water-pond-level {\n  position: relative;\n}\n.dv-water-pond-level svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-water-pond-level text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n.dv-water-pond-level ellipse,\n.dv-water-pond-level rect {\n  fill: none;\n  stroke-width: 3;\n}\n.dv-water-pond-level canvas {\n  margin-top: 8px;\n  margin-left: 8px;\n  width: calc(100% - 16px);\n  height: calc(100% - 16px);\n  box-sizing: border-box;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,QAAQ;EACR,SAAS;AACX;AACA;EACE,eAAe;EACf,iBAAiB;EACjB,mBAAmB;EACnB,yBAAyB;AAC3B;AACA;;EAEE,UAAU;EACV,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,wBAAwB;EACxB,yBAAyB;EACzB,sBAAsB;AACxB","file":"main.vue","sourcesContent":[".dv-water-pond-level {\n  position: relative;\n}\n.dv-water-pond-level svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n}\n.dv-water-pond-level text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n.dv-water-pond-level ellipse,\n.dv-water-pond-level rect {\n  fill: none;\n  stroke-width: 3;\n}\n.dv-water-pond-level canvas {\n  margin-top: 8px;\n  margin-left: 8px;\n  width: calc(100% - 16px);\n  height: calc(100% - 16px);\n  box-sizing: border-box;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$v = undefined;
    /* module identifier */
    const __vue_module_identifier__$v = undefined;
    /* functional template */
    const __vue_is_functional_template__$v = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$v = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
      __vue_inject_styles__$v,
      __vue_script__$v,
      __vue_scope_id__$v,
      __vue_is_functional_template__$v,
      __vue_module_identifier__$v,
      false,
      createInjector,
      undefined,
      undefined
    );

  function waterLevelPond (Vue) {
    Vue.component(__vue_component__$v.name, __vue_component__$v);
  }

  //
  var script$w = {
    name: 'DvPercentPond',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      const id = uuid();
      return {
        gradientId1: `percent-pond-gradientId1-${id}`,
        gradientId2: `percent-pond-gradientId2-${id}`,
        width: 0,
        height: 0,
        defaultConfig: {
          /**
           * @description Value
           * @type {Number}
           * @default value = 0
           */
          value: 0,

          /**
           * @description Colors (hex|rgb|rgba|color keywords)
           * @type {Array<String>}
           * @default colors = ['#00BAFF', '#3DE7C9']
           * @example colors = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
           */
          colors: ['#3DE7C9', '#00BAFF'],

          /**
           * @description Border width
           * @type {Number}
           * @default borderWidth = 3
           */
          borderWidth: 3,

          /**
           * @description Gap between border and pond
           * @type {Number}
           * @default borderGap = 3
           */
          borderGap: 3,

          /**
           * @description Line dash
           * @type {Array<Number>}
           * @default lineDash = [5, 1]
           */
          lineDash: [5, 1],

          /**
           * @description Text color
           * @type {String}
           * @default textColor = '#fff'
           */
          textColor: '#fff',

          /**
           * @description Border radius
           * @type {Number}
           * @default borderRadius = 5
           */
          borderRadius: 5,

          /**
           * @description Local Gradient
           * @type {Boolean}
           * @default localGradient = false
           * @example localGradient = false | true
           */
          localGradient: false,

          /**
           * @description Formatter
           * @type {String}
           * @default formatter = '{value}%'
           */
          formatter: '{value}%'
        },
        mergedConfig: null
      };
    },

    computed: {
      rectWidth() {
        const {
          mergedConfig,
          width
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth
        } = mergedConfig;
        return width - borderWidth;
      },

      rectHeight() {
        const {
          mergedConfig,
          height
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth
        } = mergedConfig;
        return height - borderWidth;
      },

      points() {
        const {
          mergedConfig,
          width,
          height
        } = this;
        const halfHeight = height / 2;
        if (!mergedConfig) return `0, ${halfHeight} 0, ${halfHeight}`;
        const {
          borderWidth,
          borderGap,
          value
        } = mergedConfig;
        const polylineLength = (width - (borderWidth + borderGap) * 2) / 100 * value;
        return `
        ${borderWidth + borderGap}, ${halfHeight}
        ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
      `;
      },

      polylineWidth() {
        const {
          mergedConfig,
          height
        } = this;
        if (!mergedConfig) return 0;
        const {
          borderWidth,
          borderGap
        } = mergedConfig;
        return height - (borderWidth + borderGap) * 2;
      },

      linearGradient() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return [];
        const {
          colors
        } = mergedConfig;
        const colorNum = colors.length;
        const colorOffsetGap = 100 / (colorNum - 1);
        return colors.map((c, i) => [colorOffsetGap * i, c]);
      },

      polylineGradient() {
        const {
          gradientId1,
          gradientId2,
          mergedConfig
        } = this;
        if (!mergedConfig) return gradientId2;
        if (mergedConfig.localGradient) return gradientId1;
        return gradientId2;
      },

      gradient2XPos() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '100%';
        const {
          value
        } = mergedConfig;
        return `${200 - value}%`;
      },

      details() {
        const {
          mergedConfig
        } = this;
        if (!mergedConfig) return '';
        const {
          value,
          formatter
        } = mergedConfig;
        return formatter.replace('{value}', value);
      }

    },
    watch: {
      config() {
        const {
          mergeConfig
        } = this;
        mergeConfig();
      }

    },
    methods: {
      async init() {
        const {
          initWH,
          config,
          mergeConfig
        } = this;
        await initWH();
        if (!config) return;
        mergeConfig();
      },

      async initWH() {
        const {
          $nextTick,
          $refs
        } = this;
        await $nextTick();
        const {
          clientWidth,
          clientHeight
        } = $refs['percent-pond'];
        this.width = clientWidth;
        this.height = clientHeight;
      },

      mergeConfig() {
        const {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      }

    },

    mounted() {
      const {
        init
      } = this;
      init();
    }

  };

  /* script */
  const __vue_script__$w = script$w;

  /* template */
  var __vue_render__$w = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "percent-pond", staticClass: "dv-percent-pond" }, [
      _c("svg", [
        _c(
          "defs",
          [
            _c(
              "linearGradient",
              {
                attrs: {
                  id: _vm.gradientId1,
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%"
                }
              },
              _vm._l(_vm.linearGradient, function(lc) {
                return _c("stop", {
                  key: lc[0],
                  attrs: { offset: lc[0] + "%", "stop-color": lc[1] }
                })
              }),
              1
            ),
            _vm._v(" "),
            _c(
              "linearGradient",
              {
                attrs: {
                  id: _vm.gradientId2,
                  x1: "0%",
                  y1: "0%",
                  x2: _vm.gradient2XPos,
                  y2: "0%"
                }
              },
              _vm._l(_vm.linearGradient, function(lc) {
                return _c("stop", {
                  key: lc[0],
                  attrs: { offset: lc[0] + "%", "stop-color": lc[1] }
                })
              }),
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c("rect", {
          attrs: {
            x: _vm.mergedConfig ? _vm.mergedConfig.borderWidth / 2 : "0",
            y: _vm.mergedConfig ? _vm.mergedConfig.borderWidth / 2 : "0",
            rx: _vm.mergedConfig ? _vm.mergedConfig.borderRadius : "0",
            ry: _vm.mergedConfig ? _vm.mergedConfig.borderRadius : "0",
            fill: "transparent",
            "stroke-width": _vm.mergedConfig ? _vm.mergedConfig.borderWidth : "0",
            stroke: "url(#" + _vm.gradientId1 + ")",
            width: _vm.rectWidth > 0 ? _vm.rectWidth : 0,
            height: _vm.rectHeight > 0 ? _vm.rectHeight : 0
          }
        }),
        _vm._v(" "),
        _c("polyline", {
          attrs: {
            "stroke-width": _vm.polylineWidth,
            "stroke-dasharray": _vm.mergedConfig
              ? _vm.mergedConfig.lineDash.join(",")
              : "0",
            stroke: "url(#" + _vm.polylineGradient + ")",
            points: _vm.points
          }
        }),
        _vm._v(" "),
        _c(
          "text",
          {
            attrs: {
              stroke: _vm.mergedConfig ? _vm.mergedConfig.textColor : "#fff",
              fill: _vm.mergedConfig ? _vm.mergedConfig.textColor : "#fff",
              x: _vm.width / 2,
              y: _vm.height / 2
            }
          },
          [_vm._v("\n      " + _vm._s(_vm.details) + "\n    ")]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$w = [];
  __vue_render__$w._withStripped = true;

    /* style */
    const __vue_inject_styles__$w = function (inject) {
      if (!inject) return
      inject("data-v-bedbda80_0", { source: ".dv-percent-pond {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.dv-percent-pond svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-percent-pond polyline {\n  transition: all 0.3s;\n}\n.dv-percent-pond text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,WAAW;EACX,YAAY;AACd;AACA;EACE,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,iBAAiB;EACjB,mBAAmB;EACnB,yBAAyB;AAC3B","file":"main.vue","sourcesContent":[".dv-percent-pond {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.dv-percent-pond svg {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n}\n.dv-percent-pond polyline {\n  transition: all 0.3s;\n}\n.dv-percent-pond text {\n  font-size: 25px;\n  font-weight: bold;\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$w = undefined;
    /* module identifier */
    const __vue_module_identifier__$w = undefined;
    /* functional template */
    const __vue_is_functional_template__$w = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$w = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$w, staticRenderFns: __vue_staticRenderFns__$w },
      __vue_inject_styles__$w,
      __vue_script__$w,
      __vue_scope_id__$w,
      __vue_is_functional_template__$w,
      __vue_module_identifier__$w,
      false,
      createInjector,
      undefined,
      undefined
    );

  function percentPond (Vue) {
    Vue.component(__vue_component__$w.name, __vue_component__$w);
  }

  //
  var script$x = {
    name: 'DvFlylineChart',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      },
      dev: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'dv-flyline-chart',
        unique: Math.random(),
        maskId: `flyline-mask-id-${id}`,
        maskCircleId: `mask-circle-id-${id}`,
        gradientId: `gradient-id-${id}`,
        gradient2Id: `gradient2-id-${id}`,
        defaultConfig: {
          /**
           * @description Flyline chart center point
           * @type {Array<Number>}
           * @default centerPoint = [0, 0]
           */
          centerPoint: [0, 0],

          /**
           * @description Flyline start points
           * @type {Array<Array<Number>>}
           * @default points = []
           * @example points = [[10, 10], [100, 100]]
           */
          points: [],

          /**
           * @description Flyline width
           * @type {Number}
           * @default lineWidth = 1
           */
          lineWidth: 1,

          /**
           * @description Orbit color
           * @type {String}
           * @default orbitColor = 'rgba(103, 224, 227, .2)'
           */
          orbitColor: 'rgba(103, 224, 227, .2)',

          /**
           * @description Flyline color
           * @type {String}
           * @default orbitColor = '#ffde93'
           */
          flylineColor: '#ffde93',

          /**
           * @description K value
           * @type {Number}
           * @default k = -0.5
           * @example k = -1 ~ 1
           */
          k: -0.5,

          /**
           * @description Flyline curvature
           * @type {Number}
           * @default curvature = 5
           */
          curvature: 5,

          /**
           * @description Flyline radius
           * @type {Number}
           * @default flylineRadius = 100
           */
          flylineRadius: 100,

          /**
           * @description Flyline animation duration
           * @type {Array<Number>}
           * @default duration = [20, 30]
           */
          duration: [20, 30],

          /**
           * @description Relative points position
           * @type {Boolean}
           * @default relative = true
           */
          relative: true,

          /**
           * @description Back ground image url
           * @type {String}
           * @default bgImgUrl = ''
           * @example bgImgUrl = './img/bg.jpg'
           */
          bgImgUrl: '',

          /**
           * @description Text configuration
           * @type {Object}
           */
          text: {
            /**
             * @description Text offset
             * @type {Array<Number>}
             * @default offset = [0, 15]
             */
            offset: [0, 15],

            /**
             * @description Text color
             * @type {String}
             * @default color = '#ffdb5c'
             */
            color: '#ffdb5c',

            /**
             * @description Text font size
             * @type {Number}
             * @default fontSize = 12
             */
            fontSize: 12
          },

          /**
           * @description Halo configuration
           * @type {Object}
           */
          halo: {
            /**
             * @description Weather to show halo
             * @type {Boolean}
             * @default show = true
             * @example show = true | false
             */
            show: true,

            /**
             * @description Halo animation duration (10 = 1s)
             * @type {Number}
             * @default duration = 30
             */
            duration: 30,

            /**
             * @description Halo color
             * @type {String}
             * @default color = '#fb7293'
             */
            color: '#fb7293',

            /**
             * @description Halo max radius
             * @type {Number}
             * @default radius = 120
             */
            radius: 120
          },

          /**
           * @description Center point img configuration
           * @type {Object}
           */
          centerPointImg: {
            /**
             * @description Center point img width
             * @type {Number}
             * @default width = 40
             */
            width: 40,

            /**
             * @description Center point img height
             * @type {Number}
             * @default height = 40
             */
            height: 40,

            /**
             * @description Center point img url
             * @type {String}
             * @default url = ''
             */
            url: ''
          },

          /**
           * @description Points img configuration
           * @type {Object}
           * @default radius = 120
           */
          pointsImg: {
            /**
             * @description Points img width
             * @type {Number}
             * @default width = 15
             */
            width: 15,

            /**
             * @description Points img height
             * @type {Number}
             * @default height = 15
             */
            height: 15,

            /**
             * @description Points img url
             * @type {String}
             * @default url = ''
             */
            url: ''
          }
        },
        mergedConfig: null,
        paths: [],
        lengths: [],
        times: [],
        texts: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          calcData
        } = this;
        calcData();
      },

      async calcData() {
        const {
          mergeConfig,
          createFlylinePaths,
          calcLineLengths
        } = this;
        mergeConfig();
        createFlylinePaths();
        await calcLineLengths();
        const {
          calcTimes,
          calcTexts
        } = this;
        calcTimes();
        calcTexts();
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        const mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
        const {
          points
        } = mergedConfig;
        mergedConfig.points = points.map(item => {
          if (item instanceof Array) {
            return {
              position: item,
              text: ''
            };
          }

          return item;
        });
        this.mergedConfig = mergedConfig;
      },

      createFlylinePaths() {
        const {
          getPath,
          mergedConfig,
          width,
          height
        } = this;
        let {
          centerPoint,
          points,
          relative
        } = mergedConfig;
        points = points.map(({
          position
        }) => position);

        if (relative) {
          centerPoint = [width * centerPoint[0], height * centerPoint[1]];
          points = points.map(([x, y]) => [width * x, height * y]);
        }

        this.paths = points.map(point => getPath(centerPoint, point));
      },

      getPath(center, point) {
        const {
          getControlPoint
        } = this;
        const controlPoint = getControlPoint(center, point);
        return [point, controlPoint, center];
      },

      getControlPoint([sx, sy], [ex, ey]) {
        const {
          getKLinePointByx,
          mergedConfig
        } = this;
        const {
          curvature,
          k
        } = mergedConfig;
        const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2];
        const distance = getPointDistance([sx, sy], [ex, ey]);
        const targetLength = distance / curvature;
        const disDived = targetLength / 2;
        let [dx, dy] = [mx, my];

        do {
          dx += disDived;
          dy = getKLinePointByx(k, [mx, my], dx)[1];
        } while (getPointDistance([mx, my], [dx, dy]) < targetLength);

        return [dx, dy];
      },

      getKLinePointByx(k, [lx, ly], x) {
        const y = ly - k * lx + k * x;
        return [x, y];
      },

      async calcLineLengths() {
        const {
          $nextTick,
          paths,
          $refs
        } = this;
        await $nextTick();
        this.lengths = paths.map((foo, i) => $refs[`path${i}`][0].getTotalLength());
      },

      calcTimes() {
        const {
          duration,
          points
        } = this.mergedConfig;
        this.times = points.map(foo => randomExtend(...duration) / 10);
      },

      calcTexts() {
        const {
          points
        } = this.mergedConfig;
        this.texts = points.map(({
          text
        }) => text);
      },

      consoleClickPos({
        offsetX,
        offsetY
      }) {
        const {
          width,
          height,
          dev
        } = this;
        if (!dev) return;
        const relativeX = (offsetX / width).toFixed(2);
        const relativeY = (offsetY / height).toFixed(2);
        console.warn(`dv-flyline-chart DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`);
      }

    }
  };

  /* script */
  const __vue_script__$x = script$x;

  /* template */
  var __vue_render__$x = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: "dv-flyline-chart",
        staticClass: "dv-flyline-chart",
        style:
          "background-image: url(" +
          (_vm.mergedConfig ? _vm.mergedConfig.bgImgUrl : "") +
          ")",
        on: { click: _vm.consoleClickPos }
      },
      [
        _vm.mergedConfig
          ? _c(
              "svg",
              { attrs: { width: _vm.width, height: _vm.height } },
              [
                _c(
                  "defs",
                  [
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.gradientId,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.gradient2Id,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _vm.paths[0]
                      ? _c(
                          "circle",
                          {
                            attrs: {
                              id: "circle" + _vm.paths[0].toString(),
                              cx: _vm.paths[0][2][0],
                              cy: _vm.paths[0][2][1]
                            }
                          },
                          [
                            _c("animate", {
                              attrs: {
                                attributeName: "r",
                                values: "1;" + _vm.mergedConfig.halo.radius,
                                dur: _vm.mergedConfig.halo.duration / 10 + "s",
                                repeatCount: "indefinite"
                              }
                            }),
                            _vm._v(" "),
                            _c("animate", {
                              attrs: {
                                attributeName: "opacity",
                                values: "1;0",
                                dur: _vm.mergedConfig.halo.duration / 10 + "s",
                                repeatCount: "indefinite"
                              }
                            })
                          ]
                        )
                      : _vm._e()
                  ],
                  1
                ),
                _vm._v(" "),
                _vm.paths[0]
                  ? _c("image", {
                      attrs: {
                        "xlink:href": _vm.mergedConfig.centerPointImg.url,
                        width: _vm.mergedConfig.centerPointImg.width,
                        height: _vm.mergedConfig.centerPointImg.height,
                        x:
                          _vm.paths[0][2][0] -
                          _vm.mergedConfig.centerPointImg.width / 2,
                        y:
                          _vm.paths[0][2][1] -
                          _vm.mergedConfig.centerPointImg.height / 2
                      }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "mask",
                  { attrs: { id: "maskhalo" + _vm.paths[0].toString() } },
                  [
                    _vm.paths[0]
                      ? _c("use", {
                          attrs: {
                            "xlink:href": "#circle" + _vm.paths[0].toString(),
                            fill: "url(#" + _vm.gradient2Id + ")"
                          }
                        })
                      : _vm._e()
                  ]
                ),
                _vm._v(" "),
                _vm.paths[0] && _vm.mergedConfig.halo.show
                  ? _c("use", {
                      attrs: {
                        "xlink:href": "#circle" + _vm.paths[0].toString(),
                        fill: _vm.mergedConfig.halo.color,
                        mask: "url(#maskhalo" + _vm.paths[0].toString() + ")"
                      }
                    })
                  : _vm._e(),
                _vm._v(" "),
                _vm._l(_vm.paths, function(path, i) {
                  return _c("g", { key: i }, [
                    _c("defs", [
                      _c("path", {
                        ref: "path" + i,
                        refInFor: true,
                        attrs: {
                          id: "path" + path.toString(),
                          d:
                            "M" +
                            path[0].toString() +
                            " Q" +
                            path[1].toString() +
                            " " +
                            path[2].toString(),
                          fill: "transparent"
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("use", {
                      attrs: {
                        "xlink:href": "#path" + path.toString(),
                        "stroke-width": _vm.mergedConfig.lineWidth,
                        stroke: _vm.mergedConfig.orbitColor
                      }
                    }),
                    _vm._v(" "),
                    _vm.lengths[i]
                      ? _c(
                          "use",
                          {
                            attrs: {
                              "xlink:href": "#path" + path.toString(),
                              "stroke-width": _vm.mergedConfig.lineWidth,
                              stroke: _vm.mergedConfig.flylineColor,
                              mask:
                                "url(#mask" + _vm.unique + path.toString() + ")"
                            }
                          },
                          [
                            _c("animate", {
                              attrs: {
                                attributeName: "stroke-dasharray",
                                from: "0, " + _vm.lengths[i],
                                to: _vm.lengths[i] + ", 0",
                                dur: _vm.times[i] || 0,
                                repeatCount: "indefinite"
                              }
                            })
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _c(
                      "mask",
                      { attrs: { id: "mask" + _vm.unique + path.toString() } },
                      [
                        _c(
                          "circle",
                          {
                            attrs: {
                              cx: "0",
                              cy: "0",
                              r: _vm.mergedConfig.flylineRadius,
                              fill: "url(#" + _vm.gradientId + ")"
                            }
                          },
                          [
                            _c("animateMotion", {
                              attrs: {
                                dur: _vm.times[i] || 0,
                                path:
                                  "M" +
                                  path[0].toString() +
                                  " Q" +
                                  path[1].toString() +
                                  " " +
                                  path[2].toString(),
                                rotate: "auto",
                                repeatCount: "indefinite"
                              }
                            })
                          ],
                          1
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c("image", {
                      attrs: {
                        "xlink:href": _vm.mergedConfig.pointsImg.url,
                        width: _vm.mergedConfig.pointsImg.width,
                        height: _vm.mergedConfig.pointsImg.height,
                        x: path[0][0] - _vm.mergedConfig.pointsImg.width / 2,
                        y: path[0][1] - _vm.mergedConfig.pointsImg.height / 2
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "text",
                      {
                        style:
                          "fontSize:" + _vm.mergedConfig.text.fontSize + "px;",
                        attrs: {
                          fill: _vm.mergedConfig.text.color,
                          x: path[0][0] + _vm.mergedConfig.text.offset[0],
                          y: path[0][1] + _vm.mergedConfig.text.offset[1]
                        }
                      },
                      [_vm._v("\n        " + _vm._s(_vm.texts[i]) + "\n      ")]
                    )
                  ])
                })
              ],
              2
            )
          : _vm._e()
      ]
    )
  };
  var __vue_staticRenderFns__$x = [];
  __vue_render__$x._withStripped = true;

    /* style */
    const __vue_inject_styles__$x = function (inject) {
      if (!inject) return
      inject("data-v-0d5cd4f5_0", { source: ".dv-flyline-chart {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart polyline {\n  transition: all 0.3s;\n}\n.dv-flyline-chart text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,0BAA0B;AAC5B;AACA;EACE,oBAAoB;AACtB;AACA;EACE,mBAAmB;EACnB,yBAAyB;AAC3B","file":"main.vue","sourcesContent":[".dv-flyline-chart {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart polyline {\n  transition: all 0.3s;\n}\n.dv-flyline-chart text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$x = undefined;
    /* module identifier */
    const __vue_module_identifier__$x = undefined;
    /* functional template */
    const __vue_is_functional_template__$x = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$x = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$x, staticRenderFns: __vue_staticRenderFns__$x },
      __vue_inject_styles__$x,
      __vue_script__$x,
      __vue_scope_id__$x,
      __vue_is_functional_template__$x,
      __vue_module_identifier__$x,
      false,
      createInjector,
      undefined,
      undefined
    );

  function flylineChart (Vue) {
    Vue.component(__vue_component__$x.name, __vue_component__$x);
  }

  //
  var script$y = {
    name: 'DvFlylineChartEnhanced',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      },
      dev: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const id = uuid();
      return {
        ref: 'dv-flyline-chart-enhanced',
        unique: Math.random(),
        flylineGradientId: `flyline-gradient-id-${id}`,
        haloGradientId: `halo-gradient-id-${id}`,

        /**
         * @description Type Declaration
         * 
         * interface Halo {
         *    show?: boolean
         *    duration?: [number, number]
         *    color?: string
         *    radius?: number
         * }
         * 
         * interface Text {
         *    show?: boolean
         *    offset?: [number, number]
         *    color?: string
         *    fontSize?: number
         * }
         * 
         * interface Icon {
         *    show?: boolean
         *    src?: string
         *    width?: number
         *    height?: number
         * }
         * 
         * interface Point {
         *    name: string
         *    coordinate: [number, number]
         *    halo?: Halo
         *    text?: Text
         *    icon?: Icon
         * }
         * 
         * interface Line {
         *    width?: number
         *    color?: string
         *    orbitColor?: string
         *    duration?: [number, number]
         *    radius?: string
         * }
         * 
         * interface Flyline extends Line {
         *    source: string
         *    target: string
         * }
         * 
         * interface FlylineWithPath extends Flyline {
         *    d: string
         *    path: [[number, number], [number, number], [number, number]]
         *    key: string
         * }
         */
        defaultConfig: {
          /**
           * @description Flyline chart points
           * @type {Point[]}
           * @default points = []
           */
          points: [],

          /**
           * @description Lines
           * @type {Flyline[]}
           * @default lines = []
           */
          lines: [],

          /**
           * @description Global halo configuration
           * @type {Halo}
           */
          halo: {
            /**
             * @description Whether to show halo
             * @type {Boolean}
             * @default show = false
             */
            show: false,

            /**
             * @description Halo animation duration (1s = 10)
             * @type {[number, number]}
             */
            duration: [20, 30],

            /**
             * @description Halo color
             * @type {String}
             * @default color = '#fb7293'
             */
            color: '#fb7293',

            /**
             * @description Halo radius
             * @type {Number}
             * @default radius = 120
             */
            radius: 120
          },

          /**
           * @description Global text configuration
           * @type {Text}
           */
          text: {
            /**
             * @description Whether to show text
             * @type {Boolean}
             * @default show = false
             */
            show: false,

            /**
             * @description Text offset
             * @type {[number, number]}
             * @default offset = [0, 15]
             */
            offset: [0, 15],

            /**
             * @description Text color
             * @type {String}
             * @default color = '#ffdb5c'
             */
            color: '#ffdb5c',

            /**
             * @description Text font size
             * @type {Number}
             * @default fontSize = 12
             */
            fontSize: 12
          },

          /**
           * @description Global icon configuration
           * @type {Icon}
           */
          icon: {
            /**
             * @description Whether to show icon
             * @type {Boolean}
             * @default show = false
             */
            show: false,

            /**
             * @description Icon src
             * @type {String}
             * @default src = ''
             */
            src: '',

            /**
             * @description Icon width
             * @type {Number}
             * @default width = 15
             */
            width: 15,

            /**
             * @description Icon height
             * @type {Number}
             * @default width = 15
             */
            height: 15
          },

          /**
           * @description Global line configuration
           * @type {Line}
           */
          line: {
            /**
             * @description Line width
             * @type {Number}
             * @default width = 1
             */
            width: 1,

            /**
             * @description Flyline color
             * @type {String}
             * @default color = '#ffde93'
             */
            color: '#ffde93',

            /**
             * @description Orbit color
             * @type {String}
             * @default orbitColor = 'rgba(103, 224, 227, .2)'
             */
            orbitColor: 'rgba(103, 224, 227, .2)',

            /**
             * @description Flyline animation duration
             * @type {[number, number]}
             * @default duration = [20, 30]
             */
            duration: [20, 30],

            /**
             * @description Flyline radius
             * @type {Number}
             * @default radius = 100
             */
            radius: 100
          },

          /**
           * @description Back ground image url
           * @type {String}
           * @default bgImgSrc = ''
           */
          bgImgSrc: '',

          /**
           * @description K value
           * @type {Number}
           * @default k = -0.5
           * @example k = -1 ~ 1
           */
          k: -0.5,

          /**
           * @description Flyline curvature
           * @type {Number}
           * @default curvature = 5
           */
          curvature: 5,

          /**
           * @description Relative points position
           * @type {Boolean}
           * @default relative = true
           */
          relative: true
        },

        /**
         * @description Fly line data
         * @type {FlylineWithPath[]}
         * @default flylines = []
         */
        flylines: [],

        /**
         * @description Fly line lengths
         * @type {Number[]}
         * @default flylineLengths = []
         */
        flylineLengths: [],

        /**
         * @description Fly line points
         * @default flylinePoints = []
         */
        flylinePoints: [],
        mergedConfig: null
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          calcData
        } = this;
        calcData();
      },

      async calcData() {
        const {
          mergeConfig,
          calcflylinePoints,
          calcLinePaths
        } = this;
        mergeConfig();
        calcflylinePoints();
        calcLinePaths();
        const {
          calcLineLengths
        } = this;
        await calcLineLengths();
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        const mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
        const {
          points,
          lines,
          halo,
          text,
          icon,
          line
        } = mergedConfig;
        mergedConfig.points = points.map(item => {
          item.halo = index.deepMerge(util_1(halo, true), item.halo || {});
          item.text = index.deepMerge(util_1(text, true), item.text || {});
          item.icon = index.deepMerge(util_1(icon, true), item.icon || {});
          return item;
        });
        mergedConfig.lines = lines.map(item => {
          return index.deepMerge(util_1(line, true), item);
        });
        this.mergedConfig = mergedConfig;
      },

      calcflylinePoints() {
        const {
          mergedConfig,
          width,
          height
        } = this;
        const {
          relative,
          points
        } = mergedConfig;
        this.flylinePoints = points.map((item, i) => {
          const {
            coordinate: [x, y],
            halo,
            icon,
            text
          } = item;
          if (relative) item.coordinate = [x * width, y * height];
          item.halo.time = randomExtend(...halo.duration) / 10;
          const {
            width: iw,
            height: ih
          } = icon;
          item.icon.x = item.coordinate[0] - iw / 2;
          item.icon.y = item.coordinate[1] - ih / 2;
          const [ox, oy] = text.offset;
          item.text.x = item.coordinate[0] + ox;
          item.text.y = item.coordinate[1] + oy;
          item.key = `${item.coordinate.toString()}${i}`;
          return item;
        });
      },

      calcLinePaths() {
        const {
          getPath,
          mergedConfig
        } = this;
        const {
          points,
          lines
        } = mergedConfig;
        this.flylines = lines.map(item => {
          const {
            source,
            target,
            duration
          } = item;
          const sourcePoint = points.find(({
            name
          }) => name === source).coordinate;
          const targetPoint = points.find(({
            name
          }) => name === target).coordinate;
          const path = getPath(sourcePoint, targetPoint).map(item => item.map(v => parseFloat(v.toFixed(10))));
          const d = `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`;
          const key = `path${path.toString()}`;
          const time = randomExtend(...duration) / 10;
          return { ...item,
            path,
            key,
            d,
            time
          };
        });
      },

      getPath(start, end) {
        const {
          getControlPoint
        } = this;
        const controlPoint = getControlPoint(start, end);
        return [start, controlPoint, end];
      },

      getControlPoint([sx, sy], [ex, ey]) {
        const {
          getKLinePointByx,
          mergedConfig
        } = this;
        const {
          curvature,
          k
        } = mergedConfig;
        const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2];
        const distance = getPointDistance([sx, sy], [ex, ey]);
        const targetLength = distance / curvature;
        const disDived = targetLength / 2;
        let [dx, dy] = [mx, my];

        do {
          dx += disDived;
          dy = getKLinePointByx(k, [mx, my], dx)[1];
        } while (getPointDistance([mx, my], [dx, dy]) < targetLength);

        return [dx, dy];
      },

      getKLinePointByx(k, [lx, ly], x) {
        const y = ly - k * lx + k * x;
        return [x, y];
      },

      async calcLineLengths() {
        const {
          $nextTick,
          flylines,
          $refs
        } = this;
        await $nextTick();
        this.flylineLengths = flylines.map(({
          key
        }) => $refs[key][0].getTotalLength());
      },

      consoleClickPos({
        offsetX,
        offsetY
      }) {
        const {
          width,
          height,
          dev
        } = this;
        if (!dev) return;
        const relativeX = (offsetX / width).toFixed(2);
        const relativeY = (offsetY / height).toFixed(2);
        console.warn(`dv-flyline-chart-enhanced DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`);
      }

    }
  };

  /* script */
  const __vue_script__$y = script$y;

  /* template */
  var __vue_render__$y = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: _vm.ref,
        staticClass: "dv-flyline-chart-enhanced",
        style:
          "background-image: url(" +
          (_vm.mergedConfig ? _vm.mergedConfig.bgImgSrc : "") +
          ")",
        on: { click: _vm.consoleClickPos }
      },
      [
        _vm.flylines.length
          ? _c(
              "svg",
              { attrs: { width: _vm.width, height: _vm.height } },
              [
                _c(
                  "defs",
                  [
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.flylineGradientId,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "radialGradient",
                      {
                        attrs: {
                          id: _vm.haloGradientId,
                          cx: "50%",
                          cy: "50%",
                          r: "50%"
                        }
                      },
                      [
                        _c("stop", {
                          attrs: {
                            offset: "0%",
                            "stop-color": "#fff",
                            "stop-opacity": "0"
                          }
                        }),
                        _vm._v(" "),
                        _c("stop", {
                          attrs: {
                            offset: "100%",
                            "stop-color": "#fff",
                            "stop-opacity": "1"
                          }
                        })
                      ],
                      1
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _vm._l(_vm.flylinePoints, function(point) {
                  return _c("g", { key: point.key + Math.random() }, [
                    _c("defs", [
                      point.halo.show
                        ? _c(
                            "circle",
                            {
                              attrs: {
                                id: "halo" + _vm.unique + point.key,
                                cx: point.coordinate[0],
                                cy: point.coordinate[1]
                              }
                            },
                            [
                              _c("animate", {
                                attrs: {
                                  attributeName: "r",
                                  values: "1;" + point.halo.radius,
                                  dur: point.halo.time + "s",
                                  repeatCount: "indefinite"
                                }
                              }),
                              _vm._v(" "),
                              _c("animate", {
                                attrs: {
                                  attributeName: "opacity",
                                  values: "1;0",
                                  dur: point.halo.time + "s",
                                  repeatCount: "indefinite"
                                }
                              })
                            ]
                          )
                        : _vm._e()
                    ]),
                    _vm._v(" "),
                    _c(
                      "mask",
                      { attrs: { id: "mask" + _vm.unique + point.key } },
                      [
                        point.halo.show
                          ? _c("use", {
                              attrs: {
                                "xlink:href": "#halo" + _vm.unique + point.key,
                                fill: "url(#" + _vm.haloGradientId + ")"
                              }
                            })
                          : _vm._e()
                      ]
                    ),
                    _vm._v(" "),
                    point.halo.show
                      ? _c("use", {
                          attrs: {
                            "xlink:href": "#halo" + _vm.unique + point.key,
                            fill: point.halo.color,
                            mask: "url(#mask" + _vm.unique + point.key + ")"
                          }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    point.icon.show
                      ? _c("image", {
                          attrs: {
                            "xlink:href": point.icon.src,
                            width: point.icon.width,
                            height: point.icon.height,
                            x: point.icon.x,
                            y: point.icon.y
                          }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    point.text.show
                      ? _c(
                          "text",
                          {
                            style:
                              "fontSize:" +
                              point.text.fontSize +
                              "px;color:" +
                              point.text.color,
                            attrs: {
                              fill: point.text.color,
                              x: point.text.x,
                              y: point.text.y
                            }
                          },
                          [_vm._v("\n        " + _vm._s(point.name) + "\n      ")]
                        )
                      : _vm._e()
                  ])
                }),
                _vm._v(" "),
                _vm._l(_vm.flylines, function(line, i) {
                  return _c("g", { key: line.key + Math.random() }, [
                    _c("defs", [
                      _c("path", {
                        ref: line.key,
                        refInFor: true,
                        attrs: { id: line.key, d: line.d, fill: "transparent" }
                      })
                    ]),
                    _vm._v(" "),
                    _c("use", {
                      attrs: {
                        "xlink:href": "#" + line.key,
                        "stroke-width": line.width,
                        stroke: line.orbitColor
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "mask",
                      { attrs: { id: "mask" + _vm.unique + line.key } },
                      [
                        _c(
                          "circle",
                          {
                            attrs: {
                              cx: "0",
                              cy: "0",
                              r: line.radius,
                              fill: "url(#" + _vm.flylineGradientId + ")"
                            }
                          },
                          [
                            _c("animateMotion", {
                              attrs: {
                                dur: line.time,
                                path: line.d,
                                rotate: "auto",
                                repeatCount: "indefinite"
                              }
                            })
                          ],
                          1
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _vm.flylineLengths[i]
                      ? _c(
                          "use",
                          {
                            attrs: {
                              "xlink:href": "#" + line.key,
                              "stroke-width": line.width,
                              stroke: line.color,
                              mask: "url(#mask" + _vm.unique + line.key + ")"
                            }
                          },
                          [
                            _c("animate", {
                              attrs: {
                                attributeName: "stroke-dasharray",
                                from: "0, " + _vm.flylineLengths[i],
                                to: _vm.flylineLengths[i] + ", 0",
                                dur: line.time,
                                repeatCount: "indefinite"
                              }
                            })
                          ]
                        )
                      : _vm._e()
                  ])
                })
              ],
              2
            )
          : _vm._e()
      ]
    )
  };
  var __vue_staticRenderFns__$y = [];
  __vue_render__$y._withStripped = true;

    /* style */
    const __vue_inject_styles__$y = function (inject) {
      if (!inject) return
      inject("data-v-36f66986_0", { source: ".dv-flyline-chart-enhanced {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart-enhanced text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,0BAA0B;AAC5B;AACA;EACE,mBAAmB;EACnB,yBAAyB;AAC3B","file":"main.vue","sourcesContent":[".dv-flyline-chart-enhanced {\n  display: flex;\n  flex-direction: column;\n  background-size: 100% 100%;\n}\n.dv-flyline-chart-enhanced text {\n  text-anchor: middle;\n  dominant-baseline: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$y = undefined;
    /* module identifier */
    const __vue_module_identifier__$y = undefined;
    /* functional template */
    const __vue_is_functional_template__$y = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$y = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$y, staticRenderFns: __vue_staticRenderFns__$y },
      __vue_inject_styles__$y,
      __vue_script__$y,
      __vue_scope_id__$y,
      __vue_is_functional_template__$y,
      __vue_module_identifier__$y,
      false,
      createInjector,
      undefined,
      undefined
    );

  function flylineChartEnhanced (Vue) {
    Vue.component(__vue_component__$y.name, __vue_component__$y);
  }

  //
  var script$z = {
    name: 'DvConicalColumnChart',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'conical-column-chart',
        defaultConfig: {
          /**
           * @description Chart data
           * @type {Array<Object>}
           * @default data = []
           */
          data: [],

          /**
           * @description Chart img
           * @type {Array<String>}
           * @default img = []
           */
          img: [],

          /**
           * @description Chart font size
           * @type {Number}
           * @default fontSize = 12
           */
          fontSize: 12,

          /**
           * @description Img side length
           * @type {Number}
           * @default imgSideLength = 30
           */
          imgSideLength: 30,

          /**
           * @description Column color
           * @type {String}
           * @default columnColor = 'rgba(0, 194, 255, 0.4)'
           */
          columnColor: 'rgba(0, 194, 255, 0.4)',

          /**
           * @description Text color
           * @type {String}
           * @default textColor = '#fff'
           */
          textColor: '#fff',

          /**
           * @description Show value
           * @type {Boolean}
           * @default showValue = false
           */
          showValue: false
        },
        mergedConfig: null,
        column: []
      };
    },

    watch: {
      config() {
        const {
          calcData
        } = this;
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          calcData
        } = this;
        calcData();
      },

      calcData() {
        const {
          mergeConfig,
          initData,
          calcSVGPath
        } = this;
        mergeConfig();
        initData();
        calcSVGPath();
      },

      mergeConfig() {
        const {
          defaultConfig,
          config
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      initData() {
        const {
          mergedConfig
        } = this;
        let {
          data
        } = mergedConfig;
        data = util_1(data, true);
        data.sort(({
          value: a
        }, {
          value: b
        }) => {
          if (a > b) return -1;
          if (a < b) return 1;
          if (a === b) return 0;
        });
        const max = data[0] ? data[0].value : 10;
        data = data.map(item => ({ ...item,
          percent: item.value / max
        }));
        mergedConfig.data = data;
      },

      calcSVGPath() {
        const {
          mergedConfig,
          width,
          height
        } = this;
        const {
          imgSideLength,
          fontSize,
          data
        } = mergedConfig;
        const itemNum = data.length;
        const gap = width / (itemNum + 1);
        const useAbleHeight = height - imgSideLength - fontSize - 5;
        const svgBottom = height - fontSize - 5;
        this.column = data.map((item, i) => {
          const {
            percent
          } = item;
          const middleXPos = gap * (i + 1);
          const leftXPos = gap * i;
          const rightXpos = gap * (i + 2);
          const middleYPos = svgBottom - useAbleHeight * percent;
          const controlYPos = useAbleHeight * percent * 0.6 + middleYPos;
          const d = `
          M${leftXPos}, ${svgBottom}
          Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
          M${middleXPos},${middleYPos}
          Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
          L${leftXPos}, ${svgBottom}
          Z
        `;
          const textY = (svgBottom + middleYPos) / 2 + fontSize / 2;
          return { ...item,
            d,
            x: middleXPos,
            y: middleYPos,
            textY
          };
        });
      }

    }
  };

  /* script */
  const __vue_script__$z = script$z;

  /* template */
  var __vue_render__$z = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-conical-column-chart" }, [
      _c(
        "svg",
        { attrs: { width: _vm.width, height: _vm.height } },
        _vm._l(_vm.column, function(item, i) {
          return _c("g", { key: i }, [
            _c("path", {
              attrs: { d: item.d, fill: _vm.mergedConfig.columnColor }
            }),
            _vm._v(" "),
            _c(
              "text",
              {
                style: "fontSize:" + _vm.mergedConfig.fontSize + "px",
                attrs: {
                  fill: _vm.mergedConfig.textColor,
                  x: item.x,
                  y: _vm.height - 4
                }
              },
              [_vm._v("\n        " + _vm._s(item.name) + "\n      ")]
            ),
            _vm._v(" "),
            _vm.mergedConfig.img.length
              ? _c("image", {
                  attrs: {
                    "xlink:href":
                      _vm.mergedConfig.img[i % _vm.mergedConfig.img.length],
                    width: _vm.mergedConfig.imgSideLength,
                    height: _vm.mergedConfig.imgSideLength,
                    x: item.x - _vm.mergedConfig.imgSideLength / 2,
                    y: item.y - _vm.mergedConfig.imgSideLength
                  }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.mergedConfig.showValue
              ? _c(
                  "text",
                  {
                    style: "fontSize:" + _vm.mergedConfig.fontSize + "px",
                    attrs: {
                      fill: _vm.mergedConfig.textColor,
                      x: item.x,
                      y: item.textY
                    }
                  },
                  [_vm._v("\n        " + _vm._s(item.value) + "\n      ")]
                )
              : _vm._e()
          ])
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$z = [];
  __vue_render__$z._withStripped = true;

    /* style */
    const __vue_inject_styles__$z = function (inject) {
      if (!inject) return
      inject("data-v-327f8464_0", { source: ".dv-conical-column-chart {\n  width: 100%;\n  height: 100%;\n}\n.dv-conical-column-chart text {\n  text-anchor: middle;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"main.vue","sourcesContent":[".dv-conical-column-chart {\n  width: 100%;\n  height: 100%;\n}\n.dv-conical-column-chart text {\n  text-anchor: middle;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$z = undefined;
    /* module identifier */
    const __vue_module_identifier__$z = undefined;
    /* functional template */
    const __vue_is_functional_template__$z = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$z = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$z, staticRenderFns: __vue_staticRenderFns__$z },
      __vue_inject_styles__$z,
      __vue_script__$z,
      __vue_scope_id__$z,
      __vue_is_functional_template__$z,
      __vue_module_identifier__$z,
      false,
      createInjector,
      undefined,
      undefined
    );

  function conicalColumnChart (Vue) {
    Vue.component(__vue_component__$z.name, __vue_component__$z);
  }

  function digitalFlop (Vue) {
    Vue.component(__vue_component__$s.name, __vue_component__$s);
  }

  //
  var script$A = {
    name: 'DvScrollBoard',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'scroll-board',
        defaultConfig: {
          /**
           * @description Board header
           * @type {Array<String>}
           * @default header = []
           * @example header = ['column1', 'column2', 'column3']
           */
          header: [],

          /**
           * @description Board data
           * @type {Array<Array>}
           * @default data = []
           */
          data: [],

          /**
           * @description Row num
           * @type {Number}
           * @default rowNum = 5
           */
          rowNum: 5,

          /**
           * @description Header background color
           * @type {String}
           * @default headerBGC = '#00BAFF'
           */
          headerBGC: '#00BAFF',

          /**
           * @description Odd row background color
           * @type {String}
           * @default oddRowBGC = '#003B51'
           */
          oddRowBGC: '#003B51',

          /**
           * @description Even row background color
           * @type {String}
           * @default evenRowBGC = '#003B51'
           */
          evenRowBGC: '#0A2732',

          /**
           * @description Scroll wait time
           * @type {Number}
           * @default waitTime = 2000
           */
          waitTime: 2000,

          /**
           * @description Header height
           * @type {Number}
           * @default headerHeight = 35
           */
          headerHeight: 35,

          /**
           * @description Column width
           * @type {Array<Number>}
           * @default columnWidth = []
           */
          columnWidth: [],

          /**
           * @description Column align
           * @type {Array<String>}
           * @default align = []
           * @example align = ['left', 'center', 'right']
           */
          align: [],

          /**
           * @description Show index
           * @type {Boolean}
           * @default index = false
           */
          index: false,

          /**
           * @description index Header
           * @type {String}
           * @default indexHeader = '#'
           */
          indexHeader: '#',

          /**
           * @description Carousel type
           * @type {String}
           * @default carousel = 'single'
           * @example carousel = 'single' | 'page'
           */
          carousel: 'single',

          /**
           * @description Pause scroll when mouse hovered
           * @type {Boolean}
           * @default hoverPause = true
           * @example hoverPause = true | false
           */
          hoverPause: true
        },
        mergedConfig: null,
        header: [],
        rowsData: [],
        rows: [],
        widths: [],
        heights: [],
        avgHeight: 0,
        aligns: [],
        animationIndex: 0,
        animationHandler: '',
        updater: 0,
        needCalc: false
      };
    },

    watch: {
      config() {
        const {
          stopAnimation,
          calcData
        } = this;
        stopAnimation();
        this.animationIndex = 0;
        calcData();
      }

    },
    methods: {
      handleHover(enter, ri, ci, row, ceil) {
        const {
          mergedConfig,
          emitEvent,
          stopAnimation,
          animation
        } = this;
        if (enter) emitEvent('mouseover', ri, ci, row, ceil);
        if (!mergedConfig.hoverPause) return;

        if (enter) {
          stopAnimation();
        } else {
          animation(true);
        }
      },

      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          mergedConfig,
          calcWidths,
          calcHeights
        } = this;
        if (!mergedConfig) return;
        calcWidths();
        calcHeights();
      },

      calcData() {
        const {
          mergeConfig,
          calcHeaderData,
          calcRowsData
        } = this;
        mergeConfig();
        calcHeaderData();
        calcRowsData();
        const {
          calcWidths,
          calcHeights,
          calcAligns
        } = this;
        calcWidths();
        calcHeights();
        calcAligns();
        const {
          animation
        } = this;
        animation(true);
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      calcHeaderData() {
        let {
          header,
          index,
          indexHeader
        } = this.mergedConfig;

        if (!header.length) {
          this.header = [];
          return;
        }

        header = [...header];
        if (index) header.unshift(indexHeader);
        this.header = header;
      },

      calcRowsData() {
        let {
          data,
          index,
          headerBGC,
          rowNum
        } = this.mergedConfig;

        if (index) {
          data = data.map((row, i) => {
            row = [...row];
            const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`;
            row.unshift(indexTag);
            return row;
          });
        }

        data = data.map((ceils, i) => ({
          ceils,
          rowIndex: i
        }));
        const rowLength = data.length;

        if (rowLength > rowNum && rowLength < 2 * rowNum) {
          data = [...data, ...data];
        }

        data = data.map((d, i) => ({ ...d,
          scroll: i
        }));
        this.rowsData = data;
        this.rows = data;
      },

      calcWidths() {
        const {
          width,
          mergedConfig,
          rowsData
        } = this;
        const {
          columnWidth,
          header
        } = mergedConfig;
        const usedWidth = columnWidth.reduce((all, w) => all + w, 0);
        let columnNum = 0;

        if (rowsData[0]) {
          columnNum = rowsData[0].ceils.length;
        } else if (header.length) {
          columnNum = header.length;
        }

        const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);
        const widths = new Array(columnNum).fill(avgWidth);
        this.widths = index.deepMerge(widths, columnWidth);
      },

      calcHeights(onresize = false) {
        const {
          height,
          mergedConfig,
          header
        } = this;
        const {
          headerHeight,
          rowNum,
          data
        } = mergedConfig;
        let allHeight = height;
        if (header.length) allHeight -= headerHeight;
        const avgHeight = allHeight / rowNum;
        this.avgHeight = avgHeight;
        if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
      },

      calcAligns() {
        const {
          header,
          mergedConfig
        } = this;
        const columnNum = header.length;
        let aligns = new Array(columnNum).fill('left');
        const {
          align
        } = mergedConfig;
        this.aligns = index.deepMerge(aligns, align);
      },

      async animation(start = false) {
        const {
          needCalc,
          calcHeights,
          calcRowsData
        } = this;

        if (needCalc) {
          calcRowsData();
          calcHeights();
          this.needCalc = false;
        }

        let {
          avgHeight,
          animationIndex,
          mergedConfig,
          rowsData,
          animation,
          updater
        } = this;
        const {
          waitTime,
          carousel,
          rowNum
        } = mergedConfig;
        const rowLength = rowsData.length;
        if (rowNum >= rowLength) return;

        if (start) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          if (updater !== this.updater) return;
        }

        const animationNum = carousel === 'single' ? 1 : rowNum;
        let rows = rowsData.slice(animationIndex);
        rows.push(...rowsData.slice(0, animationIndex));
        this.rows = rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1);
        this.heights = new Array(rowLength).fill(avgHeight);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (updater !== this.updater) return;
        this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
        animationIndex += animationNum;
        const back = animationIndex - rowLength;
        if (back >= 0) animationIndex = back;
        this.animationIndex = animationIndex;
        this.animationHandler = setTimeout(animation, waitTime - 300);
      },

      stopAnimation() {
        const {
          animationHandler,
          updater
        } = this;
        this.updater = (updater + 1) % 999999;
        if (!animationHandler) return;
        clearTimeout(animationHandler);
      },

      emitEvent(type, ri, ci, row, ceil) {
        const {
          ceils,
          rowIndex
        } = row;
        this.$emit(type, {
          row: ceils,
          ceil,
          rowIndex,
          columnIndex: ci
        });
      },

      updateRows(rows, animationIndex) {
        const {
          mergedConfig,
          animationHandler,
          animation
        } = this;
        this.mergedConfig = { ...mergedConfig,
          data: [...rows]
        };
        this.needCalc = true;
        if (typeof animationIndex === 'number') this.animationIndex = animationIndex;
        if (!animationHandler) animation(true);
      }

    },

    destroyed() {
      const {
        stopAnimation
      } = this;
      stopAnimation();
    }

  };

  /* script */
  const __vue_script__$A = script$A;

  /* template */
  var __vue_render__$A = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: _vm.ref, staticClass: "dv-scroll-board" }, [
      _vm.header.length && _vm.mergedConfig
        ? _c(
            "div",
            {
              staticClass: "header",
              style: "background-color: " + _vm.mergedConfig.headerBGC + ";"
            },
            _vm._l(_vm.header, function(headerItem, i) {
              return _c("div", {
                key: "" + headerItem + i,
                staticClass: "header-item",
                style:
                  "\n        height: " +
                  _vm.mergedConfig.headerHeight +
                  "px;\n        line-height: " +
                  _vm.mergedConfig.headerHeight +
                  "px;\n        width: " +
                  _vm.widths[i] +
                  "px;\n      ",
                attrs: { align: _vm.aligns[i] },
                domProps: { innerHTML: _vm._s(headerItem) }
              })
            }),
            0
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.mergedConfig
        ? _c(
            "div",
            {
              staticClass: "rows",
              style:
                "height: " +
                (_vm.height -
                  (_vm.header.length ? _vm.mergedConfig.headerHeight : 0)) +
                "px;"
            },
            _vm._l(_vm.rows, function(row, ri) {
              return _c(
                "div",
                {
                  key: "" + row.toString() + row.scroll,
                  staticClass: "row-item",
                  style:
                    "\n        height: " +
                    _vm.heights[ri] +
                    "px;\n        line-height: " +
                    _vm.heights[ri] +
                    "px;\n        background-color: " +
                    _vm.mergedConfig[
                      row.rowIndex % 2 === 0 ? "evenRowBGC" : "oddRowBGC"
                    ] +
                    ";\n      "
                },
                _vm._l(row.ceils, function(ceil, ci) {
                  return _c("div", {
                    key: "" + ceil + ri + ci,
                    staticClass: "ceil",
                    style: "width: " + _vm.widths[ci] + "px;",
                    attrs: { align: _vm.aligns[ci] },
                    domProps: { innerHTML: _vm._s(ceil) },
                    on: {
                      click: function($event) {
                        return _vm.emitEvent("click", ri, ci, row, ceil)
                      },
                      mouseenter: function($event) {
                        return _vm.handleHover(true, ri, ci, row, ceil)
                      },
                      mouseleave: function($event) {
                        return _vm.handleHover(false)
                      }
                    }
                  })
                }),
                0
              )
            }),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$A = [];
  __vue_render__$A._withStripped = true;

    /* style */
    const __vue_inject_styles__$A = function (inject) {
      if (!inject) return
      inject("data-v-74bd272b_0", { source: ".dv-scroll-board {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n}\n.dv-scroll-board .text {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .header {\n  display: flex;\n  flex-direction: row;\n  font-size: 15px;\n}\n.dv-scroll-board .header .header-item {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows {\n  overflow: hidden;\n}\n.dv-scroll-board .rows .row-item {\n  display: flex;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows .ceil {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .rows .index {\n  border-radius: 3px;\n  padding: 0px 3px;\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,WAAW;AACb;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,eAAe;EACf,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB","file":"main.vue","sourcesContent":[".dv-scroll-board {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #fff;\n}\n.dv-scroll-board .text {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .header {\n  display: flex;\n  flex-direction: row;\n  font-size: 15px;\n}\n.dv-scroll-board .header .header-item {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows {\n  overflow: hidden;\n}\n.dv-scroll-board .rows .row-item {\n  display: flex;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.dv-scroll-board .rows .ceil {\n  padding: 0 10px;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dv-scroll-board .rows .index {\n  border-radius: 3px;\n  padding: 0px 3px;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$A = undefined;
    /* module identifier */
    const __vue_module_identifier__$A = undefined;
    /* functional template */
    const __vue_is_functional_template__$A = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$A = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$A, staticRenderFns: __vue_staticRenderFns__$A },
      __vue_inject_styles__$A,
      __vue_script__$A,
      __vue_scope_id__$A,
      __vue_is_functional_template__$A,
      __vue_module_identifier__$A,
      false,
      createInjector,
      undefined,
      undefined
    );

  function scrollBoard (Vue) {
    Vue.component(__vue_component__$A.name, __vue_component__$A);
  }

  //
  var script$B = {
    name: 'DvScrollRankingBoard',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        ref: 'scroll-ranking-board',
        defaultConfig: {
          /**
           * @description Board data
           * @type {Array<Object>}
           * @default data = []
           */
          data: [],

          /**
           * @description Row num
           * @type {Number}
           * @default rowNum = 5
           */
          rowNum: 5,

          /**
           * @description Scroll wait time
           * @type {Number}
           * @default waitTime = 2000
           */
          waitTime: 2000,

          /**
           * @description Carousel type
           * @type {String}
           * @default carousel = 'single'
           * @example carousel = 'single' | 'page'
           */
          carousel: 'single',

          /**
           * @description Value unit
           * @type {String}
           * @default unit = ''
           * @example unit = 'ton'
           */
          unit: '',

          /**
           * @description Auto sort by value
           * @type {Boolean}
           * @default sort = true
           */
          sort: true,

          /**
           * @description Value formatter
           * @type {Function}
           * @default valueFormatter = null
           */
          valueFormatter: null
        },
        mergedConfig: null,
        rowsData: [],
        rows: [],
        heights: [],
        animationIndex: 0,
        animationHandler: '',
        updater: 0
      };
    },

    watch: {
      config() {
        const {
          stopAnimation,
          calcData
        } = this;
        stopAnimation();
        calcData();
      }

    },
    methods: {
      afterAutoResizeMixinInit() {
        const {
          calcData
        } = this;
        calcData();
      },

      onResize() {
        const {
          mergedConfig,
          calcHeights
        } = this;
        if (!mergedConfig) return;
        calcHeights(true);
      },

      calcData() {
        const {
          mergeConfig,
          calcRowsData
        } = this;
        mergeConfig();
        calcRowsData();
        const {
          calcHeights
        } = this;
        calcHeights();
        const {
          animation
        } = this;
        animation(true);
      },

      mergeConfig() {
        let {
          config,
          defaultConfig
        } = this;
        this.mergedConfig = index.deepMerge(util_1(defaultConfig, true), config || {});
      },

      calcRowsData() {
        let {
          data,
          rowNum,
          sort
        } = this.mergedConfig;
        sort && data.sort(({
          value: a
        }, {
          value: b
        }) => {
          if (a > b) return -1;
          if (a < b) return 1;
          if (a === b) return 0;
        });
        const value = data.map(({
          value
        }) => value);
        const min = Math.min(...value) || 0; // abs of min

        const minAbs = Math.abs(min);
        const max = Math.max(...value) || 0; // abs of max
        const total = max + minAbs;
        data = data.map((row, i) => ({ ...row,
          ranking: i + 1,
          percent: (row.value + minAbs) / total * 100
        }));
        const rowLength = data.length;

        if (rowLength > rowNum && rowLength < 2 * rowNum) {
          data = [...data, ...data];
        }

        data = data.map((d, i) => ({ ...d,
          scroll: i
        }));
        this.rowsData = data;
        this.rows = data;
      },

      calcHeights(onresize = false) {
        const {
          height,
          mergedConfig
        } = this;
        const {
          rowNum,
          data
        } = mergedConfig;
        const avgHeight = height / rowNum;
        this.avgHeight = avgHeight;
        if (!onresize) this.heights = new Array(data.length).fill(avgHeight);
      },

      async animation(start = false) {
        let {
          avgHeight,
          animationIndex,
          mergedConfig,
          rowsData,
          animation,
          updater
        } = this;
        const {
          waitTime,
          carousel,
          rowNum
        } = mergedConfig;
        const rowLength = rowsData.length;
        if (rowNum >= rowLength) return;

        if (start) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          if (updater !== this.updater) return;
        }

        const animationNum = carousel === 'single' ? 1 : rowNum;
        let rows = rowsData.slice(animationIndex);
        rows.push(...rowsData.slice(0, animationIndex));
        this.rows = rows.slice(0, rowNum + 1);
        this.heights = new Array(rowLength).fill(avgHeight);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (updater !== this.updater) return;
        this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
        animationIndex += animationNum;
        const back = animationIndex - rowLength;
        if (back >= 0) animationIndex = back;
        this.animationIndex = animationIndex;
        this.animationHandler = setTimeout(animation, waitTime - 300);
      },

      stopAnimation() {
        const {
          animationHandler,
          updater
        } = this;
        this.updater = (updater + 1) % 999999;
        if (!animationHandler) return;
        clearTimeout(animationHandler);
      }

    },

    destroyed() {
      const {
        stopAnimation
      } = this;
      stopAnimation();
    }

  };

  /* script */
  const __vue_script__$B = script$B;

  /* template */
  var __vue_render__$B = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: _vm.ref, staticClass: "dv-scroll-ranking-board" },
      _vm._l(_vm.rows, function(item, i) {
        return _c(
          "div",
          {
            key: item.toString() + item.scroll,
            staticClass: "row-item",
            style: "height: " + _vm.heights[i] + "px;"
          },
          [
            _c("div", { staticClass: "ranking-info" }, [
              _c("div", { staticClass: "rank" }, [
                _vm._v("No." + _vm._s(item.ranking))
              ]),
              _vm._v(" "),
              _c("div", {
                staticClass: "info-name",
                domProps: { innerHTML: _vm._s(item.name) }
              }),
              _vm._v(" "),
              _c("div", { staticClass: "ranking-value" }, [
                _vm._v(
                  _vm._s(
                    _vm.mergedConfig.valueFormatter
                      ? _vm.mergedConfig.valueFormatter(item)
                      : item.value + _vm.mergedConfig.unit
                  )
                )
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "ranking-column" }, [
              _c(
                "div",
                {
                  staticClass: "inside-column",
                  style: "width: " + item.percent + "%;"
                },
                [_c("div", { staticClass: "shine" })]
              )
            ])
          ]
        )
      }),
      0
    )
  };
  var __vue_staticRenderFns__$B = [];
  __vue_render__$B._withStripped = true;

    /* style */
    const __vue_inject_styles__$B = function (inject) {
      if (!inject) return
      inject("data-v-36f22569_0", { source: ".dv-scroll-ranking-board {\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .row-item {\n  transition: all 0.3s;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-info {\n  display: flex;\n  width: 100%;\n  font-size: 13px;\n}\n.dv-scroll-ranking-board .ranking-info .rank {\n  width: 40px;\n  color: #1370fb;\n}\n.dv-scroll-ranking-board .ranking-info .info-name {\n  flex: 1;\n}\n.dv-scroll-ranking-board .ranking-column {\n  border-bottom: 2px solid rgba(19, 112, 251, 0.5);\n  margin-top: 5px;\n}\n.dv-scroll-ranking-board .ranking-column .inside-column {\n  position: relative;\n  height: 6px;\n  background-color: #1370fb;\n  margin-bottom: 2px;\n  border-radius: 1px;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-column .shine {\n  position: absolute;\n  left: 0%;\n  top: 2px;\n  height: 2px;\n  width: 50px;\n  transform: translateX(-100%);\n  background: radial-gradient(#28f8ff 5%, transparent 80%);\n  animation: shine 3s ease-in-out infinite alternate;\n}\n@keyframes shine {\n80% {\n    left: 0%;\n    transform: translateX(-100%);\n}\n100% {\n    left: 100%;\n    transform: translateX(0%);\n}\n}\n", map: {"version":3,"sources":["main.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,YAAY;EACZ,WAAW;EACX,gBAAgB;AAClB;AACA;EACE,oBAAoB;EACpB,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,WAAW;EACX,eAAe;AACjB;AACA;EACE,WAAW;EACX,cAAc;AAChB;AACA;EACE,OAAO;AACT;AACA;EACE,gDAAgD;EAChD,eAAe;AACjB;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,yBAAyB;EACzB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,QAAQ;EACR,WAAW;EACX,WAAW;EACX,4BAA4B;EAC5B,wDAAwD;EACxD,kDAAkD;AACpD;AACA;AACE;IACE,QAAQ;IACR,4BAA4B;AAC9B;AACA;IACE,UAAU;IACV,yBAAyB;AAC3B;AACF","file":"main.vue","sourcesContent":[".dv-scroll-ranking-board {\n  width: 100%;\n  height: 100%;\n  color: #fff;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .row-item {\n  transition: all 0.3s;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-info {\n  display: flex;\n  width: 100%;\n  font-size: 13px;\n}\n.dv-scroll-ranking-board .ranking-info .rank {\n  width: 40px;\n  color: #1370fb;\n}\n.dv-scroll-ranking-board .ranking-info .info-name {\n  flex: 1;\n}\n.dv-scroll-ranking-board .ranking-column {\n  border-bottom: 2px solid rgba(19, 112, 251, 0.5);\n  margin-top: 5px;\n}\n.dv-scroll-ranking-board .ranking-column .inside-column {\n  position: relative;\n  height: 6px;\n  background-color: #1370fb;\n  margin-bottom: 2px;\n  border-radius: 1px;\n  overflow: hidden;\n}\n.dv-scroll-ranking-board .ranking-column .shine {\n  position: absolute;\n  left: 0%;\n  top: 2px;\n  height: 2px;\n  width: 50px;\n  transform: translateX(-100%);\n  background: radial-gradient(#28f8ff 5%, transparent 80%);\n  animation: shine 3s ease-in-out infinite alternate;\n}\n@keyframes shine {\n  80% {\n    left: 0%;\n    transform: translateX(-100%);\n  }\n  100% {\n    left: 100%;\n    transform: translateX(0%);\n  }\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$B = undefined;
    /* module identifier */
    const __vue_module_identifier__$B = undefined;
    /* functional template */
    const __vue_is_functional_template__$B = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$B = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$B, staticRenderFns: __vue_staticRenderFns__$B },
      __vue_inject_styles__$B,
      __vue_script__$B,
      __vue_scope_id__$B,
      __vue_is_functional_template__$B,
      __vue_module_identifier__$B,
      false,
      createInjector,
      undefined,
      undefined
    );

  function scrollRankingBoard (Vue) {
    Vue.component(__vue_component__$B.name, __vue_component__$B);
  }

  /**
   * IMPORT COMPONENTS
   */
  /**
   * USE COMPONENTS
   */

  function datav (Vue) {
    Vue.use(fullScreenContainer);
    Vue.use(loading); // border box

    Vue.use(borderBox1);
    Vue.use(borderBox2);
    Vue.use(borderBox3);
    Vue.use(borderBox4);
    Vue.use(borderBox5);
    Vue.use(borderBox6);
    Vue.use(borderBox7);
    Vue.use(borderBox8);
    Vue.use(borderBox9);
    Vue.use(borderBox10);
    Vue.use(borderBox11);
    Vue.use(borderBox12);
    Vue.use(borderBox13); // decoration

    Vue.use(decoration1);
    Vue.use(decoration2);
    Vue.use(decoration3);
    Vue.use(decoration4);
    Vue.use(decoration5);
    Vue.use(decoration6);
    Vue.use(decoration7);
    Vue.use(decoration8);
    Vue.use(decoration9);
    Vue.use(decoration10);
    Vue.use(decoration11);
    Vue.use(decoration12); // charts

    Vue.use(charts);
    Vue.use(activeRingChart);
    Vue.use(capsuleChart);
    Vue.use(waterLevelPond);
    Vue.use(percentPond);
    Vue.use(flylineChart);
    Vue.use(flylineChartEnhanced);
    Vue.use(conicalColumnChart);
    Vue.use(digitalFlop);
    Vue.use(scrollBoard);
    Vue.use(scrollRankingBoard);
  }

  Vue__default['default'].use(datav);

})));
