import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRecordingGet = {
	operation: ['get'],
	resource: ['recording'],
};

export const recordingGetDescription: INodeProperties[] = [
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		required: true,
		default: '',
		description: 'The identifier of the recording to retrieve',
		displayOptions: { show: showOnlyForRecordingGet },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForRecordingGet },
		options: [
			{
				displayName: 'Include Transcript',
				name: 'include_transcript',
				type: 'boolean',
				default: true,
				description: 'Whether to include transcript data in the response',
				routing: {
					send: {
						type: 'query',
						property: 'include_transcript',
					},
				},
			},
			{
				displayName: 'Include Summarizations',
				name: 'include_summarizations',
				type: 'boolean',
				default: true,
				description: 'Whether to include summarizations in the response',
				routing: {
					send: {
						type: 'query',
						property: 'include_summarizations',
					},
				},
			},
		],
	},
];
