import common from "./common";
import gojs from "../../gojs/go";

/**
 * topo 拓扑图
 */
export default{
    group:"MyCharts", //（自定义图表，即：非Echars）
    init(chartElement){
        chartElement.setAttribute("id","topo_"+Date.now());
        let myDiagram = this._topoTemplet(chartElement.getAttribute("id"), false);
        myDiagram.model = go.Model.fromJson(`
        {
            "class": "go.GraphLinksModel", 
            "linkFromPortIdProperty": "fromPort", 
            "linkToPortIdProperty": "toPort", 
            "nodeDataArray": [
                {
                    "category": "Comment", 
                    "loc": "373.0001718577181 -161.81704557492304", 
                    "text": "Kookie Brittle", 
                    "key": -13
                }, 
                {
                    "key": -1, 
                    "category": "Start", 
                    "loc": "195.4485691088267 -171.76798051414312", 
                    "text": "Start"
                }, 
                {
                    "key": 0, 
                    "loc": "-46.889453369247235 16.882380147464588", 
                    "text": "Preheat oven to 375 F"
                }, 
                {
                    "key": 1, 
                    "loc": "195.61114377571323 33.29220920918594", 
                    "text": "In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"
                }, 
                {
                    "key": 2, 
                    "loc": "195.73823169462773 190.60833569584855", 
                    "text": "Gradually beat in 1 cup sugar and 2 cups sifted flour"
                }, 
                {
                    "key": 3, 
                    "loc": "195.80618220754354 337.32928494803974", 
                    "text": "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
                }, 
                {
                    "key": 4, 
                    "loc": "196.28326045482254 502.4821920437321", 
                    "text": "Press evenly into ungreased 15x10x1 pan"
                }, 
                {
                    "key": 5, 
                    "loc": "430.80243982797015 24.607059997702947", 
                    "text": "Finely chop 1/2 cup of your choice of nuts"
                }, 
                {
                    "key": 6, 
                    "loc": "196.33123383532762 637.6766832935039", 
                    "text": "Sprinkle nuts on top"
                }, 
                {
                    "key": 7, 
                    "loc": "196.50921328373093 757.3062741899992", 
                    "text": "Bake for 25 minutes and let cool"
                }, 
                {
                    "key": 8, 
                    "loc": "196.6520704494309 887.942815415246", 
                    "text": "Cut into rectangular grid"
                }, 
                {
                    "key": -2, 
                    "category": "End", 
                    "loc": "196.88946475921873 1005.1061440348532", 
                    "text": "Enjoy!"
                }
            ], 
            "linkDataArray": [
                {
                    "from": 1, 
                    "to": 2, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 2, 
                    "to": 3, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 3, 
                    "to": 4, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 4, 
                    "to": 6, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 6, 
                    "to": 7, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 7, 
                    "to": 8, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 8, 
                    "to": -2, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": -1, 
                    "to": 0, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": -1, 
                    "to": 1, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": -1, 
                    "to": 5, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 5, 
                    "to": 4, 
                    "fromPort": "B", 
                    "toPort": "T"
                }, 
                {
                    "from": 0, 
                    "to": 4, 
                    "fromPort": "B", 
                    "toPort": "T"
                }
            ]
        }`);
        myDiagram.resize = ()=>{
            // let config = myDiagram.myConfig;
            // myDiagram.model = go.Model.fromJson(config.api);
        }
        myDiagram.dispose = ()=>{
            myDiagram = null;
        }
        return myDiagram;
    },

    options(diagram, paramsDevelop){
        let _this = this;
        let config = diagram.myConfig;
        diagram.model =  go.Model.fromJson(config.api);
        diagram.extend = this;

        let originalNodes = _this._originalSeries(diagram);
        let legends =[];
        for(let elem of originalNodes.values()){
            if(elem.id) legends.push(elem.id);
        }
        let params = Object.assign({legends:legends, startTime:"", endTime:""}, paramsDevelop);
        let Common = Object.assign({},common);
        Common.start(diagram, config.url||"/charts/topo", params, config.interval)(result =>{
            console.debug("===成功=topo==",result);
            if(Array.isArray(result["series"])){
                diagram.model.nodeDataArray.forEach(elem =>{
                    let node = diagram.findNodeForKey(elem.key);
                    if(node!=null){
                        let series = result["series"];
                        for(let i in series){
                            if(series[i].id == elem.id){
                                let originalNode = originalNodes.get(elem.key);
                                let items = [];
                                series[i].items.forEach(item=>{
                                    items.push(item.name+"："+item.value);
                                });
                                let shape = node.findObject("PIPE22");
                                if(items.length>4){
                                    shape.visible = true;
                                    diagram.model.setDataProperty(node.data, "detail", Object.assign([],items).splice(0,3).join("\n"));
                                    diagram.model.setDataProperty(node.data, "detail2", Object.assign([],items).splice(3));
                                }else{
                                    shape.visible = false;
                                    diagram.model.setDataProperty(node.data, "detail", items.join("\n"));
                                }
                                diagram.model.setDataProperty(node.data, "fill", _this._nodeAlarm(series[i].alarmlevel, originalNode.fill));
                                break;
                            }
                        }
                    }
                });
            }
        });
    },
    _topoTemplet(domId, bool=true){
        function nodeStyle() {
            return [
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),{
                    locationSpot: go.Spot.Center,
                    shadowOffset: new go.Point(0, 0),
                    shadowBlur: 20,
                    shadowColor: "rgba(0,0,0,.6)",
                    isShadowed:true,
                    shadowVisible:true,
                    selectionAdorned: true,
                    cursor:'pointer'
                }
            ];
        }
        function makePort(name, align, spot, output, input) {
            let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
            return $(go.Shape,{
                fill: "transparent",
                strokeWidth: 0,
                width: horizontal ? NaN : 8,
                height: !horizontal ? NaN : 8,
                alignment: align,
                stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                portId: name,
                fromSpot: spot,
                fromLinkable: output,
                toSpot: spot,
                toLinkable: input,
                cursor: "pointer",
                mouseEnter: function(e, port) {
                    if (!e.diagram.isReadOnly && bool) port.fill = "rgba(255,0,255,0.5)";
                },
                mouseLeave: function(e, port) {
                    port.fill = "transparent";
                }
            });
        }
        function textStyle() {
            return {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                stroke: "whitesmoke"
            }
        }
        function showLinkLabel(e) {
            let label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
        function hexToRgba(hex, opacity) {
            return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
        }

        let levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB","#008299", "#D24726", "#008A00", "#094AB2"];
        let color = levelColors[4];
        let $ = go.GraphObject.make;
        let myDiagram = $(go.Diagram, domId,{
            "padding":50,
            "initialAutoScale": go.Diagram.Uniform,
            "initialContentAlignment": go.Spot.Center,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            "allowDrop": true,
            "LinkDrawn": showLinkLabel,
            "LinkRelinked": showLinkLabel,
            "undoManager.isEnabled": true
        });
        //矩形
        myDiagram.nodeTemplateMap.add("",
            $(go.Node,
                "Table",
                nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        {   minSize: new go.Size(80, 70),
                            fill: $(go.Brush, "Linear", { 0: color, 1:hexToRgba(color,0.5), start: go.Spot.Right, end: go.Spot.Left }),
                            strokeWidth: 0
                        },
                        new go.Binding("figure", "figure"),
                        new go.Binding("fill", "fill",function(v){
                            return $(go.Brush, "Linear", { 0: v, 1:hexToRgba(v,0.5), start: go.Spot.Right, end: go.Spot.Left })
                        })
                    ),
                    $(go.Panel, "Vertical",
                        $(go.TextBlock, textStyle(),
                            {
                                margin: 8,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: bool
                            },
                            new go.Binding("text").makeTwoWay()
                        ),
                        $(go.Panel, "Vertical",
                            {
                                defaultAlignment: go.Spot.Left,
                                margin: new go.Margin(0, 8, 8, 8),
                                width:144,
                                height:40,
                                name: "PIPE11"
                            },
                            $(go.TextBlock, "",{font: "12px Segoe UI,sans-serif", stroke: "white"}, new go.Binding("text","detail"))
                        ),
                        $(go.Panel, "Table",
                            {
                                defaultAlignment: go.Spot.Right,
                                margin: new go.Margin(-20, 0, 0, 0),
                                name: "PIPE22",
                                width:144,
                                visible:false,
                            },
                            $("PanelExpanderButton", "LIST1",{ column: 0 }),
                            $(go.Panel, "Vertical", { width:144, alignment: go.Spot.Left,name: "LIST1", row: 1, column: 0, columnSpan: 1 ,visible:false},new go.Binding("itemArray", "detail2"))
                        )
                    )
                ),
                makePort("T", go.Spot.Top, go.Spot.TopSide, false, bool),
                makePort("L", go.Spot.Left, go.Spot.LeftSide, bool, bool),
                makePort("R", go.Spot.Right, go.Spot.RightSide, bool, bool),
                makePort("B", go.Spot.Bottom, go.Spot.BottomSide, bool, false)
            )
        );
        //菱形
        myDiagram.nodeTemplateMap.add("Conditional", $(go.Node, "Table", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Diamond",{ fill: "green", strokeWidth: 0 },new go.Binding("figure", "figure")),
                $(go.TextBlock, textStyle(),
                    {
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: bool
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, go.Spot.Top, false, bool),
            makePort("L", go.Spot.Left, go.Spot.Left, bool, bool),
            makePort("R", go.Spot.Right, go.Spot.Right, bool, bool),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, bool, false)
            )
        );
        //开始圆形
        myDiagram.nodeTemplateMap.add("Start", $(go.Node, "Table", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Circle",{ minSize: new go.Size(40, 40), fill: "#79C900", strokeWidth: 0 }),
                $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
            ),
            makePort("L", go.Spot.Left, go.Spot.Left, bool, false),
            makePort("R", go.Spot.Right, go.Spot.Right, bool, false),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, bool, false)
            )
        );
        //结束圆形
        myDiagram.nodeTemplateMap.add("End", $(go.Node, "Table", nodeStyle(),
            $(go.Panel, "Auto",
                $(go.Shape, "Circle",{ minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
                $(go.TextBlock, "End", textStyle(),new go.Binding("text"))
            ),
            makePort("T", go.Spot.Top, go.Spot.Top, false, bool),
            makePort("L", go.Spot.Left, go.Spot.Left, false, bool),
            makePort("R", go.Spot.Right, go.Spot.Right, false, bool)
            )
        );
        //文件形
        myDiagram.nodeTemplateMap.add("Comment", $(go.Node, "Auto", nodeStyle(),
            $(go.Shape, "File",{ fill: "#EFFAB4", strokeWidth: 0 }),
            $(go.TextBlock, textStyle(),
                {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: bool,
                    font: "bold 12pt Helvetica, Arial, sans-serif",
                    stroke: '#454545'
                },
                new go.Binding("text").makeTwoWay()
            )
            )
        );
        myDiagram.linkTemplate =$(go.Link, go.Link.Orthogonal,{
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4,
                relinkableFrom: bool,
                relinkableTo: bool,
                reshapable: bool,
                resegmentable: bool,
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 20,
                shadowColor: "rgba(0,0,0,.6)",
                isShadowed:true,
                mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,{ isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $(go.Shape,{ isPanelMain: true, stroke: "#00a4a4", strokeWidth: 2 }),
            $(go.Shape,{ toArrow: "standard", strokeWidth: 0, fill: "#00a4a4" }),
            $(go.Panel, "Auto",  { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                new go.Binding("visible", "visible").makeTwoWay(),
                $(go.Shape, "RoundedRectangle", { fill: "#F8F8F8", strokeWidth: 0 }),
                $(go.TextBlock, "Yes",
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: bool
                    },
                    new go.Binding("text").makeTwoWay()
                )
            )
        );
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        return myDiagram;
    },
    _originalSeries(diagram){
        let map = new Map();
        JSON.parse(diagram.myConfig.api).nodeDataArray.forEach(elem =>{
            map.set(elem.key,elem);
        });
        return map;
    },
    _nodeAlarm(level=0, defualtColor=""){
        if(level<0){
            return "#EEEEEE"
            //return "rgba(150,150,150,.5)";//灰
        }else if(level>=3){
            return "#8C0095";
            //return "rgba(255,88,80,.5)";  //红
        }else if(level>=2){
            return "#AC193D";
            //return "rgba(255,125,15,.5)"; //橙
        }else if(level>=1){
            return "#D24726";
            //return "rgba(245,195,25,.5)"; //黄
        }else{
            return defualtColor;
        }
    },
}