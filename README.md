# markdown-it-codeblocks

Splits up your header sections into samples and references ie :

````markdown
#heading1

Here is some sample code

```code
var a = 8;
```

description here

````

would get converted to:

```html
<h1> heading1 </h1>
<section class='sample'>
	<p> 
       Here is some sample code
    </p>
	<code> var a = 8 </code>
</section>

<section class='reference'>
	description here
</section>

```

If there are multiple code sections, it will only include up to the last consecuritve code section:

````markdown
#heading1

Here is some sample code

```code
var a = 8;
```

```code
var a = 2;
```

Some more text

````

would get converted to:

```html
<h1> heading1 </h1>
<section class='sample'>
	<p> 
        Here is some sample code
    </p>
	<code> var a = 8 </code>
	<code> var a = 2 </code>
</section>

<section class='reference'>
	Some more text
</section>

```

But, if there is anything inbetween those sections like:


````markdown
#heading1

Here is some sample code

```code
var a = 8;
```

Some other markdown in between these two code sections


```code
var a = 2;
```

Some more text

````

it would get converted to:

```html
<h1> heading1 </h1>
<section class='sample'>
	<p> 
        Here is some sample code
    </p>
	<code> var a = 8 </code>
</section>

<section class='reference'>
	<p>
		Some other markdown inbetween these two code sections
	</p>
	<code> var a = 2 </code>
	<p>
		Some more text
	</p>
</section>

```

Works well when combined with the [markdown-it-header-sections](https://www.npmjs.com/package/markdown-it-header-sections) plugin!

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

With level grouping:

```javascript
const MarkdownItCodeBlocks = require('markdown-it-codeblocks');
const MarkdownIt = require('markdown-it')
	.use(MarkdownItCodeBlocks, {levelGrouping:2})
```

This would group all headings within the 2 headings that are larger than 2 ie:

````markdown
## heading2a

Some markdown

### inner heading

#### another inner heading


## heading2b

````

In this case, everything between `heading2a` and `heading2b` will be considered a single section

# API

MarkdownItCodeBlocks(md, options)


Parameters:

| Attribute | Type | Required | Description | Default |
| --------- | ---- | -------- | ----------- | ------- |
| `md` | String | yes | The input markdown  |         |
| `options.sampleClass` | String | no | Class assigned to the sample blocks | 'sample' |
| `options.referenceClass` | String | no | Class assigned to the reference blocks | 'reference' |
| `options.levelGrouping` | Integer | no | Allows you to group certain headings into one section. | null |

# License

MIT

# Changelog

[1.0.0](https://github.com/jdalrymple/markdown-it-codeblocks/commit/6628f28aaa11d5f8382dee9c1adf506aea638bd0) (2017-09-02)
------------------
- Release