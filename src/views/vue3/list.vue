<template>
    <div>
        <div class="topPageination">
            <div>
                分页：<a-switch checked-children="开" un-checked-children="关" v-model:checked="checked" />
            </div>
            <div style="margin-left:30px" v-show="!checked" >
                不分页显示数量：<a-select v-model:value="valueSelect" style="width: 120px">
                    <a-select-option v-for="items in listSelect" :key="items" :value="items">{{items}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div>
            <div class="topP"></div>
            <div v-for="item in tagList.list" :key="item.id" class="listBox" @click.self="handleToDetail(item.id)">
                <img :src="item.img" alt="">
                <p>{{item.title}}</p>
                <p><a-input v-model:value="item.input1" placeholder="Basic usage" /></p>
                <p><input type="text" v-model="item.input2" placeholder="Basic usage" /></p>
                <p>
                    <a-select style="width: 120px">
                        <a-select-option v-for="items in item.select" :key="items.id" :value="items">{{items}}</a-select-option>
                    </a-select>
                </p>
            </div>
            <div v-show="checked" class="bottomP"></div>
        </div>
        <div v-show="checked" class="bottomPageination">
            <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" show-size-changer show-quick-jumper @change="onChange" @showSizeChange="showSizeChange" />
        </div>
    </div>
</template>
<script lang="ts">
import { reactive,ref,toRefs,watch } from 'vue'
import { useRouter } from 'vue-router';
// 数据库数据
import todoList from "../../assets/list.json"
export default {
    setup(){
        //  页面渲染数据
        const tagList =  reactive({
            List:[]
        })

        // 开关
        const state = reactive({
            checked:false
        })
        //不分页数量开关
        const noSelect = reactive({
            valueSelect:100,
            listSelect:[100,200,300,400,500]
        })
        tagList.list = todoList.slice(0,noSelect.valueSelect)
        
        watch(()=>noSelect.valueSelect, (nval)=>{
            current.value = 1
            pageSize.value = 10
            tagList.list = todoList.slice(0,nval)
            scrollTo(0,0)
        })

        //监听分页开关变化
        watch(()=>state.checked, (nval)=>{
           if (nval) { // 打开开关
            total.value = todoList.length
            tagList.list = todoList.slice((current.value-1)*pageSize.value,current.value*pageSize.value)
           } else { // 关闭开关
            current.value = 1
            pageSize.value = 10
            tagList.list = todoList.slice(0,noSelect.valueSelect)
           }
            scrollTo(0,0)
        })

        // 分页
        const current = ref<number>(1); //  当前页
        const pageSize = ref<number>(10); // 每页数量
        const total = ref<number>(0); // 每页数量
        const onChange = (pageNumber: number) => {
            let lists = todoList.slice((current.value-1)*pageSize.value,current.value*pageSize.value)
            tagList.list = lists
            scrollTo(0,0)
        };
        const showSizeChange = (pageNumber: number) => {
            current.value = 1
            let lists = todoList.slice((current.value-1)*pageSize.value,current.value*pageSize.value)
            tagList.list = lists
            scrollTo(0,0)
        };

        // 路由跳转
        const router = useRouter()
        function handleToDetail(id){
            router.push({
                path: '/detail3',
                query: {
                    id,
                },
            })
        }
        return {
            tagList,
            ...toRefs(state),
            ...toRefs(noSelect),
            current,
            pageSize,
            total,
            onChange,
            showSizeChange,
            handleToDetail
        }
    }
}
</script>

<style scoped>
.listBox{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0 10px 0;
    border: 1px solid #ccc;
}
.listBox img {
    height: 100%;
}
.topPageination{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    z-index: 999;
    background-color: #eeeeee;
    position: fixed;
    top: 0;
    left: 0;
}
.topP{
    width: 100%;
    height: 60px;
    background-color: #fff;
}
.bottomP{
    background-color: #ffffff;
    width: 100%;
    height: 60px;
}
.bottomPageination{
    background-color: #eeeeee;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
}
</style>