# vue-multiple-app

## 背景
根据我们的经验来看B端业务主要以业务复杂为主，到我们fe的界面其实都是以表格的增删改查为主，
代码层甚至都会有很多重复的代码，重复的逻辑虽然可以用封装复用的方式来减少cv操作，但是仍然
会出现各种问题。

## 目标
针对这种现状，我们完全可以通过实现一种工具来完成这些通用页面的代码编写，从而实现减少一个
项目大部分的开发工作。

## 与低代码平台的区别
1. 我们用户群体是fe，完全面向开发人员，提升fe的开发效率
2. 我们的目标是生成项目 源代码，与开发写的代码完全的一致，完全的支持二次开发不会导致使用
   我们的工具而对后续维护和拓展带来难度。

## 思路

业务字段 + 页面模板 = 功能模块

相同交互模式的页面其实就可以视为某一种模板，我们fe的日常开发其实就是在根据业务需求给这个
模板填充不同的数据字段，从而完成一次功能的开发。

所以我们要实现的工具需要具备的功能有：

1. 支持对业务字段的配置（前端UI界面，更加友好）
2. 支持对页面模板进行拓展，模板是插件式的，可以是我们后续来维护增加（卖钱商业化），
   也可以业务方自己来定制
3. 将业务字段的配置和页面模板结合生成页面源代码

## 规划

我们的核心是如何将业务字段的配置和页面模板结合生成页面源代码，同时难点也在这里，初期要设计
好整个内核，要足够抽象具备通用性。

1. 一期完成工具内核的设计和开发
2. 二期完成配置段的界面和接口开发
3. 三期不断的迭代增加页面模板逐渐覆盖更多的场景