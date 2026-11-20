import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const routes = [
  "front-page.php",
  "page-choditka-pro-seniory.php",
  "page-choditko-do-bytu-pro-seniory.php",
  "page-rollator-pro-seniory.php",
  "page-co-zmerit-pred-vyberem-choditka.php",
  "page-choditko-na-pojistovnu.php",
  "page-pujceni-choditka.php"
];

test("only seven explicit HTML-rendered Mobility entry templates can drop unused core block CSS", () => {
  const source = read("functions.php");
  const section = source.match(/function zaprazi_2_dequeue_unused_mobility_block_css\(\) \{([\s\S]*?)\n\}\nadd_action\(/)?.[1];
  assert.ok(section, "dequeue callback must be registered from source");
  assert.match(source, /add_action\( 'wp_enqueue_scripts', 'zaprazi_2_dequeue_unused_mobility_block_css', 1000 \)/);
  assert.match(section, /is_admin\(\).*is_preview\(\).*is_customize_preview\(\).*is_feed\(\)/);
  assert.match(section, /get_page_template_slug\( \$page_id \) !== \$templates\[ \$slug \]/);
  assert.equal((section.match(/wp_dequeue_style\( 'wp-block-library' \)/g) || []).length, 2);
  assert.doesNotMatch(section, /wp_deregister_style|wp_dequeue_script|wp_enqueue_style/);
  for (const file of routes) {
    assert.doesNotMatch(read(file), /\b(?:the_content|do_blocks|render_block)\s*\(/,
      `${file} may render Gutenberg and must not lose block styling`);
  }
  for (const template of routes.slice(1)) {
    assert.ok(section.includes("'" + template + "'"), `${template} missing exact template pin`);
  }
  // The public third-party/legacy post can still contain genuine WP blocks.
  assert.match(section, /if \( ! is_page\(\) \)/);
});

const phpAvailable = spawnSync("php", ["-v"], {encoding:"utf8"}).status === 0;
test("PHP runtime behavior removes only the seven source-bound styles", {
  skip: phpAvailable ? false : "PHP is absent locally; GitHub CI runs this test with PHP installed"
}, () => {
  const run = spawnSync("php", ["tests/mobility-block-css-239.php"], {
    encoding: "utf8", timeout: 10000
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.match(run.stdout, /PASS: bounded block stylesheet dequeue/);
});
