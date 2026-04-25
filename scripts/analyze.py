#!/usr/bin/env python3
"""
Simple wrapper to call voice_agent_website_analysis directly.
Called from Next.js API route via subprocess.
Runs from the MCP server directory to use its dependencies.
"""
import sys
import json
import os
import asyncio

# Change to MCP server directory
MCP_SERVER_DIR = '/Users/andreaskaravanas/Documents/Claude Code/voice-mcp-server-liberators'
os.chdir(MCP_SERVER_DIR)
sys.path.insert(0, MCP_SERVER_DIR)

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(MCP_SERVER_DIR, '.env'))

# Import after changing directory and loading env
from voice_agent_mcp_server import voice_agent_website_analysis, send_report_to_email

async def run_analysis(url: str) -> str:
    """Run analysis - handle both sync and async functions"""
    result = voice_agent_website_analysis(url)
    if asyncio.iscoroutine(result):
        return await result
    return result

async def run_send_report(email: str) -> str:
    """Run send report - handle both sync and async functions"""
    result = send_report_to_email(email)
    if asyncio.iscoroutine(result):
        return await result
    return result

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: analyze.py <action> <param>"}))
        sys.exit(1)

    action = sys.argv[1]
    param = sys.argv[2]

    try:
        if action == "analyze":
            result = asyncio.run(run_analysis(param))
            print(json.dumps({"success": True, "result": result}))
        elif action == "send_report":
            result = asyncio.run(run_send_report(param))
            print(json.dumps({"success": True, "result": result}))
        else:
            print(json.dumps({"error": f"Unknown action: {action}"}))
            sys.exit(1)
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
