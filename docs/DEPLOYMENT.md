# ZaPrazi 2.0 deployment path

## Primary path

The intended deployment path mirrors Solar Expert:

`GitHub repo → dev branch → Deployer for Git → inactive/test WordPress theme → manual activation after smoke`

WPVibe is not the primary deployment mechanism. It is optional diagnostics/readback.

## Repository layout

The repository root is a valid classic WordPress theme:
- `style.css`
- `functions.php`
- `header.php`
- `footer.php`
- `front-page.php`
- `index.php`
- `single.php`
- `page.php`

This allows Deployer for Git to install the **repository root** as a theme, matching the Solar Expert setup.

## Branches

- `main` — stable reviewed code
- `dev` — WordPress deployment/testing branch

Do not point the deployment plugin at a nested theme folder. Repository path/root should be `/` or `.`.

## Safety

Current production Flatsome remains untouched until:
1. ZaPrazi 2.0 theme is installed separately,
2. preview/staging smoke passes,
3. relevant legacy rendering is checked,
4. user deliberately activates the new theme.

Never overwrite Flatsome in place.

## Deployer for Git

The WordPress.org plugin supports GitHub and does not require Git installed on the server.

Important licensing boundary as of 2026-10-06:
- public repository: free version can be used,
- private repository: plugin documentation says Pro is required.

ZaPrazi repo is currently private. Therefore exact free Solar Expert-style deployment requires either:
- changing `Rastty/zaprazi-2` to public, or
- using Deployer for Git Pro while keeping it private.

Do not commit tokens or WordPress credentials into this repository.
