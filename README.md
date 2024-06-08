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
