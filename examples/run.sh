#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a command name (available: confirm, prompt, styled-header, styled-json, styled-object, table, color-demo)"
  exit 1
fi

COMMAND=$1
shift

if [ ! -f "examples/$COMMAND-command.ts" ]; then
  echo "Command '$COMMAND' not found in examples directory"
  echo "Available commands: confirm, prompt, styled-header, styled-json, styled-object, table, color-demo"
  exit 1
fi

node --loader ts-node/esm "examples/$COMMAND-command.ts" "$@"
