.PHONY: caddy
caddy:
	caddy stop &> /dev/null || true && caddy start --config Caddyfile