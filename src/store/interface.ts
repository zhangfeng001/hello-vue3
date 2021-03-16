// 测试模块 state引入
import UserModuleTypes from './modules/user/interface'
// root层state定义
export default interface RootStateTypes {
    test : string
}
// vuex所有state；类型集成定义
export interface AllStateTypes extends RootStateTypes {
    userModule:UserModuleTypes
}
