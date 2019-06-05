<template>
    <div class="main-container">
        <nav class="navgetion" v-if="isEdit">
            <nav class="menu">
                <div @click="openDrawerFun('theme_drawer')"><Icon type="ios-color-palette"/>主题</div>
                <div @click="openDrawerFun('grids_drawer')"><Icon type="md-apps"/>模板</div>
                <div @click="openDrawerFun('baseCharts_drawer')"><Icon type="ios-stats" />常规图表</div>
                <div @click="openDrawerFun('businessCharts_drawer')" v-if="$DataDOption.isUseBusinessChartModule"><Icon type="ios-pulse" />内置图表</div>
                <div @click="openDrawerFun('collection_drawerRight')"><Icon type="md-bookmarks" />收藏 / 保存</div>
                <div @click="previewFun()"><Icon type="md-qr-scanner" />预览</div>
                <div @click="openDrawerFun('collection_drawerLeft')" style="position: absolute;right: 10px;"><Icon type="ios-list-box-outline" />收藏列表</div>
            </nav>
        </nav>
        <nav class="container">
            <!--<component :is="childComponentDrawer" :isDrawerLeft="isDrawerLeft" :isDrawerRight="isDrawerRight" :app="app" @setTemplet$Parent="setTemplet" @saveTotalConfig$Parent="saveTotalConfig"></component> themeDrawer=true;gridsDrawer=false-->
            <theme-drawer :isDrawerOpen="theme_drawer"  @isDrawerOpen$Parent="isDrawerOpenFun" :app="app" @openFireworks$Parent="openFireworks"></theme-drawer>
            <grids-drawer :isDrawerOpen="grids_drawer"  @isDrawerOpen$Parent="isDrawerOpenFun"  @setTemplet$Parent="setTemplet"></grids-drawer>
            <base-charts-drawer :isDrawerOpen="baseCharts_drawer" @isDrawerOpen$Parent="isDrawerOpenFun" :app="app"></base-charts-drawer>
            <business-charts-drawer  :isDrawerOpen="businessCharts_drawer" @isDrawerOpen$Parent="isDrawerOpenFun" :app="app" v-if="$DataDOption.isUseBusinessChartModule"></business-charts-drawer>
            <collection-drawer :isDrawerOpenLeft="collection_drawerLeft" :isDrawerOpenRight="collection_drawerRight" @isDrawerOpen$Parent="isDrawerOpenFun" :app="app" @saveTotalConfig$Parent="saveTotalConfig"></collection-drawer>
            <search-drawer :isDrawerOpen="search_drawer" @isDrawerOpen$Parent="isDrawerOpenFun" ></search-drawer>
            <div class="main-box">
                <div id="box" :class="app.theme+'-theme'" :style="'background:'+app.background">
                    <nav class="box-head">
                        <div class='title'>
                            <div class="text">{{ appName }}</div>
                            <div class="subtext" id="sysDate">{{ $formatDate(sysDate,'yyyy年MM月dd日 hh时mm分ss秒') }} </div>
                        </div>
                        <div class="tool">
                            <Icon type="ios-search"  title="查询" @click="openDrawerFun('search_drawer')"/>
                            <Icon type="md-contract" title="编辑" @click="previewFun('edit')" v-if="!isEdit"/>
                        </div>
                        <svg id="svgroot" width="100%" height="80px"></svg>
                    </nav>
                    <nav class="box-body">
                        <ul id="gridMain" ref="gridMain">
                            <li :data-x="value.x" :data-y="value.y" :data-w="value.w" :data-h="value.h" :data-l="value.l||0" class="gs-w" ref="gsw" v-for="value in templet"></li>
                        </ul>
                    </nav>
                    <div class="box-foot">
                        <canvas id='fireworks' :open="isOpenFireworks"></canvas>
                        <div style="display:none">
                            <div v-if="app.bgEffects.values.length==0 && app.bgEffects.datetime.length==0" class="shape">{{ $formatDate(sysDate,'yy-MM-dd hh:mm:ss') }}</div>
                            <div v-else class="shape" v-for="item in app.bgEffects.values.split(',')">{{item}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <img ref="photograph" :src="app.photo" width="480" height="220" style="position: absolute;z-index: -1;"/>
    </div>
</template>

<script>
    import styleLess from './static/style.less';
    import dataD from './static/datad';
    import { formatDate } from './utils/formatDate';
    setInterval(()=>{
        document.getElementById("sysDate").innerText = formatDate(Date.now(),'yyyy年MM月dd日 hh时mm分ss秒');
    },1000);
    export default dataD;
</script>