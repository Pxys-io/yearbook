// imagesLoaded PACKAGED v4.1.3
// https://imagesloaded.desandro.com
! function (e, t) {
  "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module &&
    module.exports ? module.exports = t() : e.EvEmitter = t()
}("undefined" != typeof window ? window : this, function () {
  function e() {}
  var t = e.prototype;
  return t.on = function (e, t) {
    if (e && t) {
      var i = this._events = this._events || {},
        n = i[e] = i[e] || [];
      return -1 == n.indexOf(t) && n.push(t), this
    }
  }, t.once = function (e, t) {
    if (e && t) {
      this.on(e, t);
      var i = this._onceEvents = this._onceEvents || {},
        n = i[e] = i[e] || {};
      return n[t] = !0, this
    }
  }, t.off = function (e, t) {
    var i = this._events && this._events[e];
    if (i && i.length) {
      var n = i.indexOf(t);
      return -1 != n && i.splice(n, 1), this
    }
  }, t.emitEvent = function (e, t) {
    var i = this._events && this._events[e];
    if (i && i.length) {
      var n = 0,
        o = i[n];
      t = t || [];
      for (var r = this._onceEvents && this._onceEvents[e]; o;) {
        var s = r && r[o];
        s && (this.off(e, o), delete r[o]), o.apply(this, t), n += s ? 0 : 1, o = i[n]
      }
      return this
    }
  }, t.allOff = t.removeAllListeners = function () {
    delete this._events, delete this._onceEvents
  }, e
}),
function (e, t) {
  "use strict";
  "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i) {
      return t(e, i)
    }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e
    .imagesLoaded = t(e, e.EvEmitter)
}("undefined" != typeof window ? window : this, function (e, t) {
  function i(e, t) {
    for (var i in t) e[i] = t[i];
    return e
  }

  function n(e) {
    var t = [];
    if (Array.isArray(e)) t = e;
    else if ("number" == typeof e.length)
      for (var i = 0; i < e.length; i++) t.push(e[i]);
    else t.push(e);
    return t
  }

  function o(e, t, r) {
    return this instanceof o ? ("string" == typeof e && (e = document.querySelectorAll(e)), this.elements = n(e),
      this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on(
        "always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function () {
        this.check()
      }.bind(this))) : new o(e, t, r)
  }

  function r(e) {
    this.img = e
  }

  function s(e, t) {
    this.url = e, this.element = t, this.img = new Image
  }
  var h = e.jQuery,
    a = e.console;
  o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function () {
    this.images = [], this.elements.forEach(this.addElementImages, this)
  }, o.prototype.addElementImages = function (e) {
    "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(
      e);
    var t = e.nodeType;
    if (t && d[t]) {
      for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
        var o = i[n];
        this.addImage(o)
      }
      if ("string" == typeof this.options.background) {
        var r = e.querySelectorAll(this.options.background);
        for (n = 0; n < r.length; n++) {
          var s = r[n];
          this.addElementBackgroundImages(s)
        }
      }
    }
  };
  var d = {
    1: !0,
    9: !0,
    11: !0
  };
  return o.prototype.addElementBackgroundImages = function (e) {
    var t = getComputedStyle(e);
    if (t)
      for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
        var o = n && n[2];
        o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
      }
  }, o.prototype.addImage = function (e) {
    var t = new r(e);
    this.images.push(t)
  }, o.prototype.addBackground = function (e, t) {
    var i = new s(e, t);
    this.images.push(i)
  }, o.prototype.check = function () {
    function e(e, i, n) {
      setTimeout(function () {
        t.progress(e, i, n)
      })
    }
    var t = this;
    return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(
      function (t) {
        t.once("progress", e), t.check()
      }) : void this.complete()
  }, o.prototype.progress = function (e, t, i) {
    this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [
        this, e, t
      ]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount ==
      this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, e, t)
  }, o.prototype.complete = function () {
    var e = this.hasAnyBroken ? "fail" : "done";
    if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
      var t = this.hasAnyBroken ? "reject" : "resolve";
      this.jqDeferred[t](this)
    }
  }, r.prototype = Object.create(t.prototype), r.prototype.check = function () {
    var e = this.getIsImageComplete();
    return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image,
      this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this
      .img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage
        .src = this.img.src))
  }, r.prototype.getIsImageComplete = function () {
    return this.img.complete && void 0 !== this.img.naturalWidth
  }, r.prototype.confirm = function (e, t) {
    this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
  }, r.prototype.handleEvent = function (e) {
    var t = "on" + e.type;
    this[t] && this[t](e)
  }, r.prototype.onload = function () {
    this.confirm(!0, "onload"), this.unbindEvents()
  }, r.prototype.onerror = function () {
    this.confirm(!1, "onerror"), this.unbindEvents()
  }, r.prototype.unbindEvents = function () {
    this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this
      .img.removeEventListener("load", this), this.img.removeEventListener("error", this)
  }, s.prototype = Object.create(r.prototype), s.prototype.check = function () {
    this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
    var e = this.getIsImageComplete();
    e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
  }, s.prototype.unbindEvents = function () {
    this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
  }, s.prototype.confirm = function (e, t) {
    this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
  }, o.makeJQueryPlugin = function (t) {
    t = t || e.jQuery, t && (h = t, h.fn.imagesLoaded = function (e, t) {
      var i = new o(this, e, t);
      return i.jqDeferred.promise(h(this))
    })
  }, o.makeJQueryPlugin(), o
});
// fiterizr http://yiotis.net/filterizr/
! function (t, i) {
  "use strict";
  if (!i) throw new Error("Filterizr requires jQuery to work.");
  var r = function (t) {
    this.init(t)
  };
  r.prototype = {
    init: function (t) {
      this.root = {
        x: 0,
        y: 0,
        w: t
      }
    },
    fit: function (t) {
      var i, r, n, e = t.length,
        o = e > 0 ? t[0].h : 0;
      for (this.root.h = o, i = 0; i < e; i++) n = t[i], (r = this.findNode(this.root, n.w, n.h)) ? n.fit = this
        .splitNode(r, n.w, n.h) : n.fit = this.growDown(n.w, n.h)
    },
    findNode: function (t, i, r) {
      return t.used ? this.findNode(t.right, i, r) || this.findNode(t.down, i, r) : i <= t.w && r <= t.h ? t :
        null
    },
    splitNode: function (t, i, r) {
      return t.used = !0, t.down = {
        x: t.x,
        y: t.y + r,
        w: t.w,
        h: t.h - r
      }, t.right = {
        x: t.x + i,
        y: t.y,
        w: t.w - i,
        h: r
      }, t
    },
    growDown: function (t, i) {
      var r;
      return this.root = {
        used: !0,
        x: 0,
        y: 0,
        w: this.root.w,
        h: this.root.h + i,
        down: {
          x: 0,
          y: this.root.h,
          w: this.root.w,
          h: i
        },
        right: this.root
      }, (r = this.findNode(this.root, t, i)) ? this.splitNode(r, t, i) : null
    }
  }, i.fn.filterizr = function () {
    var t = this,
      r = arguments;
    if (t._fltr || (t._fltr = i.fn.filterizr.prototype.init(t, "object" == typeof r[0] ? r[0] : void 0)),
      "string" == typeof r[0]) {
      if (r[0].lastIndexOf("_") > -1) throw new Error("Filterizr error: You cannot call private methods");
      if ("function" != typeof t._fltr[r[0]]) throw new Error("Filterizr error: There is no such function");
      t._fltr[r[0]](r[1], r[2])
    }
    return t
  }, i.fn.filterizr.prototype = {
    init: function (t, r) {
      var n = i(t).extend(i.fn.filterizr.prototype);
      return n.options = {
          animationDuration: .5,
          callbacks: {
            onFilteringStart: function () {},
            onFilteringEnd: function () {},
            onShufflingStart: function () {},
            onShufflingEnd: function () {},
            onSortingStart: function () {},
            onSortingEnd: function () {}
          },
          delay: 0,
          delayMode: "progressive",
          easing: "ease-out",
          filter: "all",
          filterOutCss: {
            opacity: 0,
            transform: "scale(0.5)"
          },
          filterInCss: {
            opacity: 1,
            transform: "scale(1)"
          },
          layout: "sameSize",
          setupControls: !0
        }, 0 === arguments.length && (r = n.options), 1 === arguments.length && "object" == typeof arguments[
        0] && (r = arguments[0]), r && n.setOptions(r), n.css({
          padding: 0,
          position: "relative"
        }), n._lastCategory = 0, n._isAnimating = !1, n._isShuffling = !1, n._isSorting = !1, n._mainArray = n
        ._getFiltrItems(), n._subArrays = n._makeSubarrays(), n._activeArray = n._getCollectionByFilter(n
          .options.filter), n._toggledCategories = {}, n._typedText = i("input[data-search]").val() || "", n
        ._uID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
          var i = 16 * Math.random() | 0;
          return ("x" == t ? i : 3 & i | 8).toString(16)
        }), n._setupEvents(), n.options.setupControls && n._setupControls(), n.filter(n.options.filter), n
    },
    filter: function (t) {
      var i = this,
        r = i._getCollectionByFilter(t);
      i.options.filter = t, i.trigger("filteringStart"), i._handleFiltering(r), i._isSearchActivated() && i
        .search(i._typedText)
    },
    toggleFilter: function (t) {
      var i = this,
        r = [];
      i.trigger("filteringStart"), t && (i._toggledCategories[t] ? delete i._toggledCategories[t] : i
        ._toggledCategories[t] = !0), i._multifilterModeOn() ? (r = i._makeMultifilterArray(), i
        ._handleFiltering(r), i._isSearchActivated() && i.search(i._typedText)) : (i.filter("all"), i
        ._isSearchActivated() && i.search(i._typedText))
    },
    search: function (t) {
      var i = this,
        r = i._multifilterModeOn() ? i._makeMultifilterArray() : i._getCollectionByFilter(i.options.filter),
        n = [],
        e = 0;
      if (i._isSearchActivated())
        for (e = 0; e < r.length; e++) r[e].text().toLowerCase().indexOf(t.toLowerCase()) > -1 && n.push(r[e]);
      if (n.length > 0) i._handleFiltering(n);
      else if (i._isSearchActivated())
        for (e = 0; e < i._activeArray.length; e++) i._activeArray[e]._filterOut();
      else i._handleFiltering(r)
    },
    shuffle: function () {
      var t = this;
      t._isAnimating = !0, t._isShuffling = !0, t.trigger("shufflingStart"), t._mainArray = t
        ._fisherYatesShuffle(t._mainArray), t._subArrays = t._makeSubarrays();
      var i = t._multifilterModeOn() ? t._makeMultifilterArray() : t._getCollectionByFilter(t.options.filter);
      t._isSearchActivated() ? t.search(t._typedText) : t._placeItems(i)
    },
    sort: function (t, i) {
      var r = this;
      if (t = t || "domIndex", i = i || "asc", r._isAnimating = !0, r._isSorting = !0, r.trigger(
        "sortingStart"), "domIndex" !== t && "sortData" !== t && "w" !== t && "h" !== t)
        for (var n = 0; n < r._mainArray.length; n++) r._mainArray[n][t] = r._mainArray[n].data(t);
      r._mainArray.sort(r._comparator(t, i)), r._subArrays = r._makeSubarrays();
      var e = r._multifilterModeOn() ? r._makeMultifilterArray() : r._getCollectionByFilter(r.options.filter);
      r._isSearchActivated() ? r.search(r._typedText) : r._placeItems(e)
    },
    setOptions: function (t) {
      var i = this,
        r = 0;
      for (var n in t) i.options[n] = t[n];
      if (i._mainArray && (t.animationDuration || t.delay || t.easing || t.delayMode))
        for (r = 0; r < i._mainArray.length; r++) i._mainArray[r].css("transition", "all " + i.options
          .animationDuration + "s " + i.options.easing + " " + i._mainArray[r]._calcDelay() + "ms");
      t.callbacks && (t.callbacks.onFilteringStart || (i.options.callbacks.onFilteringStart = function () {}), t
        .callbacks.onFilteringEnd || (i.options.callbacks.onFilteringEnd = function () {}), t.callbacks
        .onShufflingStart || (i.options.callbacks.onShufflingStart = function () {}), t.callbacks
        .onShufflingEnd || (i.options.callbacks.onShufflingEnd = function () {}), t.callbacks
        .onSortingStart || (i.options.callbacks.onSortingStart = function () {}), t.callbacks.onSortingEnd ||
        (i.options.callbacks.onSortingEnd = function () {})), i.options.filterInCss.transform || (i.options
        .filterInCss.transform = "translate3d(0,0,0)"), i.options.filterOutCss.transform || (i.options
        .filterOutCss.transform = "translate3d(0,0,0)")
    },
    _getFiltrItems: function () {
      var t = this,
        r = i(t.find(".filtr-item")),
        e = [];
      return i.each(r, function (r, o) {
        var a = i(o).extend(n)._init(r, t);
        e.push(a)
      }), e
    },
    _makeSubarrays: function () {
      for (var t = this, i = [], r = 0; r < t._lastCategory; r++) i.push([]);
      for (r = 0; r < t._mainArray.length; r++)
        if ("object" == typeof t._mainArray[r]._category)
          for (var n = t._mainArray[r]._category.length, e = 0; e < n; e++) i[t._mainArray[r]._category[e] - 1]
            .push(t._mainArray[r]);
        else i[t._mainArray[r]._category - 1].push(t._mainArray[r]);
      return i
    },
    _makeMultifilterArray: function () {
      for (var t = this, i = [], r = {}, n = 0; n < t._mainArray.length; n++) {
        var e = t._mainArray[n],
          o = !1,
          a = e.domIndex in r == !1;
        if (Array.isArray(e._category)) {
          for (var s = 0; s < e._category.length; s++)
            if (e._category[s] in t._toggledCategories) {
              o = !0;
              break
            }
        } else e._category in t._toggledCategories && (o = !0);
        a && o && (r[e.domIndex] = !0, i.push(e))
      }
      return i
    },
    _setupControls: function () {
      var t = this;
      i("*[data-filter]").click(function () {
        var r = i(this).data("filter");
        t.options.filter !== r && t.filter(r)
      }), i("*[data-multifilter]").click(function () {
        var r = i(this).data("multifilter");
        "all" === r ? (t._toggledCategories = {}, t.filter("all")) : t.toggleFilter(r)
      }), i("*[data-shuffle]").click(function () {
        t.shuffle()
      }), i("*[data-sortAsc]").click(function () {
        var r = i("*[data-sortOrder]").val();
        t.sort(r, "asc")
      }), i("*[data-sortDesc]").click(function () {
        var r = i("*[data-sortOrder]").val();
        t.sort(r, "desc")
      }), i("input[data-search]").keyup(function () {
        t._typedText = i(this).val(), t._delayEvent(function () {
          t.search(t._typedText)
        }, 250, t._uID)
      })
    },
    _setupEvents: function () {
      var r = this;
      i(t).resize(function () {
        r._delayEvent(function () {
          r.trigger("resizeFiltrContainer")
        }, 250, r._uID)
      }), r.on("resizeFiltrContainer", function () {
        r._multifilterModeOn() ? r.toggleFilter() : r.filter(r.options.filter)
      }).on("filteringStart", function () {
        r.options.callbacks.onFilteringStart()
      }).on("filteringEnd", function () {
        r.options.callbacks.onFilteringEnd()
      }).on("shufflingStart", function () {
        r._isShuffling = !0, r.options.callbacks.onShufflingStart()
      }).on("shufflingEnd", function () {
        r.options.callbacks.onShufflingEnd(), r._isShuffling = !1
      }).on("sortingStart", function () {
        r._isSorting = !0, r.options.callbacks.onSortingStart()
      }).on("sortingEnd", function () {
        r.options.callbacks.onSortingEnd(), r._isSorting = !1
      })
    },
    _calcItemPositions: function () {
      var t = this,
        n = t._activeArray,
        e = 0,
        o = Math.round(t.width() / t.find(".filtr-item").outerWidth()),
        a = 0,
        s = n[0].outerWidth(),
        l = 0,
        f = 0,
        u = 0,
        c = 0,
        g = 0,
        _ = [];
      if ("packed" === t.options.layout) {
        i.each(t._activeArray, function (t, i) {
          i._updateDimensions()
        });
        var h = new r(t.outerWidth());
        for (h.fit(t._activeArray), c = 0; c < n.length; c++) _.push({
          left: n[c].fit.x,
          top: n[c].fit.y
        });
        e = h.root.h
      }
      if ("horizontal" === t.options.layout)
        for (a = 1, c = 1; c <= n.length; c++) s = n[c - 1].outerWidth(), l = n[c - 1].outerHeight(), _.push({
          left: f,
          top: u
        }), f += s, e < l && (e = l);
      else if ("vertical" === t.options.layout) {
        for (c = 1; c <= n.length; c++) l = n[c - 1].outerHeight(), _.push({
          left: f,
          top: u
        }), u += l;
        e = u
      } else if ("sameHeight" === t.options.layout) {
        a = 1;
        var d = t.outerWidth();
        for (c = 1; c <= n.length; c++) {
          s = n[c - 1].width();
          var p = n[c - 1].outerWidth(),
            y = 0;
          n[c] && (y = n[c].width()), _.push({
            left: f,
            top: u
          }), (g = f + s + y) > d ? (g = 0, f = 0, u += n[0].outerHeight(), a++) : f += p
        }
        e = a * n[0].outerHeight()
      } else if ("sameWidth" === t.options.layout) {
        for (c = 1; c <= n.length; c++) {
          if (_.push({
              left: f,
              top: u
            }), c % o == 0 && a++, f += s, u = 0, a > 0)
            for (g = a; g > 0;) u += n[c - o * g].outerHeight(), g--;
          c % o == 0 && (f = 0)
        }
        for (c = 0; c < o; c++) {
          for (var m = 0, v = c; n[v];) m += n[v].outerHeight(), v += o;
          m > e ? (e = m, m = 0) : m = 0
        }
      } else if ("sameSize" === t.options.layout) {
        for (c = 1; c <= n.length; c++) _.push({
          left: f,
          top: u
        }), f += s, c % o == 0 && (u += n[0].outerHeight(), f = 0);
        e = (a = Math.ceil(n.length / o)) * n[0].outerHeight()
      }
      return t.css("height", e), _
    },
    _handleFiltering: function (t) {
      for (var i = this, r = i._getArrayOfUniqueItems(i._activeArray, t), n = 0; n < r.length; n++) r[n]
        ._filterOut();
      i._activeArray = t, i._placeItems(t)
    },
    _multifilterModeOn: function () {
      var t = this;
      return Object.keys(t._toggledCategories).length > 0
    },
    _isSearchActivated: function () {
      return this._typedText.length > 0
    },
    _placeItems: function (t) {
      var i = this;
      i._isAnimating = !0, i._itemPositions = i._calcItemPositions();
      for (var r = 0; r < t.length; r++) t[r]._filterIn(i._itemPositions[r])
    },
    _getCollectionByFilter: function (t) {
      var i = this;
      return "all" === t ? i._mainArray : i._subArrays[t - 1]
    },
    _makeDeepCopy: function (t) {
      var i = {};
      for (var r in t) i[r] = t[r];
      return i
    },
    _comparator: function (t, i) {
      return function (r, n) {
        return "asc" === i ? r[t] < n[t] ? -1 : r[t] > n[t] ? 1 : 0 : "desc" === i ? n[t] < r[t] ? -1 : n[t] >
          r[t] ? 1 : 0 : void 0
      }
    },
    _getArrayOfUniqueItems: function (t, i) {
      var r, n, e = [],
        o = {},
        a = i.length;
      for (r = 0; r < a; r++) o[i[r].domIndex] = !0;
      for (a = t.length, r = 0; r < a; r++)(n = t[r]).domIndex in o || e.push(n);
      return e
    },
    _delayEvent: function () {
      var t = {};
      return function (i, r, n) {
        if (null === n) throw Error("UniqueID needed");
        t[n] && clearTimeout(t[n]), t[n] = setTimeout(i, r)
      }
    }(),
    _fisherYatesShuffle: function (t) {
      for (var i, r, n = t.length; n;) r = Math.floor(Math.random() * n--), i = t[n], t[n] = t[r], t[r] = i;
      return t
    }
  };
  var n = {
    _init: function (t, i) {
      var r = this;
      return r._parent = i, r._category = r._getCategory(), r._lastPos = {}, r.domIndex = t, r.sortData = r
        .data("sort"), r.w = 0, r.h = 0, r._isFilteredOut = !0, r._filteringOut = !1, r._filteringIn = !1, r
        .css(i.options.filterOutCss).css({
          "-webkit-backface-visibility": "hidden",
          perspective: "1000px",
          "-webkit-perspective": "1000px",
          "-webkit-transform-style": "preserve-3d",
          position: "absolute",
          transition: "all " + i.options.animationDuration + "s " + i.options.easing + " " + r._calcDelay() +
            "ms"
        }), r.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
          r._onTransitionEnd()
        }), r
    },
    _updateDimensions: function () {
      var t = this;
      t.w = t.outerWidth(), t.h = t.outerHeight()
    },
    _calcDelay: function () {
      var t = this,
        i = 0;
      return "progressive" === t._parent.options.delayMode ? i = t._parent.options.delay * t.domIndex : t
        .domIndex % 2 == 0 && (i = t._parent.options.delay), i
    },
    _getCategory: function () {
      var t = this,
        i = t.data("category");
      if ("string" == typeof i) {
        i = i.split(", ");
        for (var r = 0; r < i.length; r++) {
          if (isNaN(parseInt(i[r]))) throw new Error(
            "Filterizr: the value of data-category must be a number, starting from value 1 and increasing.");
          parseInt(i[r]) > t._parent._lastCategory && (t._parent._lastCategory = parseInt(i[r]))
        }
      } else i > t._parent._lastCategory && (t._parent._lastCategory = i);
      return i
    },
    _onTransitionEnd: function () {
      var t = this;
      t._filteringOut ? (i(t).addClass("filteredOut"), t._isFilteredOut = !0, t._filteringOut = !1) : t
        ._filteringIn && (t._isFilteredOut = !1, t._filteringIn = !1), t._parent._isAnimating && (t._parent
          ._isShuffling ? t._parent.trigger("shufflingEnd") : t._parent._isSorting ? t._parent.trigger(
            "sortingEnd") : t._parent.trigger("filteringEnd"), t._parent._isAnimating = !1)
    },
    _filterOut: function () {
      var t = this,
        i = t._parent._makeDeepCopy(t._parent.options.filterOutCss);
      i.transform += " translate3d(" + t._lastPos.left + "px," + t._lastPos.top + "px, 0)", t.css(i), t.css(
        "pointer-events", "none"), t._filteringOut = !0
    },
    _filterIn: function (t) {
      var r = this,
        n = r._parent._makeDeepCopy(r._parent.options.filterInCss);
      i(r).removeClass("filteredOut"), r._filteringIn = !0, r._lastPos = t, r.css("pointer-events", "auto"), n
        .transform += " translate3d(" + t.left + "px," + t.top + "px, 0)", r.css(n)
    }
  }
}(this, jQuery);
// simplelightbox 1.12.0 https://github.com/andreknieriem/simplelightbox
! function (t, e, i, n) {
  "use strict";
  t.fn.simpleLightbox = function (n) {
    var a, n = t.extend({
        sourceAttr: "href",
        overlay: !0,
        spinner: !0,
        nav: !0,
        navText: ["&lsaquo;", "&rsaquo;"],
        captions: !0,
        captionDelay: 0,
        captionSelector: "img",
        captionType: "attr",
        captionsData: "title",
        captionPosition: "bottom",
        captionClass: "",
        close: !0,
        closeText: "×",
        swipeClose: !0,
        showCounter: !0,
        fileExt: "png|jpg|jpeg|gif",
        animationSlide: !0,
        animationSpeed: 250,
        preloading: !0,
        enableKeyboard: !0,
        loop: !0,
        rel: !1,
        docClose: !0,
        swipeTolerance: 50,
        className: "simple-lightbox",
        widthRatio: .8,
        heightRatio: .9,
        disableRightClick: !1,
        disableScroll: !0,
        alertError: !0,
        alertErrorMessage: "Image not found, next image will be loaded",
        additionalHtml: !1,
        history: !0
      }, n),
      o = (e.navigator.pointerEnabled || e.navigator.msPointerEnabled, 0),
      s = 0,
      l = t(),
      r = function () {
        var t = i.body || i.documentElement;
        return t = t.style, "" === t.WebkitTransition ? "-webkit-" : "" === t.MozTransition ? "-moz-" : "" === t
          .OTransition ? "-o-" : "" === t.transition && ""
      },
      c = !1,
      p = [],
      d = n.rel && !1 !== n.rel ? function (e, i) {
        return t(i.selector).filter(function () {
          return t(this).attr("rel") === e
        })
      }(n.rel, this) : this,
      h = 0,
      g = !1 !== (r = r()),
      u = "pushState" in history,
      f = !1,
      m = e.location,
      v = function () {
        return m.hash.substring(1)
      },
      b = v(),
      x = function () {
        v();
        var t = "pid=" + (D + 1),
          e = m.href.split("#")[0] + "#" + t;
        u ? history[f ? "replaceState" : "pushState"]("", i.title, e) : f ? m.replace(e) : m.hash = t, f = !0
      },
      y = function () {
        u ? history.pushState("", i.title, m.pathname + m.search) : m.hash = "", clearTimeout(a)
      },
      w = function () {
        f ? a = setTimeout(x, 800) : x()
      },
      E = "simplelb",
      C = t("<div>").addClass("sl-overlay"),
      T = t("<button>").addClass("sl-close").html(n.closeText),
      S = t("<div>").addClass("sl-spinner").html("<div></div>"),
      k = t("<div>").addClass("sl-navigation").html('<button class="sl-prev">' + n.navText[0] +
        '</button><button class="sl-next">' + n.navText[1] + "</button>"),
      I = t("<div>").addClass("sl-counter").html(
        '<span class="sl-current"></span>/<span class="sl-total"></span>'),
      q = !1,
      D = 0,
      M = t("<div>").addClass("sl-caption " + n.captionClass + " pos-" + n.captionPosition),
      A = t("<div>").addClass("sl-image"),
      R = t("<div>").addClass("sl-wrapper").addClass(n.className),
      O = function (e) {
        if (!n.fileExt) return !0;
        var i = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim,
          a = t(e).attr(n.sourceAttr).match(i);
        return a && "a" == t(e).prop("tagName").toLowerCase() && new RegExp(".(" + n.fileExt + ")$", "i").test(a)
      },
      P = function (e) {
        e.trigger(t.Event("show.simplelightbox")), n.disableScroll && (h = K("hide")), R.appendTo("body"), A
          .appendTo(R), n.overlay && C.appendTo(t("body")), q = !0, D = d.index(e), l = t("<img/>").hide().attr(
            "src", e.attr(n.sourceAttr)), -1 == p.indexOf(e.attr(n.sourceAttr)) && p.push(e.attr(n.sourceAttr)), A
          .html("").attr("style", ""), l.appendTo(A), X(), C.fadeIn("fast"), t(".sl-close").fadeIn("fast"), S
          .show(), k.fadeIn("fast"), t(".sl-wrapper .sl-counter .sl-current").text(D + 1), I.fadeIn("fast"), z(),
          n.preloading && Y(), setTimeout(function () {
            e.trigger(t.Event("shown.simplelightbox"))
          }, n.animationSpeed)
      },
      z = function (i) {
        if (l.length) {
          var a = new Image,
            o = t(e).width() * n.widthRatio,
            s = t(e).height() * n.heightRatio;
          a.src = l.attr("src"), t(a).bind("error", function (e) {
            d.eq(D).trigger(t.Event("error.simplelightbox")), q = !1, c = !0, S.hide(), n.alertError && alert(
              n.alertErrorMessage), j(1 == i || -1 == i ? i : 1)
          }), a.onload = function () {
            void 0 !== i && d.eq(D).trigger(t.Event("changed.simplelightbox")).trigger(t.Event((1 === i ?
                "nextDone" : "prevDone") + ".simplelightbox")), n.history && w(), -1 == p.indexOf(l.attr(
              "src")) && p.push(l.attr("src"));
            var r = a.width,
              u = a.height;
            if (r > o || u > s) {
              var f = r / u > o / s ? r / o : u / s;
              r /= f, u /= f
            }
            t(".sl-image").css({
              top: (t(e).height() - u) / 2 + "px",
              left: (t(e).width() - r - h) / 2 + "px"
            }), S.hide(), l.css({
              width: r + "px",
              height: u + "px"
            }).fadeIn("fast"), c = !0;
            var m, v = "self" == n.captionSelector ? d.eq(D) : d.eq(D).find(n.captionSelector);
            if (m = "data" == n.captionType ? v.data(n.captionsData) : "text" == n.captionType ? v.html() : v
              .prop(n.captionsData), n.loop || (0 === D && t(".sl-prev").hide(), D >= d.length - 1 && t(
                ".sl-next").hide(), D > 0 && t(".sl-prev").show(), D < d.length - 1 && t(".sl-next").show()),
              1 == d.length && t(".sl-prev, .sl-next").hide(), 1 == i || -1 == i) {
              var b = {
                opacity: 1
              };
              n.animationSlide && (g ? (W(0, 100 * i + "px"), setTimeout(function () {
                  W(n.animationSpeed / 1e3, "0px")
                }, 50)) : b.left = parseInt(t(".sl-image").css("left")) + 100 * i + "px"), t(".sl-image")
                .animate(b, n.animationSpeed, function () {
                  q = !1, L(m)
                })
            } else q = !1, L(m);
            n.additionalHtml && 0 === t(".sl-additional-html").length && t("<div>").html(n.additionalHtml)
              .addClass("sl-additional-html").appendTo(t(".sl-image"))
          }
        }
      },
      L = function (e) {
        "" !== e && void 0 !== e && n.captions && M.html(e).hide().appendTo(t(".sl-image")).delay(n.captionDelay)
          .fadeIn("fast")
      },
      W = function (e, i) {
        var n = {};
        n[r + "transform"] = "translateX(" + i + ")", n[r + "transition"] = r + "transform " + e + "s linear", t(
          ".sl-image").css(n)
      },
      X = function () {
        t(e).on("resize." + E, z), t(i).on("click.simplelb touchstart." + E, ".sl-close", function (t) {
          t.preventDefault(), c && H()
        }), n.history && setTimeout(function () {
          t(e).on("hashchange." + E, function () {
            c && v() === b && H()
          })
        }, 40), k.on("click." + E, "button", function (e) {
          e.preventDefault(), o = 0, j(t(this).hasClass("sl-next") ? 1 : -1)
        });
        var a = 0,
          l = 0,
          r = 0,
          p = 0,
          h = !1,
          u = 0;
        A.on("touchstart.simplelb mousedown." + E, function (t) {
          return !!h || (g && (u = parseInt(A.css("left"))), h = !0, a = t.originalEvent.pageX || t
            .originalEvent.touches[0].pageX, r = t.originalEvent.pageY || t.originalEvent.touches[0].pageY,
            !1)
        }).on("touchmove.simplelb mousemove.simplelb pointermove MSPointerMove", function (t) {
          if (!h) return !0;
          t.preventDefault(), l = t.originalEvent.pageX || t.originalEvent.touches[0].pageX, p = t
            .originalEvent.pageY || t.originalEvent.touches[0].pageY, o = a - l, s = r - p, n
            .animationSlide && (g ? W(0, -o + "px") : A.css("left", u - o + "px"))
        }).on(
          "touchend.simplelb mouseup.simplelb touchcancel.simplelb mouseleave.simplelb pointerup pointercancel MSPointerUp MSPointerCancel",
          function (t) {
            if (h) {
              h = !1;
              var e = !0;
              n.loop || (0 === D && o < 0 && (e = !1), D >= d.length - 1 && o > 0 && (e = !1)), Math.abs(o) > n
                .swipeTolerance && e ? j(o > 0 ? 1 : -1) : n.animationSlide && (g ? W(n.animationSpeed / 1e3,
                  "0px") : A.animate({
                  left: u + "px"
                }, n.animationSpeed / 2)), n.swipeClose && Math.abs(s) > 50 && Math.abs(o) < n.swipeTolerance &&
                H()
            }
          })
      },
      N = function () {
        k.off("click", "button"), t(i).off("click." + E, ".sl-close"), t(e).off("resize." + E), t(e).off(
          "hashchange." + E)
      },
      Y = function () {
        var e = D + 1 < 0 ? d.length - 1 : D + 1 >= d.length - 1 ? 0 : D + 1,
          i = D - 1 < 0 ? d.length - 1 : D - 1 >= d.length - 1 ? 0 : D - 1;
        t("<img />").attr("src", d.eq(e).attr(n.sourceAttr)).on("load", function () {
          -1 == p.indexOf(t(this).attr("src")) && p.push(t(this).attr("src")), d.eq(D).trigger(t.Event(
            "nextImageLoaded.simplelightbox"))
        }), t("<img />").attr("src", d.eq(i).attr(n.sourceAttr)).on("load", function () {
          -1 == p.indexOf(t(this).attr("src")) && p.push(t(this).attr("src")), d.eq(D).trigger(t.Event(
            "prevImageLoaded.simplelightbox"))
        })
      },
      j = function (e) {
        d.eq(D).trigger(t.Event("change.simplelightbox")).trigger(t.Event((1 === e ? "next" : "prev") +
          ".simplelightbox"));
        var i = D + e;
        if (!(q || (i < 0 || i >= d.length) && !1 === n.loop)) {
          D = i < 0 ? d.length - 1 : i > d.length - 1 ? 0 : i, t(".sl-wrapper .sl-counter .sl-current").text(D +
            1);
          var a = {
            opacity: 0
          };
          n.animationSlide && (g ? W(n.animationSpeed / 1e3, -100 * e - o + "px") : a.left = parseInt(t(
            ".sl-image").css("left")) + -100 * e + "px"), t(".sl-image").animate(a, n.animationSpeed,
          function () {
            setTimeout(function () {
              var i = d.eq(D);
              l.attr("src", i.attr(n.sourceAttr)), -1 == p.indexOf(i.attr(n.sourceAttr)) && S.show(), t(
                ".sl-caption").remove(), z(e), n.preloading && Y()
            }, 100)
          })
        }
      },
      H = function () {
        if (!q) {
          var e = d.eq(D),
            i = !1;
          e.trigger(t.Event("close.simplelightbox")), n.history && y(), t(
              ".sl-image img, .sl-overlay, .sl-close, .sl-navigation, .sl-image .sl-caption, .sl-counter")
            .fadeOut("fast", function () {
              n.disableScroll && K("show"), t(".sl-wrapper, .sl-overlay").remove(), N(), i || e.trigger(t.Event(
                "closed.simplelightbox")), i = !0
            }), l = t(), c = !1, q = !1
        }
      },
      K = function (n) {
        var a = 0;
        if ("hide" == n) {
          var o = e.innerWidth;
          if (!o) {
            var s = i.documentElement.getBoundingClientRect();
            o = s.right - Math.abs(s.left)
          }
          if (i.body.clientWidth < o) {
            var l = i.createElement("div"),
              r = parseInt(t("body").css("padding-right"), 10);
            l.className = "sl-scrollbar-measure", t("body").append(l), a = l.offsetWidth - l.clientWidth, t(i
              .body)[0].removeChild(l), t("body").data("padding", r), a > 0 && t("body").addClass(
              "hidden-scroll").css({
              "padding-right": r + a
            })
          }
        } else t("body").removeClass("hidden-scroll").css({
          "padding-right": t("body").data("padding")
        });
        return a
      };
    return n.close && T.appendTo(R), n.showCounter && d.length > 1 && (I.appendTo(R), I.find(".sl-total").text(d
      .length)), n.nav && k.appendTo(R), n.spinner && S.appendTo(R), d.on("click." + E, function (e) {
      if (O(this)) {
        if (e.preventDefault(), q) return !1;
        P(t(this))
      }
    }), t(i).on("click.simplelb touchstart." + E, function (e) {
      c && n.docClose && 0 === t(e.target).closest(".sl-image").length && 0 === t(e.target).closest(
        ".sl-navigation").length && H()
    }), n.disableRightClick && t(i).on("contextmenu", ".sl-image img", function (t) {
      return !1
    }), n.enableKeyboard && t(i).on("keyup." + E, function (t) {
      if (o = 0, c) {
        t.preventDefault();
        var e = t.keyCode;
        27 == e && H(), 37 != e && 39 != t.keyCode || j(39 == t.keyCode ? 1 : -1)
      }
    }), this.open = function (e) {
      e = e || t(this[0]), P(e)
    }, this.next = function () {
      j(1)
    }, this.prev = function () {
      j(-1)
    }, this.close = function () {
      H()
    }, this.destroy = function () {
      t(i).unbind("click." + E).unbind("keyup." + E), H(), t(".sl-overlay, .sl-wrapper").remove(), this.off(
        "click")
    }, this.refresh = function () {
      this.destroy(), t(this).simpleLightbox(n)
    }, this
  }
}(jQuery, window, document);

