import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'

/**
 * SVG绘制导航抬头
 * @param svgId
 * @returns {{path: null}}
 */
export function DrawNavgetion(svgId,theme){
    const SVG = Snap(svgId);
    let instance = {path:null};
    let lgrad= SVG.gradient("l(0, 0, 1, 0)rgba(0,0,0,0)-rgba(0,0,0,.5)-rgba(0,0,0,0)");
    // if(theme=="dark"){
    //     lgrad= SVG.gradient("l(0, 0, 1, 0)rgba(77,135,250,0)-rgba(77,135,250,.3)-rgba(77,135,250,0)");
    // }
    instance.navgetion = ()=>{
        let [documentWidth,documentHeight,bottomBorder]=[document.body.clientWidth, 40, 200];
        let shapeShadow = SVG.filter(Snap.filter.shadow(0, 2, 5,"#000000",.6));
        instance.path = SVG.path("M 0 0 H "+documentWidth+" V "+documentHeight+" h -"+((documentWidth)/2-(bottomBorder/2+60))+" q -15 0 -30 15 t -30 15  h -"+bottomBorder+" q -15 0 -30 -15 t -30 -15 H 0 Z").attr({
            fill: lgrad,
            stroke: lgrad,
            filter: shapeShadow,
            strokeWidth: 2.5
        });
        return instance;
    }
    instance.resize = ()=>{
        let [documentWidth,documentHeight,bottomBorder]=[document.body.clientWidth, 40, 200];
        instance.path.attr({
            d:"M 0 0 H "+documentWidth+" V "+documentHeight+" h -"+((documentWidth)/2-(bottomBorder/2+60))+" q -15 0 -30 15 t -30 15  h -"+bottomBorder+" q -15 0 -30 -15 t -30 -15 H 0 Z"
        });
    }
    return instance;
}