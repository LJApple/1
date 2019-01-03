<template>
  <div class="tree">
    <div class="t-right">
      <div class="tr-btn">
        <el-input class="lv-input marginR10" v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="clickAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
        <el-button type="primary" @click="clickEdit"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
        <el-button type="primary" @click="clickDel"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
        <el-button type="primary" @click="clickButtonAut"><i class="el-icon-delete el-icon--left"></i>功能授权</el-button>
      </div>
      <el-table
        class="table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column width="50">
          <template slot-scope="scope1">
            <el-radio class="singleRadio" v-model="radio" :label="scope1.row.roleId" @change.native="clickSelectRow(scope1.row.roleId, scope1.$index)"></el-radio>
          </template>
        </el-table-column>
        <template v-for="item in tableThead">
          <el-table-column style="{display: item.hidden === true ? 'none': ''}" v-if="item.hidden !== true" :key="item.menuId"
          :label="item.label"
          :prop="item.prop"
          min-width="150"
          >
           <template slot-scope="scope">
            <div v-if="scope.row[item.prop] === true">是</div>
            <div v-else-if="scope.row[item.prop] === false">否</div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        </template>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog title="新增角色" 
    :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="form" :model="form">
        <template v-for="(item, index) in tableThead">
          <el-form-item :key="index" v-if="item.tagType === 'input'" :label="item.label" 
          :label-width="formLabelWidth">
            <el-input class="lv-input300" v-model="form[item.prop]" :type="item.type"></el-input>
          </el-form-item>
          <el-form-item :key="index" v-else-if="item.tagType === 'radio'" :label="item.label" 
          :label-width="formLabelWidth">
            <el-radio v-for="(itemRodio, index) in item.radioInfo" :key="index" v-model="form[item.prop]" 
            :label="itemRodio.radioLabel">{{itemRodio.radioText}}</el-radio>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isSummit === true" @click="clickSummit()">确 定</el-button>
        <el-button type="primary" v-else @click="eidtMenu()">确 定</el-button>
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
import { getRoleList, addRole, delRole, getMenuButtonAuthList, getMenuAuthList } from '@/api/roleSystem'
export default {
  name: 'sysRoles',
  components: {},
  data() {
    return {
      tableData: [],
      radio: '',
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
      formLabelWidth: '100px',
      nodeClickInfo: '',
      selectRowIndex: '', // 选中的行
      selectRowId: '', // 选中行的id
      btnList: [], // 功能btn列表
      isSummit: true // 是否是添加菜单
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
      const {data, success, message} = await getRoleList()
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
      const {data, success, message} = await getMenuAuthList()
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
    // 点击--新增
    clickAdd() {
      this.dialogFormVisible = true
      this.isSummit = true
      this.resetFields()
    },
    // 点击--编辑
    async clickEdit() {
      if (!this.selectRowId) return this.$alert('请选中需要编辑的行', '提示', {confirmButtonText: '确定'})
      this.dialogFormVisible = true
      this.isSummit = false
      /* eslint-disable */
      const {success, data} = await getMenuInfo(this.selectRowId)
      if (success) {
        this.selected = data.parentId
        this.form = data
      }
    },
    // 点击--删除
    async clickDel() {
      if (!this.selectRowId) return this.$alert('请选中需要编辑的行', '提示', {confirmButtonText: '确定'})
      this.$confirm('菜单将会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        /* eslint-disable */
        const { success, message } = await delRole({id: this.selectRowId})
        if (success) {
          const res = await this.$store.dispatch('getMenuAll')
          if (res.success) { 
            this.$message.success('删除菜单成功')
            this.tableData.splice(this.selectRowIndex, 1)
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
      if (!this.selectRowId) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      this.dialogBtnVisible = true
      const { success, message } = await getMenuButtonAuthList({roleId: this.selectRowId})
      if (!success) {
         this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      }
    },
    // 点击--选中一行
    clickSelectRow(selectRowId, selectRowIndex) {
      this.selectRowId = selectRowId
      this.selectRowIndex = selectRowIndex
    },
    // 点击--新增提交表达
    async clickSummit() {
      const { success, message } = await addRole(this.form)
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
    }
  },
  created() {
    this.resetFields()
    this.getRoleList()
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