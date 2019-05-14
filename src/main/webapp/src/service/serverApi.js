import axios from 'axios';
import qs from 'qs';
import DB from './indexedDB';

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

/**
 * 根据编译环境判定处理业务逻辑分支
 */
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = '/';
} else {
    axios.defaults.baseURL = '/api/';
}
//引入mockApi.js文件
require('../service/mockApi');

/**数据库**MOCK后端读写数据库操作API接口****/
const DataD_DB = DB.open("DataD",2).then(db=>{
    db.createTable("grids");
    db.createTable("pages");
    return db;
});
let _add = (tableName, param)=>{
    return new Promise(resolve=>{
        DataD_DB.then(db=> {
            let id = db.from(tableName).add(param);
            resolve(id);
        });
    });
};
let _delete = (tableName, id)=>{
    return new Promise(resolve=>{
        DataD_DB.then(db=> {
            let result = db.from(tableName).delete(id);
            resolve(result);
        });
    });
};
let _update = (tableName, param, id)=>{
    return new Promise(resolve=>{
        DataD_DB.then(db=> {
            let result = db.from(tableName).update(param, id);
            resolve(result);
        });
    });
};
let _select = (tableName, id)=>{
    return new Promise(resolve=>{
        DataD_DB.then(db=> db.from(tableName).select(id) ).then(data=>{
            resolve(data);
        });
    });
};
let _selectAll = (tableName)=>{
    return new Promise(resolve=>{
        DataD_DB.then(db=> db.from(tableName).selectAll() ).then(datas=>{
            resolve(datas);
        });
    });
};


/**
 * Data Dashboard API
 */
//模板API
let grids = "grids";
const addDdGrid = (param, isUseIndexedDB)=> {
    if(isUseIndexedDB){ //存储到浏览器数据库
        return _add(grids, param);
    }else{ //存储到用户指定位置
        return axios.post("/"+grids, param);
    }
}
const deleteDdGrid = (id, isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _delete(grids, id);
    }else{
        return axios.delete("/"+grids+ "/" + id);
    }
}
const selectAllDdGrid = (isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _selectAll(grids);
    }else{
        return axios.get("/"+grids);
    }
}
//页面收藏API
let pages = "pages";
const addDdPage = (param, isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _add(pages,param);
    }else{
        return axios.post("/"+pages, param);
    }
}
const deleteDdPage = (id, isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _delete(pages,id);
    }else{
        return axios.delete("/"+pages+ "/" + id);
    }
}
const updateDdPage = (param, id, isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _update(pages, param, id);
    }else{
        return axios.put("/"+pages, qs.stringify({config:param, id: id}));
    }
}
const selectDdPage = (id, isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _select(pages,id);
    }else{
        return axios.get("/"+pages+ "/" + id);
    }
}
const selectAllDdPage = (isUseIndexedDB)=> {
    if(isUseIndexedDB){
        return _selectAll(pages);
    }else{
        return axios.get("/"+pages);
    }
}
export { addDdGrid, deleteDdGrid, selectAllDdGrid, addDdPage, deleteDdPage, updateDdPage, selectDdPage, selectAllDdPage }


/**
 * 性能监控
 */
const getAppList = (url='/demo/apps') => axios.get(url);
const getServiceList = (appName, url='/demo/services') => axios.get(url, {params: {app: appName}});
const getMethodList = (appName, serviceName, url='/demo/methods') => axios.get(url, {params: {app: appName,clazz: serviceName}});
const getLegendList = (url='/demo/supplyconfig') => axios.get(url);
export { getAppList, getServiceList, getMethodList, getLegendList }