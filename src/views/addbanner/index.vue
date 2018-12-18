<template>
  <div class="tree">
    <div class="t-left">
      <el-tree
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
        @check-change="handleCheckChange"
      >
      </el-tree>
    </div>
    <div class="t-right">
      <div class="tr-btn">
        <el-input class="lv-input marginR10" v-model="input" placeholder="请输入内容"></el-input>
        <!-- <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button> -->
        <el-button type="primary" @click="dialogFormVisible = true"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
        <el-button type="primary"><i class="el-icon-edit el-icon--left"></i>编辑</el-button>
        <el-button type="primary"><i class="el-icon-delete el-icon--left"></i>删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="日期"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog :title="$t('views.addbanner.addbanner')" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item :label="$t('views.addbanner.menuName')" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="打开方式" :label-width="formLabelWidth">
          <el-radio v-model="form.openType" label="0">当前页面嵌套</el-radio>
          <el-radio v-model="form.openType" label="1">打开新页面</el-radio>
        </el-form-item>
        <el-form-item label="打开地址" :label-width="formLabelWidth">
          <el-input v-model="form.openUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" :label-width="formLabelWidth">
          <el-radio v-model="form.haveMenuPermission" label="true">是</el-radio>
          <el-radio v-model="form.haveMenuPermission" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="操作权限分配" :label-width="formLabelWidth">
          <el-radio v-model="form.haveFunctionPermission" label="true">是</el-radio>
          <el-radio v-model="form.haveFunctionPermission" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否冻结" :label-width="formLabelWidth">
          <el-radio v-model="form.isFreeze" label="true">是</el-radio>
          <el-radio v-model="form.isFreeze" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否显示菜单" :label-width="formLabelWidth">
          <el-radio v-model="form.isShow" label="true">是</el-radio>
          <el-radio v-model="form.isShow" label="false">否</el-radio>
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
import { AddMenu } from '@/api/menu'
export default {
  name: 'dashboard',
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      input: null,
      dialogFormVisible: false,
      form: {
        parentId: '', // 父Id
        menuName: '', // 菜单名称
        icon: '', // 菜单Icon
        openType: '0', // 打开方式：0：当前页面嵌套，1：打开新页面
        openUrl: '', // 打开地址
        remark: '', // 备注
        sort: '', // 排序
        haveMenuPermission: 'true', // 模块是否具有权限分配
        haveFunctionPermission: 'true', // 模块是否具有操作权限分配
        isFreeze: 'true', // 是否冻结
        isShow: 'true' // 是否显示菜单
      },
      formLabelWidth: '100px'
    }
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      /* eslint-disable */
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      /* eslint-disable */
      console.log(data)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])

      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 添加菜单
    async summitAddBanner() {
      const curForm = {}
      const form = this.form
      for(const key in form) {
        curForm[key] = form[key]
        if (curForm[key] === 'true') curForm[key] = true
        if (curForm[key] === 'false') curForm[key] = false
        if (curForm[key] === '0') curForm[key] = 0
        if (curForm[key] === '1') curForm[key] = 1
      }
      const { data, code, message } = await AddMenu(curForm)
      if (code === 500) {
         this.$message({
          message,
          type: 'error',
          duration: 1000,
          showClose: true
        })
      } else if (code === 200) {
        this.dialogFormVisible = false
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
         this.$message.success('添加成功')
      }
      /* eslint-disable */
      console.log('data', data, this.form)
    }
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
</style>
