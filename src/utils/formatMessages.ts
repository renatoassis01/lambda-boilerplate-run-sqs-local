/* eslint-disable no-restricted-syntax */
export const formatMessages = (
    data: AWS.SQS.Types.ReceiveMessageResult,
): { count: number; data: Record<string, unknown>[] } => {
    const result = data.Messages!.map(s => ({
        messageId: s.MessageId,
        receiptHandle: s.ReceiptHandle,
        ...formatMessageAttributes(s.MessageAttributes!),
    }));
    return { count: result.length, data: result };
};

export const formatMessageAttributes = (
    messageAttributes: AWS.SQS.Types.MessageBodyAttributeMap,
): Record<string, unknown> => {
    const item = {};

    const keys = Object.keys(messageAttributes);

    for (const key of keys) {
        item[key.toLowerCase()] = messageAttributes[key].StringValue;
    }
    return item;
};
