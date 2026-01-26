import type { INodeProperties } from 'n8n-workflow';
import { extractActionItems } from '../../utils/extractActionItems';

const showOnlyForActionItems = {
	resource: ['actionItem'],
};

export const actionItemDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForActionItems,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get action items from recording',
				description: 'Get action items extracted from a recording',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/public/recordings/{{$parameter.recordingId}}',
						qs: {
							include_summarizations: true,
						},
					},
					output: {
						postReceive: [extractActionItems],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		required: true,
		default: '',
		description: 'The identifier of the recording to extract action items from',
		displayOptions: {
			show: {
				resource: ['actionItem'],
				operation: ['getAll'],
			},
		},
	},
];
