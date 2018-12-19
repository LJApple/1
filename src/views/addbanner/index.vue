<template>
  <div class="tree">
    <div class="t-left">
      <el-tree
        :data="nodeData"
        node-key="id"
        ref="tree"
        :draggable='draggable'
        @node-click = 'nodeClick'
        :props="defaultProps">
      </el-tree>
    </div>
    <div class="t-right">
      <div class="tr-btn">
        <el-input class="lv-input marginR10" v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="clickAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
        <el-button type="primary"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
        <el-button type="primary" @click="delMenu"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
      </div>
      <el-table
        class="table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @select="select"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column> -->
        <el-table-column width="50">
          <template slot-scope="scope1">
            <el-radio class="singleRadio" v-model="radio" :label="scope1.row.menuId" @change.native="getMenuId(scope1.row.menuId, scope1.$index)"></el-radio>
          </template>
        </el-table-column>
        <template v-for="item in tableThead">
          <el-table-column :key="item.menuId"
          :label="item.label"
          :prop="item.prop"
          >
          <template slot-scope="scope">
            <!-- <el-radio class="radio" v-model="scope.row." label="选中" @change.native="getCurrentRow(scope.$index)" >&nbsp;</el-radio> -->
            <el-switch
              v-if="scope.row[item.prop] === true || 
              scope.row[item.prop] === false"
              v-model="scope.row[item.prop]"
              active-text="是"
              inactive-text="否">
            </el-switch>
            <div v-else-if="scope.row[item.prop] === 0 ||
              scope.row[item.prop] === 1">
              <el-radio v-model="scope.row[item.prop]" :label="0">当前页面嵌套</el-radio>
              <el-radio v-model="scope.row[item.prop]" :label="1">打开新页面</el-radio>
            </div>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog :title="$t('views.addbanner.addbanner')" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form">
        <el-form-item :label="$t('views.addbanner.menuName')" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="打开方式" :label-width="formLabelWidth">
          <el-radio v-model="form.openType" :label="0">当前页面嵌套</el-radio>
          <el-radio v-model="form.openType" :label="1">打开新页面</el-radio>
        </el-form-item>
        <el-form-item label="打开地址" :label-width="formLabelWidth">
          <el-input v-model="form.openUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" type="number" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限分配" :label-width="formLabelWidth">
          <el-radio v-model="form.haveMenuPermission" label="true">是</el-radio>
          <el-radio v-model="form.haveMenuPermission" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="操作权限分配" :label-width="formLabelWidth">
          <el-radio v-model="form.haveFunctionPermission" label="true">是</el-radio>
          <el-radio v-model="form.haveFunctionPermission" label="false">否</el-radio>
        </el-form-item> -->
        <el-form-item label="是否冻结" :label-width="formLabelWidth">
          <el-radio v-model="form.isFreeze" :label="true">是</el-radio>
          <el-radio v-model="form.isFreeze" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否显示菜单" :label-width="formLabelWidth">
          <el-radio v-model="form.isShow" :label="true">是</el-radio>
          <el-radio v-model="form.isShow" :label="false">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="summitAddBanner()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMenu, getMenuTree, getListByPid, delMenu } from '@/api/menu'
export default {
  name: 'dashboard',
  data() {
    return {
      tableData: [],
      radio: '',
      tableThead: [
        {label: '菜单名称', prop: 'menuName'},
        {label: '菜单图标', prop: 'icon'},
        {label: '打开地址', prop: 'openUrl'},
        {label: '备注', prop: 'remark'},
        {label: '打开方式', prop: 'openType'},
        // {label: '权限分配', prop: 'haveMenuPermission'},
        // {label: '操作权限分配', prop: 'haveFunctionPermission'},
        {label: '是否冻结', prop: 'isFreeze'},
        {label: '是否显示菜单', prop: 'isShow'},
      ],
      multipleSelection: [],
      input: null,
      dialogFormVisible: false,
      form: {
        parentId: '', // 父Id
        menuName: '', // 菜单名称
        icon: '', // 菜单Icon
        openType: 0, // 打开方式：0：当前页面嵌套，1：打开新页面
        openUrl: '', // 打开地址
        remark: '', // 备注
        sort: '', // 排序
        // haveMenuPermission: true, // 模块是否具有权限分配
        // haveFunctionPermission: true, // 模块是否具有操作权限分配
        isFreeze: true, // 是否冻结
        isShow: true // 是否显示菜单
      },
      formLabelWidth: '100px',
      nodeData: [],
      // 重置树节点
      defaultProps: {
        label: 'name'
       },
      draggable: true, // 是否开启拖拽菜单
      nodeClickInfo: '',
      selectRowIndex: '' // 选中的行
    }
  },
  methods: {
    // table
    select(selection) {
      if (selection.length)  {
        this.$refs.tree.setCheckedKeys([selection[0].menuId])
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    // 获取table
    async getListByPid() {
      const pId = !this.nodeClickInfo ? '' : this.nodeClickInfo.id
      const {data, code} = await getListByPid(pId)
      if (code === 200 && data) {
        this.tableData = data
      }
      /* eslint-disable */
      console.log('data', code, data, this.tableData)
    },
    // table
    nodeClick(data) {
      this.nodeClickInfo = data
      this.getListByPid()
    },
    // 获取树结构菜单
    async getMenuTree() {
      const {data, code} = await getMenuTree()
      if (code === 200) this.nodeData = data
    },
    // 新增点击事件
    clickAdd() {
      this.dialogFormVisible = true
    },
    resetFields() {
      this.form = {
        parentId: '', // 父Id
        menuName: '', // 菜单名称
        icon: '', // 菜单Icon
        openType: 0, // 打开方式：0：当前页面嵌套，1：打开新页面
        openUrl: '', // 打开地址
        remark: '', // 备注
        sort: '', // 排序
        haveMenuPermission: true, // 模块是否具有权限分配
        haveFunctionPermission: true, // 模块是否具有操作权限分配
        isFreeze: true, // 是否冻结
        isShow: true // 是否显示菜单
      }
    },
    // 添加菜单
    async summitAddBanner() {
      if (this.nodeClickInfo) this.form.parentId = this.nodeClickInfo.id
      const { data, code, message } = await addMenu(this.form)
      if (code === 500) {
         this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      } else if (code === 200) {
        this.dialogFormVisible = false
        this.getMenuTree()
        this.getListByPid()
        this.resetFields()
        this.$message.success('添加菜单成功')
      }
    },
    // 删除菜单
    async delMenu() {
      const { data, code, message } = await delMenu(this.nodeClickInfo.id)
      if (code === 200) {
        this.$message.success('删除菜单成功')
        this.$refs.tree.remove(this.nodeClickInfo.id)
        this.tableData.splice(this.selectRowIndex, 1)
      } else {
        this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      }
    },
    getMenuId(menuId, index) {
      if (!this.nodeClickInfo) this.nodeClickInfo = {}
      this.nodeClickInfo.id = menuId
      this.selectRowIndex = index
    }
  },
  created() {
    this.getMenuTree()
    this.getListByPid()
  }
}
</script>

<style lang="stylus" scoped>
.tree
  display flex
  .t-left
    width 300px
    margin-right 10px
  .t-right
    width 100%
  .tr-btn
    margin-bottom 20px
    display flex
  .table .el-radio+.el-radio
    margin-left 0 !important
</style>
