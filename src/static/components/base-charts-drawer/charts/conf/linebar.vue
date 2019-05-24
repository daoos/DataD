<template>
    <div class="charts-linebar">
        <charts-common ref="commonConf" :chartName="chartName" :isDisabledUrl="isDisabledUrl"></charts-common>
        <Row>
            <Col span="3" class="tab">刷新方式：</Col>
            <Col span="10">
                <RadioGroup v-model="refurbishMode" size="large">
                    <Radio label="add">追加</Radio>
                    <Radio label="cover">覆盖</Radio>
                </RadioGroup>
            </Col>
            <Col span="11" style="text-align: right;font-size: 9px;">
                <Tooltip placement="bottom-end" max-width=550 >
                    数据返回格式说明：<Icon type="md-help-circle" size="16"/>
<pre slot="content">
{
    "series":{
        "图例A":[24,765,45,66],
        "图例B":[8,34,77,21,45]
    },
    "xAxis":["00:01","00:02","00:03","00:04"]
}

说明：当xAxis数组中值为时间戳(秒或毫秒）时，图表数据轴会自动格式化为日期时间格式。
"xAxis":[1557199616,1557199620,1557199624,1557199628]</pre>
                </Tooltip>
            </Col>
        </Row>
        <Divider dashed/>

        <Row @click.native="handleSave(editIndex);editIndex = -1;">
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
                        <template  v-if="legends && legends.length > 0">
                            <Select v-model="editLegendTitle" v-if="editIndex === index" placeholder="必填">
                                <Option :value="elem" v-for="elem in legends">{{elem}}</Option>
                            </Select>
                            <span v-else>
                                <span v-if="row.legendTitle">{{ row.legendTitle }}</span>
                                <span v-else style="color:#ed4014">必填</span>
                            </span>
                        </template>
                        <template v-else>
                            <Input v-model="editLegendTitle" v-if="editIndex === index" placeholder="必填"/>
                            <span v-else>
                                <span v-if="row.legendTitle">{{ row.legendTitle }}</span>
                                <span v-else style="color:#ed4014">必填</span>
                            </span>
                        </template>
                    </template>

                    <template slot-scope="{ row, index }" slot="seriesType">
                        <Select v-model="editSeriesType" v-if="editIndex === index">
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
        <Row @click.native="handleSave(editIndex);editIndex = -1;" style="height:200px;"></Row>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        props:["seriesTypes","chartType","legends","isDisabledUrl"],
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
                data: [],
                editIndex: -1,
                editLegendTitle: '',
                editSeriesType: '',
                editUnit: '',
                editColor: '',
                rowNumber:1,
                refurbishMode:"add"
            }
        },
        computed: {
            chartName:function () {
                let name = "线柱";
                if(this.chartType){
                    name = this.chartType=="line"?"线":"柱";
                }
                return name + "状图";
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
            initConfig(config){
                this.data = config["api"] || [];
                this.refurbishMode = config["refurbishMode"] || "add";
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                this.handleSave(this.editIndex);
                this.editIndex = -1;

                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    commonConf.refurbishMode = this.refurbishMode;
                    if(this.data.length > 0){
                        let legendTitleLength = new Set([... this.data.map(x=>{
                            return x.legendTitle;
                        })]);
                        if(this.data.length != legendTitleLength.size){
                            this.$Notice.error({title: '图例名称不能重复!!!'});
                            return;
                        }
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