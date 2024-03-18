import { DomRender } from "./domRender";
import { nanoid } from 'nanoid'
export default class BaseVue {
  constructor(domList, data) {
    // 初始化 dom的操作对象
    this.domRender = new DomRender();
    const { bindModel, virtualTemplate, state } = this.bindMVVM(domList, data);
    this.bindModel = bindModel
    this.state = state
    this.virtualTemplate = virtualTemplate
  }
  bindMVVM(domList, data) {
    const bindModel = []
    const virtualTemplate = []
    for (let index = 0; index < domList.length; index++) {
      const element = domList[index];
      const id = nanoid();
      bindModel.push({ modelName: element.model, viewId: id, value: data[element.model] });
      virtualTemplate.push({ ...element, id })
    }
    // Proxy 版本写法
    const that = this
    const state = new Proxy(data, {
      get: function (target, key, receiver) {
        const ret = Reflect.get(target, key, receiver);
        return that.getVal(key);
      },
      set: function (target, key, value, receiver) {
        const ret = Reflect.set(target, key, value, receiver)
        that.update(key, value);
        return ret;
      }
    })

    // defineProxy版本写法
    // let state = {}
    // Object.keys(data).forEach((key) => {
    //   Object.defineProperty(state, key, {
    //     //但是默认是不可枚举的(for in打印打印不出来)，可：enumerable: true
    //     //默认不可以修改，可：wirtable：true
    //     //默认不可以删除，可：configurable：true
    //     get: function () {
    //       return that.getVal(key);
    //     },
    //     set: function (val) {
    //       personName = that.update(key, val);
    //     }
    //   })
    // })

    return { bindModel, virtualTemplate, state }
  };
  update(key, val) {
    // 更新model
    for (let index = 0; index < this.bindModel.length; index++) {
      const element = this.bindModel[index];
      if (element.modelName === key) {
        this.bindModel[index].value = val;
      }
    }
    // 更新view
    const ids = (this.bindModel.filter(item => item.modelName === key)).map(item => item.viewId);
    this.domRender.updateById(ids, val);
  };
  getVal(key) {
    return this.bindModel.find((item) => item.modelName === key).value;
  }
}