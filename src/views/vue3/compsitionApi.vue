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
import useAddModule from '../../assets/ts/add'
import useRemoveModule from '../../assets/ts/remove'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
    setup() {
        const {state,remove} = useRemoveModule();
        const {state2,addStu} = useAddModule(state)
        return {state,state2,remove,addStu}
    },
})

</script>
