<template>
    <div class="collection-drawer">
        <Drawer title="页面收藏" :transfer="false" :inner="true" :width="400" v-model="isDrawerRight">
            <Form ref="custom" :model="app" :rules="ruleInline" inline>
                <FormItem prop="name" label="图表名称：" style="width: 100%;">
                    <Input v-model="app.name" placeholder="Please enter chart name..." />
                </FormItem>
                <FormItem prop="flag" label="适用范围：" style="width: 100%;">
                    <Select v-model="app.flag">
                        <Option value=1>所有人可见</Option>
                        <Option value=2>仅自己可见</Option>
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
    export default {
        props:["isDrawerLeft","isDrawerRight","app"],
        data() {
            return {
                isDrawerRight:false,
                ruleInline: {
                    'name': [{required: true, message: 'Please fill in the name', trigger: 'blur'}],
                }
            }
        },
        methods:{
            add(){
                this.$emit('saveTotalConfig$Parent',1);
            },
            update(){
                this.$Modal.confirm({
                    title: '确定该修改 ?',
                    onOk: () => {
                        this.$emit('saveTotalConfig$Parent',2);
                    }
                });
            },
            remove(){
                this.$Modal.confirm({
                    title: '确定该删除 ?',
                    onOk: () => {
                        this.$emit('saveTotalConfig$Parent',0);
                    }
                });
            }
        },
        mounted() {
            let curTheme = sessionStorage.getItem("curTheme");
            if(curTheme){
                let _themeConf= JSON.parse(curTheme);
                this.app.theme=_themeConf.theme;
                this.app.background=_themeConf.background;
            }
        }
    }
</script>