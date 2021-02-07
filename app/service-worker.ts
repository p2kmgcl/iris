const sw: ServiceWorkerGlobalScope = (self as unknown) as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event) => {
  console.log(event);
});
