<template>
  <div class="tree">
    <div class="t-right">
      <table-model 
        @handleSelectionChange="handleSelectionChange" 
        @clickAdd="clickAdd"
        @clickEdit="clickEdit"
        @clickDel="clickDel"
        @clickMenuAut="clickMenuAut"
        @clickButtonAut="clickButtonAut"
        @clickDataAut="clickDataAut"
        @clickFieldAut="clickFieldAut"
        :butttonList="butttonList"
        :tableData="tableData" 
        :tableThead="tableThead"></table-model>
    </div>
    <!-- dialog -->
    <el-dialog title="新增" 
    :visible.sync="dialogFormVisible" width="500px">
      <form-model :form="form" :tableThead="tableThead"></form-model>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isSummit === true" @click="clickSummit()">确 定</el-button>
        <el-button type="primary" v-else @click="eidtMenu()">确 定</el-button>
      </div>
    </el-dialog>
     <!-- dialog 功能列表-->
    <el-dialog title="功能授权" :visible.sync="dialogBtnVisible">
      <div class="dialog">
        <div class="t-left">
          <el-tree
            :data="nodeData"
            node-key="id"
            ref="leftTree"
            :draggable='draggable'
            @node-click = 'nodeClick'
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="t-right">
          <div class="btn-list">
            <el-button v-for="(item, index) in btnList" :key="index"
            @click="clickBindBtn(item.buttonId)" type="primary">{{item.buttonName}}
            <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- dialog 树授权-->
    <el-dialog title="菜单授权" :visible.sync="dialogMenuVisible">
      <div class="dialog">
        <el-tree
            :data="nodeData"
            node-key="id"
            ref="menuTrue"
            :draggable='draggable'
            show-checkbox
            default-expand-all
            :props="defaultProps">
          </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogMenuVisible = false">取 消</el-button>
          <el-button type="primary" @click="clickMenuSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- dialog 数据授权-->
    <el-dialog title="数据授权" :visible.sync="dialogDataVisible">
      <div class="dialog">
        <div class="t-left">
          <el-tree
            :data="nodeData"
            node-key="id"
            ref="leftTree"
            :draggable='draggable'
            @node-click = 'nodeClick'
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="t-right">
          <div class="btn-list">
            <el-button v-for="(item, index) in btnList" :key="index"
            @click="clickBindBtn(item.buttonId)" type="primary">{{item.buttonName}}
            <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- dialog 字段授权-->
    <el-dialog title="字段授权" :visible.sync="dialogFieldVisible">
      <div class="dialog">
        <div class="t-left">
          <el-tree
            :data="nodeData"
            node-key="id"
            ref="leftTree"
            :draggable='draggable'
            @node-click = 'nodeClick'
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="t-right">
          <div class="btn-list">
            <el-button v-for="(item, index) in btnList" :key="index"
            @click="clickBindBtn(item.buttonId)" type="primary">{{item.buttonName}}
            <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api/index'
