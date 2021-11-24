import { formatMessages } from './utils/formatMessages';
import { deleteMessage, getMessages, sendMessage } from './utils/sqs';

export const postMessage: AWSLambda.Handler = async (
    event: AWSLambda.APIGatewayProxyEvent,
    context: AWSLambda.Context,
    callback: AWSLambda.Callback,
): Promise<void> => {
    const result = await sendMessage();
    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ result }),
    });
};

export const getAll: AWSLambda.Handler = async (
    event: AWSLambda.APIGatewayProxyEvent,
    context: AWSLambda.Context,
    callback: AWSLambda.Callback,
): Promise<void> => {
    const result = await getMessages();

    if (result.Messages)
        callback(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(formatMessages(result)),
        });
    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ count: 0, data: [] }),
    });
};

export const deleteMessages: AWSLambda.Handler = async (
    event: AWSLambda.APIGatewayProxyEvent,
    context: AWSLambda.Context,
    callback: AWSLambda.Callback,
): Promise<void> => {
    await deleteMessage(event.pathParameters!.receiptHandle!);
    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'message deleted successfully' }),
    });
};
