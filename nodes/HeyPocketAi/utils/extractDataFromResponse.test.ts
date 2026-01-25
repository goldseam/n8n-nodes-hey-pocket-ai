/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, test, expect } from 'bun:test';
import { extractDataFromResponse } from './extractDataFromResponse';
import type { INodeExecutionData, IN8nHttpFullResponse } from 'n8n-workflow';

const mockResponse = {} as IN8nHttpFullResponse;
const mockThis = {} as any;

describe('extractDataFromResponse', () => {
	describe('empty responses', () => {
		test('returns empty array when items array is empty', async () => {
			const items: INodeExecutionData[] = [];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toEqual([]);
		});

		test('returns empty array when data is empty array', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [],
						pagination: { page: 1, limit: 50, total: 0, total_pages: 0, has_more: false },
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toEqual([]);
		});

		test('returns empty array when data is null', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: null,
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toEqual([]);
		});

		test('returns empty array when data is undefined', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toEqual([]);
		});
	});

	describe('single page with array data', () => {
		test('extracts array data as individual items', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{ id: '1', title: 'Recording 1' },
							{ id: '2', title: 'Recording 2' },
							{ id: '3', title: 'Recording 3' },
						],
						pagination: { page: 1, limit: 50, total: 3, total_pages: 1, has_more: false },
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(3);
			expect(result[0].json).toEqual({ id: '1', title: 'Recording 1' });
			expect(result[1].json).toEqual({ id: '2', title: 'Recording 2' });
			expect(result[2].json).toEqual({ id: '3', title: 'Recording 3' });
		});

		test('handles single item in array', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [{ id: '1', title: 'Only Recording' }],
						pagination: { page: 1, limit: 50, total: 1, total_pages: 1, has_more: false },
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ id: '1', title: 'Only Recording' });
		});
	});

	describe('single item with object data (Get single resource)', () => {
		test('extracts object data as single item', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: {
							id: '123',
							title: 'Single Recording',
							duration: 120,
							transcript: 'Hello world',
						},
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				id: '123',
				title: 'Single Recording',
				duration: 120,
				transcript: 'Hello world',
			});
		});

		test('handles audio URL response', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: {
							url: 'https://s3.amazonaws.com/bucket/audio.mp3?signature=abc123',
							expires_at: '2024-01-01T12:00:00Z',
						},
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				url: 'https://s3.amazonaws.com/bucket/audio.mp3?signature=abc123',
				expires_at: '2024-01-01T12:00:00Z',
			});
		});
	});

	describe('multiple pages (returnAll pagination)', () => {
		test('accumulates data from multiple pages', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{ id: '1', title: 'Page 1 - Item 1' },
							{ id: '2', title: 'Page 1 - Item 2' },
						],
						pagination: { page: 1, limit: 2, total: 5, total_pages: 3, has_more: true },
					},
				},
				{
					json: {
						success: true,
						data: [
							{ id: '3', title: 'Page 2 - Item 1' },
							{ id: '4', title: 'Page 2 - Item 2' },
						],
						pagination: { page: 2, limit: 2, total: 5, total_pages: 3, has_more: true },
					},
				},
				{
					json: {
						success: true,
						data: [{ id: '5', title: 'Page 3 - Item 1' }],
						pagination: { page: 3, limit: 2, total: 5, total_pages: 3, has_more: false },
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(5);
			expect(result[0].json).toEqual({ id: '1', title: 'Page 1 - Item 1' });
			expect(result[1].json).toEqual({ id: '2', title: 'Page 1 - Item 2' });
			expect(result[2].json).toEqual({ id: '3', title: 'Page 2 - Item 1' });
			expect(result[3].json).toEqual({ id: '4', title: 'Page 2 - Item 2' });
			expect(result[4].json).toEqual({ id: '5', title: 'Page 3 - Item 1' });
		});

		test('handles many pages with large datasets', async () => {
			const pages = 10;
			const itemsPerPage = 100;
			const items: INodeExecutionData[] = [];

			for (let page = 1; page <= pages; page++) {
				const pageData = [];
				for (let i = 0; i < itemsPerPage; i++) {
					pageData.push({
						id: `${(page - 1) * itemsPerPage + i + 1}`,
						title: `Item ${(page - 1) * itemsPerPage + i + 1}`,
					});
				}
				items.push({
					json: {
						success: true,
						data: pageData,
						pagination: {
							page,
							limit: itemsPerPage,
							total: pages * itemsPerPage,
							total_pages: pages,
							has_more: page < pages,
						},
					},
				});
			}

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(pages * itemsPerPage);
			expect(result[0].json).toEqual({ id: '1', title: 'Item 1' });
			expect(result[999].json).toEqual({ id: '1000', title: 'Item 1000' });
		});
	});

	describe('error handling', () => {
		test('throws error when success is false with error message', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: false,
						error: 'Invalid API key provided',
					},
				},
			];

			await expect(extractDataFromResponse.call(mockThis, items, mockResponse)).rejects.toThrow(
				'Invalid API key provided',
			);
		});

		test('throws default error when success is false without error message', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: false,
					},
				},
			];

			await expect(extractDataFromResponse.call(mockThis, items, mockResponse)).rejects.toThrow(
				'API request failed',
			);
		});

		test('throws error when success is false with empty error string', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: false,
						error: '',
					},
				},
			];

			await expect(extractDataFromResponse.call(mockThis, items, mockResponse)).rejects.toThrow(
				'API request failed',
			);
		});

		test('throws on first failed page in multi-page response', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [{ id: '1' }],
						pagination: { page: 1, has_more: true },
					},
				},
				{
					json: {
						success: false,
						error: 'Rate limit exceeded',
					},
				},
			];

			await expect(extractDataFromResponse.call(mockThis, items, mockResponse)).rejects.toThrow(
				'Rate limit exceeded',
			);
		});
	});

	describe('success field edge cases', () => {
		test('processes data when success is true', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [{ id: '1' }],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
		});

		test('processes data when success field is missing (implicit success)', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						data: [{ id: '1' }],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
		});

		test('processes data when success is truthy but not boolean true', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: 1,
						data: [{ id: '1' }],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
		});
	});

	describe('data type preservation', () => {
		test('preserves nested objects', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{
								id: '1',
								tags: [
									{ id: 'tag1', name: 'conversation', color: null },
									{ id: 'tag2', name: 'personal', color: '#ff0000' },
								],
								metadata: {
									created_by: 'user123',
									settings: { auto_transcribe: true },
								},
							},
						],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				id: '1',
				tags: [
					{ id: 'tag1', name: 'conversation', color: null },
					{ id: 'tag2', name: 'personal', color: '#ff0000' },
				],
				metadata: {
					created_by: 'user123',
					settings: { auto_transcribe: true },
				},
			});
		});

		test('preserves various data types', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{
								string_field: 'hello',
								number_field: 42,
								float_field: 3.14,
								boolean_field: true,
								null_field: null,
								array_field: [1, 2, 3],
								date_field: '2024-01-01T00:00:00Z',
							},
						],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result[0].json).toEqual({
				string_field: 'hello',
				number_field: 42,
				float_field: 3.14,
				boolean_field: true,
				null_field: null,
				array_field: [1, 2, 3],
				date_field: '2024-01-01T00:00:00Z',
			});
		});
	});

	describe('real-world API response scenarios', () => {
		test('handles recordings list response', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{
								id: '5d78783c-40a4-4bf2-bf85-22f4b8bb80f8',
								title: 'Shopping and Subscriptions',
								duration: 15,
								state: 'completed',
								language: 'en',
								created_at: '2026-01-24T13:55:08Z',
								updated_at: '2026-01-24T13:55:36Z',
								tags: [
									{ id: 'c15eaddc-4a56-4a4d-a166-c6adc0dd53fa', name: 'conversation', color: null },
								],
							},
						],
						pagination: { page: 1, limit: 50, total: 1, total_pages: 1, has_more: false },
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(1);
			expect(result[0].json.id).toBe('5d78783c-40a4-4bf2-bf85-22f4b8bb80f8');
			expect(result[0].json.title).toBe('Shopping and Subscriptions');
			expect(result[0].json.tags as any[]).toHaveLength(1);
		});

		test('handles tags list response', async () => {
			const items: INodeExecutionData[] = [
				{
					json: {
						success: true,
						data: [
							{ id: 'tag1', name: 'conversation', color: null, usage_count: 10 },
							{ id: 'tag2', name: 'personal', color: '#ff0000', usage_count: 5 },
						],
					},
				},
			];

			const result = await extractDataFromResponse.call(mockThis, items, mockResponse);

			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe('conversation');
			expect(result[1].json.name).toBe('personal');
		});
	});
});
