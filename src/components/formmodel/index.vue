<template>
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
            <el-select v-model="form[item.prop]" 
            style="width: 300px" placeholder="请选择">
              <el-option
                v-for="item in item.option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :key="index" v-else-if="item.tagType === 'dateTimePicker'" :label="item.label" 
          :label-width="formLabelWidth">
            <view>{{form[item.prop]}}</view>
             <el-date-picker
              v-model="form[item.prop]"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-form>
</template>

<script>
export default {
  name: 'demo',
  props: {
    form: {
      type: Object,
      required: true
    },
    tableThead: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      formLabelWidth: '100px',
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
</style>
