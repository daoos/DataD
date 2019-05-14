/**
 * 对外提供接口
 * @param option
 * @constructor
 */
export function DataD(option){
    window.DataDOption = option;
    require("./dist/main.bundle");
}