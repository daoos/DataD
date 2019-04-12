<template>
    <div class="collection-drawer">
        <Drawer title="页面收藏" :transfer="false" :inner="true" :width="590" :styles="styles" v-model="isOpenDrawer">
            <nav>
                1111
            </nav>
            <div class="drawer-footer">
                <Button  @click="isOpenDrawer = false">取消</Button>
                <Button type="primary" @click="submit">确定</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    export default {
        props:["isOpenDrawer"],
        data() {
            return {
                menuName:"我的图表",
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 90px)',
                    overflow: 'auto',
                    position: 'static'
                }
            }
        },
        methods:{
            submit(){
                this.$emit('saveTotalConfig$Parent','22')
            }
        }
    }
</script>

<style lang="less" type="text/less">

</style>