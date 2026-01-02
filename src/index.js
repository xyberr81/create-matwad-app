import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import { red, green, bold, blue, cyan } from "kolorist";
import { Command } from "commander";
import fse from "fs-extra";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run() {
  const program = new Command();
  let projectName;

  program
    .name("create-matwad-app")
    .arguments("[project-name]")
    .usage("[project-name] [options]")
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv);

  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "matwad-app",
    });
    projectName = response.projectName;
  }

  if (!projectName) {
    console.log(red("Operation cancelled"));
    return;
  }

  const root = path.join(process.cwd(), projectName);

  if (fs.existsSync(root)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `Target directory "${projectName}" is not empty. Remove existing files and continue?`,
    });

    if (!overwrite) {
      console.log(red("Operation cancelled"));
      return;
    }

    await fse.emptyDir(root);
  } else {
    fs.mkdirSync(root, { recursive: true });
  }

  console.log(`Scaffolding project in ${bold(root)}...`);

  const templateDir = path.resolve(__dirname, "../templates");
  const serverTemplate = path.join(templateDir, "server");
  const clientTemplate = path.join(templateDir, "client");

  // 1. Scaffold Server
  const serverDir = path.join(root, "server");
  console.log(`\n${blue(bold("Setting up Server..."))}`);
  await fse.copy(serverTemplate, serverDir);

  // Rename _gitignore to .gitignore
  const gitignorePath = path.join(serverDir, "_gitignore");
  if (fse.existsSync(gitignorePath)) {
    await fse.move(gitignorePath, path.join(serverDir, ".gitignore"));
  }

  // Rename _env.local to .env.local
  const envPath = path.join(serverDir, "_env.local");
  if (fse.existsSync(envPath)) {
    await fse.move(envPath, path.join(serverDir, ".env.local"));
  }

  // Update server package.json name
  const serverPkgPath = path.join(serverDir, "package.json");
  const serverPkg = await fse.readJson(serverPkgPath);
  serverPkg.name = `${projectName}-server`;
  await fse.writeJson(serverPkgPath, serverPkg, { spaces: 2 });

  console.log(cyan("Installing server dependencies..."));
  await runCommand("npm", ["install"], { cwd: serverDir });

  // 2. Scaffold Client
  const clientDir = path.join(root, "client");
  console.log(`\n${blue(bold("Setting up Client..."))}`);

  // Run create-vite
  // We use --yes to skip confirmation if needed, and --template react for JS
  console.log(cyan("Running create-vite..."));
  await runCommand(
    "npm",
    [
      "create",
      "vite@latest",
      "client",
      "--",
      "--template",
      "react",
      "--no-interactive",
      "--no-rolldown",
    ],
    { cwd: root }
  );

  // Overwrite with Client Template
  console.log(cyan("Applying generic template overrides..."));
  await fse.copy(clientTemplate, clientDir, { overwrite: true });

  // Update client package.json name
  const clientPkgPath = path.join(clientDir, "package.json");
  const clientPkg = await fse.readJson(clientPkgPath);
  clientPkg.name = `${projectName}-client`;
  await fse.writeJson(clientPkgPath, clientPkg, { spaces: 2 });

  // Cleanup default Vite files
  const appCssPath = path.join(clientDir, "src/App.css");
  if (fse.existsSync(appCssPath)) {
    await fse.remove(appCssPath);
  }

  // 3. Initialize Shadcn
  console.log(`\n${blue(bold("Initializing Shadcn (Interactive)..."))}`);
  console.log(cyan("Please follow the prompts to configure shadcn/ui:"));

  console.log(cyan("Installing base client dependencies..."));
  await runCommand("npm", ["install"], { cwd: clientDir });

  // Run shadcn init
  await runCommand("npx", ["shadcn@latest", "init"], {
    cwd: clientDir,
    stdio: "inherit",
  });

  console.log(`\n${green("Success!")} Created ${bold(projectName)} at ${root}`);
  console.log("\nNext steps:");
  console.log(`  cd ${projectName}`);
  console.log("\n  To start the server:");
  console.log(`    cd server`);
  console.log(`    npm run dev`);
  console.log("\n  To start the client:");
  console.log(`    cd client`);
  console.log(`    npm run dev`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Command ${command} ${args.join(" ")} failed with code ${code}`
          )
        );
        return;
      }
      resolve();
    });
  });
}
