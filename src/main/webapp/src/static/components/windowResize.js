import {DrawNavgetion} from "./drawNavgetion";
import {ChartsFactory} from "./base-charts-drawer/ChartsFactory"

/**
 * 监听浏览器窗口大小变动，调用各图表的宽高自适应
 * @param $vue
 * @param nav
 */
export function WindowResize($vue){
    //导航
    let nav = DrawNavgetion("#svgroot",$vue.app.theme).navgetion();

    window.addEventListener("resize", () => {
        [nav].forEach(el=> el.resize());

        //设置图表Resize前，需要重新计算每个布局格子宽度.
        [... document.querySelectorAll("#gridMain .gs-w")].forEach(x=>{
            ChartsFactory().resize(x);
        })
    });
}