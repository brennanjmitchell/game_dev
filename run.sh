#!/bin/bash

PORT=8080

# Function to start http-server
start_http_server() {
    if command -v http-server &> /dev/null
    then
        echo "http-server is not installed. Installing http-server..."
        npm install -g http-server
    fi

    echo "Starting http-server on port $PORT..."
    http-server -p $PORT &
}

# Function to open the default web browser
open_browser() {
    echo "Opening web browser to http://localhost:$PORT"
    open "http://localhost:$PORT"
}

start_http_server
open_browser