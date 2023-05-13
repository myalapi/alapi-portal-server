import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const options = {
  apiVersion: "2017-10-17",
  region: process.env.AWS_REGION || "null",
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "null",
    accessKeyId: process.env.AWS_ACCESS_ID || "null",
  },
};

const client = new SecretsManagerClient(options);
export async function createSecret(secretName: string, creds: Object) {

  let response;

  try {
    response = await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(creds),
      })
    );
  } catch (error: any) {
    console.log(error.name);

    if (error.name === "InvalidRequestException") {
      deleteSecret(secretName);
      response = await client.send(
        new CreateSecretCommand({
          Name: secretName,
          SecretString: JSON.stringify(creds),
        })
      );
    } else {
      throw error;
    }
  }
  return response.Name;
}

export async function getSecret(secretName: string) {
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  const secret = response.SecretString;
  return JSON.parse(secret as string);
}

export async function updateSecret(secretName: string, creds: Object) {
  let response;

  try {
    response = await client.send(
      new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: JSON.stringify(creds),
      })
    );
  } catch (error) {
    throw error;
  }
  return response.Name;
}

export async function deleteSecret(secretName: string) {
  let response;
  try {
    response = await client.send(
      new DeleteSecretCommand({
        SecretId: secretName,
        ForceDeleteWithoutRecovery: true,
      })
    );
  } catch (error) {
    throw error;
  }

  // client.destroy();
  return response.Name;
}
