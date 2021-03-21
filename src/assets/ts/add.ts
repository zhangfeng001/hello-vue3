import { defineComponent, reactive } from 'vue'

// 独立模块 增加逻辑
function useAddModule(state){
    let state2 = reactive({
            stu:{
                id:'',
                name:'',
                age:''
            }
        })
        function addStu(e){
            e.preventDefault();
            const stu = Object.assign({},state2.stu)
            state.student.push(stu)
        }
        return {state2,addStu}
}

export default useAddModule;