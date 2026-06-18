// Generated from petstore API schema by openapi-skills.

import { HttpClient, HttpRequestWithBodyOptions } from '../tests/fetch-client';

export interface AddPetRequest {
  id?: number;
  category?: { id?: number; name?: string };
  name: string;
  photoUrls: string[];
  tags?: { id?: number; name?: string }[];
  status?: 'available' | 'pending' | 'sold';
}

export interface AddPetResponse {
  id: number;
  category?: { id?: number; name?: string };
  name: string;
  photoUrls: string[];
  tags?: { id?: number; name?: string }[];
  status?: string;
  statusText: string;
}

export interface AddPet405Error {
  message: string;
  status: number;
}

export class PetstorePetClient {
  // Pass your own http client that implements the HttpClient interface.
  constructor(private httpClient: HttpClient) {}

  async addPet(
    body: AddPetRequest,
    headers?: Record<string, string>,
  ): Promise<AddPetResponse | AddPet405Error> {
    const options: HttpRequestWithBodyOptions = { body };
    if (headers) {
      options.headers = headers;
    }
    return this.httpClient.post<AddPetResponse | AddPet405Error>('/pet', options);
  }
}
