# 使用方法
目前只需要传入索要展示的内容即可

例子：
```js
<div style={{ maxHeight: '700px', overflowY: 'auto' }}>
  {
    Array.from({length: 300}, (text, index) => (<ScrollLoad content={<div style={{ height: 20 }}>第{index + 1}个元素</div>} />))
  }
</div>
```

> 上述例子是展示多元素的情况，如果传入元素本省较为复杂，建议将传入的content元素拆分为较为简单的若干个组件，以保证加载速度。

> 其中父级盒子的高度和滚动需要自行控制。