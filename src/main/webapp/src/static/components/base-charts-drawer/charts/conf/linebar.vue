<template>
    <div class="charts-linebar">
        <charts-common ref="commonConf"></charts-common>

        <Row @click.native="handleSave(editIndex);editIndex = -1">
            <Col span="3" class="tab">图例配置：</Col>
            <Col span="21" class="tab">
            <ButtonGroup size="small">
                <Button icon="md-add" type="primary" @click="addRow">增加</Button>
                <Button icon="md-close" @click="removeRow">删除</Button>
            </ButtonGroup>
            </Col>
        </Row>

        <Row>
            <Col span="24">
            <Table highlight-row border ref="dataTable" :columns="columns" :data="data" @on-current-change="currentChange">
                <template slot-scope="{ row, index }" slot="legendTitle">
                    <Input v-model="editLegendTitle" v-if="editIndex === index" placeholder="必填"/>
                    <span v-else>
                            <span v-if="row.legendTitle">{{ row.legendTitle }}</span>
                            <span v-else style="color:#ed4014">必填</span>
                        </span>
                </template>

                <template slot-scope="{ row, index }" slot="seriesType">
                    <Select v-model="editSeriesType" v-if="editIndex === index" >
                        <template v-if="seriesTypes">
                            <Option :value="key" v-for="key in Object.keys(seriesTypes)">{{ seriesTypes[key] }}</Option>
                        </template>
                        <template v-else>
                            <OptionGroup label="线状图">
                                <Option :value="key" v-for="key in Object.keys(seriesTypes_Line)">{{ seriesTypes_Line[key] }}</Option>
                            </OptionGroup>
                            <OptionGroup label="柱状图">
                                <Option :value="key" v-for="key in Object.keys(seriesTypes_Bar)">{{ seriesTypes_Bar[key] }}</Option>
                            </OptionGroup>
                        </template>
                    </Select>
                    <span v-else>{{ (seriesTypes || Object.assign({},seriesTypes_Line,seriesTypes_Bar))[row.seriesType] || '无' }}</span>
                </template>

                <template slot-scope="{ row, index }" slot="unit">
                    <Select v-model="editUnit" v-if="editIndex === index" >
                        <Option :value="index" v-for="(item,index) in units">{{ item }}</Option>
                    </Select>
                    <span v-else ><Tooltip content="单位不能超过两类" placement="top">{{ units[row.unit] || units[0] }}</Tooltip></span>
                </template>

                <template slot-scope="{ row, index }" slot="color">
                    <ColorPicker v-model="editColor" v-if="editIndex === index" recommend alpha/>
                    <span v-else>
                            <span v-if="row.color" :style="'padding:1.5px 9px;box-shadow: 0px 0px 2px rgba(0,0,0,.6) inset;background-color:'+row.color"></span>
                            <span v-else>自动</span>
                        </span>
                </template>
            </Table>
            </Col>
        </Row>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        props:["seriesTypes","chartType"],
        components: {
            'charts-common': common,
        },
        data () {
            return {
                units:["数值","时间 (ms)","流量 (bps)","百分比(%)"],
                seriesTypes_Line:{"line_0":"线（不堆叠）","line_1":"线（堆叠一）","line_2":"线（堆叠二）"},
                seriesTypes_Bar:{"bar_0":"柱（不堆叠）","bar_1":"柱（堆叠一）","bar_2":"柱（堆叠二）"},
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '名称',
                        slot: 'legendTitle'
                    },
                    {
                        width: 150,
                        title: '分组（堆叠）',
                        slot: 'seriesType'
                    },
                    {
                        title: '单位',
                        slot: 'unit'
                    },
                    {
                        width: 95,
                        title: '颜色',
                        slot: 'color',
                    }
                ],
                data: [
                    // {
                    //     legendTitle: '王小明',
                    //     seriesType: 'line_0',
                    //     unit: 1,
                    //     color: ''
                    // },
                    // {
                    //     legendTitle: '张小刚',
                    //     seriesType: 'bar_0',
                    //     unit: 2,
                    //     color: ''
                    // },
                    // {
                    //     legendTitle: '李小红',
                    //     seriesType: 'line_0',
                    //     unit: 3,
                    //     color: ''
                    // },
                    // {
                    //     legendTitle: '周小伟',
                    //     seriesType: 'line_0',
                    //     unit: 0,
                    //     color: ''
                    // }
                ],
                editIndex: -1,
                editLegendTitle: '',
                editSeriesType: '',
                editUnit: '',
                editColor: '',
                rowNumber:1
            }
        },
        methods: {
            handleEdit (row, index) {
                this.editLegendTitle = row.legendTitle;
                this.editSeriesType = row.seriesType;
                this.editUnit = row.unit;
                this.editColor = row.color;
                this.editIndex = index;
            },
            handleSave (index) {
                if(index==-1) return;
                this.data[index].legendTitle = this.editLegendTitle;
                this.data[index].seriesType = this.editSeriesType;
                this.data[index].unit = this.editUnit;
                this.data[index].color = this.editColor;
            },
            currentChange(currentRow,oldCurrentRow){
                if(oldCurrentRow) {
                    this.handleSave(this.data.findIndex(x=>x.legendTitle==oldCurrentRow.legendTitle));
                }
                this.handleEdit(currentRow,this.data.findIndex(x=>x.legendTitle==currentRow.legendTitle));
            },
            addRow(){
                let _this = this;
                this.data.push({
                    legendTitle: '图例'+(_this.rowNumber++),
                    seriesType: _this.chartType?_this.chartType+"_0":'line_0',
                    unit: 0,
                    color: ''
                });
            },
            removeRow(){
                this.$refs.dataTable.getSelection().forEach(el=>{
                    this.data.splice(this.data.findIndex(x=>x.legendTitle==el.legendTitle),1);
                });
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    if(this.data.length > 0){
                        commonConf.api = this.data;
                        return commonConf;
                    }else{
                        this.$Notice.error({title: '请配置图例列表!!!'});
                        return;
                    }
                }else{
                    return;
                }
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-linebar{
        &:before{
            content: "-- 线柱状图 --";
            font-size: 20px;
            font-weight: bold;
            display: block;
            margin-bottom: 25px;
            text-align: center;
        }
        .tab{
            font-weight: bold;
            text-align: right;
            padding-top: 5px;
        }
    }
</style>