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
            <el-radio class="singleRadio" v-model="radio" :label="scope1.row.menuId" @change.native="clickSelectRow(scope1.row.roleId)"></el-radio>
          </template>
        </el-table-column>
        <template v-for="item in tableThead">
          <el-table-column style="{display: item.hidden === true ? 'none': ''}" v-if="item.hidden !== true" :key="item.menuId"
          :label="item.label"
          :prop="item.prop"
          min-width="150"
          >
          <!-- <template slot-scope="scope">
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
          </template> -->
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
        <el-button type="primary" v-if="isSummit === true" @click="summitAddBanner()">确 定</el-button>
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
import { getRoleList } from '@/api/roleSystem'
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
        if (item.tagType === 'radio') {
          obj[item.prop] = true
        } else {
          obj[item.prop] = ''
        }
      }
      this.form = {...this.form, ...obj}
      // this.form = {
      //   roleName: '',
      //   isShow: true
      // }
      /* eslint-disable */
      console.log('this.form', this.form, typeof this.form)
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
      this.$confirm('菜单将会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        /* eslint-disable */
        const { success, message } = await delMenu(this.selectRowId)
        if (success) {
          const res = await this.$store.dispatch('getMenuAll')
          if (res.success) { 
            this.$message.success('删除菜单成功')
            this.$refs.leftTree.remove(this.selectRowId)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })     
      })
    },
    // 点击--功能授权
    async clickButtonAut() {
      if (!this.nodeClickInfo) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      this.dialogBtnVisible = true
      // const { data, success } = await getMenuButtonList(this.nodeClickInfo.id)
    },
    // 点击--选中一行
    clickSelectRow(selection) {
      /* eslint-disable */
      console.log('selection', selection)
    },
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