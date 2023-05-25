// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { Configuration, OpenAIApi } = require("openai");
const { Selection } = require('vscode');
const dotenv = require("dotenv").config({ path: __dirname + '/.env' })

console.log(process.env.OPENAI_ORG)
const configuration = new Configuration({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

let disposable;

function registerHoverProvider(textt,selection) {
  if (disposable) {
    disposable.dispose();
  }

  disposable = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position, token) {
      const range = new vscode.Range(selection.start, selection.end);
      const text = textt;

      return new vscode.Hover(text);
    }
  });
}

var busy = 0;
const prompt = "你是一个叫TellMeCode的机器人，请你结合我发送的代码路径，分析我给你发的具体的代码，以这样的格式输出：整体作用：xxxxxx（换行），[1]（输出第一行具体代码原文）：作用是xxx（换行），[2]（输出第二行具体代码原文）：作用是xxx（换行），以此类推，注意结合目录路径去推测分析这段代码在整个项目中的作用，注意输出格式，注意序号后面首先跟每一行代码内容然后再输出作用，不要有任何别的东西，另外如果你发现了这是资料很多的知名项目，请在最后输出这段代码在整个项目里的作用，如果你确定的话。";



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jiahuan-test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jiahuan-test.helloWorld', async function () {
		
		if(busy){
			vscode.window.showInformationMessage("不要一次提交太多请求喵呜！");
			return;
		}
		
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		var FolderName = "";
		var relativeFilePath = "";
		try {

			var Test = ""
			// 获取当前选中文本所在文件的路径
			const selectedFilePath = editor.document.fileName;

			// 获取当前工作区的根文件夹路径
			const workspaceFolderPath = vscode.workspace.rootPath;
			//console.log(workspaceFolderPath);

			// 提取当前工作区的根文件夹名称
			FolderName = workspaceFolderPath ? workspaceFolderPath.split('\\').pop() : "";
			//console.log(FolderName)

			// 提取当前选中文本所在文件的相对路径
			relativeFilePath = selectedFilePath.replace(workspaceFolderPath, "");

			// 去掉相对路径前面的斜杠,否则拼接的时候会错误的解释relativeFilePath
			if (relativeFilePath.startsWith("/") || relativeFilePath.startsWith("\\")) {
				relativeFilePath = relativeFilePath.substring(1);
			}

			// 检查变量是否为空，如果为空则抛出异常
			if (!editor || !selectedFilePath || !workspaceFolderPath || !FolderName) {
				throw new Error("One or more variables are null or undefined.");
			}

			// 创建一个信息提示框，显示包含项目目录名称的当前选中文本所在文件的相对路径
			vscode.window.showInformationMessage(`The selected file path is ${FolderName}\\${relativeFilePath}`);
		} catch (error) {
			console.log("An error occurred: ", error.message);
		}



		if (editor) {
			const start = selection.start;
			const end = selection.end;
			const selectedText = editor.document.getText(new vscode.Range(start, end));
			console.log(selectedText);
			Test = selectedText;
		}


		try {
			console.log(Test)
			registerHoverProvider("正在加载中Loading---",selection);
			busy = 1;
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				max_tokens: 1000,
				messages: [
					{ "role": "system", "content": `${prompt}` },
					{ "role": "user", "content": "这段代码的路径是"+`${FolderName}\\${relativeFilePath}`+"代码如下:"+`${Test}` }
				]
			});
			
			console.log(completion.data.choices[0].message.content);

			registerHoverProvider(completion.data.choices[0].message.content,selection);
			busy = 0;
		} catch (error) {
			if (error.response) {
				console.log(error.response.status);
				console.log(error.response.data);
				registerHoverProvider(error.response.data.error + error.response.data.error);
			} else {
				console.log(error.message);
			}
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}


