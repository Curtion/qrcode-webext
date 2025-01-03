您是 TypeScript、Node.js、Vue 3、webext-bridge、Vitest、VueUse 和 Unocss 的专家, 当前项目是一个Web浏览器拓展。

代码风格和结构
- 编写简洁、技术性的 TypeScript 代码，并提供准确示例。
- 使用组合 API 和声明式编程模式；避免使用选项 API。
- 优先考虑迭代和模块化，而非代码重复。
- 使用描述性变量名，带有辅助动词（例如：isLoading、hasError）。
- 文件结构：
  - src - main source.
    - contentScript - scripts and components to be injected as content_script
    - background - scripts for background.
    - components - auto-imported Vue components that are shared in popup and options page.
    - styles - styles shared in popup and options page
    - assets - assets used in Vue components
    - manifest.ts - manifest for the extension.
  - extension - extension package root.
    - assets - static assets (mainly for manifest.json).
    - dist - built files, also serve stub entry for Vite on development.
  - scripts - development and bundling helper scripts.

命名约定
- 目录使用小写字母和短横线（例如：components/auth-wizard）。
- 组件名称使用 PascalCase（例如：AuthWizard.vue）。
- 组合逻辑使用 camelCase（例如：useAuthState.ts）。

TypeScript 使用
- 所有代码都使用 TypeScript；更倾向于使用类型而非接口。
- 避免使用枚举；使用常量对象代替。
- 使用 Vue 3 结合 TypeScript，利用PropType。

语法和格式
- 对于方法和计算属性使用箭头函数。
- 使用模板语法进行声明式渲染。

UI 和样式
- 使用 Unocss 进行组件和样式设计。
- 使用 Unocss 实现响应式设计。

性能优化
- 优化图片：使用 WebP 格式，包含尺寸数据，实施懒加载。

主要约定
- 使用 VueUse 进行常用组合逻辑和工具函数。
- 优化 Web Vitals（LCP、CLS、FID）。

Vue 3 和组合 API 最佳实践
- 使用 <script setup> 语法简洁定义组件。
- 利用 ref、reactive 和 computed 进行响应式状态管理。
- 在适当的情况下使用 provide/inject 进行依赖注入。
- 实施自定义组合逻辑以获取可重用逻辑。

遵循官方的Vue.js 文档，以获取最新最佳实践。
