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
        <el-button type="primary" @click="getMenuInfo"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
        <el-button type="primary" @click="delMenu"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
        <el-button type="primary" @click="getButtonList"><i class="el-icon-delete el-icon--left"></i>功能授权</el-button>
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
          min-width="150"
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
    <el-dialog :title="$t('views.addbanner.addbanner')" 
    :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="form" :model="form">
        <el-form-item label="上级菜单" class="selectTree">
          <select-tree @selected="selectedId" width="300" :options="nodeData" v-model="selected" />
        </el-form-item>
        <el-form-item :label="$t('views.addbanner.menuName')" :label-width="formLabelWidth">
          <el-input class="lv-input300" ref="labelInput" v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="菜单图标" :label-width="formLabelWidth">
          <el-input class="lv-input300" v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="打开方式" :label-width="formLabelWidth">
          <el-radio v-model="form.openType" :label="0">当前页面嵌套</el-radio>
          <el-radio v-model="form.openType" :label="1">打开新页面</el-radio>
        </el-form-item>
        <el-form-item label="打开地址" :label-width="formLabelWidth">
          <el-input class="lv-input300" v-model="form.openUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input  class="lv-input300" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input class="lv-input300" v-model="form.sort" type="number" autocomplete="off"></el-input>
        </el-form-item>
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
     <!-- dialog 功能列表-->
    <el-dialog title="功能授权" :visible.sync="dialogBtnVisible">
      <div class="btn-list">
        <el-button v-for="(item, index) in btnList" :key="index"
        @click="bindBtn(item.buttonId)" type="primary">{{item.buttonName}}
        <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBtnVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogBtnVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMenu, getMenuTree, getListByPid, delMenu, getMenuButtonList, postButtonList, delButtonList, getMenuInfo, editMenu } from '@/api/menu'
import SelectTree from '@/components/selectTree'
export default {
  name: 'dashboard',
  components: {
    SelectTree
  },
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
      dialogBtnVisible: false,
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
        parent: 'id',
        value: 'pId',
        label: 'name',
        children: 'children'
      },
      draggable: true, // 是否开启拖拽菜单
      nodeClickInfo: '',
      selectRowIndex: '', // 选中的行
      btnList: [], // 功能btn列表
      
      // 选择树
       // 默认选中值
      selected: ''
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
    },
    // table
    nodeClick(data) {
      if (!data.children.length) return
      this.nodeClickInfo = data
      this.getListByPid()
    },
    // 获取树结构菜单
    async getMenuTree() {
      const {data, code} = await getMenuTree()
      if (code === 200) this.nodeData = data
      console.log('this.nodeData', this.nodeData)
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
        isShow: true, // 是否显示菜单
      }
    },
    // 添加菜单
    async summitAddBanner() {
      // if (!this.form.parentId && this.nodeData.length) return this.$alert('请选中上级菜单', '提示', {confirmButtonText: '确定'})
      const { code, message } = await addMenu(this.form)
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
    delMenu() {
      this.$confirm('菜单将会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success, message } = await delMenu(this.nodeClickInfo.id)
        if (success) {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })     
      })
    },
    getMenuId(menuId, index) {
      if (!this.nodeClickInfo) this.nodeClickInfo = {}
      this.nodeClickInfo.id = menuId
      this.selectRowIndex = index
    },
    selectedId(data) {
      this.form.parentId = data
    },
    // 获取功能列表
    async getButtonList() {
      if (!this.nodeClickInfo) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      this.dialogBtnVisible = true
      const { data, success } = await getMenuButtonList(this.nodeClickInfo.id)
      if (success) this.btnList = data
    },
    // 选择功能列表
    async bindBtn(buttonId) {
      if (!this.nodeClickInfo) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      const menuId = this.nodeClickInfo.id
      for (const item of this.btnList) {
        if (item.buttonId === buttonId) {
          if (!item.isCheck) {
            // 选中
            const {success} = await postButtonList({menuId,buttonId})
            if (success) item.isCheck = true
          } else {
            // 取消选中
            const {success} = await delButtonList({menuId,buttonId})
            if (success) item.isCheck = false
          }
        }
      }
    },
    // 获取菜单信息
    async getMenuInfo() {
      if (!this.nodeClickInfo) return this.$alert('请选中需要编辑的行', '提示', {confirmButtonText: '确定'})
      this.dialogFormVisible = true
      const {success, data} = await getMenuInfo(this.nodeClickInfo.id)
      if (success) {
        this.selected = data.parentId
        console.log('this.selected', this.selected)
        this.form = data
      }
    },
    // 编辑菜单
    async eidtMenu() {
      const menuId = this.nodeClickInfo.id
      /* eslint-disable */
      const {success} = await editMenu(menuId, this.form)
    }
  },
  created() {
    this.getMenuTree()
    this.getListByPid()
  },
  mounted() {
    this.restaurants = this.nodeData
  }
}
</script>

<style lang="stylus" scoped>
.tree
  display flex
  .t-left
    min-width 200px
    margin-right 10px
  .t-right
    width 100%
  .tr-btn
    margin-bottom 20px
    display flex
  .table .el-radio+.el-radio
    margin-left 0 !important
.btn-list
  display flex
  flex-wrap wrap
.checkColor
  border 1px solid #fff
  color rgba(0, 0,0, 0)
  border-radius 100%
  box-sizing border-box
.selectTree
  display flex
  /deep/ .el-form-item__label
    width 100px
</style>
