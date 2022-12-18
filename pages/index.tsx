// import Image from 'next/image';
import { Inter } from '@next/font/google';

import { Sandpack } from '@codesandbox/sandpack-react';
import { useEffect, useState, useCallback } from 'react';
import source from '../widgets/App';
import initSwc, { parseSync } from '@swc/wasm-web';
import fetchWidgetCode from '../utils/fetchWidgetCode';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [socialWidgets, setSocialWidgets] = useState<Record<string, string>>();

  useEffect(() => {
    window.onmessage = function (e) {
      console.log(`Parent window received message:`, JSON.stringify(e));
    };
  }, []);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  const parse = useCallback(async () => {
    if (!initialized) {
      return;
    }
    const result = parseSync(source, { tsx: true, syntax: 'typescript' });
    console.log(result);
    const pulledWidgets: Record<string, string> = {};
    for (const node of result.body) {
      if (node.type !== 'ImportDeclaration') continue;

      const match = node.source.value.match(
        /social-widgets\/(\w*\.near)\/(\w*)/
      );
      if (match?.length === 3) {
        const [full, owner, name] = match;
        console.log(`Found ${match.join(', ')}`);
        const path = `/social-widgets/${owner}/${name}`;
        pulledWidgets[`${path}.tsx`] = await fetchWidgetCode(owner, name);
      }
    }
    setSocialWidgets(pulledWidgets);
    // setReady(true);
  }, [initialized]);

  useEffect(() => {
    parse();
  }, [parse]);
  return (
    <>
      <main>
        <div className={inter.className} style={{ padding: '1.5rem' }}>
          Near Social - Sandpacked
        </div>
        <div style={{ height: '100rem' }}>
          {socialWidgets ? (
            <Sandpack
              // theme="dark"
              template="react-ts"
              customSetup={{
                dependencies: {
                  'near-api-js': '^1.1.0',
                },
              }}
              options={{ editorHeight: '70rem' }}
              files={{
                '/App.tsx': source,
                ...socialWidgets,
              }}
            />
          ) : (
            <div>Parsing...</div>
          )}
        </div>
      </main>
    </>
  );
}
