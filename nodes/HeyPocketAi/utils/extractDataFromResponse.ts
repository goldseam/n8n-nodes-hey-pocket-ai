import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
} from 'n8n-workflow';

/**
 * Post-receive action to extract data from response and validate success
 */
export async function extractDataFromResponse(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (const item of items) {
		const json = item.json as IDataObject;

		if (json.success === false) {
			throw new Error((json.error as string) || 'API request failed');
		}

		const data = json.data;
		if (Array.isArray(data)) {
			for (const record of data) {
				returnData.push({ json: record as IDataObject });
			}
		} else if (data) {
			returnData.push({ json: data as IDataObject });
		}
	}

	return returnData;
}
