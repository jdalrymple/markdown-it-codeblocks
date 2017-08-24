# markdown-it-codeblocks

Splits up your header sections into samples and references ie :

```markdown
#heading1
sample code
```code
var a = 8;
```

description here

```

would get converted to:

```html
<h1> heading1 </h1>
<section class='sample'>
<p> sample code </p>
<code> var a = 8 </code>
</section>

<section class='reference'>
	description here
</section>

```
Works well when combined with the markdown-it-header-sections plugin!

# Table of Contents

* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [License](#licence)
* [Changelog](#changelog)

# Install
```
npm install -S markdown-it-codeblocks
```

# Usage

With defaults:

```javascript
const MarkdownItCodeBlocks = require('markdown-it-codeblocks');
const MarkdownIt = require('markdown-it')
	.use(MarkdownItCodeBlocks)
```

With custom classes:

```javascript
const MarkdownItCodeBlocks = require('markdown-it-codeblocks');
const MarkdownIt = require('markdown-it')
	.use(MarkdownItCodeBlocks, {sampleClass:'foo', referenceClass:'bar'})
```

# API

MarkdownItCodeBlocks(md, options)


Parameters:

| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `md` | string | yes | The input markdown |
| `options.sampleClass` | string | no | Class assigned to the sample blocks | 'sample' |
| `options.referenceClass` | string | no | Class assigned to the reference blocks | 'reference' |

# License

MIT

# Changelog

[1.0.0]() (2017-08-24)
------------------
- Release