#!/bin/bash
cd /home/kavia/workspace/code-generation/streamview-platform-221742/streaming_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

