import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoldseamHeyPocketAiApi implements ICredentialType {
	name = 'goldseamHeyPocketAiApi';

	displayName = 'Goldseam Hey Pocket Ai API';

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/@goldseam/-hey-pocket-ai?tab=readme-ov-file#credentials';

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
