import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRecordingGetAudioUrl = {
	operation: ['getAudioUrl'],
	resource: ['recording'],
};

export const recordingGetAudioUrlDescription: INodeProperties[] = [
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		required: true,
		default: '',
		description: 'The identifier of the recording to get the audio URL for',
		displayOptions: { show: showOnlyForRecordingGetAudioUrl },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForRecordingGetAudioUrl },
		options: [
			{
				displayName: 'Expires In',
				name: 'expires_in',
				type: 'number',
				default: 3600,
				description: 'URL expiration time in seconds (60-86400)',
				typeOptions: {
					minValue: 60,
					maxValue: 86400,
				},
				routing: {
					send: {
						type: 'query',
						property: 'expires_in',
					},
				},
			},
		],
	},
];
