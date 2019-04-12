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
    const DataD_DB = DB.open("DataD",1).then(db=>{
        db.createTable("grids");
        db.createTable("pages");
        return db;
    });
    var addDdGrid = (param)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let id = db.from("grids").add(param);
                resolve(id);
            });
        });
    };
    var deleteDdGrid = (id)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let result = db.from("grids").delete(id);
                resolve(result);
            });
        });
    };
    var selectAllDdGrid = ()=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> db.from("grids").selectAll() ).then(datas=>{
                resolve(datas);
            });
        });
    };
    var addDdPage = (param)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> {
                let id = db.from("pages").add(param);
                resolve(id);
            });
        });
    };
    var selectDdPage = (id)=>{
        return new Promise(resolve=>{
            DataD_DB.then(db=> db.from("pages").select(id) ).then(data=>{
                resolve(data);
            });
        });
    }
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
// const updateDdPage = (param)=> axios.put(pagesUrl, param);
export {addDdGrid, deleteDdGrid, selectAllDdGrid, addDdPage, selectDdPage}


