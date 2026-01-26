import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
} from 'n8n-workflow';

interface ActionItemSubtask {
	id: string;
	title: string;
	category?: string;
	priority?: string;
	dueDate?: string | null;
	startDate?: string | null;
	recurrencePattern?: string;
	requiresMeeting?: boolean;
}

interface ActionItem {
	id: string;
	title: string;
	description: string;
	startTime?: string;
	endTime?: string;
	subtasks: ActionItemSubtask[];
}

interface Summarizations {
	v2_action_items?: {
		actionItems: ActionItem[];
		version: string;
	};
}

interface Recording {
	id: string;
	title: string;
	created_at: string;
	summarizations?: Summarizations;
}

/**
 * Post-receive action to extract action items from recordings response
 */
export async function extractActionItems(
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
		const recordings = Array.isArray(data) ? data : data ? [data] : [];

		for (const recording of recordings as Recording[]) {
			const actionItems = recording.summarizations?.v2_action_items?.actionItems || [];

			for (const actionItem of actionItems) {
				returnData.push({
					json: {
						id: actionItem.id,
						title: actionItem.title,
						description: actionItem.description,
						startTime: actionItem.startTime,
						endTime: actionItem.endTime,
						subtasks: actionItem.subtasks,
						recording: {
							id: recording.id,
							title: recording.title,
							created_at: recording.created_at,
						},
					} as IDataObject,
				});
			}
		}
	}

	return returnData;
}
