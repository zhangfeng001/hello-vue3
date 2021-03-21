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
    //删除逻辑
    function remove(index){
        state.student = state.student.filter( (it,idx) => index !== idx)
    }
    return {state,remove}
}
export default useRemoveModule;