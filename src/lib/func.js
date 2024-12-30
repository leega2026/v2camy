import Vue from 'vue'

export default {
  clearData(obj) {
    if (obj.ups && obj.ups.length != 0) {
      obj.ups.forEach((o) => {
        delete o.range
        delete o.selecs
      })
    }
    if (obj.downs && obj.downs.length != 0) {
      obj.downs.forEach((o) => {
        delete o.range
        delete o.selecs
      })
    }
    return obj
  },
  _addComp(dom, comp, id, listId) {
    const mountNode = document.createElement('div');
    mountNode.id = `${id}${parseInt(Math.random()*100000)}`;

    var MyPartial = Vue.extend(comp);
    const partial = new MyPartial();
    if (listId) {
      partial._data.listId = listId
    }
    dom.append(mountNode);
    partial.$mount(`#${mountNode.id}`);

    return partial._data
  },
  addComp(dom, comp, id, listId, p) {
    var MyPartial = Vue.extend(comp);
    const partial = new MyPartial().$mount()
    if (listId) {
      partial._data.listId = listId
    }
    partial.$parent = p
    dom.append(partial.$el);
    return partial._data
  },
  addCompMutil(dom, comp, num, p, fn) {
    const mountNode = document.createElement('div')
    var MyPartial = Vue.extend(comp)
    for(var i = 0; i < num; i++) {
      const partial = new MyPartial()
      // if (listId) {
      //   partial._data.listId = listId
      // }
      partial._data.listId = i
      partial.$parent = p
      fn(partial._data, i)
      mountNode.append(partial.$mount().$el)
    }
    dom.append(mountNode)
  },
  addMainComp(dom, comp, id) {
    const mountNode = document.createElement('div');
    mountNode.id = id;

    var MyPartial = Vue.extend(comp);
    const partial = new MyPartial();
    dom.append(mountNode);
    partial.$mount(`#${id}`);
    return partial
  },
  match(obj1, obj2) {
    obj2.checked = obj1.checked
    obj1.lists.forEach((v, i) => {
      obj2.lists[i].val = v.val
    })
  }
}