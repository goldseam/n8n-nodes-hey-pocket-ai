# n8n-nodes-hey-pocket-ai

This is an n8n community node. It lets you use [Pocket AI](https://heypocket.com) in your n8n workflows.

Hey Pocket AI is an AI-powered meeting and recording assistant that captures, transcribes, and summarizes your audio recordings.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Recording

- **Get Many**: Retrieve a paginated list of recordings with optional filtering by date range and tags
- **Get**: Retrieve a single recording with full details, including optional transcript and summarizations
- **Get Audio URL**: Generate a pre-signed URL for downloading the audio file

### Tag

- **Get Many**: Retrieve all tags with their usage counts

### Action Item

- **Get Many**: Extract AI-generated action items from recordings' summarizations

## Credentials

To use this node, you need a Hey Pocket AI API access token.

1. Sign up for a [Hey Pocket AI](https://heypocketai.com) account
2. Generate an API access token from your account settings
3. In n8n, create new credentials of type "Hey Pocket AI API"
4. Enter your access token

## Compatibility

Tested with n8n version 1.x.

## Usage

### Filtering Recordings

When using the "Get Many" operation for recordings, you can filter by:

- **Date range**: Specify start and end dates in YYYY-MM-DD format (UTC)
- **Tags**: Provide comma-separated tag IDs to filter by specific tags

### Including Additional Data

When retrieving a single recording with the "Get" operation, you can choose to include:

- **Transcript**: The full transcript of the recording
- **Summarizations**: AI-generated summaries of the recording content

### Audio Downloads

The "Get Audio URL" operation generates a pre-signed S3 URL. You can configure:

- **Expiration time**: How long the URL remains valid (60 to 86400 seconds, default: 3600)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Hey Pocket AI](https://heypocketai.com)

## Version history

## [0.1.0](https://github.com/goldseam/n8n-nodes-hey-pocket-ai/compare/v0.0.1...v0.1.0) (2026-01-25)

### Features

- create tag & recording resources ([41f6dba](https://github.com/goldseam/n8n-nodes-hey-pocket-ai/commit/41f6dbac5ddc114826cc89162e8d99c919f7f6e1))

### 0.0.1

Initial release with support for:

- Recording operations (Get Many, Get, Get Audio URL)
- Tag operations (Get Many)
