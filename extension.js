// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	organization: "org-pgiAijovDjEKtXXWqSqCy8pu",
	apiKey: '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',
});
const openai = new OpenAIApi(configuration);

var Test = ""

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
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// 获取当前所选文本对象
			const selection = editor.selection;
			console.log(selection);
			// 获取所选文本的起始和结束位置
			const start = selection.start;
			const end = selection.end;

			// 提取所选文本并输出到控制台
			const selectedText = editor.document.getText(new vscode.Range(start, end));
			console.log(selectedText);
			Test = selectedText
		}


		try {
			console.log(Test)
			const completion = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				max_tokens: 1000,
				messages:[
					{"role": "system", "content": "你现在在帮一个用户分析源码，请你简介清晰不要说多余的废话回答，并以这样的格式输出，整体作用：xxx换行，（第一行代码内容）:作用是xxx换行,（第二行代码内容）:作用是xxxx换行"},
					{"role": "user", "content": `${Test}`}
				]
			});
			console.log(completion.data.choices[0].message.content);
		} catch (error) {
			if (error.response) {
				console.log(error.response.status);
				console.log(error.response.data);
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
