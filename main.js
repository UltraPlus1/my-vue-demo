import template from './jsDom'
import BaseVue from "./BaseVue";
// 类比vue的data
const defaultData = {
  title: 'hello world',
  count: 0,
  randomNum: 33,
  btnLabel: 'count+1',
  btnLabel2: 'randomNum',
  msgLabel: 'sendMsg111'
}
// 类比vue对象
class MyVue extends BaseVue {
  constructor(domList, data) {
    super(domList, data)
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
        // // 1. 创建一个 new XMLHttpRequest 对象
        // let xhr = new XMLHttpRequest();

        // // 2. 配置它：从 URL 
        // xhr.open('GET', '/api/test');

        // // 3. 通过网络发送请求
        // xhr.send();

        // // 4. 当接收到响应后，将调用此函数
        // xhr.onload = ()=> {
        //   if (xhr.status != 200) { // 分析响应的 HTTP 状态
        //     alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        //   } else { // 显示结果
        //     this.state.btnLabel = xhr.response;
        //   }
        // };
        // fetch API
        fetch('/api/test')
          .then(res => {
            if (!res.ok) {
              throw new Error('请求错误！状态码为：', res.status)
            }
            return res.text()
          }).then(data => {
            this.state.btnLabel = data;
          })
      }
    };
    this.domRender.initRender(this.virtualTemplate, data, this.methods)
  }
}

// 假想的vue实例
const instance = new MyVue(template.domList, defaultData)