$(document).ready(function () {
  $('.filtr-container').css('visibility', 'hidden');
  $('.filtr-controls').after('<div class="filtr-loading"></div>');

  // init filterizr when images are loaded
  options = {
    callbacks: {
      onFilteringEnd: function () {
        // only visible items
        var gall = $('.filtr-controls span.active').attr('data-filter');
        $('.filtr-item').each(function () {
          if ($(this).css('opacity') != 0) {
            $(this).find('a').attr('data-simplelightbox', gall);
          } else {
            $(this).find('a').removeAttr('data-simplelightbox');
          }
        });
        // init simplelightbox
        //var lightbox = $('a[data-simplelightbox').simpleLightbox();
        //lightbox.destroy();
        var lightbox = $('a[data-simplelightbox="' + gall + '"]').simpleLightbox({
          showCounter: false,
          history: false,
          captionType: 'data',
          captionsData: 'caption'
        });
        lightbox.refresh();

      }
    },
    layout: 'sameWidth'
  }

  $('.filtr-container').imagesLoaded(function () {
    var filterizd = $('.filtr-container').filterizr(options);
    $('.filtr-container').css('visibility', 'visible');
    $('.filtr-loading').remove();
  });

  // active class for controls
  $('.filtr-controls').on('click', 'span', function () {
    $('.filtr-controls').find('span').removeClass('active');
    $(this).addClass('active');
  });

});