# Everyday helpers

```post-data
{
  "date": "2026-08-16",
  "tags": ["javascript", "python", "demo"],
  "summary": "A sample gist: small debounce, clamp, and retry helpers I keep reaching for."
}
```

A demo snippet in the same markdown format as blog posts. Each fenced block gets syntax highlighting plus **Raw** and **Copy**.

## JavaScript

```javascript debounce.js
export function debounce(fn, wait = 200) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export async function retry(task, { attempts = 3, delay = 250 } = {}) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await task(i);
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}
```

## Python

```python helpers.py
from time import sleep
from typing import Callable, TypeVar

T = TypeVar("T")


def clamp(value: float, low: float, high: float) -> float:
    return min(high, max(low, value))


def retry(task: Callable[[], T], attempts: int = 3, delay: float = 0.25) -> T:
    last_error: Exception | None = None
    for i in range(attempts):
        try:
            return task()
        except Exception as err:
            last_error = err
            if i < attempts - 1:
                sleep(delay * (i + 1))
    assert last_error is not None
    raise last_error
```

Drop another `.md` file in `gist/posts/` and it will show up on the Snippets index after the post index refreshes.
