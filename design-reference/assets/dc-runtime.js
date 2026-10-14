/* Folk & Form — tiny page runtime.
   Renders each page's <template> with its component's data and keeps it up to date
   when the page's state changes (size buttons, carousel, tabs…). No build step needed. */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = undefined; }
    setState(p) {
      const prev = this.state || {};
      const patch = typeof p === 'function' ? p(prev, this.props) : p;
      this.state = Object.assign({}, prev, patch);
      if (this.__update) this.__update();
    }
    forceUpdate() { if (this.__update) this.__update(); }
  }
  window.DCLogic = DCLogic;

  const registry = {};
  const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  const FULL = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^(['"]).*\1$/.test(expr)) return expr.slice(1, -1);
    let v = scope;
    for (const part of expr.split('.')) { if (v == null) return undefined; v = v[part]; }
    return v;
  }

  function interp(str, scope) {
    const m = FULL.exec(str);
    if (m) return lookup(m[1], scope);
    return str.replace(HOLE, (_, e) => { const v = lookup(e, scope); return v == null ? '' : String(v); });
  }

  const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  function renderNodes(list, scope, out) {
    for (const n of Array.from(list)) renderNode(n, scope, out);
    return out;
  }

  function loop(listExpr, as, scope, each) {
    const list = interp(listExpr, scope) || [];
    list.forEach((item, i) => { const s = Object.assign({}, scope); s[as] = item; s.$index = i; each(s); });
  }

  function renderNode(node, scope, out) {
    if (node.nodeType === 3) {
      const t = node.nodeValue;
      if (t.indexOf('{{') < 0) { out.push(document.createTextNode(t)); return; }
      const v = interp(t, scope);
      out.push(document.createTextNode(v == null ? '' : String(v)));
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-for') {
      loop(node.getAttribute('list') || '', node.getAttribute('as') || 'item', scope, (s) => renderNodes(node.childNodes, s, out));
      return;
    }
    if (tag === 'sc-if') {
      if (interp(node.getAttribute('value') || '', scope)) renderNodes(node.childNodes, scope, out);
      return;
    }
    if (tag === 'dc-import') {
      const name = node.getAttribute('name');
      const Cls = registry[name];
      if (!Cls) return;
      const props = {};
      for (const a of Array.from(node.attributes)) {
        if (a.name === 'name' || a.name.indexOf('hint-') === 0) continue;
        props[camel(a.name)] = interp(a.value, scope);
      }
      renderComponent(name, new Cls(props), out);
      return;
    }
    if (node.hasAttribute('dc-for')) {
      loop(node.getAttribute('dc-for'), node.getAttribute('dc-as') || 'item', scope, (s) => out.push(buildEl(node, s, true)));
      return;
    }
    out.push(buildEl(node, scope, false));
  }

  function buildEl(node, scope, skipFor) {
    const el = document.createElementNS(node.namespaceURI, node.localName);
    for (const a of Array.from(node.attributes)) {
      if (skipFor && (a.name === 'dc-for' || a.name === 'dc-as')) continue;
      if (a.name.indexOf('hint-') === 0) continue;
      if (a.name.indexOf('on') === 0 && FULL.test(a.value)) {
        const fn = interp(a.value, scope);
        if (typeof fn === 'function') (el.__dcEvents || (el.__dcEvents = {}))[a.name.slice(2).toLowerCase()] = fn;
        continue;
      }
      const v = a.value.indexOf('{{') < 0 ? a.value : interp(a.value, scope);
      if (v === false || v == null) continue;
      el.setAttributeNS(a.namespaceURI, a.name, v === true ? '' : String(v));
    }
    for (const k of renderNodes(node.childNodes, scope, [])) el.appendChild(k);
    return el;
  }

  function renderComponent(name, inst, out) {
    const tpl = document.getElementById('tpl-' + name);
    const vals = (inst.renderVals && inst.renderVals()) || {};
    return renderNodes(tpl.content.childNodes, vals, out || []);
  }

  /* Events: one real listener per element and type, pointing at the latest handler. */
  function bind(el) {
    const ev = el.__dcEvents;
    if (!ev) return;
    const bound = el.__dcBound || (el.__dcBound = {});
    for (const t in ev) {
      if (bound[t]) continue;
      bound[t] = true;
      el.addEventListener(t, (e) => { const h = el.__dcEvents && el.__dcEvents[t]; if (h) h(e); });
    }
  }
  function wire(n) { if (n.nodeType !== 1) return; bind(n); for (const c of Array.from(n.children)) wire(c); }

  /* Update the page in place so CSS transitions (the carousel slide) still animate. */
  function syncAttrs(o, n) {
    const keepOpen = o.localName === 'details';
    for (const a of Array.from(o.attributes)) {
      if (keepOpen && a.name === 'open') continue;
      if (!n.hasAttribute(a.name)) o.removeAttribute(a.name);
    }
    for (const a of Array.from(n.attributes)) {
      if (keepOpen && a.name === 'open') continue;
      if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
    }
  }
  function morph(parent, kids) {
    const old = Array.from(parent.childNodes);
    kids.forEach((n, i) => {
      const o = old[i];
      if (!o) { parent.appendChild(n); wire(n); return; }
      const same = o.nodeType === n.nodeType && (o.nodeType !== 1 || (o.namespaceURI === n.namespaceURI && o.localName === n.localName));
      if (!same) { parent.replaceChild(n, o); wire(n); return; }
      if (o.nodeType !== 1) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
      syncAttrs(o, n);
      o.__dcEvents = n.__dcEvents;
      bind(o);
      morph(o, Array.from(n.childNodes));
    });
    for (let j = old.length - 1; j >= kids.length; j--) parent.removeChild(old[j]);
  }

  window.DC = {
    define(name, Cls) { registry[name] = Cls; },
    img(id) { return (window.DC_IMAGES && window.DC_IMAGES[id]) || ('images/' + id + '.svg'); },
    mount(name) {
      const inst = new registry[name]({});
      const root = document.getElementById('app');
      inst.__update = () => morph(root, renderComponent(name, inst));
      inst.__update();
      if (inst.componentDidMount) inst.componentDidMount();
      window.addEventListener('pagehide', () => { if (inst.componentWillUnmount) inst.componentWillUnmount(); });
    }
  };
})();
