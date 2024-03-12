import { DomRender } from "./domRender";
import template from './jsDom'
import { nanoid } from 'nanoid'
// 类比vue的data
const defaultData = {
  title: 'hello world',
  count: 0,
  randomNum: 33,
  btnLabel: 'count+1',
  btnLabel2: 'randomNum',
  msgLabel:'sendMsg111'
}

// 类比vue对象
class MyVue{
  constructor(domList, data) {
    // 初始化 dom的操作对象
    this.domRender = new DomRender();
    const { bindModel, virtualTemplate,state } = this.bindMVVM(domList, data);
    this.bindModel = bindModel
    this.state = state
    // 定义方法
    this.methods = {
      AddCount: () => {
        this.state.count += 1;
      },
      GenRandomNum: () => {
        this.state.randomNum = Math.floor(Math.random() * 100)
      },
      updateLabel: (event) => {
        const val = event.srcElement.value
        this.state.btnLabel = val
      },
      fetchMsg: () => {
        console.log('fetchMsg')
        // 1. 创建一个 new XMLHttpRequest 对象
        let xhr = new XMLHttpRequest();

        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('GET', '/api/test');

        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = ()=> {
          if (xhr.status != 200) { // 分析响应的 HTTP 状态
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
          } else { // 显示结果
            this.state.btnLabel = xhr.response;
          }
          
        };
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
    // Proxy API 优化
    const that = this
    const state = new Proxy(data,{
      get:function(target,key,receiver) {
        const ret = Reflect.get(target, key, receiver);
        return that.getVal(key);
      },
      set:function(target,key,value,receiver) {
        const ret = Reflect.set(target, key, value, receiver)
        that.update(key, value);
        return ret;
      }
  })
    return {bindModel,virtualTemplate,state}
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