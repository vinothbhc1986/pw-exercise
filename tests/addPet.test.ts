import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { FetchClient } from './fetch-client';
import { PetstorePetClient, AddPetRequest } from '../client/PetstorePetClient';

const config = JSON.parse(
  readFileSync(path.resolve('.openapi-skills/config.json'), 'utf-8'),
);
const apiBaseUrl = config.apis.petstore.baseUrl;

test.describe('PetstorePetClient', () => {
  test('addPet creates a pet and returns it', async ({ request }) => {
    const httpClient = new FetchClient(apiBaseUrl, request);
    const petstorePetClient = new PetstorePetClient(httpClient);

    const body: AddPetRequest = {
      id: 10,
      name: 'Mizi',
      photoUrls: [],
      status: 'available',
    };

    const result = await petstorePetClient.addPet(body);
    expect(result).toBeDefined();
    expect(result.id).toBe(10);
    expect(result.name).toBe('Mizi');
  });
});
