<template>
    <div>
        <charts-linebar :seriesTypes="seriesTypes" class="charts-bar"></charts-linebar>
    </div>
</template>

<script>
    import linebar from './linebar.vue';
    export default {
        components: {
            'charts-linebar': linebar,
        },
        data () {
            return {
                seriesTypes:{"bar_0":"无","bar_1":"分组一","bar_2":"分组二"}
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-bar{
        &:before{
            content: "-- 柱状图 --";
        }
    }
</style>