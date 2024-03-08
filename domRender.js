// 实现dom的渲染和双向数据绑定
export class DomRender {
    constructor() {
        this.app = document.getElementById('app')
    }
    initRender(jsDom, data, methods) {
        jsDom.forEach(item => {
            // render
            const newEle = document.createElement(item.type)
            newEle.id = item.id
            // input 特殊处理
            if (item.type !== 'input') {
                newEle.innerHTML = data[item.model] 
            } else {
                newEle.value = data[item.model]
            }
            this.app.appendChild(newEle)
            // bind Events
            if (item.events instanceof Array) {
                item.events.forEach(event => {
                    this.bindEvents(
                        newEle,
                        event.type,
                        methods[event.methodName]
                    )
                })
            }
        })
    };
    updateById(ids, val) {
        ids.forEach((id) => {
            const Ele = document.getElementById(id) || {};
            if (Ele.tagName === 'INPUT') {
                Ele.value = val; 
            } else {
                Ele.innerHTML = val;   
            }
        })
    };
    bindEvents(ele, event, methods) {
        ele.addEventListener(event,methods)
    }
}