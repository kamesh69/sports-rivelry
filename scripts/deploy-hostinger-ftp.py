#!/usr/bin/env python3
"""Deploy TSR WordPress stack to Hostinger via FTP."""

from __future__ import annotations

import argparse
import io
import os
import re
import secrets
import sys
import tempfile
import urllib.request
import zipfile
from ftplib import FTP, error_perm
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MU_LOCAL = ROOT / "wordpress/wp-content/mu-plugins"
# Hostinger FTP lands in /public_html, but the live CMS site is under:
# domains/cms.thesportsrivalry.com/public_html/
REMOTE_ROOT = "domains/cms.thesportsrivalry.com/public_html"
REMOTE_MU = f"{REMOTE_ROOT}/wp-content/mu-plugins"
REMOTE_PLUGINS = f"{REMOTE_ROOT}/wp-content/plugins"
WP_CONFIG = f"{REMOTE_ROOT}/wp-config.php"


def ensure_dir(ftp: FTP, path: str) -> None:
    parts = path.strip("/").split("/")
    cur = ""
    for part in parts:
        cur = f"{cur}/{part}" if cur else part
        try:
            ftp.mkd(cur)
        except error_perm:
            pass


def upload_bytes(ftp: FTP, remote: str, data: bytes) -> None:
    ensure_dir(ftp, "/".join(remote.split("/")[:-1]))
    ftp.storbinary(f"STOR {remote}", io.BytesIO(data))


def upload_file(ftp: FTP, local: Path, remote: str) -> None:
    with local.open("rb") as fh:
        ensure_dir(ftp, "/".join(remote.split("/")[:-1]))
        ftp.storbinary(f"STOR {remote}", fh)


def download_remote(ftp: FTP, remote: str) -> bytes:
    buf = io.BytesIO()
    ftp.retrbinary(f"RETR {remote}", buf.write)
    return buf.getvalue()


def patch_wp_config(content: str, secrets_map: dict[str, str]) -> str:
    block = "\n".join(
        [
            "",
            "// The Sports Rivalry headless CMS",
            f"define('SR_FRONTEND_URL', 'https://www.thesportsrivalry.com');",
            f"define('SR_PREVIEW_SECRET', '{secrets_map['preview']}');",
            f"define('SR_REVALIDATE_ENDPOINT', 'https://www.thesportsrivalry.com/api/revalidate');",
            f"define('SR_REVALIDATE_SECRET', '{secrets_map['revalidate']}');",
            f"define('SR_BOOTSTRAP_SECRET', '{secrets_map['bootstrap']}');",
            "",
        ]
    )

    if "SR_FRONTEND_URL" in content:
        content = re.sub(
            r"\n?// The Sports Rivalry headless CMS[\s\S]*?define\('SR_BOOTSTRAP_SECRET'[^\n]*\);\n?",
            "\n",
            content,
            count=1,
        )

    marker = "/* That's all, stop editing!"
    if marker in content:
        return content.replace(marker, block + marker, 1)

    return content.rstrip() + block


def upload_tree(ftp: FTP, local_dir: Path, remote_dir: str) -> int:
    count = 0
    for path in sorted(local_dir.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(local_dir).as_posix()
        upload_file(ftp, path, f"{remote_dir}/{rel}")
        count += 1
        print(f"  {rel}")
    return count


def install_wp_graphql(ftp: FTP) -> None:
    print("\n=== Download WPGraphQL ===")
    url = "https://downloads.wordpress.org/plugin/wp-graphql.latest-stable.zip"
    with urllib.request.urlopen(url, timeout=120) as resp:
        payload = resp.read()

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        zip_path = tmp_path / "wp-graphql.zip"
        zip_path.write_bytes(payload)
        extract_dir = tmp_path / "extract"
        with zipfile.ZipFile(zip_path) as zf:
            zf.extractall(extract_dir)

        plugin_dir = extract_dir / "wp-graphql"
        if not plugin_dir.is_dir():
            raise RuntimeError("WPGraphQL zip layout unexpected")

        print("=== Upload WPGraphQL plugin ===")
        upload_tree(ftp, plugin_dir, f"{REMOTE_PLUGINS}/wp-graphql")


def deploy_mu_plugins(ftp: FTP) -> int:
    print("=== Upload mu-plugins ===")
    ensure_dir(ftp, REMOTE_MU)
    mu_count = 0
    for path in sorted(MU_LOCAL.glob("*.php")):
        upload_file(ftp, path, f"{REMOTE_MU}/{path.name}")
        print(f"  {path.name}")
        mu_count += 1
    print(f"Uploaded {mu_count} mu-plugin files")
    return mu_count


def main() -> int:
    parser = argparse.ArgumentParser(description="Deploy TSR WordPress files to Hostinger")
    parser.add_argument(
        "--mu-only",
        action="store_true",
        help="Upload mu-plugins only (for CI on push)",
    )
    args = parser.parse_args()

    host = os.environ.get("FTP_HOST", "82.112.239.215")
    user = os.environ["FTP_USER"]
    password = os.environ["FTP_PASS"]

    secrets_map = {
        "revalidate": os.environ.get("REVALIDATE_SECRET") or secrets.token_urlsafe(32),
        "preview": os.environ.get("WORDPRESS_PREVIEW_SECRET") or secrets.token_urlsafe(32),
        "bootstrap": secrets.token_urlsafe(24),
    }

    ftp = FTP(host, timeout=180)
    ftp.login(user, password)
    ftp.set_pasv(True)

    deploy_mu_plugins(ftp)

    if args.mu_only:
        ftp.quit()
        print("\nMu-plugins deploy complete.")
        return 0

    install_wp_graphql(ftp)

    print("\n=== Patch wp-config.php ===")
    wp_config = download_remote(ftp, WP_CONFIG).decode("utf-8", errors="replace")
    patched = patch_wp_config(wp_config, secrets_map)
    upload_bytes(ftp, WP_CONFIG, patched.encode("utf-8"))
    print("  wp-config.php updated")

    ftp.quit()

    secrets_file = ROOT / ".hostinger-deploy-secrets.env"
    secrets_file.write_text(
        "\n".join(
            [
                f"REVALIDATE_SECRET={secrets_map['revalidate']}",
                f"WORDPRESS_PREVIEW_SECRET={secrets_map['preview']}",
                f"SR_BOOTSTRAP_SECRET={secrets_map['bootstrap']}",
                "NEXT_PUBLIC_WORDPRESS_URL=https://cms.thesportsrivalry.com",
                "NEXT_PUBLIC_SITE_URL=https://www.thesportsrivalry.com",
                "",
            ]
        )
    )
    print(f"\nSecrets written to {secrets_file.name}")
    print(f"Bootstrap URL: https://cms.thesportsrivalry.com/?sr_bootstrap={secrets_map['bootstrap']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
