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
    //引入mockApi.js文件
    require('../service/mockApi');

    /**数据库**MOCK后端读写数据库操作API接口****/
    const DataD_DB = DB.open("DataD",2).then(db=>{
        db.createTable("grids");
        db.createTable("pages");
        return db;
    });

    let _add = (tableName,param)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let id = db.from(tableName).add(param);
                resolve(id);
            });
        });
    };
    let _delete = (tableName,id)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let result = db.from(tableName).delete(id);
                resolve(result);
            });
        });
    };
    let _select = (tableName,id)=>{
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

    var addDdGrid = (param)=>{ return _add("grids",param)};
    var deleteDdGrid = (id)=>{ return _delete("grids",id)};
    var selectAllDdGrid = ()=>{ return _selectAll("grids")};
    var addDdPage = (param)=>{ return _add("pages",param)};
    var deleteDdPage = (id)=>{ return _delete("pages",id)};
    var updateDdPage = (param, id)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let result = db.from("pages").update(param, id);
                resolve(result);
            });
        });
    };
    var selectDdPage = (id)=>{ return _select("pages",id)};
    var selectAllDdPage = ()=>{ return _selectAll("pages")};
}


/**
 * Data Dashboard AIP
 */
// let gridsUrl = "/grids";
// const addDdGrid = (param)=> axios.post(gridsUrl, param);
// const deleteDdGrid = (id)=> axios.delete(gridsUrl, {params:id});
// const selectAllDdGrid = ()=> axios.get(gridsUrl);
// let pagesUrl = "/pages";
// const addDdPage = (param)=> axios.post(pagesUrl, param);
// const selectDdPage = (id)=> axios.get(pagesUrl, {params:id});
// const deleteDdPage = (id)=> axios.delete(pagesUrl, {params:id});
// const updateDdPage = (param)=> axios.put(pagesUrl, param);
// const selectAllDdPage = ()=> axios.get(pagesUrl);
export {addDdGrid, deleteDdGrid, selectAllDdGrid, addDdPage, selectDdPage, deleteDdPage, updateDdPage, selectAllDdPage}


