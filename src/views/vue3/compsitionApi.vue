<template>
    <div>
        <form action="">
            <input type="text" v-model="state2.stu.id">
            <input type="text" v-model="state2.stu.name">
            <input type="text" v-model="state2.stu.age">
            <input type="submit" @click="addStu">
        </form>
        <ul>
            <li v-for="(item,index) in state.student" 
            :key="item.is" @click="remove(index)">
                {{item.name}} -- {{item.age}}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
    setup() {
        const {state,remove} = useRemoveModule();
        const {state2,addStu} = useAddModule(state)
        return {state,state2,remove,addStu}
    },
})

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
</script>
