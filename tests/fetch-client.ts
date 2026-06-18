export interface HttpRequestOptionsBase {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}

export interface HttpRequestWithBodyOptions extends HttpRequestOptionsBase {
  body?: any;
}

export interface HttpClient {
  get<T = unknown>(url: string, options?: HttpRequestOptionsBase): Promise<T>;
  head<T = unknown>(url: string, options?: HttpRequestOptionsBase): Promise<T>;
  options<T = unknown>(url: string, options?: HttpRequestOptionsBase): Promise<T>;
  post<T = unknown>(url: string, options?: HttpRequestWithBodyOptions): Promise<T>;
  put<T = unknown>(url: string, options?: HttpRequestWithBodyOptions): Promise<T>;
  patch<T = unknown>(url: string, options?: HttpRequestWithBodyOptions): Promise<T>;
  delete<T = unknown>(url: string, options?: HttpRequestWithBodyOptions): Promise<T>;
}

export class FetchClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly requestContext?: any,
  ) {}

  private async request<T>(
    method: string,
    path: string,
    options: HttpRequestOptionsBase | HttpRequestWithBodyOptions = {},
  ): Promise<T> {
    const finalUrl = this.baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, '');

    const hasBody =
      'body' in options &&
      options.body !== undefined &&
      method !== 'GET' &&
      method !== 'HEAD';

    const headers: Record<string, string> = {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    };

    if (this.requestContext) {
      const response = await this.requestContext.fetch(finalUrl, {
        method,
        headers,
        data: hasBody ? JSON.stringify((options as HttpRequestWithBodyOptions).body) : undefined,
      });

      const text = await response.text();
      let body: unknown = {};
      if (text.trim().length > 0) {
        try {
          body = JSON.parse(text);
        } catch {
          body = text;
        }
      }

      if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
        return { ...body, status: response.status(), statusText: response.statusText() } as T;
      }

      return { body, status: response.status(), statusText: response.statusText() } as T;
    }

    const response = await fetch(finalUrl, {
      method,
      headers,
      body: hasBody ? JSON.stringify((options as HttpRequestWithBodyOptions).body) : null,
    });

    const text = await response.text();
    let body: unknown = {};
    if (text.trim().length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
      return { ...body, status: response.status, statusText: response.statusText } as T;
    }

    return { body, status: response.status, statusText: response.statusText } as T;
  }

  get<T>(path: string, options?: HttpRequestOptionsBase): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  head<T>(path: string, options?: HttpRequestOptionsBase): Promise<T> {
    return this.request<T>('HEAD', path, options);
  }

  options<T>(path: string, options?: HttpRequestOptionsBase): Promise<T> {
    return this.request<T>('OPTIONS', path, options);
  }

  post<T>(path: string, options?: HttpRequestWithBodyOptions): Promise<T> {
    return this.request<T>('POST', path, options);
  }

  put<T>(path: string, options?: HttpRequestWithBodyOptions): Promise<T> {
    return this.request<T>('PUT', path, options);
  }

  patch<T>(path: string, options?: HttpRequestWithBodyOptions): Promise<T> {
    return this.request<T>('PATCH', path, options);
  }

  delete<T>(path: string, options?: HttpRequestWithBodyOptions): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }
}
