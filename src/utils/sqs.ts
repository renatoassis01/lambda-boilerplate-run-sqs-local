import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

AWS.config.update({ region: process.env.REGION });

export const SQS_QUEUE_URL = `${process.env.QUEUE_URL}/${process.env.QUEUE_NAME}`;

export const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

export const sendMessage = async (): Promise<
    PromiseResult<AWS.SQS.SendMessageResult, AWS.AWSError>
> => {
    const params: AWS.SQS.Types.SendMessageRequest = {
        DelaySeconds: 10,
        MessageBody: ` add user account ${new Date().toISOString()}`,
        MessageAttributes: {
            Name: {
                DataType: 'String',
                StringValue: 'name',
            },
            Email: {
                DataType: 'String',
                StringValue: 'name@email.com',
            },
            PhoneNumber: {
                DataType: 'String',
                StringValue: '559999999999',
            },
            LastName: {
                DataType: 'String',
                StringValue: 'lastname',
            },
            City: {
                DataType: 'String',
                StringValue: 'Belo Horizonte',
            },
            State: {
                DataType: 'String',
                StringValue: 'MG',
            },
            PostalCode: {
                DataType: 'String',
                StringValue: '99065',
            },
        },

        QueueUrl: SQS_QUEUE_URL,
    };

    return SQS.sendMessage(params).promise();
};

export const getMessages = async (): Promise<
    PromiseResult<AWS.SQS.ReceiveMessageResult, AWS.AWSError>
> => {
    const params: AWS.SQS.Types.ReceiveMessageRequest = {
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ['All'],
        QueueUrl: SQS_QUEUE_URL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 1,
    };

    return SQS.receiveMessage(params).promise();
};

export const deleteMessage = async (receiptHandle: string): Promise<void> => {
    const params: AWS.SQS.Types.DeleteMessageRequest = {
        QueueUrl: SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle,
    };

    await SQS.deleteMessage(params).promise();
};
