<template>
    <div>
        <charts-linebar :seriesTypes="seriesTypes" class="charts-line"></charts-linebar>
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
                seriesTypes:{"line_0":"无","line_1":"分组一","line_2":"分组二"}
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-line{
        &:before{
            content: "-- 线状图 --";
        }
    }
</style>