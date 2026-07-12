#!/usr/bin/env python3
"""Set GitHub Actions repository secrets via API (libsodium sealed box)."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from base64 import b64encode

from nacl import encoding, public

OWNER = "kamesh69"
REPO = "sports-rivelry"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"


def api_request(method: str, path: str, token: str, body: dict | None = None) -> dict:
    url = f"{API}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "tsr-deploy-script",
            **({"Content-Type": "application/json"} if data else {}),
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else {}


def encrypt_secret(public_key_b64: str, secret_value: str) -> str:
    pk = public.PublicKey(public_key_b64.encode("utf-8"), encoding.Base64Encoder())
    sealed = public.SealedBox(pk).encrypt(secret_value.encode("utf-8"))
    return b64encode(sealed).decode("utf-8")


def set_secret(token: str, name: str, value: str, key_id: str, key_b64: str) -> None:
    encrypted = encrypt_secret(key_b64, value)
    api_request(
        "PUT",
        f"/actions/secrets/{name}",
        token,
        {"encrypted_value": encrypted, "key_id": key_id},
    )
    print(f"Set secret: {name}")


def dispatch_workflow(token: str, workflow_file: str, ref: str = "main") -> None:
    api_request(
        "POST",
        f"/actions/workflows/{workflow_file}/dispatches",
        token,
        {"ref": ref},
    )
    print(f"Triggered workflow: {workflow_file} on {ref}")


def main() -> int:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("Set GITHUB_TOKEN", file=sys.stderr)
        return 1

    secrets = {
        "FTP_HOST": os.environ.get("FTP_HOST", "82.112.239.215"),
        "FTP_USER": os.environ.get("FTP_USER", ""),
        "FTP_PASS": os.environ.get("FTP_PASS", ""),
    }
    missing = [k for k, v in secrets.items() if not v]
    if missing:
        print(f"Missing env: {', '.join(missing)}", file=sys.stderr)
        return 1

    key_data = api_request("GET", "/actions/secrets/public-key", token)
    key_id = key_data["key_id"]
    key_b64 = key_data["key"]

    for name, value in secrets.items():
        set_secret(token, name, value, key_id, key_b64)

    dispatch_workflow(token, "deploy-wordpress.yml")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
