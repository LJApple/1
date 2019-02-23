<template>
  <div class="tree">
    <div class="t-right">
       <table-model 
        @handleSelectionChange="handleSelectionChange" 
        @clickAdd="clickAdd"
        @clickEdit="clickEdit"
        @clickDel="clickDel"
        @clickBusinessAut="clickBusinessAut"
        @clickRoleAut="clickRoleAut"
        :butttonList="butttonList"
        :tableData="tableData" 
        :tableThead="tableThead"></table-model>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialogTitle" 
    :visible.sync="dialogFormVisible" width="500px">
      <form-model :form="form" :tableThead="tableThead"></form-model>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isSummit === true" @click="clickSummit()">确 定</el-button>
        <el-button type="primary" v-else @click="eidt()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- dialog 功能列表-->
    <el-dialog title="业务授权" :visible.sync="dialogBtnVisible">
      <div class="btn-list">
        <el-button v-for="(item, index) in btnList" :key="index"
        @click="bindBtn(item.system)" type="primary">{{item.system}}
        <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
      </div>
    </el-dialog>
     <!-- dialog 功能列表2-->
    <el-dialog title="角色授权" :visible.sync="dialogBtn2Visible">
      <div class="btn-list">
        <el-button v-for="(item, index) in btnList2" :key="index"
        @click="bindBtn2(item.roleId)" type="primary">{{item.roleName}}
        <i class="el-icon-success el-icon--right" :class="item.isCheck === false ? 'checkColor' : ''"></i></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api/index'
import formModel from '@/components/formmodel'
import tableModel from '@/components/tablemodel'
export default {
  name: 'functionManage',
  components: {
    formModel,
    tableModel
  },
  data() {
    return {
      tableData: [],
      butttonList: ['clickAdd', 'clickEdit', 'clickDel', 'clickBusinessAut',  'clickRoleAut'],
      tableThead: [
        {label: 'companyId', prop: 'companyId', hidden: true},
        {label: '公司名称', prop: 'companyName', tagType: 'input', type:"text"},
        {label: '公司代码', prop: 'companyCode', tagType: 'input', type:"text"},
        {label: '公司类型', prop: 'companyType', tagType: 'select', option: []},
        {label: '账号', prop: 'account', tagType: 'input', type:"text"},
        {label: 'db部署服务器', prop: 'dbServerName', tagType: 'select', option: []},  
        {label: '数据库名称', prop: 'dbName', tagType: 'input', type:"text"},
        {label: '使用期', prop: 'expireDate', tagType: 'input', type:"text"},        
        {label: '是否禁用', prop: 'isDisable', tagType: 'radio', radioInfo: [{radioText: '是', radioLabel: true}, {radioText: '否', radioLabel: false}]}
      ],
      form: {},
      dialogFormVisible: false,
      formLabelWidth: '100px',
      selectedRowInfo: '', // 选中行信息
      isSummit: true, // 是否是添加菜单
      dialogTitle: '新增',
      dialogBtnVisible: false,
      btnList: [],
      btnList2: [],
      dialogBtn2Visible: false
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
    // 获取--获取基本数据
    async getBaseSelect() {
      // 公司类型
      const resCom =  await Api.getComRoleList()
      // 服务器类型
      const resSer = await Api.getSerList()
      const comOptions = []
      const serOptions = []
      if (resCom.data) {
        for (const item of resCom.data) {
          const option = {
            value: item.roleName,
            label: item.roleName
          }
          comOptions.push(option)
        }
      }
       if (resSer.data) {
        for (const item of resSer.data) {
          const option = {
            value: item.dbServiceName,
            label: item.dbServiceName
          }
          serOptions.push(option)
        }
      }
      for (const item of this.tableThead) {
        // 服务器数据初始化
        if (item.tagType === 'select' && item.prop === 'companyType') {
          item.option = comOptions
        }
        if (item.tagType === 'select' && item.prop === 'dbServerName') {
          item.option = serOptions
        }
      }
      if (!this.form.dbServerName) this.form.dbServerName = serOptions[0].value
      if (!this.form.companyType) this.form.companyType = comOptions[0].value
    },
    // 获取--获取角色列表
    async getList() {
      const {data, success, message} = await Api.getComMaList()
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
      this.getBaseSelect()
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
    async eidt() {
      const { success } = await  Api.editComMa(this.selectedRowInfo[0].companyId, this.form)
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
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { companyId } = this.selectedRowInfo[0]
        const { success, message } = await  Api.delComMa(companyId)
        if (success) {
            this.$message.success('删除成功')
            this.tableData.splice(this.tableData.findIndex(item => item.companyId === companyId), 1)
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
    // 点击--选中
    handleSelectionChange(val) {
      this.selectedRowInfo = val
    },
    // 点击--新增提交表达
    async clickSummit() {
      const { success, message } = await Api.AddComMa(this.form)
      if (success) {
        this.$message.success('添加成功')
        this.getList()
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
    // 点击-获取业务授权列表
    async clickBusinessAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要删除的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行删除', '提示', {confirmButtonText: '确定'})
      this.dialogBtnVisible = true
      const { data, success } = await Api.getComSystemAuthList(this.selectedRowInfo[0].companyId)
      if (success) this.btnList = data
    },
    // 点击-选择授权功能列表
    async bindBtn(system) {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      for (const item of this.btnList) {
        if (item.system === system) {
          if (!item.isCheck) {
            // 选中
            const {success} = await Api.postComSystemAuth(this.selectedRowInfo[0].companyId,system)
            if (success) item.isCheck = true
          } else {
            // 取消选中
            // const {success} = await Api.delButtonList({menuId,buttonId})
            // if (success) item.isCheck = false
          }
        }
      }
    },

    // 点击-获取角色授权列表
    async clickRoleAut() {
      if (!this.selectedRowInfo || !this.selectedRowInfo.length) return this.$alert('请选中需要授权的行', '提示', {confirmButtonText: '确定'})
      if (this.selectedRowInfo.length > 1) return this.$alert('只能选中一行进行授权', '提示', {confirmButtonText: '确定'})
      this.dialogBtn2Visible = true
      const { data, success } = await Api.getComRoleAuthList(this.selectedRowInfo[0].companyId)
      if (success) this.btnList2 = data
    },
    // 点击-选择授权功能列表
    async bindBtn2(buttonId) {
      for (const item of this.btnList) {
        if (item.buttonId === buttonId) {
          if (!item.isCheck) {
            // 选中
            const {success} = await Api.postComRoleAuth(this.selectedRowInfo[0].companyId, buttonId)
            if (success) item.isCheck = true
          } else {
            // 取消选中
            // const {success} = await Api.delButtonList({menuId,buttonId})
            // if (success) item.isCheck = false
          }
        }
      }
    }
  },
  created() {
    this.resetFields()
    this.getList()
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