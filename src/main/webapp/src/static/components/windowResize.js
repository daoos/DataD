import {DrawNavgetion} from "./drawNavgetion";

/**
 * 监听浏览器窗口大小变动，调用各图表的宽高自适应
 * @param $vue
 * @param nav
 */
export function WindowResize($vue){
    //导航
    let nav = DrawNavgetion("#svgroot").navgetion();

    window.addEventListener("resize", () => {
        [nav].forEach(el=> el.resize());
    });
}