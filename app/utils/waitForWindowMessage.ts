export function waitForWindowMessage(name: string): Promise<string> {
  return new Promise((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'sendWindowMessage' &&
        event.data?.name === name
      ) {
        window.removeEventListener('message', handleMessage);
        resolve(event.data?.data as string);
      }
    };

    window.addEventListener('message', handleMessage);
  });
}

export function sendWindowMessage(
  targetWindow: Window,
  name: string,
  data = '',
) {
  targetWindow.postMessage({ type: 'sendWindowMessage', name, data }, '*');
}
