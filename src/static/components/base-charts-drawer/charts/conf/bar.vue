<template>
    <div>
        <charts-linebar ref="linebarChart" :seriesTypes="seriesTypes" :chartType="chartType" class="charts-bar"></charts-linebar>
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
                chartType:"bar",
                seriesTypes:{"bar_0":"无","bar_1":"分组一","bar_2":"分组二"}
            }
        },
        methods: {
            initConfig(config){
                this.$refs.linebarChart.initConfig(config);
            },
            submitConf(){
                return this.$refs.linebarChart.submitConf();
            }
        }
    }
</script>