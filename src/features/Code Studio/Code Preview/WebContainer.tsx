'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { FileSystemTree as WCFileTree, WebContainer } from '@webcontainer/api';
import DirectoryContext from '@/context/DirectoryContext';
import { FileSystemTree } from '@/lib/types';

type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'free';

function getFileNode(tree: FileSystemTree, path: string) {
  const parts = path.split('/');
  let current: FileSystemTree | undefined = tree;

  if (!parts) return null;

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

  // Responsive device view state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('free');

  const context = useContext(DirectoryContext);

  useEffect(() => {
    if (JSON.stringify(context.files) === '{}') return;
    if (webcontainerRef.current || isBootingRef.current) return;
    
    isBootingRef.current = true;

    async function bootContainer() {
      try {
        setStatus('Booting WebContainer...');
        const instance = await WebContainer.boot();
        webcontainerRef.current = instance;

        setStatus('Writing initial files...');
        await instance.mount(context.files as unknown as WCFileTree);

        setStatus('Installing dependencies...');
        const installProcess = await instance.spawn('npm', ['install']);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) { console.log(data); },
          })
        );

        const exitCode = await installProcess.exit;
        if (exitCode !== 0) throw new Error('Installation failed');

        setStatus('Starting server...');
        await instance.spawn('npm', ['run', 'dev']);

        instance.on('server-ready', (port, url) => {
          setStatus(`Live on port ${port}`);
          setIframeUrl(url);
        });

        setIsContainerReady(true);

      } catch (error) {
        console.error(error);
        setStatus('Failed to load container.');
        isBootingRef.current = false;
      }
    }

    bootContainer();
  }, [context.files]); 

  useEffect(() => {
    if (!isContainerReady || !webcontainerRef.current) return;

    try {
      const wc = webcontainerRef.current;
      const updatedNode = getFileNode(context.files, context.filePath);
      const updatedCode = updatedNode?.file?.contents || '';

      wc.fs.writeFile(context.filePath, updatedCode);
    } catch (error) {
      console.error('Failed to update file inside WebContainer:', error);
    }
  }, [context.files, context.filePath, isContainerReady]);

  return (
    <div className='w-full h-full'>
      <h1>{status}</h1>
      <iframe src={iframeUrl || ''} className='h-full w-full'></iframe>
    </div>
  )
}
