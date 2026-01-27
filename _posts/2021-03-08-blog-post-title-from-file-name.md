## Blog Post Title From First Header

Due to a plugin called `jekyll-titles-from-headings` which is supported by GitHub Pages by default. The above header (in the markdown file) will be automatically used as the pages title.

If the file does not start with a header, then the post title will be derived from the filename.

This is a sample blog post. You can talk about all sorts of fun things here.

<div class="interactive">
  <div class="math-pane">
    $$\int_{0}^{1} x^2\,dx = \frac{1}{3}$$
    <p>Step: $ \int x^2\,dx = \tfrac{x^3}{3} $</p>
  </div>
  <div class="code-pane">
    <pre><code class="language-python"># Example Python
def square_integral():
    # approximate integral of x^2 on [0,1] with simple Riemann sum
    n = 1000
    dx = 1.0 / n
    return sum((i*dx)**2 * dx for i in range(n))

print(square_integral())
</code></pre>
  </div>
</div>

---

### This is a header

#### Some T-SQL Code

```tsql
SELECT This, [Is], A, Code, Block -- Using SSMS style syntax highlighting
    , REVERSE('abc')
FROM dbo.SomeTable s
    CROSS JOIN dbo.OtherTable o;
```

#### Some PowerShell Code

```powershell
Write-Host "This is a powershell Code block";

# There are many other languages you can use, but the style has to be loaded first

ForEach ($thing in $things) {
    Write-Output "It highlights it using the GitHub style"
}
```
