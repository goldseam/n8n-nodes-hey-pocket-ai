import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { companyDescription } from './resources/company';

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
						name: 'User',
						value: 'user',
					},
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: 'user',
			},
			...userDescription,
			...companyDescription,
		],
	};
}
