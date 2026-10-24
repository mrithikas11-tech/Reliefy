"""Amazon Bedrock integration placeholder.

Use boto3 with your approved AWS profile/SSO session.
Do not hard-code access keys or expose credentials to the frontend.
"""
import os
import boto3


def get_bedrock_runtime():
    region = os.getenv("AWS_REGION", "us-east-1")
    profile = os.getenv("AWS_PROFILE", "reliefy")
    session = boto3.Session(profile_name=profile, region_name=region)
    return session.client("bedrock-runtime")


def parse_restaurant_message(message: str) -> dict:
    """TODO: Call Bedrock Converse and validate the response against offer_schema.py."""
    raise NotImplementedError("Connect Bedrock after the mock workflow is working.")
