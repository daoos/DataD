<template>
    <div class="main-container">
        <nav class="navgetion">
            <nav class="menu">
                <div @click="openDrawer('grids-drawer')"><Icon type="md-apps"/>模板</div>
                <div><Icon type="ios-color-palette"/>主题</div>
                <div @click="openDrawer('base-charts-drawer')"><Icon type="ios-stats" />常规图表</div>
                <div><Icon type="ios-pulse" />业务图表</div>
                <div><Icon type="md-bookmarks" />收藏</div>
                <div><Icon type="md-qr-scanner" />预览</div>
            </nav>
        </nav>
        <nav class="container">
            <component :is="childComponentDrawer" :isDrawerLeft="isOpenDrawer" @setTemplet$Parent="setTemplet"></component>
            <div class="main-box">
                <div class="box">
                    <nav class="box-head">
                        <div class='title'>
                            <div class="text">{{ appName }}</div>
                            <div class="subtext">{{ $formatDate(sysDate,'yyyy年MM月dd日 hh时mm分ss秒') }}</div>
                        </div>
                        <svg id="svgroot" width="100%" height="80px"></svg>
                    </nav>
                    <nav class="box-body">
                        <ul id="gridMain" ref="gridMainTemplet">
                            <li :data-x="value.x" :data-y="value.y" :data-w="value.w" :data-h="value.h" :data-l="value.l||2" class="gs-w" ref="gsw" v-for="value in templet"></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    import styleLess from './static/style.less';
    import dataD from './static/datad';
    export default dataD;
</script>