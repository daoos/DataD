import axios from 'axios';
import qs from 'qs';

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
}

/**
 * Data Dashboard
 */



