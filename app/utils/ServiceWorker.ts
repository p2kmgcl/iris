let serviceWorkerRegistration: ServiceWorkerRegistration;

export const ServiceWorker = {
  register: async () => {
    serviceWorkerRegistration = await navigator.serviceWorker.register(
      '/service-worker.js',
    );

    console.log(serviceWorkerRegistration);
  },
};
