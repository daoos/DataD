<template>
    <div class="main-container">
        <nav class="navgetion">
            <nav class="menu">
                <div @click="openGridsDrawer = true"><Icon type="md-apps"/>模板</div>
                <div><Icon type="ios-color-palette"/>主题</div>
                <div><Icon type="ios-stats" />常规图表</div>
                <div><Icon type="ios-pulse" />业务图表</div>
                <div><Icon type="md-bookmarks" />收藏</div>
                <div><Icon type="md-qr-scanner" />预览</div>
            </nav>
        </nav>
        <nav class="container">
            <grids-drawer :isDrawerLeft="openGridsDrawer"></grids-drawer>
            <div class="box">
                <nav class="box-head">
                    <div class='title'>
                        <div class="text">{{ appName }}</div>
                        <div class="subtext">{{ $formatDate(sysdate,'yyyy年MM月dd日 hh时mm分ss秒') }}</div>
                    </div>
                    <svg id="svgroot" width="100%" height="80px"></svg>
                </nav>
                <nav class="box-body">
                </nav>
            </div>
        </nav>
    </div>
</template>


<script>
    import styleLess from './static/style.less';
    import dataD from './static/datad';
    export default dataD;
</script>


<style scoped lang='less'>
    .button-group {
        text-align: right;
        Button {
            width: 74px;
            border-radius: 5px 5px 0px 0px;
            border: 1px solid rgba(0,0,0,.2);
            border-bottom: 0px;
        }
    }
</style>