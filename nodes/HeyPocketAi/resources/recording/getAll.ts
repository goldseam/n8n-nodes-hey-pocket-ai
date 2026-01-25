import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRecordingGetAll = {
	operation: ['getAll'],
	resource: ['recording'],
};

export const recordingGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: showOnlyForRecordingGetAll },
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ $response.body.pagination.has_more }}',
						request: {
							qs: {
								page: '={{ $response.body.pagination.page + 1 }}',
							},
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				returnAll: [false],
				...showOnlyForRecordingGetAll,
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForRecordingGetAll },
		options: [
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				description: 'Filter recordings from this date (YYYY-MM-DD format, UTC)',
				placeholder: '2024-01-01',
				routing: {
					send: {
						type: 'query',
						property: 'start_date',
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'string',
				default: '',
				description: 'Filter recordings until this date (YYYY-MM-DD format, UTC)',
				placeholder: '2024-12-31',
				routing: {
					send: {
						type: 'query',
						property: 'end_date',
					},
				},
			},
			{
				displayName: 'Tag IDs',
				name: 'tag_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated tag identifiers to filter by',
				placeholder: 'tag1,tag2,tag3',
				routing: {
					send: {
						type: 'query',
						property: 'tag_ids',
					},
				},
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number for pagination',
				typeOptions: {
					minValue: 1,
				},
				routing: {
					send: {
						type: 'query',
						property: 'page',
					},
				},
			},
		],
	},
];
