<template>
    <div class="container">
        <a-form layout="vertical" :form="form" @submit="handleSubmit">
            <a-form-item>
                <a-input placeholder="账号" v-model="user.name">
                    <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input type="password" placeholder="密码" v-model="user.password">
                    <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
            <a-button type="primary" html-type="submit" @click="handleLogin()">
                登录
            </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts">
import { computed, reactive } from 'vue';
import { useStore } from '../../src/store';
export default {
    setup(){
        const user =reactive({
            name:'',
            password:''
        })
        const handleLogin = ()=>{
            console.log(user)
            const store = useStore();
            console.log(store)
        }
        return {
            user,
            handleLogin
        }
    },
}
</script>
<style lang="">
    .container{
        width: 500px;
        margin: 0 auto;
    }
</style>