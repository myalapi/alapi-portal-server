import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
} from "@aws-sdk/client-secrets-manager";

export async function createSecret(secretName: string, creds: Object) {
  const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA3BJ7GXY2TS7PRQKZ",
      secretAccessKey: "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",
    },
  });
  let response;

  try {
    response = await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(creds),
      })
    );
  } catch (error) {
    throw error;
  }
  client.destroy();
  return response.Name;
}

export async function getSecret(secretName: string) {
  const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA3BJ7GXY2TS7PRQKZ",
      secretAccessKey: "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",
    },
  });
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
  const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA3BJ7GXY2TS7PRQKZ",
      secretAccessKey: "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",
    },
  });
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
  const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA3BJ7GXY2TS7PRQKZ",
      secretAccessKey: "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",
    },
  });
  let response;

  try {
    response = await client.send(
      new DeleteSecretCommand({
        SecretId: secretName,
      })
    );
  } catch (error) {
    throw error;
  }
  client.destroy();
  return response.Name;
}
