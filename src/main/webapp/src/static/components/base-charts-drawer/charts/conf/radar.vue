<template>
    <div class="charts-radar">
        <charts-common ref="commonConf" :chartName="chartName"></charts-common>

        <Row @click.native="handleSave(table1.editIndex,1);table1.editIndex = -1;">
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
            <Table highlight-row border ref="dataTable1" :columns="table1.columns" :data="table1.data" @on-current-change="currentChange1">
                <template slot-scope="{ row, index }" slot="col1">
                    <Input v-model="table1.editCol1" v-if="table1.editIndex === index" placeholder="必填"/>
                    <span v-else>
                        <span v-if="row.col1">{{ row.col1 }}</span>
                        <span v-else style="color:#ed4014">必填</span>
                    </span>
                </template>
                <template slot-scope="{ row, index }" slot="col2">
                    <ColorPicker v-model="table1.editCol2" v-if="table1.editIndex === index" recommend alpha/>
                    <span v-else>
                        <span v-if="row.col2" :style="'padding:1.5px 9px;box-shadow: 0px 0px 2px rgba(0,0,0,.6) inset;background-color:'+row.col2"></span>
                        <span v-else>自动</span>
                    </span>
                </template>
            </Table>
            </Col>
        </Row>
        <br/>

        <Row @click.native="handleSave(table2.editIndex,2);table2.editIndex = -1;">
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
            <Table highlight-row border ref="dataTable2" :columns="table2.columns" :data="table2.data" @on-current-change="currentChange2">
                <template slot-scope="{ row, index }" slot="col1">
                    <Input v-model="table2.editCol1" v-if="table2.editIndex === index" placeholder="必填"/>
                    <span v-else>
                        <span v-if="row.col1">{{ row.col1 }}</span>
                        <span v-else style="color:#ed4014">必填</span>
                    </span>
                </template>
                <template slot-scope="{ row, index }" slot="col2">
                    <InputNumber v-model="table2.editCol2"  v-if="table2.editIndex === index" :min="0"></InputNumber>
                    <span v-else>{{ row.col2 || 100 }}</span>
                </template>
            </Table>
            </Col>
        </Row>
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
                            slot: 'col1'
                        },
                        {
                            width: 150,
                            title: '颜色',
                            slot: 'col2'
                        }
                    ],
                    data: [],
                    editIndex: -1,
                    editCol1: '',
                    editCol2: '',
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
                            slot: 'col1'
                        },
                        {
                            width: 150,
                            title: '最大值',
                            slot: 'col2'
                        }
                    ],
                    data: [],
                    editIndex: -1,
                    editCol1: '',
                    editCol2: 100,
                    rowNumber:1
                }
            }
        },
        methods: {
            handleEdit (row, index, tabIndex) {
                let _table = this["table"+tabIndex];
                _table.editCol1 = row.col1;
                _table.editCol2 = row.col2;
                _table.editIndex = index;
            },
            handleSave (index, tabIndex) {
                if(index==-1) return;
                let _table = this["table"+tabIndex];
                _table.data[index].col1 = _table.editCol1;
                _table.data[index].col2 = _table.editCol2;
            },
            currentChange1(currentRow,oldCurrentRow,tabIndex=1){
                let _table = this["table"+tabIndex];
                if(oldCurrentRow) {
                    this.handleSave(_table.data.findIndex(x=>x.col1==oldCurrentRow.col1),tabIndex);
                }
                this.handleEdit(currentRow,_table.data.findIndex(x=>x.col1==currentRow.col1),tabIndex);
            },
            currentChange2(currentRow,oldCurrentRow,tabIndex=2){
               this.currentChange1(currentRow,oldCurrentRow,tabIndex);
            },
            addRow(tabIndex){
                let _table = this["table"+tabIndex];
                _table.data.push({
                    col1: '图例'+(_table.rowNumber++),
                    col2: tabIndex==1?"":100
                });
            },
            removeRow(tabIndex){
                let _table = this["table"+tabIndex];
                this.$refs["dataTable"+tabIndex].getSelection().forEach(el=>{
                    let _data = _table.data;
                    _data.splice(_data.findIndex(x=>x.col1==el.col1),1);
                });
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
                let tables = [this["table1"],this["table2"]].map((x,index)=>{
                    this.handleSave(x.editIndex,index+1);
                    x.editIndex = -1;
                    return x;
                });
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    if(tables[0].data.length>0 && tables[1].data.length>0){
                        if(tables[1].data.length<3){
                            this.$Notice.error({title: '指标项必须大于或等于3项!!!'});
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