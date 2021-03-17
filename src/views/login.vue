<template>
  <a-form
    class="form"
    layout="vertical"
    :model="formState"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item>
      <a-input v-model:value="formState.userName" placeholder="Username">
        <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="formState.password" type="password" placeholder="Password">
        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="formState.user === '' || formState.password === ''"
      >
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">

    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
    import { reactive, computed } from 'vue';
    import { useStore } from '../store' 
    import { useRouter } from 'vue-router'
    export default {
        setup() {
            const router = useRouter();
            const store = useStore();
            const formState  = reactive({
                userName: '',
                password: '',
            });
            // 取缓存中用户名和密码
            const lUserName = localStorage.getItem('userName');
            const lPsd = localStorage.getItem('password');
            console.log(lUserName)
            console.log(lPsd)
            // if( lUserName && lPsd ){
                    
            // }
            const handleFinish = (values) => {
                const token = 'abc123456'
                store.commit('userModule/SET_TOKEN',{token})
                // 用户名密码 存local
                router.push({
                    path:'/list2',
                })
            };
            const handleFinishFailed = (errors) => {
                console.log(errors);
            };
            return {
                formState,
                handleFinish,
                handleFinishFailed,
            };
        },
        onMounted(){

        },
        components: {
            UserOutlined,
            LockOutlined,
        },
    };
</script>
<style >
    .form{
        width: 300px;
        margin: 0 auto;
    }
</style>