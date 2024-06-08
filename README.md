# @kf/preact-icons

[![JSR](https://jsr.io/badges/@kf/preact-icons)](https://jsr.io/@kf/preact-icons)

[fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons.git)
for preact. You can browse all icons at this page: [catalog](https://react.fluentui.dev/?path=/docs/icons-catalog--page)

I export icons like this:

```js
import { createIcon, bundleIcon, type FluentIcon } from "../core.tsx";
export const AccessibilityFilled = ...
export const AccessibilityRegular = ...
export const Accessibility = ...
```

So your import statements should be in this format:

```js
import { AccessibilityFilled, AccessibilityRegular, Accessibility } from "jsr:@kf/preact-icons/icons/Accessibility.ts";
```

### islands

In order to make bundledIcon work in islands, you need define an 'initial' island like this and insert the component to _app.tsx.

```js
// islands/Initial.tsx
import { initIconConfiguration } from "jsr:@kf/preact-icons";

initIconConfiguration("icon", "filled", "regular")

export default function Initial() {
  return null;
}

// routes/_app.tsx
...
<Initial />
...
```

Now, icons has correct class name. Then you can style them with css.

```css
.filled {
  display: none;
}

.Container:hover .filled {
  display: unset;
}
.Container:hover .regular {
  display: none;
}
```
