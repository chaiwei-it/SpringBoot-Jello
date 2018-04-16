fis.require('jello')(fis);

// 标记 staitc/libs 下面的 js 为模块化代码。
fis.match('/static/libs/**.js', {
  isMod: true
});

// jello 里面默认用的 commonjs 这里改成 amd 方案。
fis.unhook('commonjs');
fis.hook('amd', {
  packages: [

    // 用来存放 libs 库
    {
      name: 'libs',
      location: 'static/libs/',
      main: 'index'
    }
  ]
});

// 设置 *.scss 配置配置项
fis.match('*.scss', {
  rExt: '.css',
  parser: fis.plugin('node-sass', {
    include_paths: [
      './static/scss',
      './components/scss-core',
      './components/compass-mixins'
    ]
  })
});

// 不启用 less
fis.match('*.less', {
  parser: null
});

// 解析 markdown，编译成 html
fis.match('*.md', {
  parser: fis.plugin('marked'),
  rExt: '.html'
});

// 加载es6插件
fis.match('*.es6', {
  parser: fis.plugin('translate-es6', {
    presets: ['es2015']
  }),
  rExt: '.js' // .es6 最终修改其后缀为 .js
})

// sass打包配置
fis.match('::package', {
  // 关于打包配置，请参考：https://github.com/fex-team/fis3-packager-deps-pack
  packager: fis.plugin('deps-pack', {
    'pkg/develop.css': [
      '/static/scss/**.scss',
      '/static/css/**.css',
      '/widget/**.scss',
      '/page/**.scss'
    ]
  })
})

// 生产配置
fis.media('prod')
  .match('/page/**.{png,js,css}', {
    useHash: true
  })
  .match('/widget/**.{png,js,css}', {
    useHash: true
  })
  .match('::package', {
    // 关于打包配置，请参考：https://github.com/fex-team/fis3-packager-deps-pack
    packager: fis.plugin('deps-pack', {
      'pkg/frame.css': [
        '/static/scss/**.css',
        '/static/scss/**.scss',
        '/widget/**.scss',
        '/page/**.scss',
      ]
    })
  })