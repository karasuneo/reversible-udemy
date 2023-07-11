import fs from "fs";
import util from "util";

const promisifyReadFile = util.promisify(fs.readFile);

async function main() {
  const data = await promisifyReadFile("../package.json");
  const fileContent = data.toString();
  console.log(fileContent);

  //   const readFilePromise = promisifyReadFile("../package.json");

  //   readFilePromise.then((data) => {
  //     const fileContent = data.toString();
  //     console.log(fileContent);
  //   });

  //   ここから
  //   let fileContent: string = "Not loaded";

  //   fs.readFile("../package.json", (err, data) => {
  //     fileContent = data.toString();
  //     console.log(fileContent);
  //   });

  //   console.log(fileContent);
}

main();
