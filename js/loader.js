export async function loadPageData(url, spinnerMs = 1500) {
    const loader = document.querySelector('#page-loader');
    const startTime = performance.now();

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status}`);
        }

        return await response.json();

    } finally {
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, spinnerMs - elapsedTime);

        await new Promise(resolve => setTimeout(resolve, remainingTime));

        loader?.classList.add('is-hidden');
    }
}