import formModel from '@/components/formmodel'
import tableModel from '@/components/tablemodel'
export default {
  name: 'sysRoles',
  components: {
    formModel,
    tableModel
  },
  data() {
    return {
      tableData: [],
      butttonList: ['clickAdd', 'clickEdit', 'clickDel', 'clickMenuAut', 'clickButtonAut', 'clickDataAut', 'clickFieldAut'],
      tableThead: [
        {label: '角色Id', prop: 'roleId', hidden: true},
        {label: '角色名称', prop: 'roleName', tagType: 'input', type:"text"},
        {label: '是否禁用', prop: 'isDisable', tagType: 'radio', radioInfo: [{radioText: '是', radioLabel: true}, {radioText: '否', radioLabel: false}]},
        {label: '是否显示', prop: 'isShow', tagType: 'radio', radioInfo: [{radioText: '是', radioLabel: true}, {radioText: '否', radioLabel: false}]},
        {label: '排序', prop: 'sort', tagType: 'input', type:"number"},
        {label: '备注', prop: 'remark', tagType: 'input', type:"text"}
      ],
      form: {},
      multipleSelection: [],
      input: null,
      dialogFormVisible: false,
      dialogBtnVisible: false,
      dialogMenuVisible: false,
      dialogDataVisible: false, // 数据授权弹窗
      dialogFieldVisible: false, // 字段授权弹窗
      formLabelWidth: '100px',
      nodeClickInfo: '',
      selectRowIndex: '', // 选中的行
      selectedRowInfo: '', // 选中行信息
      btnList: [], // 功能btn列表
      isSummit: true, // 是否是添加菜单

      // 功能授权树列表
      nodeData: [],
      // 重置树节点
      defaultProps: {
        parent: 'id',
        value: 'pId',
        label: 'name',
        children: 'children'
      },
      draggable: true, // 是否开启拖拽菜单
      temArr: []
    }
  },
  methods: {
    // 重置表单
    resetFields() {
      const obj = {}
      for (const item of this.tableThead) {
        if(!item.hidden) {
          if (item.tagType === 'radio') {
            obj[item.prop] = true
          } else {
            obj[item.prop] = ''
          }
        }
      }
      this.form = {...this.form, ...obj}
    },
    // 获取--获取角色列表
    async getRoleList() {
      const {data, success, message} = await  Api.getComRoleList()
      if (success) {
        this.tableData = data
      } else {
        this.$message({
          message,
          type: 'error',
          duration: 1000,
          isDisable: true,
          showClose: true
        })
      }
    },
    // 获取--授权菜单列表
    async getMenuAuthList() {
      const {data, success, message} = await  Api.getComMenuAuthList({roleId: this.selectedRowInfo[0].roleId})
      if (success) {
        this.nodeData = data
        this.findTreeID(this.nodeData)
        /* eslint-disable */
        console.log('a111rr', this.temArr)
        this.$refs.menuTrue.setCheckedKeys(this.temArr)
        this.temArr = []
      } else {
        this.$message({
          message,
          type: 'error',
          duration: 1000,
          isDisable: true,
          showClose: true
        })
      }
    },

    // 获取树节点
    async findTreeID(arr) {
      for (const [index, item] of arr.entries()) {
        if (item.checked && item.children.length === 0) this.temArr.push(item.id)
        if (item.children.length > 0) {
          return this.findTreeID(arr[index].children)
        }
      }
    },
    // 获取-更具点击的菜单获取功能列表
    async getMenuButtonAuthList(menuId) {
      const { success, message, data } = await  Api.getComMenuButtonAuthList({roleId: this.selectedRowInfo[0].selectRowId, menuId})
      if (!success) {
         this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      } else {
        this.btnList = data
      }
    },
    // 点击--新增
    clickAdd() {
      this.dialogFormVisible = true
      this.isSummit = true
      this.resetFields()
    },
    // 点击--编辑
    async clickEdit() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要编辑的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行编辑', '提示', {confirmButtonText: '确定'})
      this.dialogFormVisible = true
      this.isSummit = false
      this.form = this.selectedRowInfo[0]
    },
    // 点击--确定编辑
    async eidtMenu() {
      const { success } = await  Api.editComRole(this.selectedRowInfo[0].roleId, this.form)
      if (success) {
        this.$message.success('编辑成功')
        this.getRoleList()
        this.dialogFormVisible = false
      }
    },
    // 点击--删除
    async clickDel() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要删除的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行删除', '提示', {confirmButtonText: '确定'})
      this.$confirm('菜单将会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { roleId } = this.selectedRowInfo[0]
        const { success, message } = await  Api.delComRole({id: roleId})
        if (success) {
          const res = await this.$store.dispatch('getMenuAll')
          if (res.success) { 
            this.$message.success('删除菜单成功')
            this.tableData.splice(this.tableData.findIndex(item => item.roleId === roleId), 1)
          }
        } else {
          this.$message({
            message,
            type: 'error',
            duration: 1000,
            showClose: true
          })
        }
      })
    },
    // 点击--功能授权
    async clickButtonAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      this.dialogBtnVisible = true
      await this.getMenuAuthList()
    },
    // 点击--选中一行
    // clickSelectRow(selectRowId, selectRowIndex) {
    //   console.log('selectedRowInfo.selectRowId', selectedRowInfo.selectRowId)
    //   this.selectedRowInfo.selectRowId = selectedRowInfo.selectRowId
    //   this.selectRowIndex = selectRowIndex
    // },
    // 点击--选中
    handleSelectionChange(val) {
      this.selectedRowInfo = val
    },
    // 点击--新增提交表达
    async clickSummit() {
      const { success, message } = await  Api.addComRole(this.form)
      if (success) {
        this.$message.success('添加成功')
        this.getRoleList()
      } else {
        this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      }
      this.dialogFormVisible = false
    },
    // 点击--功能授权树列表
    nodeClick(data) {
      this.getMenuButtonAuthList(data.id)
    },
    // 点击--功能授权
    async clickBindBtn(menuButtonId) {
      const {roleId} = this.selectedRowInfo[0]
      for (const item of this.btnList) {
        if (item.buttonId === menuButtonId) {
          if (!item.isCheck) {
            // 选中
            const {success} = await  Api.postComMenuButtonAuth({roleId,menuButtonId})
            if (success) {
              item.isCheck = true
              this.$message.success('授权成功')
            }
          } else {
            // 取消选中
            const {success} = await  Api.cancleComMenuButtonAuth({roleId,menuButtonId})
            if (success) {
              item.isCheck = false
              this.$message.success('取消授权成功')
            }
          }
        }
      }
    },
    // 点击--菜单授权
    async clickMenuAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      this.dialogMenuVisible = true
      this.getMenuAuthList()
    },
    // 点击--菜单授权树点击事件
    async clickMenuSure() {
      this.dialogMenuVisible = false
      const menuIdArr = [...this.$refs.menuTrue.getHalfCheckedKeys(), ...this.$refs.menuTrue.getCheckedKeys()]
      const { success } = await  Api.postComMenuAuth({ roleId: this.selectedRowInfo[0].roleId, menuId: menuIdArr})
      if (success) this.$message.success('授权成功')
    },
    // 点击--数据授权
    async clickDataAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      this.dialogDataVisible = true
      const { success, data } = await Api.getComDataAuthList(this.selectedRowInfo[0].roleId)
      if (success) {
        console.log('data', data)
      }
    },
    // 点击--字段授权
    async clickFieldAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      this.dialogFieldVisible = true
      const { success, data } = await Api.getComFieldAuthList(this.selectedRowInfo[0].roleId)
      if (success) {
        console.log('data', data)
      }
    }
  },
  created() {
    this.resetFields()
    this.getRoleList()
  }
}
</script>

<style lang="stylus" scoped>
.dialog
  display flex
  .t-left
    width 200px
    height 300px
    border 1px solid #ddd
    margin-right 20px
  .t-right
    width 400px
    height 300px
    border 1px solid #ddd
  .tr-btn
    margin-bottom 20px
    display flex
  .table .el-radio+.el-radio
    margin-left 0 !important
.btn-list
  display flex
  flex-wrap wrap
  .el-button
    margin-left 10px
    margin-top 10px
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