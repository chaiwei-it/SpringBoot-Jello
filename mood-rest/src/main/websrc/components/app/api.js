// var FACE_URl = 'http://testwww.aldbim.com';
// var FACE_URl = 'http://www.aldbim.com';
// var FACE_URl = 'http://172.31.1.238:8070';
// var FACE_URl = 'http://172.31.1.239:8080';
var FACE_URl = '';
var IMAGE_DOMAIN = 'http://www.artbim.com'; // 图片服务url
var api = {
  login: FACE_URl + '/api/v1/login', // 登录
  logout: FACE_URl + '/api/v1/logout', // 退出登录
  register: FACE_URl + '/api/v1/register', // 注册
  
}

module.exports = api;
