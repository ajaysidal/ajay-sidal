import { exec } from "child_process";

export function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { shell: "/bin/bash" }, (error, stdout, stderr) => {
      if (error) {
        resolve(`Error: ${stderr || error.message}`);
      } else {
        resolve(stdout || "Command executed.");
      }
    });
  });
}
