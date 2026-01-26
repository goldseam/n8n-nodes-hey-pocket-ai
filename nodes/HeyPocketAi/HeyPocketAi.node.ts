import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { tagDescription } from './resources/tag';
import { recordingDescription } from './resources/recording';
import { actionItemDescription } from './resources/actionItem';

export class HeyPocketAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hey Pocket AI',
		name: 'heyPocketAi',
		icon: { light: 'file:pocketai.light.svg', dark: 'file:pocketai.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Hey Pocket AI API',
		defaults: {
			name: 'Hey Pocket AI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'heyPocketAiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://public.heypocketai.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Action Item',
						value: 'actionItem',
					},
					{
						name: 'Recording',
						value: 'recording',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
				],
				default: 'recording',
			},
			...actionItemDescription,
			...recordingDescription,
			...tagDescription,
		],
	};
}
