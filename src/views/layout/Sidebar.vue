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
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarItem from './SidebarItem'
// import { GetMenuAll } from '@/api/menu'
// import _import from '@/utils/import'
export default {
  name: 'Sidebar',
  data() {
    return {
      bg: '#556d84',
      tc: '#fff',
      atc: '#41B883',
      routes: []
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
  async created() {
    const res = await this.$store.dispatch('getMenuAll')
    this.routes = res.data
  }
}
</script>
