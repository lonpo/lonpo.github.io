---
layout: post
title: github jekyll upgrade show many problems
date: 2016-03-10 14:59:01
category: test
tags: [github, jekyll]
comments: true
---

# github的jekyll升级之后导致一系列问题

win7上搭建ruby开发环境
1. 安装ruby

可使用windows下的ruby安装工具rubyinstaller来方便地安装ruby解释器，可以http://rubyinstaller.org/网站上下载得到。安装时，看清安装的辅助选项，如是否将安装路径添加到环境变量中等。注意安装路径中不要有空格，否则会影响rails的安装。安装完成后，进入命令窗口，输入命令：ruby –v，如果能够显示ruby的版本，则说明安装成功。

2. 安装gem系统（在线）

RubyGems（简称 gems）是一个用于对 Rails 组件进行打包的 Ruby 打包系统。 它提供一个分发 Ruby 程序和库的标准格式，还提供一个管理程序包安装的工具。gem系统类似于redhat操作系统中的yum工具，或debian操作系统中的apt-get工具。安装gem系统，可继续在控制台输入命令：gem update –-system

3. 安装rails（在线）

Ruby on Rails (简称rails) 是一个可以使你开发，部署，维护 web 应用程序变得简单的框架。执行命令：gem install rails 即可安装。因为需要安装的东西很多，所以需要稍等一会儿。安装完成后，进入命令窗口，输入命令：rails -v，即可rails的版本号。但我在安装过程中遇到两个问题：

系统提示SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://bb-m.rubygems.org/gems/multi_json-1.3.2.gem)。这是说系统中的ssl设置有问题。可以参考这篇文章来解决：《OpenSSL Errors and Rails – Certificate Verify Failed》 ：http://railsapps.github.io/openssl-certificate-verify-failed.html。因为自己使用的win7系统，所以参照了文章中提到的Fnichol提供的解决办法（https://gist.github.com/fnichol/867550）来解决。我使用的the manual way (boring)方法，因为尝试第一种自动化的方法时，ruby程序执行出错。我看了下，可能需要在源程序中将ruby的安装路径改为我自己机器上的安装路径。因为只是猜测，加上我对ruby还一无所知，我就尝试了手工的方法。手工方法也就是：首先，在本地ruby的安装路径下（如D:\Ruby2000)，新建一个名为cacert.pem的文件，cacert.pem下载地址：【】然后将网页上提供的cacert.pem中的内容复制到该文件并保存。然后设置一个名为SSL_CERT_FILE的环境变量，值为cacert.pem的路径即可。
使用gem update遇到这个问题，

原来是ruby没有包含SSL证书，所以Https的链接被服务器拒绝。

解决方法很简单，首先在这里下载证书(http://curl.haxx.se/ca/cacert.pem), 然后再环境变量里设置SSL_CERT_FILE这个环境变量，并把value指向这个文件

<!--more-->

系统提示ERROR: Error installing XXXXXXXXXXX: The 'XXXXXXXXXXXX' native gem requires installed build tools. 出错的原因是安装XXX的时候，需要build tools，但系统中没有。错误提示信息也给出了解决这一问题的方法：到http://rubyinstaller.org/downloads/去下载适合自己的dev kit。下载完成后，可按时http://github.com/oneclick/rubyinstaller/wiki/Development-Kit/ 给出的方法安装dev kit。将原文浓缩一下，dev kit的安装方法如下：首先，解压下载下来的文件到指定的目录，如D:\Ruby2000\devkit。(注意：目录不能有空格)。然后，在控制台中进入devkit的安装目录，运行命令：ruby dk.rb init 和ruby dk.rb install 。最后，通过命令： gem install rdiscount --platform=ruby 来测试是否成功。如果提示1 gem installed，则说明安装成功。
4. 安装mysql 及 ruby针对mysql的gem

 使用windows下的mysql安装工具进行安装。注意安装时所提供的配置选项。安装成功后，可在控制台输入：mysql -uroot -p你设置的密码，来连接mysql数据库。

再安装ruby针对mysql的gem，命令为：gem install mysql


# ruby环境sass编译中文出现Syntax error: Invalid GBK character错误解决方法
问题描述
在windows7上面，通过ruby编译scss时，发现编译报错，内容如下：

Conversion error: Jekyll::Converters::Scss encountered an error while converting 'css/main.scss':
                         Invalid GBK character "\xE3" on line 315
虽然给出来了报错的原因，但是尼玛，main.scss总共也没有315行啊，而且并没有中文注释什么的。查找一番之后才发现，这里编译器报错的位置不一定是scss中的位置，也有可能是你在scss中引用了其他库中含有中文字符。我在scss中引入了字体文件，文件中包含了中文字符

解决办法
1.在ruby的安装目录下找到engine.rb文件，目录格式如D:\ruby\Ruby21\lib\ruby\gems\2.1.0\gems\sass-3.4.15\lib\sass在文件中添加一行Encoding.default_external = Encoding.find('utf-8')
在require语句结束处，如：

require 'sass/media'
require 'sass/supports'
module Sass   
Encoding.default_external = Encoding.find('utf-8')

2.在scss文件的头部加一行@charset "utf-8"


# 设置阿里云ruby镜像

```shell
$ gem source -a http://mirrors.aliyun.com/rubygems/
$ ruby -v
ruby 2.0.0p451 (2014-02-24 revision 45167) [x86_64-linux]
$ gem -v
2.2.2
$ gem source -r https://rubygems.org/
$ gem source -a http://mirrors.aliyun.com/rubygems/
$ gem sources -l
*** CURRENT SOURCES ***

http://mirrors.aliyun.com/rubygems/
```

当然你也可以使用Taobao的源：
```shell
$ gem sources -a http://ruby.taobao.org/
*** CURRENT SOURCES ***
http://ruby.taobao.org
```






 