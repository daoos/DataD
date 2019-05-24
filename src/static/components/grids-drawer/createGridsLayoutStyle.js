/**
 *  模板格子布局样式
 * @param ElemThis 布局存入容器
 * @constructor
 */
export function CreateGridsLayoutStyle(ElemThis){
    let options = {
        widget_base_dimensions:[100,50],
        margin_base:4,
        max_cols:4,
        max_rows:6,
    };

    function _grids(obj) {
        this.elem = obj;
        this.gridOptions={
            width : this.elem.clientWidth/options.max_cols,
            height: this.elem.clientHeight/options.max_rows
        };
        this.init();
        this.createStyle(options.max_rows);
        return this;
    };

    let fn = _grids.prototype;

    fn.init = function() {
        this.elem.querySelectorAll("ul").forEach(x=>{
            //x.style.width = this.elem.clientWidth;
            //x.style.height = this.elem.clientHeight;
        })
    };

    fn.createStyle = function(count){
        let elemId = this.elem.id;
        let [_gw,_gh] = [this.gridOptions.width,this.gridOptions.height];
        const _loop = function(i, str=""){
            let [_width,_height] = [i*_gw, i*_gh], [_let,_top] = [_width-_gw, _height-_gh];
            for(let j=2; j<=count; j++){
                str+=`
                #${elemId} [data-w="${i}"][data-l="${j}"] .chartTemplet{ width: ${(_width/j)-5}px;}`;
            }
            str+=`
                #${elemId} [data-w="${i}"] { width:${_width}px; }
                #${elemId} [data-h="${i}"] { height:${_height}px; }
                #${elemId} [data-x="${i}"] { left:${_let}px; }
                #${elemId} [data-y="${i}"] { top:${_top}px; }
                `;
            if(i > 1) str = _loop(i - 1, str);
            return str;
        };
        let strStyle = _loop(count);
        strStyle += `
            #${elemId} [data-l="0"] { flex-flow: column; }
            #${elemId} [data-l="1"] { flex-flow: row; }
            #${elemId} .gs-w{ min-width:${_gw}px;  min-height:${_gh}px; border-width:${options.margin_base/2}px; }
            #${elemId} [data-l]:not([data-l="0"]):not([data-l="1"]) { flex-wrap: wrap; }
            #${elemId} [data-l="0"] .chartTemplet{ flex:1; }
            #${elemId} [data-l="1"] .chartTemplet{ flex:1; }
            `;
        let styleId = `gs-${elemId}`;
        let styleElement = document.querySelector("#"+styleId);
        if(styleElement && styleElement.tagName=="STYLE"){
            styleElement.innerHTML = strStyle;
        }else{
            let style = document.createElement('style') ;
            style.id = styleId;
            style.type = 'text/css';
            style.innerHTML = strStyle ;
            document.getElementsByTagName('HEAD').item(0).appendChild(style) ;
        }
    };

    new _grids(ElemThis);

    window.onresize=()=>{
        let gridMain = document.getElementById("gridMain");
        new _grids(gridMain);
    };
}