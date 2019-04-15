/**
 * 浏览器数据库IndexedDB（类型为NoSql数据库）
 *
 =====测试 API =====
DB.open("testDB",2).then(db=> {
    db.createTable("person","id");
    db.from("person").add({ id: 3, name: '张三', age: 24, email: 'zhangsan@example.com' });
    db.from("person").delete(2);
    db.from("person").update({ id: 3, name: '李四', age: 24, email: 'zhangsan@example.com' });
    db.from("person").select(5).then(data=>{
        console.log("====",data);
    });
    db.from("person").selectAll().then(datas=>{
        console.log("====",datas);
    });
});

 */
export default {
    /**
     * 打开数据库
     * @param databaseName
     * @param version
     * @returns {Promise<any>}
     * @private
     */
    open(databaseName, version=1){
        return new Promise((resolve,reject)=>{
            let request = window.indexedDB.open(databaseName, version);
            /**
             * 数据库打开失败
             * @param event
             */
            request.onerror = (event)=> {
                console.error(event,'==数据库打开报错==');
                reject(event);
            }
            /**
             * 数据库打开成功
             * @param event
             */
            request.onsuccess = (event)=> {
                resolve(_DbEnhance(event.target.result));
            }
            /**
             * 版本变更时触发
             * @param event
             */
            request.onupgradeneeded = (event)=> {
                resolve(_DbEnhance(event.target.result));
            }
        });
    }
}

/**
 * 对象增强方法
 * @param db
 * @returns {*}
 * @private
 */
function _DbEnhance(db){
    /**
     * 创建表
     * @param tableName
     * @param primaryKey
     */
    db.createTable = (tableName, primaryKey)=>{
        if (!db.objectStoreNames.contains(tableName)) {
            let obj = primaryKey ? {keyPath: primaryKey}: {autoIncrement:true};
            let objectStore = db.createObjectStore(tableName, obj);
            //新建索引(只有主键和索引字段才能参与条件查询)
            //objectStore.createIndex('name', 'name', { unique: false });
        }
    }
    /**
     * 操作表（增删改查）
     * @param tableName
     * @returns {*}
     */
    db.from = (tableName)=>{
        let table = db.transaction([tableName], 'readwrite').objectStore(tableName);
        return {
            add(data){
                return new Promise((resolve,reject)=>{
                    let row = table.add(data);
                    row.onsuccess =(event)=>{
                        resolve({data: event.target.result});
                    }
                    row.onerror= (event)=>{
                        console.error('==新增失败!!!==',event);
                        reject({data:null});
                    }
                });
            },
            delete(primaryKey){
                return new Promise((resolve,reject)=>{
                    let row = table.delete(primaryKey);
                    row.onsuccess =(event)=>{
                        resolve({data: "done"});
                    }
                    row.onerror= (event)=>{
                        console.error('==删除失败!!!==',event);
                        reject({data:null});
                    }
                });
            },
            update(data,primaryKey){
                return new Promise((resolve,reject)=>{
                    // 把更新过的对象放回数据库
                    let row = table.put(data, primaryKey);
                    row.onsuccess = (event)=> {
                        resolve({data: "done"});  // 完成，数据已更新！
                    };
                    row.onerror = (event)=>{
                        console.error('==修改失败!!!==',e);
                        reject({data:null});
                    };
                });
            },
            select(primaryKey){
                return new Promise((resolve,reject)=>{
                    let row = table.get(primaryKey);
                    row.onsuccess =(event)=>{
                        resolve({data:event.target.result});
                    }
                    row.onerror= (event)=>{
                        console.error('==查询失败!!!==');
                        reject(event);
                    }
                });
            },
            selectAll(){
                return new Promise((resolve,reject)=>{
                    let results = [];
                    let rows = table.openCursor();
                    rows.onsuccess = (event)=>{
                        let cursor = event.target.result;
                        if(cursor){
                            results.push({key:cursor.key, value:cursor.value});
                            cursor.continue();
                        }else{
                            resolve({data:results});
                        }
                    }
                    rows.onerror= (event)=>{
                        console.error('==查询失败!!!===');
                        reject(event);
                    }
                });
            }
        }
    }
    return db;
}