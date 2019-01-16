<template>
  <div class="tree">
    <div class="t-right">
      <div class="tr-btn">
        <el-button type="primary" @click="clickAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
        <el-button type="primary" @click="clickEdit"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
        <el-button type="primary" @click="clickDel"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
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
          <el-form-item :key="index" v-else-if="item.tagType === 'select'" :label="item.label" 
          :label-width="formLabelWidth">
          <view>{{form[item.prop]}}</view>
            <el-select v-model="form[item.prop]" 
            style="width: 300px" placeholder="请选择">
              <el-option
                v-for="item in item.option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isSummit === true" @click="clickSummit()">确 定</el-button>
        <el-button type="primary" v-else @click="eidt()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api/index'
export default {
  name: 'functionManage',
  components: {},
  data() {
    return {
      tableData: [],
      radio: '',
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
    // 
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