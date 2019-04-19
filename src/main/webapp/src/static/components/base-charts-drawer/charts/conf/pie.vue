<template>
    <div class="charts-pie">
        <charts-common ref="commonConf" :chartName="chartName"></charts-common>

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
                    <Input v-model="editLegendTitle" v-if="editIndex === index" placeholder="必填"/>
                    <span v-else>
                        <span v-if="row.legendTitle">{{ row.legendTitle }}</span>
                        <span v-else style="color:#ed4014">必填</span>
                    </span>
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
        components: {
            'charts-common': common,
        },
        data () {
            return {
                chartName:"饼状图",
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
                        width: 95,
                        title: '颜色',
                        slot: 'color',
                    }
                ],
                data: [],
                editIndex: -1,
                editLegendTitle: '',
                editColor: '',
                rowNumber:1
            }
        },
        methods: {
            handleEdit (row, index) {
                this.editLegendTitle = row.legendTitle;
                this.editColor = row.color;
                this.editIndex = index;
            },
            handleSave (index) {
                if(index==-1) return;
                this.data[index].legendTitle = this.editLegendTitle;
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
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                this.handleSave(this.editIndex);
                this.editIndex = -1;

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