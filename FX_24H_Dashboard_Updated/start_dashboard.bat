@echo off
title FX 24H Cycle Dashboard Server (Port 8080)
echo Starting local HTTP server at http://localhost:8080 ...
echo Keep this window open while using two-way CSV binding.
start "" http://localhost:8080
python -m http.server 8080
pause
