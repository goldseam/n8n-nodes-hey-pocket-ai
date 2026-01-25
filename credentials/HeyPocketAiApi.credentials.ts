import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class HeyPocketAiApi implements ICredentialType {
	name = 'heyPocketAiApi';

	displayName = 'Hey Pocket AI API';
	icon: Icon = { light: 'file:pocketai.light.svg', dark: 'file:pocketai.dark.svg' };

	// Link to your community node's README
	documentationUrl =
		'https://github.com/goldseam/n8n-nodes-hey-pocket-ai?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://public.heypocketai.com',
			url: '/v1/user',
		},
	};
}

