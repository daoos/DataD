<template>
    <div class="search-drawer">
        <Drawer title="条件查询" :transfer="false" :inner="true" :width="500" v-model="isDrawerRight">
            <Row @click.native="handleSave(editIndex);editIndex = -1;">
                <Col span="5" class="tab" style="text-align: left;">扩展请求参数：</Col>
                <Col span="19"></Col>
            </Row>
            <Row @click.native="handleSave(editIndex);editIndex = -1;">
                <Col span="5" class="tab"></Col>
                <Col span="19" class="tab">
                    <ButtonGroup size="small">
                        <Button icon="md-add" type="primary" @click="addRow">增加</Button>
                        <Button icon="md-close" @click="removeRow">删除</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <Table highlight-row border ref="dataTable" :columns="columns" :data="data" @on-current-change="currentChange">
                        <template slot-scope="{ row, index }" slot="paramKey">
                            <Input v-model="editParamKey" v-if="editIndex === index" placeholder="必填"/>
                            <span v-else>
                            <span v-if="row.paramKey">{{ row.paramKey }}</span>
                            <span v-else style="color:#ed4014">必填</span>
                        </span>
                        </template>
                        <template slot-scope="{ row, index }" slot="paramValue">
                            <Input v-model="editParamValue" v-if="editIndex === index"/>
                            <span v-else>
                            <span v-if="row.paramValue">{{ row.paramValue }}</span>
                            <span v-else style="color:#eeeeee">null</span>
                        </span>
                        </template>
                    </Table>
                </Col>
            </Row>
            <Row @click.native="handleSave(editIndex);editIndex = -1;" style="height:200px;"></Row>

            <div class="drawer-footer">
                <Row :gutter="8">
                    <Col span="3">
                        <i-switch v-model="isSeries" title="实时开关" style="position: relative;top:5px;">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                    <Col span="15">
                        <DatePicker :options="datePicker.dateRangeOption" :disabled="datePicker.disabled" v-model="datePicker.value" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="日期时间（开始-结束）" placement="top-end" style="width:100%"></DatePicker>
                    </Col>
                    <Col span="6">
                        <input v-model="duration" class="duration" list="cars" placeholder="粒度（自动）" type="number"/>
                        <datalist class="duration-datalist" id="cars" style="width: 200px">
                            <option :value=4>4秒</option>
                            <option :value=10>10秒</option>
                            <option :value=60>1分</option>
                            <option :value=300>5分</option>
                            <option :value=3600>1时</option>
                            <option :value=86400>1天</option>
                        </datalist>
                    </Col>
                </Row>
                <Divider dashed style="margin: 15px 0px;"/>
                <ButtonGroup>
                    <Button @click="search" type="primary" icon="md-search">查询</Button>
                    <Button @click="refresh" icon="md-refresh">重置</Button>
                </ButtonGroup>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import { ChartsFactory } from '../base-charts-drawer/chartsFactory';

    export default {
        props:["isDrawerLeft","isDrawerRight"],
        data() {
            return {
                isDrawerRight:false,
                isSeries: true,
                duration:60,
                datePicker:{
                    value:"",
                    disabled:true,
                    dateRangeOption: {
                        shortcuts: [
                            {
                                text: '1 week',
                                value () {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    return [start, end];
                                }
                            },
                            {
                                text: '1 month',
                                value () {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                    return [start, end];
                                }
                            },
                            {
                                text: '3 months',
                                value () {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                    return [start, end];
                                }
                            }
                        ]
                    }
                },
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 50,
                    },
                    {
                        title: 'Key',
                        slot: 'paramKey'
                    },
                    {
                        title: 'Value',
                        slot: 'paramValue',
                    }
                ],
                data: [],
                editIndex: -1,
                editParamKey: '',
                editParamValue: '',
                rowNumber:1
            }
        },
        computed: {
            dataValue(){
                return this.datePicker.value;
            }
        },
        watch:{
            isSeries(v) {
                this.duration = v?60:"";
                Object.assign(this.datePicker,{value:"",disabled:v});
            },
            dataValue() {
                if (this.datePicker.value !== ""){
                    this.autoDuration(this.datePicker.value[0], this.datePicker.value[1]);
                }
            }
        },
        methods:{
            handleEdit (row, index) {
                this.editParamKey = row.paramKey;
                this.editParamValue = row.paramValue;
                this.editIndex = index;
            },
            handleSave (index) {
                if(index==-1) return;
                this.data[index].paramKey = this.editParamKey;
                this.data[index].paramValue = this.editParamValue;
            },
            currentChange(currentRow,oldCurrentRow){
                if(oldCurrentRow) {
                    this.handleSave(this.data.findIndex(x=>x.paramKey==oldCurrentRow.paramKey));
                }
                this.handleEdit(currentRow,this.data.findIndex(x=>x.paramKey==currentRow.paramKey));
            },
            addRow(){
                let _this = this;
                this.data.push({
                    paramKey: 'key_'+(_this.rowNumber++),
                    paramValue: ''
                });
            },
            removeRow(){
                this.$refs.dataTable.getSelection().forEach(el=>{
                    this.data.splice(this.data.findIndex(x=>x.paramKey==el.paramKey),1);
                });
            },
            refresh(){
                this.data = [];
                this.isSeries=true;
            },
            search(){
                //缓存查询扩展请求参数.
                localStorage.setItem("searchParam_"+ this.$route.query["id"], JSON.stringify(this.data));
                let _datePicker = this.datePicker.value;
                let param = {
                    duration: this.duration,
                    startTime:_datePicker[0] && parseInt(_datePicker[0].getTime()/1000),
                    endTime:_datePicker[1] && parseInt(_datePicker[1].getTime()/1000)
                };
                this.data.forEach(x=>{
                    if(x.paramKey){
                        param[x.paramKey] = x.paramValue;
                    }
                })
                ChartsFactory().settings(param);
            },
            autoDuration(startTime, endTime){
                let dValue = (endTime - startTime)/1000;
                if(dValue/4 <= 150){
                    this.duration = 4;
                }else if(dValue/10 <= 150){
                    this.duration = 10;
                }else if(dValue/60 <= 150){
                    this.duration = 60;
                }else if(dValue/300 <= 150){
                    this.duration = 300;
                }else if(dValue/3600 <= 150){
                    this.duration = 3600;
                }else{
                    this.duration = 86400;
                }
            },
        },
        mounted(){
            let searchParams = localStorage["searchParam_"+ this.$route.query["id"]];
            if(searchParams){
                this.data = JSON.parse(searchParams);
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .search-drawer {
        .duration{
            display: inline-block;
            width: 100%;
            height: 32px;
            line-height: 1.5;
            padding: 4px 7px;
            font-size: 12px;
            border: 1px solid #dcdee2;
            border-radius: 4px;
            paramValue: #515a6e;
            position: relative;
            cursor: text;
            width: 100%
        }
        .duration:focus, .duration:hover {
            border-paramValue: #57a3f3;
        }
        .tab{
            font-weight: bold;
            text-align: right;
            padding-top: 5px;
        }
        .ivu-drawer-body{
            overflow: initial;
        }
    }
</style>