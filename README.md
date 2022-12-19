# Near Social - Sandpacked

Live: [near-social-sandpacked.vercel.app](https://near-social-sandpacked.vercel.app/)

POC of using [Sandpack](https://sandpack.codesandbox.io/docs/), the online bundler used and maintained by [CodeSandbox](https://codesandbox.io/), for the NEAR Social Viewer

## Why

Sandpack is built to compile and run modern React in the browser with support for TypeScript, hooks, etc. Using Sandpack in place of the custom built VM could improve widget DevX while simultaneously lightening the maintenance and development workload of the Viewer project.

## How it works

1. Root widget code is fetched via near-api-js
2. Widget code is parsed to AST with [@swc/wasm-web](https://swc.rs/docs/usage/wasm)
3. Other widgets identified by `import` statements are fetched and parsed recursively e.g.
   ```tsx
   import PokeActivity from '/social-widgets/michaelpeter.near/PokeActivity';
   ```
4. Root widget is loaded into `/App.tsx` (Sandpack default view) and all other widgets are loaded into their own
   files i.e. `/social-widgets/<owner>/<widget>.tsx`

## Benefits

- lightens maintenance and development of Viewer
- robust React support
- TypeScript support
- trivial to add [npm packages](https://sandpack.codesandbox.io/docs/getting-started/custom-content#npm-dependencies) and other dependencies to widget-land
- [security OOTB](https://sandpack.codesandbox.io/docs/advanced-usage/client#security)

## Drawbacks

- initial page load is slower
- full widget tree is fetched and parsed before any widgets are rendered
- requires [hosting a bundler](https://sandpack.codesandbox.io/docs/advanced-usage/client#hosting-the-bundler)

## Notes

- monaco is not the default editor but it [can be added](https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor)
- Viewer app can receive messages from Sandpack iFrame to execute tasks not capable within iFrame (i.e. NEAR Wallet Selector interactions)
- all imported widget tabs are shown in editor for demonstration, but they can be individually hidden

# What would this change

- widget code would be a full component file, providing the widget as its default export i.e.

  ```ts
  export default function Profile(){...}
  ```

- other widgets would be `import`ed and used by name in tsx/jsx

  ```tsx
  import PokeActivity from '/social-widgets/michaelpeter.near/PokeActivity';

  return <PokeActivity />;
  ```

- actions not available in iFrame would be handled by sending messages back to Viewer code  
  e.g. opening a link in current tab
  ```ts
  // Widget code
  window.top.postMessage(
    { action: 'link', target: 'https://www.google.com' },
    '*'
  );
  ```
  ```ts
  // Viewer code
  window.onmessage = function (e) {
    if (e.data?.action === 'link' && typeof e.data?.target === 'string') {
      window.location.href = e.data.target;
    }
  };
  ```
