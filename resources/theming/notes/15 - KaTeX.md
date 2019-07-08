---
tags: [Basics, Notebooks/Theming]
title: 15 - KaTeX
created: '2019-03-02T01:09:32.132Z'
modified: '2019-07-01T16:32:21.521Z'
---

# 15 - KaTeX

Inline $e^{iπ} + \fbox{1} = 0$

Single char $2$

Fractions $\frac{1}{2}$, $1/2$

Block:

$$f{x} = \int_{-\infty}^\infty \hat f\xi\,e^{2 \pi i \xi x} \,d\xi$$

Multi-line block:

$$
f{x} = \int_{-\infty}^\infty \hat f\xi\,e^{2 \pi i \xi x} \,d\xi
$$

Codeblock:

```katex
f{x} = \int_{-\infty}^\infty \hat f\xi\,e^{2 \pi i \xi x} \,d\xi
```

- $ is not a formula
- $2+1$2 is not a formula
- \$2+1\$ is not a formula
- \$partially-escaped plus formula $1$
- $\$$ and $del\$$ have an embedded delimiter
