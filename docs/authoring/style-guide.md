---
title: Style Guide
description: A quick demo of various markdown features.
---

# {{title}}

This page is primarily here to show off some of the things you can do with Doxicity's default theme. You can learn more about supported markdown syntaxes on the [markdown page](/authoring/).

## Basics

Let's talk about paragraphs. Paragraphs are _fun things_ to write. They **usually contain** at least two or three sentences. Sometimes they contain more or less, depending on what you're trying to write.

When you have a [second paragraph](#), there is spacing between the first and the second one. The amount of spacing is determined by the element's margin, which can be customized with CSS. By default, we set a comfortable margin so you don't have to worry about anything.

Can we talk about "quotes" and if so, are you sure it's OK? There's a typography plugin that turns "quotes" into "smart quotes" so you should definitely check that out.

## Lists and more

- List item 1
- List item 2
- List item 3

And now let's see an ordered list to compare:

1. List item 1
1. List item 2
1. List item 3

Here are some additional things you can do with Doxicity. Let's use the ==mark== tag and show some keys like [[CMD]] [[A]]. You can also ++insert++ things and ~~delete~~ things.

## Blockquotes

How about a blockquote? People use them, so let's try it.

> This is a blockquote written in markdown. Just prepend a _greater than_ symbol and you're on your way to quoting things like a champion.

## Images

Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste non tenetur recusandae quis porro a hic quam voluptatem? Explicabo accusamus architecto dolore quas blanditiis, hic molestiae illum optio similique aspernatur.

![What a beautiful field](https://images.unsplash.com/photo-1504280645497-00afe6a47e43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80)

Iste non tenetur recusandae quis porro a hic quam voluptatem? Explicabo accusamus architecto dolore quas blanditiis, hic molestiae illum optio similique aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.

## Tables

| Header  | Another header    | One more                                                               |
| ------- | ----------------- | ---------------------------------------------------------------------- |
| field 1 | something         | why not                                                                |
| field 2 | something else    | because                                                                |
| field 3 | and another thing | because why                                                            |
| field 4 | and yet another   | just because this one is going to be so long that it will make you cry |

## Code Blocks

Code blocks look like this.

```bash
echo "# This is amazing\n\nYour content goes here." > index.md
doxicity
```

## Section Breaks

Here is a horizontal rule for you to feast your eyes on. Extra spacing here because we want to create a visual separation for thematic breaks.

---

What did you think? Was it everything you expected it to be?

## Callouts

Create special callouts for tips, warnings, and dangerous announcements.

:::tip
This is a tip. It's good to call helpful things out.
:::

:::warning
This is a warning. Be careful when you see this callout.
:::

:::danger
This is a dangerous callout. Something will probably break if you're not careful!
:::

Here's the code.

```md
:::tip
This is a tip. It's good to call helpful things out.
:::

:::warning
This is a warning. Be careful when you see this callout.
:::

:::danger
This is a dangerous callout. Something will probably break if you're not careful!
:::
```

## Asides

:::aside
#### Just so you know...

This is an aside. You can call things out with it pretty easily. What do you think?
Just start a line with `:::aside` and end it with `:::` and you're done.

You can even have images and just about any other content in your asides.
:::

Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste non tenetur recusandae quis porro a hic quam voluptatem? Explicabo accusamus architecto dolore quas blanditiis, hic molestiae illum optio similique aspernatur.

Iste non tenetur recusandae quis porro a hic quam voluptatem? Explicabo accusamus architecto dolore quas blanditiis, hic molestiae illum optio similique aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.

Explicabo accusamus architecto dolore quas blanditiis, hic molestiae illum optio similique aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste non tenetur recusandae quis porro a hic quam voluptatem?

Here's how to make one.

```md
:::aside
Your aside content here.
:::
```

## Details

Provide additional information without making the page insanely long using a details/summary field.

:::details Learn More
This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed.

![What a beautiful field](https://images.unsplash.com/photo-1504280645497-00afe6a47e43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80)

This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed.

This is more information that you can consume. It will expand and collapse as needed.
:::

Here's the code that creates them.

```md
:::details Learn More
Expandable content here.
:::
```

Details can also be stacked to create an accordion-like grouping.

:::details Details 1
This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed.
:::

:::details Details 2
This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed.
:::

:::details Details 3
This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed. This is more information that you can consume. It will expand and collapse as needed.
:::

## Cover

You can do some really cool things with covers because they break out of the usual page flow and span the full width of the page. This is useful for adding something like a custom homepage. We'll use some HTML in it do better demonstrate. Note the extra line breaks and lack of indentation between the HTML tags, which allows you to stuff more markdown inside the tag.

:::cover
<div style="background: var(--docs-color-neutral-100); padding: 2rem;">

Let's _imagine_ we want a section to span the full width of the page. Is that even possible? It sure is! Just add a cover field and you'll get a block-level element that stretches the full body, forming your very own cover section. 

This one isn't that pretty and probably feels out of place, but imagine using it for a homepage splash or something like that!

</div>
:::
