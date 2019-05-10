<template>
    <div class="charts-sgm">
        <Row>
            <Col span="24" class="charts-name">-- {{ chartName }} --</Col>
        </Row>
        <Row>
            <Col span="24">
                <Select id="app" placeholder="请选择应用 （必选）" filterable clearable v-model="app" @on-change="serviceSelect(app)">
                    <Option :key="selectData.apps[key]" :value="key" v-for="key in Object.keys(selectData.apps)">{{selectData.apps[key]}}</Option>
                </Select>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="24">
                <Select id="service" placeholder="请选择服务 （可选）" filterable clearable  v-model="service" @on-change="methodSelect(app,service)">
                    <Option :key="item" :value="item" v-for="item in selectData.services">{{item}}</Option>
                </Select>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="24">
                <Select id="method" placeholder="请选择方法 （可选）" filterable clearable v-model="method">
                    <Option :key="item.methodName" :value="item.methodName" v-for="item in selectData.methods">{{item.methodName}}</Option>
                </Select>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="12">
                <Select  v-model="baseChartType" placeholder="基础图形">
                    <Option value="linebar">线、柱图 <Icon type="md-pulse" style="float:right;"/></Option>
                    <Option value="pie">饼图 <Icon type="md-pie" style="float:right;"/></Option>
                    <Option value="radar">雷达图 <Icon type="md-wifi" style="float:right;"/></Option>
                    <Option value="liquidfill">水位图 <Icon type="ios-radio-button-on" style="float:right;"/></Option>
                    <Option value="number" disabled>数字图 <Icon type="md-barcode" style="float:right;"/></Option>
                </Select>
            </Col>
        </Row>
        <Divider dashed/>

        <component class="charts-sgm-component" ref="baseChildComponentDrawer" :is="baseChildComponentDrawer" :legends="legends" :quotasRadar="quotasRadar"></component>
    </div>
</template>

<script>
    import {getAppList,getServiceList,getMethodList,getLegendList} from '../../../../../service/serverApi';
    import * as baseChartsConf from '../../../base-charts-drawer/charts/conf';
    import * as baseCharts from "../../../base-charts-drawer/charts";

    export default {
        data(){
            return {
                defaultUrl:"",
                legends:[],
                quotasRadar:{
                    legend:["健康度"],
                    indicator:["失败率","日志数","主机","容量","性能"]
                },
                chartName:"性能监控图",
                eCharts:null,
                app:undefined,
                service:undefined,
                method:undefined,
                selectData:{
                    apps:{},
                    services:[],
                    methods:[]
                },
                baseChartType:"",
                baseChildComponentDrawer:""
            }
        },
        watch:{
            baseChartType(val){
                this.baseChildComponentDrawer = baseChartsConf[val];
            }
        },
        methods: {
            legendSelect(){
                getLegendList().then((response)=>{
                    this.legends = response.data || [];
                });
            },
            appSelect(){
                getAppList().then((response)=>{
                    this.selectData.apps = response.data || {};
                });
            },
            serviceSelect(app,service){
                this.service="";
                this.method ="";
                if(app){
                    getServiceList(app).then((response)=>{
                        this.selectData.services = response.data || [];
                        this.service = service;
                    });
                }else{
                    this.selectData.services = [];
                    this.selectData.methods = [];
                }
            },
            methodSelect(app,service,method){
                this.method ="";
                if(service){
                    getMethodList(app,service).then((response)=>{
                        this.selectData.methods = response.data || [];
                        this.method = method;
                    });
                }else{
                    this.selectData.methods = [];
                }
            },
            initConfig(config, chartElement){
                this.eCharts = chartElement["charts"];
                this.app = config.app;
                this.serviceSelect(config.app, config.service);
                this.methodSelect(config.app, config.service, config.method);
                this.baseChartType = config.baseChartType;
                if(typeof(config)=="object"){
                    this.$nextTick(function() {
                        config.url = this.defaultUrl;
                        this.$refs.baseChildComponentDrawer.initConfig(config);
                    });
                }
            },
            submitConf(){
                if(!this.app){
                    this.$Notice.error({title: '请选择应用!!!'});
                    return;
                }
                let commonConf = this.$refs.baseChildComponentDrawer.submitConf();
                if(commonConf){
                    commonConf.app = this.app;
                    commonConf.service = this.service;
                    commonConf.method = this.method;
                    commonConf.baseChartType = this.baseChartType;

                    let eCharts = this.eCharts;
                    baseCharts[this.baseChartType].init(eCharts, eCharts.themeName);
                    return commonConf;
                }else{
                    return;
                }
            }
        },
        mounted() {
            this.appSelect();
            this.legendSelect();
        },
    }
</script>

<style lang="less" type="text/less">
    //样式共用 base-charts-drawer.vue
    .charts-sgm{
        .charts-name{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
            text-align: center;
        }
        .charts-sgm-component{
            .charts-name{
                display: none;
            }
        }
    }
</style>
