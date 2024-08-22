import { SuiEvent } from '@mysten/sui/client';
import DbResults from '../db/dbResults';
import DbEvents from '../db/dbEvents';

import {
	CreateAIAgentMessage,
	DeleteAIAgentMessage,
	CallAIMessage,
	UpdateNameMessage,
	UpdateEncryptUrlMessage,
	UpdateDescriptionMessage,
	UpdateReceiveAddressMessage,
	UpdatePriceMessage,
} from '../typing';

import aes from '../encryption/aes';
import { makeRequest } from '../utils/util';

export const handleEventObjects = async (events: SuiEvent[], type: string) => {
	for (const event of events) {
		// console.log(event);

		let type = event.type;
		if (type.indexOf("CreateAIAgentMessage") != -1) {
			DbEvents.CreateAIAgent(event.parsedJson as CreateAIAgentMessage);
		} else if (type.indexOf("DeleteAIAgentMessage") != -1) {
			DbEvents.DeleteAIAgent(event.parsedJson as DeleteAIAgentMessage);
		} else if (type.indexOf("UpdateNameMessage") != -1) {
			DbEvents.UpdateName(event.parsedJson as UpdateNameMessage);
		} else if (type.indexOf("UpdateEncryptUrlMessage") != -1) {
			DbEvents.UpdateEncryptUrl(event.parsedJson as UpdateEncryptUrlMessage);
		} else if (type.indexOf("UpdateDescriptionMessage") != -1) {
			DbEvents.UpdateDescription(event.parsedJson as UpdateDescriptionMessage);
		} else if (type.indexOf("UpdateReceiveAddressMessage") != -1) {
			DbEvents.UpdateReceiveAddress(event.parsedJson as UpdateReceiveAddressMessage);
		} else if (type.indexOf("UpdatePriceMessage") != -1) {
			DbEvents.UpdatePrice(event.parsedJson as UpdatePriceMessage);
		} else if (type.indexOf("CallAIMessage") != -1) {
			handleCallAIMessage(event, event.parsedJson as CallAIMessage);
		}
	}

	await Promise.resolve();
};

export const handleCallAIMessage = async (event: SuiEvent, message: CallAIMessage) => {
	let id = message.id;
	let params = message.params;
	let nonce = message.nonce;
	let caller = message.caller;

	let data = DbEvents.GetAIAgent(id);
	if (data != null) {
		let requestUrl = aes.decrypt(data.encrypt_url)
		let paramsData: any = JSON.parse(params);
		let response = await makeRequest({
			requestUrl,
			requestParams: paramsData,
			requestType: data.method_type,
		});

		console.log("handleCallAIMessage")
		console.log(data)
		console.log(requestUrl);
		console.log(response);
		if (typeof response == "object") {
			response.name = data.name;
			response.description = data.description;
			response.params = paramsData;
			response.time = event.timestampMs;
			response.txid = event.id.txDigest;
			DbResults.WriteResult(caller, id, nonce, response);
		} else {
			console.error("handleCallAIMessage error ");
			console.error(response);
		}
	}

	await Promise.resolve();
};