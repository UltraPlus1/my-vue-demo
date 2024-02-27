import { DomRender } from "./domRender";
import template from './jsDom'
import { nanoid } from 'nanoid'
// 类比vue的data
const defaultData = {
  title: 'hello world',
  count: 0,
  randomNum: 33,
  btnLabel: 'count+1',
  btnLabel2: 'randomNum'
}

// 类比vue对象
class MyVue{
  constructor(domList, data) {
    // 初始化 dom的操作对象
    this.domRender = new DomRender();
    const { bindModel, virtualTemplate } = this.bindMVVM(domList, data);
    this.bindModel = bindModel
    // 定义方法
    this.methods = {
      AddCount: () => {
        const count = this.getVal('count');
        this.update('count', count + 1)
      },
      GenRandomNum: () => {
        const newCount = Math.floor(Math.random() * 100)
        this.update('randomNum', newCount)
      }
    };
    this.domRender.initRender(virtualTemplate, data, this.methods)
  }
  bindMVVM(domList, data) {
    const bindModel = []
    const virtualTemplate = []
    for (let index = 0; index < domList.length; index++){
      const element = domList[index];
      const id = nanoid();
      bindModel.push({ modelName: element.model, viewId: id, value: data[element.model] });
      virtualTemplate.push({...element,id})
    }
    return {bindModel,virtualTemplate}
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

// 假想的vue实例
const instance = new MyVue(template.domList,defaultData)