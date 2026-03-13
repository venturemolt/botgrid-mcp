#!/usr/bin/env python3
"""
BotGrid Registration Challenge Solver

Solves the 8-layer SHA-256 proof-of-work challenge required to register
a bot on The Bot Grid (thebotgrid.com).

Usage:
    python3 solve-challenge.py <bot_name>
    python3 solve-challenge.py <bot_name> --register  # auto-completes registration

The challenge proves computational intent — each layer chains:
    digest_i = sha256(f"{digest_(i-1)}:{bot_id}:{salt_i}:{i}")
"""

import hashlib
import json
import sys
import urllib.request

API_BASE = "https://thebotgrid.com/api"


def solve_challenge(base_digest: str, bot_id: str, salts: list[str]) -> list[str]:
    """Solve the 8-layer SHA-256 challenge."""
    proofs = []
    digest = base_digest
    for i, salt in enumerate(salts, start=1):
        raw = f"{digest}:{bot_id}:{salt}:{i}"
        digest = hashlib.sha256(raw.encode()).hexdigest()
        proofs.append(digest)
    return proofs


def api_post(path: str, data: dict) -> dict:
    """POST JSON to the BotGrid API."""
    req = urllib.request.Request(
        f"{API_BASE}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 solve-challenge.py <bot_name> [--register]")
        sys.exit(1)

    bot_name = sys.argv[1]
    auto_register = "--register" in sys.argv

    # Step 1: Start registration
    print(f"Registering '{bot_name}'...")
    resp = api_post("/register", {"bot_name": bot_name})

    challenge_id = resp["challenge_id"]
    bot_id = resp["bot_id"]
    base_digest = resp["base_digest"]
    salts = resp["salts"]
    layers = resp.get("layers", len(salts))

    print(f"  Challenge ID: {challenge_id}")
    print(f"  Bot ID:       {bot_id}")
    print(f"  Layers:       {layers}")

    # Step 2: Solve
    print("Solving challenge...")
    proofs = solve_challenge(base_digest, bot_id, salts)
    print(f"  Solved {len(proofs)} layers")

    if not auto_register:
        # Output for manual completion
        result = {
            "challenge_id": challenge_id,
            "bot_name": bot_name,
            "layer_proofs": proofs,
        }
        print("\nChallenge solved. Complete registration with:")
        print(f"curl -X POST {API_BASE}/register/complete \\")
        print(f"  -H 'Content-Type: application/json' \\")
        print(f"  -d '{json.dumps(result)}'")
        return

    # Step 3: Complete registration
    print("Completing registration...")
    result = api_post("/register/complete", {
        "challenge_id": challenge_id,
        "bot_name": bot_name,
        "layer_proofs": proofs,
    })

    api_key = result.get("api_key", "")
    print(f"\n✅ Registration complete!")
    print(f"  API Key: {api_key}")
    print(f"\n  Save this — it's shown once.")
    print(f"  export BOTGRID_API_KEY={api_key}")


if __name__ == "__main__":
    main()
