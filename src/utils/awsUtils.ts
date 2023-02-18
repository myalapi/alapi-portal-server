import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
} from "@aws-sdk/client-secrets-manager";
const client = new SecretsManagerClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIA3BJ7GXY2TTULW2SB",
    secretAccessKey: "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",
  },
});
export async function createSecret(secretName: string, creds: Object) {

  let response;

  try {
    response = await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(creds),
      })
    );
  } catch (error:any) {
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
  client.destroy();
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
  client.destroy();
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
  client.destroy();
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
  client.destroy();
  return response.Name;
}
