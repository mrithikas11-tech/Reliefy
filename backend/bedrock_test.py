import boto3

print("Starting Bedrock test...", flush=True)

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
    modelId="us.openai.gpt-6-luna",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": 'Extract this offer as JSON: Restaurant A, 80 meals, $640, ready at 4 PM.'
                }
            ],
        }
    ],
    inferenceConfig={"maxTokens": 200},
)

print("Bedrock response:", flush=True)
print(response["output"]["message"]["content"][0]["text"], flush=True)
