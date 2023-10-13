// @ts-check

const assert = require("assert");
const child_process = require("child_process");

const cliHelp =
  "Usage: rescript <options> <subcommand>\n" +
  "\n" +
  "`rescript` is equivalent to `rescript build`\n" +
  "\n" +
  "Options:\n" +
  "  -v, -version  display version number\n" +
  "  -h, -help     display help\n" +
  "\n" +
  "Subcommands:\n" +
  "  build\n" +
  "  clean\n" +
  "  format\n" +
  "  convert\n" +
  "  dump\n" +
  "  help\n" +
  "\n" +
  "Run `rescript <subcommand> -h` for subcommand help. Examples:\n" +
  "  rescript build -h\n" +
  "  rescript format -h\n" +
  "The default `rescript` is equivalent to `rescript build` subcommand\n" +
  "\n";

const buildHelp =
  "Usage: rescript build <options> -- <ninja_options>\n" +
  "\n" +
  "`rescript build` builds the project with dependencies\n" +
  "\n" +
  "`rescript -- -h` for Ninja options (internal usage only; unstable)\n" +
  "\n" +
  "Options:\n" +
  "  -w          Watch mode\n" +
  "  -ws         [host]:port set up host & port for WebSocket build notifications\n" +
  "  -verbose    Set the output to be verbose\n" +
  "  -with-deps  *deprecated* This is the default behavior now. This option will be removed in a future release\n";

const cleanHelp =
  "Usage: rescript clean <options>\n" +
  "\n" +
  "`rescript clean` cleans build artifacts\n" +
  "\n" +
  "Options:\n" +
  "  -verbose    Set the output to be verbose\n" +
  "  -with-deps  *deprecated* This is the default behavior now. This option will be removed in a future release\n";

const formatHelp =
  "Usage: rescript format <options> [files]\n" +
  "\n" +
  "`rescript format` formats the current directory\n" +
  "\n" +
  "Options:\n" +
  "  -stdin  [.res|.resi|.ml|.mli] Read the code from stdin and print\n" +
  "          the formatted code to stdout in ReScript syntax\n" +
  "  -all    Format the whole project \n" +
  "  -check  Check formatting for file or the whole project. Use `-all` to check the whole project\n";

const convertHelp =
  "Usage: rescript convert <options> [files]\n" +
  "\n" +
  "`rescript convert` converts the current directory\n" +
  "\n" +
  "**This command removes old OCaml files and creates new ReScript \n" +
  "files. Make sure your work is saved first!**\n" +
  "\n" +
  "Options:\n" +
  "  -all  Convert the whole project\n";

const dumpHelp =
  "Usage: rescript dump <options> [target]\n" +
  "`rescript dump` dumps the information for the target\n";

// Shows build help with --help arg
let out = child_process.spawnSync(`../../../rescript`, ["build", "--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, buildHelp);

// Shows build help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["build", "-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, buildHelp);

// Exits with build help with unknown arg
out = child_process.spawnSync(`../../../rescript`, ["build", "-wtf"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stderr, "Error: unknown option: '-wtf'.\n" + buildHelp + "\n");

// Shows cli help with --help arg
out = child_process.spawnSync(`../../../rescript`, ["--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, cliHelp);

// Shows cli help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, cliHelp);

// Shows cli help with help command
out = child_process.spawnSync(`../../../rescript`, ["help"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, cliHelp);

// Shows cli help with unknown command
out = child_process.spawnSync(`../../../rescript`, ["built"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Should write to stderr instead ???
assert.equal(out.stdout, cliHelp);

// Shows cli help with unknown args
out = child_process.spawnSync(`../../../rescript`, ["-w"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Should write to stderr instead ???
assert.equal(out.stdout, cliHelp);

// Shows clean help with --help arg
out = child_process.spawnSync(`../../../rescript`, ["clean", "--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, cleanHelp);

// Shows clean help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["clean", "-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stdout, cleanHelp);

// Exits with clean help with unknown arg
out = child_process.spawnSync(`../../../rescript`, ["clean", "-wtf"], {
  encoding: "utf8",
  cwd: __dirname,
});
assert.equal(out.stderr, "Error: unknown option: '-wtf'.\n" + cleanHelp + "\n");

// Shows format help with --help arg
out = child_process.spawnSync(`../../../rescript`, ["format", "--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, formatHelp);

// Shows format help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["format", "-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, formatHelp);

// Shows convert help with --help arg
out = child_process.spawnSync(`../../../rescript`, ["convert", "--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, convertHelp);

// Shows convert help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["convert", "-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, convertHelp);

// Shows dump help with --help arg
out = child_process.spawnSync(`../../../rescript`, ["dump", "--help"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, dumpHelp);

// Shows dump help with -h arg
out = child_process.spawnSync(`../../../rescript`, ["dump", "-h"], {
  encoding: "utf8",
  cwd: __dirname,
});
// Note: it writes to stderr
assert.equal(out.stderr, dumpHelp);
