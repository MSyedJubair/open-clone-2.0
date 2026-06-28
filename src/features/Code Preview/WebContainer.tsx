'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { FileSystemTree as WCFileTree, WebContainer } from '@webcontainer/api';
import DirectoryContext from '@/context/DirectoryContext';
import { convertToWebContainerFormat } from '@/lib/utils';
import { Loader2, Box, Terminal, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WebContainerPreview({ width }: { width: string }) {
  const [status, setStatus] = useState('Idle');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const webcontainerRef = useRef<WebContainer | null>(null);

  const isBootingRef = useRef(false);
  const [isContainerReady, setIsContainerReady] = useState(false);

  const context = useContext(DirectoryContext);
  const files = convertToWebContainerFormat(context.files);

  useEffect(() => {
    if (!files || Object.keys(files).length === 0) return;
    if (webcontainerRef.current || isBootingRef.current) return;

    isBootingRef.current = true;

    async function bootContainer() {
      try {
        setStatus('Booting WebContainer...');
        const instance = await WebContainer.boot();
        webcontainerRef.current = instance;

        setStatus('Writing initial files...');
        await instance.mount(files as unknown as WCFileTree);

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
        const devProcess = await instance.spawn('npm', ['run', 'dev']);

        devProcess.output.pipeTo(
          new WritableStream({
            write(data) { console.log(data); },
          })
        );

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
  }, [files]);

  useEffect(() => {
    if (!isContainerReady || !webcontainerRef.current || !context.filePath) return;

    const syncFiles = async () => {
      try {
        const wc = webcontainerRef.current!;
        const updatedCode = context.files[context.filePath]

        const pathParts = context.filePath.split('/');
        if (pathParts.length > 1) {
          const dirPath = pathParts.slice(0, -1).join('/');
          await wc.fs.mkdir(dirPath, { recursive: true });
        }

        await wc.fs.writeFile(context.filePath, updatedCode);
        console.log(`Synced: ${context.filePath}`);
      } catch (error) {
        console.error('Failed to update file inside WebContainer:', error);
      }
    };

    syncFiles();
  }, [files, context.files, isContainerReady, context.filePath]);

  const getCurrentStep = () => {
    if (status.includes('Failed')) return -1;
    if (status.includes('Installing')) return 2;
    if (status.includes('Starting')) return 3;
    if (status.includes('Live')) return 4;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className='w-full h-full flex flex-col bg-zinc-950 rounded-lg overflow-hidden'>
      <div className='flex-1 flex bg-zinc-950 justify-center items-center border-none'>

        {iframeUrl ? (
          <div className="w-full h-full flex justify-center bg-gray-950 animate-in fade-in duration-500">
            <iframe
              src={iframeUrl}
              className='h-full'
              style={{ width: width, transition: 'width 0.3s ease-in-out' }}
              allow="cross-origin-isolated"
            />
          </div>
        ) : (
          <div className='h-full w-full flex items-center justify-center p-6'>
            <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-18">

              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                {currentStep === -1 ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                )}
                <h3 className="text-lg font-medium text-zinc-100">
                  {currentStep === -1 ? 'Container Error' : 'Provisioning Environment'}
                </h3>
              </div>

              <div className="flex flex-col gap-6 relative mt-4">
                <div className="absolute left-3.75 top-4 bottom-4 w-0.5 bg-zinc-800 -z-10" />

                <div className={`flex items-start gap-4 transition-opacity duration-300 ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-zinc-950 shrink-0 transition-colors duration-500 ${currentStep > 1 ? 'border-green-500 text-green-500' :
                      currentStep === 1 ? 'border-indigo-500 text-indigo-400' : 'border-zinc-700 text-zinc-500'
                    }`}>
                    {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : <Box className={`w-4 h-4 ${currentStep === 1 ? 'animate-pulse' : ''}`} />}
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-sm font-medium text-zinc-200">Initialize Container</span>
                    {currentStep === 1 && <span className="text-xs text-zinc-400 mt-1">{status}</span>}
                  </div>
                </div>

                <div className={`flex items-start gap-4 transition-opacity duration-300 ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-zinc-950 shrink-0 transition-colors duration-500 ${currentStep > 2 ? 'border-green-500 text-green-500' :
                      currentStep === 2 ? 'border-indigo-500 text-indigo-400' : 'border-zinc-700 text-zinc-500'
                    }`}>
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : <Terminal className={`w-4 h-4 ${currentStep === 2 ? 'animate-pulse' : ''}`} />}
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-sm font-medium text-zinc-200">Install Dependencies</span>
                    {currentStep === 2 && <span className="text-xs text-zinc-400 mt-1">Running npm install...</span>}
                  </div>
                </div>

                <div className={`flex items-start gap-4 transition-opacity duration-300 ${currentStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-zinc-950 shrink-0 transition-colors duration-500 ${currentStep > 3 ? 'border-green-500 text-green-500' :
                      currentStep === 3 ? 'border-indigo-500 text-indigo-400' : 'border-zinc-700 text-zinc-500'
                    }`}>
                    {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : <Server className={`w-4 h-4 ${currentStep === 3 ? 'animate-pulse' : ''}`} />}
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-sm font-medium text-zinc-200">Start Dev Server</span>
                    {currentStep === 3 && <span className="text-xs text-zinc-400 mt-1">Running npm run dev...</span>}
                  </div>
                </div>

              </div>

              {currentStep === -1 && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-xs text-red-400">{status}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}