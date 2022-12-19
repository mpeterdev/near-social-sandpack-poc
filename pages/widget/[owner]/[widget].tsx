import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import { useEffect, useState, useCallback } from 'react';
// import source from '../widgets/App';
import initSwc, { parseSync } from '@swc/wasm-web';
import fetchWidgetCode from '../../../utils/fetchWidgetCode';
import { useRouter } from 'next/router';

import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function WidgetRenderer() {
  const router = useRouter();
  const { owner, widget } = router.query;

  const [initialized, setInitialized] = useState(false);
  const [socialWidgets, setSocialWidgets] = useState<Record<string, string>>();

  useEffect(() => {
    window.onmessage = function (e) {
      console.log(`Parent window received message:`, JSON.stringify(e.data));
      if (e.data?.action === 'link' && typeof e.data?.target === 'string') {
        window.location.href = e.data.target;
      }
    };
  }, []);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  /**
   * Recursively fetches widget code
   */
  const fetchWidgetTree = useCallback(
    async (owner: string, widget: string, cache: Record<string, string>) => {
      const path = `/social-widgets/${owner}/${widget}.tsx`;
      const code = cache[path] ?? (await fetchWidgetCode(owner, widget));
      if (!cache['/App.tsx']) {
        // Sandpack loads /App.tsx by default so load root widget there
        cache['/App.tsx'] = code;
      } else {
        cache[path] = code;
      }
      // console.log(cache);

      // parse widget code to check for imports of other widgets
      const result = parseSync(code, { tsx: true, syntax: 'typescript' });
      for (const node of result.body) {
        if (node.type !== 'ImportDeclaration') continue;

        const match = node.source.value.match(
          /social-widgets\/(\w*\.near)\/(\w*)/
        );
        if (match?.length === 3) {
          const [_, owner, widget] = match;

          // fetch recursively
          await fetchWidgetTree(owner, widget, cache);
        }
      }
    },
    []
  );

  /**
   * Initiates widget fetch recursion
   */
  const fetchAll = useCallback(
    async (rootOwner: string, rootName: string) => {
      if (!initialized) {
        return;
      }
      const widgetFiles: Record<string, string> = {};
      await fetchWidgetTree(rootOwner, rootName, widgetFiles);
      console.log('Widget files', Object.keys(widgetFiles));
      setSocialWidgets(widgetFiles);
    },
    [initialized, fetchWidgetTree]
  );

  useEffect(() => {
    if (typeof owner !== 'string' || typeof widget !== 'string') return;

    fetchAll(owner, widget);
  }, [fetchAll, owner, widget]);
  return (
    <>
      <main className="maxOut">
        <div className={inter.className} style={{ padding: '1.5rem' }}>
          Near Social - Sandpacked
        </div>
        <div className="maxOut">
          {socialWidgets ? (
            <CustomSandpack socialWidgets={socialWidgets} />
          ) : (
            <div>Parsing...</div>
          )}
        </div>
      </main>
    </>
  );
}

function CustomSandpack({
  socialWidgets,
}: {
  socialWidgets: Record<string, string>;
}) {
  return (
    <SandpackProvider
      template="react-ts"
      customSetup={{
        dependencies: {
          'near-api-js': '^1.1.0',
        },
      }}
      options={{
        classes: {
          'sp-wrapper': 'maxOut',
          'sp-preview-iframe': 'maxOut',
          'sp-stack': 'maxOut',
          'sp-preview-container': 'maxOut',
        },
        externalResources: [
          // 'https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css',
          'https://cdn.tailwindcss.com',
        ],
      }}
      files={{
        ...socialWidgets,
      }}
    >
      <SandpackThemeProvider>
        <SandpackPreview />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
}
