<template>
    <div class="charts-radar">
        <charts-common ref="commonConf" :chartName="chartName" :isDisabledUrl="isDisabledUrl"></charts-common>

        <Row>
            <Col span="3" class="tab">图例配置：</Col>
            <Col span="21" class="tab">
            <ButtonGroup size="small">
                <Button icon="md-add" type="primary" @click="addRow(1)">增加</Button>
                <Button icon="md-close" @click="removeRow(1)">删除</Button>
            </ButtonGroup>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table highlight-row border ref="dataTable1" :columns="table1.columns" :data="table1.data"></Table>
            </Col>
        </Row>
        <br/>
        <Row>
            <Col span="3" class="tab">指标配置：</Col>
            <Col span="21" class="tab">
            <ButtonGroup size="small">
                <Button icon="md-add" type="primary" @click="addRow(2)">增加</Button>
                <Button icon="md-close" @click="removeRow(2)">删除</Button>
            </ButtonGroup>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table highlight-row border ref="dataTable2" :columns="table2.columns" :data="table2.data"></Table>
            </Col>
        </Row>
        <Row>
            <Col span="24" style="text-align: right;margin-top: 20px;font-size: 9px;">
            <Tooltip placement="bottom-end" max-width=300 >
                数据返回格式说明：<Icon type="md-help-circle" size="16"/>
                <pre slot="content">
{
    "series":{
        "图例A":[43,87,10],
        "图例B":[23,34,66]
    }
}</pre>
            </Tooltip>
            </Col>
        </Row>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        props:["quotasRadar","isDisabledUrl"],
        components: {
            'charts-common': common,
        },
        data () {
            return {
                chartName:"雷达图",
                table1:{
                    columns: [
                        {
                            type: 'selection',
                            align: 'center',
                            width: 60,
                        },
                        {
                            title: '名称',
                            key: 'col1',
                            render: (h, params) => {
                                if(this.quotasRadar && this.quotasRadar.legend.length > 0){
                                    let _legends = this.quotasRadar.legend;
                                    return h('Select',{
                                        props: {
                                            value: params.row[params.column.key],
                                            placeholder:`必填`
                                        },
                                        on: {
                                            'on-change':(val) => {
                                                this.table1.data[params.index][params.column.key] = val;
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
                                                this.table1.data[params.index][params.column.key] = val.target.value;
                                            },
                                            'on-clear':(val) => {
                                                this.table1.data[params.index][params.column.key] = "";
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        {
                            width: 120,
                            title: '颜色',
                            key: 'col2',
                            render: (h, params) => {
                                return h('ColorPicker',{
                                    props: {
                                        recommend:true,
                                        alpha:true,
                                        value: params.row[params.column.key],
                                    },
                                    on: {
                                        'on-change':(val) => {
                                            this.table1.data[params.index][params.column.key] = val;
                                        }
                                    }
                                });
                            }
                        }
                    ],
                    data: [],
                    rowNumber:1
                },
                table2:{
                    columns: [
                        {
                            type: 'selection',
                            align: 'center',
                            width: 60,
                        },
                        {
                            title: '名称',
                            key: 'col1',
                            render: (h, params) => {
                                if(this.quotasRadar && this.quotasRadar.indicator.length > 0){
                                    let _legends = this.quotasRadar.indicator;
                                    return h('Select',{
                                        props: {
                                            value: params.row[params.column.key],
                                            placeholder:`必填`
                                        },
                                        on: {
                                            'on-change':(val) => {
                                                this.table2.data[params.index][params.column.key] = val;
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
                                                this.table2.data[params.index][params.column.key] = val.target.value;
                                            },
                                            'on-clear':(val) => {
                                                this.table2.data[params.index][params.column.key] = "";
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        {
                            width: 120,
                            title: '最大值',
                            key: 'col2',
                            render: (h, params) => {
                                return h('InputNumber',{
                                    props: {
                                        value: params.row[params.column.key],
                                        min:1
                                    },
                                    on: {
                                        'on-change':(val) => {
                                            this.table2.data[params.index][params.column.key] = val;
                                        }
                                    }
                                });
                            }
                        }
                    ],
                    data: [],
                    rowNumber:1
                }
            }
        },
        methods: {
            addRow(tabIndex){
                let _strName = "";
                let _quotasRadar = this.quotasRadar
                if(tabIndex==1){
                    _strName = (_quotasRadar && _quotasRadar.legend.length>0)?_quotasRadar.legend[0]:false;
                }else{
                    _strName = (_quotasRadar && _quotasRadar.indicator.length>0)?_quotasRadar.indicator[0]:false;
                }
                let _table = this["table"+tabIndex];
                _table.data.push({
                    col1: _strName?_strName:'图例'+(_table.rowNumber++),
                    col2: tabIndex==1?"":100
                });
            },
            removeRow(tabIndex){
                let _table = this["table"+tabIndex];
                let indexs = [];
                [... this.$refs["dataTable"+tabIndex].$el.querySelectorAll("td .ivu-checkbox-input")].forEach((x,index)=>{
                    if(x.checked) indexs.push(index);
                });
                let newIndexs = indexs.map((val, idx)=>{return val - idx;});
                newIndexs.forEach((index)=>{
                    _table.data.splice(index, 1);
                })
            },
            initConfig(config){
                if(config["api"]){
                    this.table1.data = config["api"].legend.map(x=>{
                        return {col1:x.legendTitle, col2:x.color}
                    });
                    this.table2.data = config["api"].indicator.map(x=>{
                        return {col1:x.name, col2:x.max}
                    });
                }
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                let tables = [this["table1"],this["table2"]];
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    if(tables[0].data.length>0 && tables[1].data.length>0){
                        let isEmptyValidate0 = false,isEmptyValidate1 = false;
                        let tables0_col1 = new Set([... tables[0].data.map(x=>{
                            if(x.col1.trim()==""){
                                isEmptyValidate0 = true;
                            }
                            return x.col1;
                        })]);
                        let tables1_col1 = new Set([... tables[1].data.map(x=>{
                            if(x.col1.trim()==""){
                                isEmptyValidate1 = true;
                            }
                            return x.col1;
                        })]);
                        if(isEmptyValidate0){
                            this.$Notice.error({title: '图例名称不能为空!!!'});
                            return;
                        }
                        if(isEmptyValidate1){
                            this.$Notice.error({title: '指标名称不能为空!!!'});
                            return;
                        }
                        if(tables[0].data.length != tables0_col1.size){
                            this.$Notice.error({title: '图例名称不能重复!!!'});
                            return;
                        }
                        if(tables[1].data.length != tables1_col1.size){
                            this.$Notice.error({title: '指标名称不能重复!!!'});
                            return;
                        }
                        if(tables[1].data.length<3){
                            this.$Notice.error({title: '指标项必须大于2项!!!'});
                            return;
                        }
                        commonConf.api = {
                            "legend": tables[0].data.map(x => {
                                return {legendTitle: x.col1, color: x.col2}
                            }),
                            "indicator": tables[1].data.map(x => {
                                return {name: x.col1, max: x.col2}
                            })
                        };
                        return commonConf;
                    }else{
                        this.$Notice.error({title: '请图例、指标名称不能为空!!!'});
                        return;
                    }
                }else{
                    return;
                }
            }
        }
    }
</script>