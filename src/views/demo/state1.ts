import { defineComponent, reactive } from 'vue'

// 独立的模块 删除逻辑
function useRemoveModule(){
    let state = reactive({
        student:[
            {id:1,name:'zs',age:10},
            {id:2,name:'ls',age:20},
            {id:3,name:'ww',age:30},
        ]
    })
    function add(index){
        state.student.push({
            id:4,name:'zs22',age:112
        })
    }
    function jian(index){
        state.student.pop()
    }
    return {state,add,jian}
}
export default useRemoveModule;