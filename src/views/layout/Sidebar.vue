<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      class="sidebar-menu"
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="bg"
      :text-color="tc"
      :active-text-color="atc">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarItem from './SidebarItem'
import { GetMenuAll } from '@/api/menu'
import _import from '@/utils/import'
export default {
  name: 'Sidebar',
  data() {
    return {
      bg: '#556d84',
      tc: '#fff',
      atc: '#41B883',
      permission_routers: []
    }
  },
  components: {
    sidebarItem
  },
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      if (this.sidebar.sliderState === 'full') {
        return false
      }
      return true
    }
  },
  created() {
    this.GetMenuAll()
  },
  methods: {
    // 获取菜单
    async GetMenuAll() {
      const { data } = await GetMenuAll()
      this.permission_routers = [
        {
            path: '',
            children: [{
              path: 'addbanner',
              name: 'addbanner',
              component: _import('addbanner/index'),
              meta: {
                title: 'addbanner',
                icon: 'dashboard'
              }
            }]
        }
      ]
      // this.permission_routers = [
      //   {
      //       path: 'dashboard',
      //       name: 'dashboard',
      //       component: _import('dashboard/index'),
      //       meta: {
      //         title: 'dashboard',
      //         icon: 'dashboard',
      //         noCache: true
      //       },
      //       children: [{
      //         path: '/test',
      //         name: 'test',
      //         component: '1',
      //         meta: {title: 'test'}
      //       },
      //       {
      //         path: '/test1',
      //         name: 'test1',
      //         component: '1',
      //         meta: {title: 'test1'}
      //       }
      //       ]
      //   }
      // ]
      /* eslint-disable */
      console.log(data, this.permission_routers)
    }
  }
}
</script>
