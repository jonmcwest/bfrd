export class HttpService {
  async retryFetch (url, maxRetries = 3) {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          // If rate limited, retry with exponential backoff
          if (response.status === 429) {
            const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            attempt++;
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Add jitter to prevent thundering herd
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      }
    }
  }
}

