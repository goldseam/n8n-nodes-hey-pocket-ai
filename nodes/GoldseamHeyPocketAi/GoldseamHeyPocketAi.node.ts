import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { companyDescription } from './resources/company';

export class GoldseamHeyPocketAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Goldseam Hey Pocket Ai',
		name: 'goldseamHeyPocketAi',
		icon: { light: 'file:goldseamHeyPocketAi.svg', dark: 'file:goldseamHeyPocketAi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Goldseam Hey Pocket Ai API',
		defaults: {
			name: 'Goldseam Hey Pocket Ai',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'goldseamHeyPocketAiApi', required: true }],
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
