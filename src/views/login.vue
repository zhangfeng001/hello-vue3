<template>
  <a-form
    class="form"
    layout="vertical"
    :model="formState"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item>
      <a-input v-model:value="formState.userName" placeholder="Username" allowClear='true'>
        <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="formState.password" type="password" placeholder="Password" allowClear='true'>
        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
        <a-select
            class="select"
            v-model:value="formState.vueModel"
            style="width: 300px"
            @focus="focus"
            ref="select"
        >
            <a-select-option value="/list2">vue2</a-select-option>
            <a-select-option value="/list3">vue3</a-select-option>
        </a-select>
    </a-form-item>
    <a-form-item>
      <!-- <a-button
        type="primary"
        html-type="submit"
        :disabled="formState.user === '' || formState.password === ''"
      >
        Log in
      </a-button> -->
      <a-button
        class='btn'
        type="primary"
        html-type="submit"
      >
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">

    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
    import { notification } from 'ant-design-vue';
    import { reactive, watch } from 'vue';
    import { useStore } from '../store' 
    import { useRouter } from 'vue-router'
    export default {
        setup() {
            const router = useRouter();
            const store = useStore();
            const formState  = reactive({
                userName: '',
                password: '',
                token:'abc123456',
                vueModel:'/list3',
            });
            // 取缓存中的用户名和密码
            const localUserName = localStorage.getItem('userName');
            const localUserPsd = localStorage.getItem('userpsd');
            if( localUserName && localUserPsd ){
                formState.userName = localUserName
                formState.password = localUserPsd
            }
            // 监听模式切换
            watch( ()=> formState.vueModel, (value)=>{
                formState.vueModel = value
            })

            // 信息不完善提醒
            const openNotification = () => {
                notification.open({
                    message: '提示',
                    description:'请先完善信息~',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });
            } 
            // 提登录交
            const handleFinish = (values) => {
                if( formState.userName.trim() == '' || formState.password.trim() == '' ) {
                    openNotification();
                    return
                }
                if( !localUserName && !localUserPsd ){
                    localStorage.setItem('userName',formState.userName)
                    localStorage.setItem('userpsd',formState.password)
                }
                // 存 store
                store.commit('userModule/SET_TOKEN',{token:formState.token})
                store.commit('userModule/SET_USERNAME',{username:formState.userName})
                store.commit('userModule/SET_PSD',{psd:formState.password})
                // 用户名密码 存local
                router.push({
                    path:formState.vueModel,
                })
            };
            const handleFinishFailed = (errors) => {
                console.log(errors);
            };
            return {
                formState,
                handleFinish,
                handleFinishFailed,
                openNotification,
            };
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
        margin: 100px auto;
    }
    .ant-select{
        width: 300px;
    }
    .btn{
        width: 300px;
    }
</style>