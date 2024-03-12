// 类比vue的template
export default {
    domList: [
        {
            type: 'h1',
            model:'title',
        },
        {
            type: 'h2',
            model:'count'
        },
        {
            type: 'h1',
            model:'randomNum'
        },
        {
            type: "button",
            model: 'btnLabel',
            events: [
                {type:'click',methodName:'AddCount'}
            ]
        },
        {
            type: "input",
            model: 'btnLabel',
            events: [
                {type:'input',methodName:'updateLabel'}
            ]
        },
        {
            type: "button",
            model: "btnLabel2",
            events: [
                {type:'click',methodName:'GenRandomNum'}
            ]
        },
        {
            type: "button",
            model: 'msgLabel',
            events: [
                {type:"click", methodName:'fetchMsg'}
            ]
        }
    ]
}