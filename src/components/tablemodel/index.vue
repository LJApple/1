<template>
    <div>
        <div class="tr-btn">
             <!-- <el-input class="lv-input marginR10" v-model="input" placeholder="请输入内容"></el-input> -->
            <el-button type="primary" v-if="butttonList.includes('clickAdd')" @click="clickAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickEdit')" @click="clickEdit"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickDel')" @click="clickDel"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickMenuAut')" @click="clickMenuAut"><i class="el-icon-circle-check el-icon--left"></i>菜单授权</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickButtonAut')" @click="clickButtonAut"><i class="el-icon-circle-check el-icon--left"></i>功能授权</el-button>
             <el-button type="primary" v-if="butttonList.includes('clickDataAut')" @click="clickDataAut"><i class="el-icon-circle-check el-icon--left"></i>数据授权</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickFieldAut')" @click="clickFieldAut"><i class="el-icon-circle-check el-icon--left"></i>字段授权</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickBusinessAut')" @click="clickBusinessAut"><i class="el-icon-circle-check el-icon--left"></i>业务授权</el-button>
            <el-button type="primary" v-if="butttonList.includes('clickRoleAut')" @click="clickRoleAut"><i class="el-icon-circle-check el-icon--left"></i>角色授权</el-button>
        </div>
        <el-table
            class="table"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            highlight-current-row
        >
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <template v-for="(item, index) in tableThead">
            <el-table-column style="{display: item.hidden === true ? 'none': ''}" 
            v-if="item.hidden !== true" :key="index"
            :label="item.label"
            :prop="item.prop"
            min-width="150">
            <template slot-scope="scope">
                <div v-if="scope.row[item.prop] === true">是</div>
                <div v-else-if="scope.row[item.prop] === false">否</div>
                <div v-else-if="item.hasOwnProperty('prop2') === true">{{scope.row[item.prop2]}}</div>
                <div v-else>{{scope.row[item.prop]}}</div>
            </template>
            </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
export default {
  name: 'demo',
  props: {
    tableData: {
        type: Array,
        required: true
    },
    tableThead: {
        type: Array,
        required: true
    },
    butttonList: {
        type: Array
    }
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    // 点击--选中
    handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
    },
    // 点击--新增
    clickAdd() {
        this.$emit('clickAdd')
    },
    // 点击--编辑
    clickEdit() {
        this.$emit('clickEdit')
    },
    // 点击--删除
    clickDel() {
        this.$emit('clickDel')
    },
    // 点击--菜单授权
    clickMenuAut() {
        this.$emit('clickMenuAut')
    },
    // 点击--功能授权
    clickButtonAut() {
        this.$emit('clickButtonAut')
    },
    // 点击--数据授权
    clickDataAut() {
        this.$emit('clickDataAut')
    },
    // 点击--字段授权
    clickFieldAut() {
        this.$emit('clickFieldAut')
    },
    // 点击--业务授权
    clickBusinessAut() {
        this.$emit('clickBusinessAut')
    },
    // 点击--角色授权
    clickRoleAut() {
        this.$emit('clickRoleAut')
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
</style>
