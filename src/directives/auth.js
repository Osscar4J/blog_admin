import Store from '@/store'

let permissions = null

function checkAuth(key) {

    if (!permissions) {
        let userInfo = Store.getters.userInfo
        if (!userInfo) {
            return false
        }
        if (!userInfo.menus) {
            return false
        }
        permissions = {}
        for (let i = 0; i < userInfo.menus.length; i++) {
            const menu = userInfo.menus[i];
            if (menu.type == 2){
                permissions[menu.id] = true
                if (menu.subMenus){
                    for (let j = 0; j < menu.subMenus.length; j++) {
                        const subMenu = menu.subMenus[j];
                        if (subMenu.type == 2){
                            permissions[subMenu.id] = true
                        }
                    }
                }
            }
        }
    }

    return !!permissions[key]
}
  
const auth = {
    inserted: function (el, binding) {
        let auth = binding.value // 获取到 v-auth的值
        if (auth) {
        let authed = checkAuth(auth)
        if (!authed) {
            // 没有权限 移除Dom元素
            el.parentNode && el.parentNode.removeChild(el)
        }
        }
    },
}
  
export default auth