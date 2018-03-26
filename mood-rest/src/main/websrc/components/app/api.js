// var FACE_URl = 'http://testwww.aldbim.com';
// var FACE_URl = 'http://www.aldbim.com';
// var FACE_URl = 'http://172.31.1.238:8070';
// var FACE_URl = 'http://172.31.1.239:8080';
var FACE_URl = '';
var IMAGE_DOMAIN = 'http://www.artbim.com'; // 图片服务url
var api = {
  IMAGE_DOMAIN: IMAGE_DOMAIN,
  login: FACE_URl + '/login', // 登录
  loginout: FACE_URl + '/loginout', // 登出
  resetPassword: FACE_URl + '/resetPassword', // 重置密码
  register: FACE_URl + '/api/v1/register', // 注册
  sendCode: FACE_URl + '/api/v1/sendCode', // 发送验证码
  videoList: FACE_URl + '/aldbim/video/list', // 视频中心 - 列表
  videoListBySection: FACE_URl + '/aldbim/video/listBySection', // 视频中心 - 获取二级分类下的视频列表
  addComment: FACE_URl + '/comment/addComment', // 讨论社区 - 评论 / 回复
  deletebyComment: FACE_URl + '/comment/deleteByCommentId', // 讨论社区 - 删除评论
  communityApiPraise: FACE_URl + '/comment/praise', // 讨论社区 - 点赞
  communityApiCancelPraise: FACE_URl + '/comment/cancelPraise', // 讨论社区 - 取消点赞
  communityApiCollection: FACE_URl + '/comment/collection', // 讨论社区 - 收藏
  communityApiCancelCollection: FACE_URl + '/comment/cancelCollection', // 讨论社区 - 取消收藏
  getCommentList: FACE_URl + '/comment/getCommentList', // 讨论社区 - 问题评论列表
  communityApiList: FACE_URl + '/community/list', // 论坛社区 - 列表
  communityApiLabelList: FACE_URl + '/community/labelList', // 讨论社区 - 标签列表
  communityApiDeleteLabel: FACE_URl + '/community/deleteLabel', // 讨论社区 - 删除标签
  communityApiAddLabel: FACE_URl + '/community/addLabel', // 讨论社区 - 添加标签
  communityApiAdd: FACE_URl + '/community/add', // 论坛社区 - 添加问题
  communityApiDelete: FACE_URl + '/community/delete', // 讨论社区 - 删除问题
  myCommunityList: FACE_URl + '/community/myCommunityList', // 讨论社区 - 我的发布 / 我的收藏
  communityApiGet: FACE_URl + '/community/get', // 讨论社区 - 问题详情
  adoptComment: FACE_URl + '/community/adoptComment', // 讨论社区 - 答案采纳
  communityApiEdit: FACE_URl + '/community/edit', // 讨论社区 - 修改问题(没做)
  communityApiFollow: FACE_URl + '/community/follow', // 讨论社区 - 关注（没做）
  communityApiCancelFollow: FACE_URl + '/community/cancelFollow', // 讨论社区 - 取消关注（没做）
  imageFileUpload: FACE_URl + '/imageFileUpload', // ckeditor - 自定义上传图片
  imageDragUpload: FACE_URl + '/imageDragUpload', // ckeditor - 拖拽上传 + 复制粘贴上传
  filesUpload: FACE_URl + '/fileImage', // 上传图片
  getCity: FACE_URl + '/api/v1/city/getCity', // 获取城市列表
  designerInsert: FACE_URl + '/api/v1/designer/insert', // 设计师入驻
  enterState: FACE_URl + '/api/v1/designer/selectState', // 设计师入驻状态
  smsSend: FACE_URl + '/api/v1/sms/send', // 设计师入驻 - 发送验证码
  smsCheckCode: FACE_URl + '/api/v1/sms/checkCode', // 设计师入驻 - 验证
  designerSelect: FACE_URl + '/api/v1/designer/selectLeft', // 设计师入驻 - 信息
  designerUpdate: FACE_URl + '/api/v1/designer/update', // 设计师入驻 - 修改
  getStyle: FACE_URl + '/api/v1/dict/select' // 字典接口
}

module.exports = api;
