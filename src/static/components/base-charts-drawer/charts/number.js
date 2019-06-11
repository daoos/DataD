import common from "./common";
import {def,particle} from "../../numberAnimate";
import {formatNumber} from "../../../../utils/formatNumber";
/**
 * number 数字图
 */
export default{
    group:"MyCharts", //（自定义图表，即：非Echars）
    init(chartElement,themeName){
        let theme = common.themes.filter(x=> x.id.includes(themeName));
        let myDiagram = document.createElement("canvas");
        chartElement.appendChild(myDiagram);

        let canvasId = "number_"+Date.now()+"_"+Math.ceil(Math.random()*100000);
        myDiagram.setAttribute("id",canvasId);
        myDiagram.setAttribute("style","position: absolute;top:0px;left: 0px;");
        myDiagram.setAttribute("width",chartElement.clientWidth);
        myDiagram.setAttribute("height",chartElement.clientHeight);
        myDiagram.fontSize = 200;
        myDiagram.title = "数字图";
        myDiagram.titleColor = theme.length==0?"#333333":theme[0].titleColor;
        myDiagram.themeColor = theme.length==0?"rgb(116,153,159)":theme[0].colors[0];
        myDiagram.color = theme.length==0?"rgb(116,153,159)":theme[0].colors[0];
        myDiagram.series = "+123456789.87";
        myDiagram.type = "default";
        myDiagram.effects = {
            "default":def(canvasId),
            "particle":particle(canvasId)
        };
        this._drawText(myDiagram, myDiagram.series);

        myDiagram.resize = ()=>{
            setTimeout(()=>{
                myDiagram.width = chartElement.clientWidth;
                myDiagram.height = chartElement.clientHeight;
                myDiagram.fontSize = 200;
                this._drawText(myDiagram, myDiagram.series);
            },200);
        };
        myDiagram.dispose = ()=>{
            myDiagram = null;
        };
        return myDiagram;
    },

    _drawText(canvas, number=0){
        canvas.series = number;
        canvas.effects[canvas.type].drawText(formatNumber(number));
        this._drawTitle(canvas, canvas.title);
    },
    _drawTitle(canvas, text){
        let canvasContext = canvas.getContext('2d');
        canvasContext.save(); //save和restore可以保证样式属性只运用于该段canvas元素
        if(false){
        }else{
            canvasContext.fillStyle = canvas.titleColor;
            canvasContext.textAlign = "center";
            canvasContext.textBaseline="middle";
            //canvasContext.shadowColor = "rgba(0, 0, 0, .4)";
            //canvasContext.shadowBlur = 10;
            canvasContext.font = "bold 18px sans-serif";
        }
        canvasContext.fillText(text, canvas.width/2,  22); //绘制字体，并且指定位置
        canvasContext.restore();
    },

    options(diagram, paramsDevelop){
        diagram.extend = this;
        let config = diagram.myConfig;
        let params = Object.assign({duration:config.interval, startTime:"", endTime:""}, paramsDevelop);
        let Common = Object.assign({},common);
        Common.start(diagram, config.url||"/demo/charts/number", params, config.interval)(result =>{
            console.debug("===成功=number==",result);
            diagram.title = config.title;
            diagram.color = config.api.color||diagram.themeColor;
            diagram.type = config.api.seriesType;
            if("series" in result){
                this._drawText(diagram, result["series"]);
            }
        });
    }
}

