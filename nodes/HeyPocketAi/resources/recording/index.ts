import type { INodeProperties } from 'n8n-workflow';
import { recordingGetAllDescription } from './getAll';
import { recordingGetDescription } from './get';
import { recordingGetAudioUrlDescription } from './getAudioUrl';
import { extractDataFromResponse } from '../../utils/extractDataFromResponse';

const showOnlyForRecordings = {
	resource: ['recording'],
};

export const recordingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForRecordings,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get recordings',
				description: 'Get paginated list of recordings with optional filtering',
				routing: {
					request: {
						method: 'GET',
						url: '/api/v1/public/recordings',
					},
					output: {
						postReceive: [extractDataFromResponse],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a recording',
				description: 'Get a single recording with full details',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/public/recordings/{{$parameter.recordingId}}',
					},
					output: {
						postReceive: [extractDataFromResponse],
					},
				},
			},
			{
				name: 'Get Audio URL',
				value: 'getAudioUrl',
				action: 'Get audio download URL',
				description: 'Generate pre-signed S3 URL for audio download',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/public/recordings/{{$parameter.recordingId}}/audio-url',
					},
					output: {
						postReceive: [extractDataFromResponse],
					},
				},
			},
		],
		default: 'getAll',
	},
	...recordingGetAllDescription,
	...recordingGetDescription,
	...recordingGetAudioUrlDescription,
];
