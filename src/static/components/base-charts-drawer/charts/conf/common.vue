<template>
    <div class="charts-common">
        <Row>
            <Col span="24" class="charts-name">-- {{ chartName }} --</Col>
        </Row>
        <Row>
            <Col span="3" class="tab">图表名称：</Col>
            <Col span="9"><Input v-model="title" placeholder="非必填..." clearable size="large" style="width: 200px"/></Col>
            <Col span="3" class="tab">模块布局：</Col>
            <Col span="9">
                <Select v-model="layout" size="large"  style="width:200px">
                    <Option :value=0>纵向</Option>
                    <Option :value=1>横向</Option>
                    <Option :value=2>X*2</Option>
                    <Option :value=3>X*3</Option>
                    <Option :value=4>X*4</Option>
                    <Option :value=5>X*5</Option>
                    <Option :value=6>X*6</Option>
                </Select>
            </Col>
        </Row>
        <Divider dashed/>
        <Row>
            <Col span="3" class="tab">刷新频率：</Col>
            <Col span="9"><InputNumber v-model="interval" :max="86400" :min="1" placeholder="默认：4秒" size="large" style="width: 80px;"/>（单位：秒）</Col>
            <Col span="3"  v-show="!isDisabledUrl" class="tab">数据URL：</Col>
            <Col span="9" v-show="!isDisabledUrl">
                <Input v-model="url" type="url" placeholder="http://.不填时为模拟数据" clearable size="large" style="width: 200px">
                    <span slot="append">
                        <Tooltip placement="bottom-end" max-width=550 >
                            <Icon type="md-help-circle" size="16"/>
                            <pre slot="content">
数据URL跨域访问（您可以选择下方任意一种方式实现跨域资源共享）

方式一（JSONP）：JSONP回调函数：jsonpCallback
    后端Controller方法返回结果需要做进一步处理
    {
        ... ...
        // return result ;
        return "jsonpCallback("+result.toString()+")" ;
    }

方式二（CORS）：
    后端Controller方法中自定义HTTP头部（如：只允许特定域发起跨域请求）
    {
        ... ...
        String[] allowOrigin = {"http://sgm.jdfmgt.com","http://sgm.jd.com"};
        Set&lt;String&gt; allowedOrigins = new HashSet(Arrays.asList(allowOrigin));
        String originHeader = request.getHeader("Origin");
        if(allowedOrigins.contains(originHeader)){
             response.setHeader("Access-Control-Allow-Origin",originHeader);
             response.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS");
             response.setHeader("Access-Control-Allow-Headers","Content-type,x-requested-with");
             ... ...
        }
        ... ...
    }</pre>
                        </Tooltip>
                    </span>
                </Input>
            </Col>
        </Row>
        <Divider dashed/>
    </div>
</template>

<script>
    export default {
        props:["chartName","isDisabledUrl"],
        data() {
            return {
                chartType:"line",
                title:"",
                url:"",
                interval:4,
                layout:0
            }
        },
        methods: {
            initConfig(config){
                if(typeof(config)=="object"){
                    this.chartType = config.chartType || "line";
                    this.title = config.title ||"";
                    this.url = config.url || "";
                    this.interval = config.interval || 4;
                    this.layout = config.layout || 0;
                }else{
                    this.chartType = "line";
                    this.title = "";
                    this.url = "";
                    this.interval = 4;
                    this.layout = config;
                }
            },
            submitConf(){
                let _this = this;
                return {
                    chartType:_this.chartType,
                    title:_this.title,
                    url:_this.url,
                    interval:_this.interval,
                    layout:_this.layout
                };
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-common{
        .charts-name{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
            text-align: center;
        }
    }
</style>