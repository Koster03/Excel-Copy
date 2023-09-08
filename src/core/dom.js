class Dom {
  constructor(selector) {
    this.$el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
  }

  html(html) {
    if (typeof html === "string") {
      this.$el.innerHTML = html;
      return this;
    }

    return this.$el.outerHTML.trim();
  }

  clear() {
    this.html("");
    return this;
  }

  on(eventType, calback) {
    this.$el.addEventListener(eventType, calback);
  }

  get data() {
    return this.$el.dataset;
  }

  css(styles = {}) {
    Object.keys(styles).forEach((key) => {
      this.$el.style[key] = styles[key];
    });
  }

  text(text) {
    if (typeof text === "string") {
      this.$el.textContent = text;
      return this;
    }
    if (this.$el.tagName.toLowerCase() === "input") {
      return this.$el.value.trim();
    }
    return this.$el.textContent.trim();
  }

  id(parse) {
    if (parse) {
      const parsed = this.id().split(':')
      return {
        row: +parsed[0],
        col: +parsed[1]
      }
    }
    return this.data.id
  }

  addClass(className) {
    this.$el.classList.add(className);
  }

  removeClass(className) {
    this.$el.classList.remove(className);
  }

  focus() {
    this.$el.focus();
    return this;
  }

  find(selector) {
    return $(this.$el.querySelector(selector));
  }

  findAll(selector) {
    return this.$el.querySelectorAll(selector);
  }

  off(eventType, calback) {
    this.$el.removeEventListener(eventType, calback);
  }

  getCoords() {
    return this.$el.getBoundingClientRect();
  }

  closest(selector) {
    return $(this.$el.closest(selector));
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el;
    }

    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }

    return this;
  }
}

export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = "") => {
  const el = document.createElement(tagName);
  if (classes) {
    el.classList.add(classes);
  }

  return $(el);
};
