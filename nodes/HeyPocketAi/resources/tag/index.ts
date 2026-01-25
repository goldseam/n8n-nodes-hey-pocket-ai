import type { INodeProperties } from 'n8n-workflow';

import { extractDataFromResponse } from '../../utils/extractDataFromResponse';

const showOnlyForTags = {
	resource: ['tag'],
};

export const tagDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTags,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get tags',
				description: 'Get many tags with usage count',
				routing: {
					request: {
						method: 'GET',
						url: '/api/v1/public/tags',
					},
					output: {
						postReceive: [extractDataFromResponse],
					},
				},
			},
		],
		default: 'getAll',
	},
];
