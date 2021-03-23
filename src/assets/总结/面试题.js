////////////// 直接赋值：
let foo = [1,2]
let bar = foo
console.log(bar) // [1,2]
bar.push(33)
console.log(bar) // [1,2,33]
console.log(foo) // [1,2,33]

/////////////// 浅拷贝
// 使用方法
// 1.Object.assign()
 let foo = {a:1,b:2,c:[33,44]}
 let bar = Object.assign({},foo)
 console.log(bar) // {a:1,b:2,c:[33,44]}

 bar.a = 111
 console.log(bar) // {a:111,b:2,c:[33,44]}
 console.log(foo) // {a:1,b:2,c:[33,44]}  不变

 bar.c.push(555)
 console.log(bar) // {a:1,b:2,c:[33,44,555]}
 console.log(foo) // {a:1,b:2,c:[33,44,555]} 变化了
//  除了Object.assign() 我们ES6用到的 let  bar = {...foo}
//  原生写法
    function shallowCopy(src){
        var dst = {}
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                det[prop] = src[prop]
            }
        }
        return dst
    }

let bar = shallowCopy(foo)

////////////////深拷贝
// 递归
let deepCopy = (obj)=>{
    let ret = {}
    for (var key in obj) {
        let value = obj[key]
        ret[key] = typeof value === 'object' ? deepCopy(value) : value  // 如果椒引用类型就递归
    }
    return ret
}


let foo = {a:1,b:2,c:[33,44]}
let bar = deepCopy(foo)
console.log(bar) // {a:1,b:2,c:[33,44]}

foo.a=111
console.log(foo) // {a:111,b:2,c:[33,44]}
console.log(foo) // {a:1,b:2,c:[33,44]} // 不变

foo.c.push(55)
console.log(foo) // {a:1,b:2,c:[33,44,55]}
console.log(foo) // {a:1,b:2,c:[33,44]} // 不变

//还有 let bar = JSON.parse(JSON.stringify(foo)) 也是深拷贝
