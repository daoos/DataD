<template>
    <div class="collection-drawer">
        <Drawer title="收藏列表" :transfer="false" :inner="true" :mask="true" :width="316.5" :styles="styles" placement="left" v-model="isDrawerLeft">
            <div id="pageTemplet">
                <template  v-for="item in pageList">
                    <Divider><span style="font-size: 14px;">{{item.key+"："+item.value.name}}</span></Divider>
                    <img class="page-photo" :data-id="item.key" :src="item.value.photo" width="280" height="134" @click="openPage(item.key)"/>
                </template>
            </div>
            <div class="drawer-footer"></div>
        </Drawer>

        <Drawer title="页面收藏" :transfer="false" :inner="true" :width="400" v-model="isDrawerRight">
            <Form ref="custom" :model="app" :rules="ruleInline" inline>
                <FormItem prop="name" label="图表名称：" style="width: 100%;">
                    <Input v-model="app.name" placeholder="Please enter chart name..." clearable/>
                </FormItem>
                <FormItem prop="flag" label="适用范围：" style="width: 100%;">
                    <Select v-model="app.flag">
                        <Option :value=1>仅自己可见</Option>
                        <Option :value=2>仅组内可见</Option>
                        <Option :value=3>所有人可见</Option>
                    </Select>
                </FormItem>
                <Divider />
                <Row style="text-align: center;">
                    <ButtonGroup>
                        <Button icon="md-add" type="primary" @click="add">新增</Button>
                        <Button icon="md-settings"  @click="update" v-show="app.id!=null">修改</Button>
                        <Button icon="md-close" @click="isDrawerRight = false">取消</Button>
                        <Button icon="md-trash" type="primary" @click="remove" v-show="app.id!=null">删除</Button>
                    </ButtonGroup>
                </Row>
            </Form>
        </Drawer>
    </div>
</template>

<script>
    import { selectAllDdPage } from "../../../service/serverApi";
    export default {
        props:["isDrawerLeft","isDrawerRight","app"],
        data() {
            return {
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 75px)',
                    overflow: 'auto',
                    position: 'static'
                },
                pageList:[],
                ruleInline: {
                    'name': [{required: true, message: 'Please fill in the name', trigger: 'blur'}],
                }
            }
        },
        watch:{
            isDrawerLeft(newVal){
                if(newVal) this.list();
            }
        },
        methods:{
            add(){
                sessionStorage.removeItem("bgEffects");
                this.$emit('saveTotalConfig$Parent',1);
            },
            update(){
                this.$Modal.confirm({
                    title: '确定该修改 ?',
                    onOk: () => {
                        sessionStorage.removeItem("bgEffects");
                        this.$emit('saveTotalConfig$Parent',2);
                    }
                });
            },
            remove(){
                this.$Modal.confirm({
                    title: '确定该删除 ?',
                    onOk: () => {
                        sessionStorage.removeItem("bgEffects");
                        this.$emit('saveTotalConfig$Parent',0);
                    }
                });
            },
            list(){
                selectAllDdPage(this.$DataDOption.isUseIndexedDB).then(response=>{
                    this.pageList = response.data||[];
                });
            },
            openPage(pageId){
                sessionStorage.removeItem("curTheme");
                this.$router.push({
                    query:{id:pageId}
                });
                window.location.reload();
            }
        },
        mounted() {
            let curTheme = sessionStorage.getItem("curTheme");
            if(curTheme){
                let _themeConf= JSON.parse(curTheme);
                this.app.theme=_themeConf.theme;
                this.app.background=_themeConf.background;
            }
            let bgEffects = sessionStorage.getItem("bgEffects");
            if(bgEffects){
                Object.assign(this.app.bgEffects, JSON.parse(bgEffects));
            }
            this.list();
        }
    }
</script>
<style lang="less" type="text/less">
    .collection-drawer{
        .page-photo{
            cursor: pointer;
            border:0px;
            box-shadow: 0px 0px 2px rgba(0,0,0,.2);
            background: url(../../images/bg.png);
            &:hover{
                box-shadow: 0px 0px 4px rgba(0,0,0,.4);
            }
        }
    }
</style>