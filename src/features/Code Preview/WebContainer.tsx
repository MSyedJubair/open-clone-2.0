'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { FileSystemTree as WCFileTree, WebContainer } from '@webcontainer/api';
import DirectoryContext from '@/context/DirectoryContext';

function getFileNode(tree: any, path: string) {
  const parts = path.split('/');
  let current = tree;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (isLast) {
      return current[part];
    }

    current = current[part]?.directory;
    if (!current) return null;
  }

  return null;
}

export default function WebContainerPreview() {
  const [status, setStatus] = useState('Idle');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const webcontainerRef = useRef<WebContainer | null>(null);
  
  const isBootingRef = useRef(false);
  const [isContainerReady, setIsContainerReady] = useState(false);

  const context = useContext(DirectoryContext);

  // Effect 1: Booting up the WebContainer environment
  useEffect(() => {
    if (!context.files || Object.keys(context.files).length === 0) return;
    if (webcontainerRef.current || isBootingRef.current) return;
    
    isBootingRef.current = true;

    async function bootContainer() {
      try {
        setStatus('Booting WebContainer...');
        const instance = await WebContainer.boot();
        webcontainerRef.current = instance;

        setStatus('Writing initial files...');
        await instance.mount(context.files as unknown as WCFileTree);

        setStatus('Installing dependencies (this may take a moment)...');
        const installProcess = await instance.spawn('npm', ['install']);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) { console.log(data); },
          })
        );

        const exitCode = await installProcess.exit;
        if (exitCode !== 0) throw new Error('Installation failed');

        setStatus('Starting Next.js server...');
        // Using --port 3000 explicitly can help keep port tracking stable
        await instance.spawn('npm', ['run', 'dev', '--', '-p', '3000']);

        instance.on('server-ready', (port, url) => {
          setStatus(`Live on port ${port}`);
          setIframeUrl(url);
        });

        setIsContainerReady(true);

      } catch (error) {
        console.error('WebContainer boot error:', error);
        setStatus('Failed to load container. Check console for details.');
        isBootingRef.current = false;
      }
    }

    bootContainer();
  }, [context.files]); 

  // Effect 2: Incremental File Synchronization
  useEffect(() => {
    if (!isContainerReady || !webcontainerRef.current || !context.filePath) return;

    const syncFiles = async () => {
      try {
        const wc = webcontainerRef.current!;
        const updatedNode = getFileNode(context.files, context.filePath);
        const updatedCode = updatedNode?.file?.contents || '';

        // Handle path parts to ensure directory paths exist before writing file
        const pathParts = context.filePath.split('/');
        if (pathParts.length > 1) {
          const dirPath = pathParts.slice(0, -1).join('/');
          // Generates folders recursively if they don't exist yet
          await wc.fs.mkdir(dirPath, { recursive: true });
        }

        // Incrementally update only the specific file
        await wc.fs.writeFile(context.filePath, updatedCode);
        console.log(`Synced: ${context.filePath}`);
      } catch (error) {
        console.error('Failed to update file inside WebContainer:', error);
      }
    };

    syncFiles();
  }, [context.files, context.filePath, isContainerReady]);

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='p-2 bg-gray-800 text-white text-sm font-mono'>{status}</div>
      <div className='flex-1 border border-gray-300 rounded'>
        {iframeUrl ? (
          <iframe src={iframeUrl} className='h-full w-full' allow="cross-origin-isolated"></iframe>
        ) : (
          <div className='h-full w-full flex items-center justify-center bg-gray-50 text-gray-400'>
            Waiting for server...
          </div>
        )}
      </div>
    </div>
  );
}