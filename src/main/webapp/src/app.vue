<template>
    <div class="main-container">
        <nav class="navgetion" v-if="isEdit">
            <nav class="menu">
                <div @click="openDrawerFun('theme-drawer',1)"><Icon type="ios-color-palette"/>主题</div>
                <div @click="openDrawerFun('grids-drawer')"><Icon type="md-apps"/>模板</div>
                <div @click="openDrawerFun('base-charts-drawer')"><Icon type="ios-stats" />常规图表</div>
                <div onclick="alert('未上线')"><Icon type="ios-pulse" />业务图表</div>
                <div @click="openDrawerFun('collection-drawer',1)"><Icon type="md-bookmarks" />收藏 / 保存</div>
                <div @click="previewFun()"><Icon type="md-qr-scanner" />预览</div>
                <div @click="openDrawerFun('collection-drawer')" style="position: absolute;right: 10px;"><Icon type="ios-list-box-outline" />收藏列表</div>
            </nav>
        </nav>
        <nav class="container">
            <component :is="childComponentDrawer" :isDrawerLeft="isDrawerLeft" :isDrawerRight="isDrawerRight" :app="app" @setTemplet$Parent="setTemplet" @saveTotalConfig$Parent="saveTotalConfig"></component>
            <div class="main-box">
                <div id="box" :class="app.theme+'-theme'" :style="'background:'+app.background">
                    <nav class="box-head">
                        <div class='title'>
                            <div class="text">{{ appName }}</div>
                            <div class="subtext">{{ $formatDate(sysDate,'yyyy年MM月dd日 hh时mm分ss秒') }}</div>
                        </div>
                        <div class="tool">
                            <Icon type="ios-search"  title="查询" @click="openDrawerFun('search-drawer',1)"/>
                            <Icon type="md-contract" title="编辑" @click="previewFun('edit')" v-if="!isEdit"/>
                        </div>
                        <svg id="svgroot" width="100%" height="80px"></svg>
                    </nav>
                    <nav class="box-body">
                        <ul id="gridMain" ref="gridMain">
                            <li :data-x="value.x" :data-y="value.y" :data-w="value.w" :data-h="value.h" :data-l="value.l||0" class="gs-w" ref="gsw" v-for="value in templet"></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </nav>
        <img ref="photograph" :src="app.photo" width="480" height="220" style="position: absolute;z-index: -1;"/>
    </div>
</template>

<script>
    import styleLess from './static/style.less';
    import dataD from './static/datad';
    export default dataD;
</script>