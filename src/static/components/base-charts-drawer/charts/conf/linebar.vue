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

        <Row>
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
                <Table highlight-row border ref="dataTable" :columns="columns" :data="data"></Table>
            </Col>
        </Row>
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
                        key: 'legendTitle',
                        render: (h, params) => {
                            let _legends = this.legends;
                            if(_legends && _legends.length > 0){
                                return h('Select',{
                                    props: {
                                        value: params.row[params.column.key],
                                        placeholder:`必填`
                                    },
                                    on: {
                                        'on-change':(val) => {
                                            this.data[params.index][params.column.key] = val;
                                        }
                                    }
                                },_legends.map(x=> h('Option',{props: {value: x}},x)));
                            }else{
                                return h('Input',{
                                    props: {
                                        value: params.row[params.column.key],
                                        placeholder:`必填`,
                                        clearable:true,
                                    },
                                    on: {
                                        'on-blur':(val) => {
                                            this.data[params.index][params.column.key] = val.target.value;
                                        },
                                        'on-clear':(val) => {
                                            this.data[params.index][params.column.key] = "";
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        width: 150,
                        title: '分组（堆叠）',
                        key: 'seriesType',
                        render: (h, params) => {
                            let options = [];
                            if(this.seriesTypes){
                                options = Object.keys(this.seriesTypes).map(x=> h('Option',{props: {value: x}},this.seriesTypes[x]));
                            }else{
                                options.push(h('OptionGroup',{props: {label: "线状图"}},Object.keys(this.seriesTypes_Line).map(x=> h('Option',{props: {value: x}},this.seriesTypes_Line[x]))));
                                options.push(h('OptionGroup',{props: {label: "柱状图"}},Object.keys(this.seriesTypes_Bar).map(x=> h('Option',{props: {value: x}},this.seriesTypes_Bar[x]))));
                            }
                            return h('Select',{
                                props: {
                                    value: params.row[params.column.key],
                                    placeholder:`必填`
                                },
                                on: {
                                    'on-change':(val) => {
                                        this.data[params.index][params.column.key] = val;
                                    }
                                }
                            },options);
                        }
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        render: (h, params) => {
                            return h('Select',{
                                props: {
                                    value: params.row[params.column.key],
                                    placeholder:`必填`
                                },
                                on: {
                                    'on-change':(val) => {
                                        this.data[params.index][params.column.key] = val;
                                    }
                                }
                            },this.units.map((x,index)=>h('Option',{props: {value: index}},x)));
                        }
                    },
                    {
                        width: 95,
                        title: '颜色',
                        key: 'color',
                        render: (h, params) => {
                            return h('ColorPicker',{
                                props: {
                                    recommend:true,
                                    alpha:true,
                                    value: params.row[params.column.key],
                                },
                                on: {
                                    'on-change':(val) => {
                                        this.data[params.index][params.column.key] = val;
                                    }
                                }
                            });
                        }
                    }
                ],
                data: [],
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
            addRow(){
                let _this = this;
                this.data.push({
                    legendTitle: (this.legends && this.legends.length>0)?this.legends[0]:'图例'+(_this.rowNumber++),
                    seriesType: _this.chartType?_this.chartType+"_0":'line_0',
                    unit: 0,
                    color: ''
                });
            },
            removeRow(){
                let indexs = [];
                [... this.$refs.dataTable.$el.querySelectorAll("td .ivu-checkbox-input")].forEach((x,index)=>{
                    if(x.checked) indexs.push(index);
                });
                let newIndexs = indexs.map((val, idx)=>{return val - idx;});
                newIndexs.forEach((index)=>{
                    this.data.splice(index, 1);
                })
            },
            initConfig(config){
                let _api = config["api"] || [];
                this.data = Array.isArray(_api)?_api:JSON.parse(_api);
                this.refurbishMode = config["refurbishMode"] || "add";
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    commonConf.refurbishMode = this.refurbishMode;
                    if(this.data.length > 0){
                        let isEmptyValidate = false;
                        let legendTitleLength = new Set([... this.data.map(x=>{
                            if(x.legendTitle.trim()==""){
                                isEmptyValidate = true;
                            }
                            return x.legendTitle;
                        })]);
                        if(isEmptyValidate){
                            this.$Notice.error({title: '图例名称不能为空!!!'});
                            return;
                        }
                        if(this.data.length != legendTitleLength.size){
                            this.$Notice.error({title: '图例名称不能重复!!!'});
                            return;
                        }
                        commonConf.api = JSON.stringify(this.data); //防止引用传递，实现深度克隆数组
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