#!/usr/bin/env bash
set -euo pipefail
mkdir -p assets
download() {
  local target="$1" url="$2"
  if [ -s "$target" ]; then
    echo "Already stored: $target"
    return
  fi
  echo "Downloading photograph: $target"
  curl --fail --location --show-error --silent --retry 3 --retry-delay 2 --max-time 45 \
    --user-agent "Mozilla/5.0 (compatible; NeuroQuest Educational Quest)" \
    "$url" --output "$target"
  test "$(wc -c < "$target")" -gt 4000
  case "$(file -b --mime-type "$target")" in image/jpeg|image/png|image/webp) ;; *) echo "Invalid image data: $target"; exit 1;; esac
}
download assets/real_cat.jpg "https://images.unsplash.com/photo-1573865526739-10659fec78a5?fm=jpg&w=700&q=75&fit=crop"
download assets/real_astronaut.jpg "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?fm=jpg&w=700&q=75&fit=crop"
download assets/real_rocket.jpg "https://images.unsplash.com/photo-1517976487492-5750f3195933?fm=jpg&w=700&q=75&fit=crop"
download assets/real_coffee.jpg "https://images.unsplash.com/photo-1442512595331-e89e73853f31?fm=jpg&w=700&q=75&fit=crop"
echo "All photographs are available"
