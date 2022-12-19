# Near Social - Sandpacked

POC of using [Sandpack](https://sandpack.codesandbox.io/) from CodeSandbox.io for the Near Social Viewer

## Benefits

- lightens maintenance and development of Viewer
- robust React support
- TypeScript support
- trivial to add [npm packages](https://sandpack.codesandbox.io/docs/getting-started/custom-content#npm-dependencies) and other dependencies to widget-land
- [security OOTB](https://sandpack.codesandbox.io/docs/advanced-usage/client#security)

## Drawbacks

- initial page load is slower
- full widget tree is fetched and parsed at before any widgets are rendered
- requires [hosting a bundler](https://sandpack.codesandbox.io/docs/advanced-usage/client#hosting-the-bundler)

## Notes

- monaco is not the default editor but it [can be added](https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor)
- Viewer app can receive messages from Sandpack iFrame to execute tasks not capable within iFrame (i.e. NEAR Wallet Selector interactions)

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
