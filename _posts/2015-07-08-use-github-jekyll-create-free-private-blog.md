---
layout: post
title: 使用github和jekyll搭建免费博客
description: "使用github和jekyll搭建免费博客"
category: github
tags: [github, jekyll, markdown]
comments: true
share: true
---

[TOC]
# 访问github pages
* 点击进入[Github pages](https://pages.github.com/)
* 访问jekyll按照页面[Jekyll Install](https://help.github.com/articles/using-jekyll-with-pages/)
# 安装ruby、Bundler、Jekyll

	gem install github-pages

* 安装Jekyll的时候特别注意，因为rubygems.org可能别墙了，所以编写Gemfile文件的时候需要修改数据源：具体Gemfile文件为：

	source 'http://ruby.taobao.org/'
	gem 'github-pages'
	
* 运行Jekyll

	bundle exec jekyll serve

* 看到运行启动之后，就可以访问http://localhost:4000
# 绑定自己的域名
访问地址：[setup custom domain with Github pages](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)

	vim CNAME

然后再输入

	yourdomain.com
	


* 如果想拥有属于自己的样式，我们可以参考：
* jekyll网址：[jekyll sites](https://github.com/jekyll/jekyll/wiki/sites)
* 找到github源代码，拷贝复制所有文件夹，之后修改关键字
* 比如我现在拿Ze3kr代码为例：[ze3kr github site](https://github.com/ZE3kr/ZE3kr.github.io/tree/master)
* 拷贝文件覆盖lonpo.github.io
* 执行jekyll serve，查看http://localhost:4000

# markdown语法
发表一篇新文章，你所需要的就是在_posts文件夹下创建一个新的文件。文件名的命名非常重要。遵循下面的格式：

	年-月-日-标题.MARKUP

如下：

	2011-12-31-new-years-eve-is-awesome.md
	2012-09-12-how-to-write-a-blog.textile

##内容格式
所有博客文章顶部都必须有一段YAML头信息，并且需要按照 YAML 的格式写在两行三虚线之间。如：

	---
	layout: post
	title: 使用github和jekyll搭建免费博客
	description: "使用github和jekyll搭建免费博客"
	category: github
	tags: [github, jekyll, markdown]
	comments: true
	share: true
	---
	
