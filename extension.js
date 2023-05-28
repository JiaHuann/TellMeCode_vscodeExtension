// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { Configuration, OpenAIApi } = require("openai");

let disposable;
let configuration, openai;
const TIMEOUT_MS = 40000;		//超时响应
var busy = 0;					//一次只能提交一个
const prompt = "你是一个叫TellMeCode的机器人,请你结合我发送的代码路径,分析我给你发的具体的代码,以这样的格式输出:整体作用:xxxxxx(换行),[1](输出第一行具体代码原文):作用是xxx(换行),[2](输出第二行具体代码原文):作用是xxx(换行),以此类推，注意结合目录路径去推测分析这段代码在整个项目中的作用，注意输出格式，注意序号后面首先跟每一行代码内容然后再输出作用，不要有任何别的东西，另外如果你发现了这是资料很多的知名项目，请在最后输出这段代码在整个项目里的作用，如果你确定的话。";

//配置GPT
function GPTConfigure(orgCode, apiToken) {
	configuration = new Configuration({
		organization: orgCode,
		apiKey: apiToken,
	});

	openai = new OpenAIApi(configuration);

}

//生成Hover面板 聚焦文字显示
function registerHoverProvider(textt, selection) {
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


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('TellMeCode.helloWorld', async function () {
		if (busy) {
			vscode.window.showInformationMessage("不要一次提交太多请求喵呜！");
			return;
		}

		const apiToken = context.globalState.get('apiToken');
		const orgCode = context.globalState.get('orgCode');
		GPTConfigure(orgCode, apiToken);
		//console.log(apiToken, orgCode);

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		let Text = ""


		//获取 选中代码相对于项目文件夹路径（包含）
		try {
			// 获取当前选中文本所在文件的路径
			const selectedFilePath = editor.document.fileName;

			// 获取当前工作区的根文件夹路径
			const workspaceFolderPath = vscode.workspace.rootPath;
			//console.log(workspaceFolderPath);

			// 提取当前工作区的根文件夹名称
			var FolderName = workspaceFolderPath ? workspaceFolderPath.split('\\').pop() : "";
			//console.log(FolderName)

			// 提取当前选中文本所在文件的相对路径
			var relativeFilePath = selectedFilePath.replace(workspaceFolderPath, "");

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
			//console.log("An error occurred: ", error.message);
		}


		//获取 选中代码文本
		const start = selection.start;
		const end = selection.end;
		const selectedText = editor.document.getText(new vscode.Range(start, end));
		if (!selectedText) {
			vscode.window.showInformationMessage("选中文本为空！");
			return;
		}
		Text = selectedText;

		//console.log(Text);

		//发送请求
		try {
			const completionPromise = openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				max_tokens: 1000,
				messages: [
					{ "role": "system", "content": `${prompt}` },
					{ "role": "user", "content": "这段代码的路径是" + `${FolderName}\\${relativeFilePath}` + "代码如下:" + `${Text}` }
				]
			});
			
			const timeoutPromise = new Promise((resolve, reject) => {
				setTimeout(() => {
					reject(new Error("Operation timed out."));
				}, TIMEOUT_MS);
			});

			busy = 1;
			registerHoverProvider("Loading...稍等片刻喵~", selection);
			const completion = await Promise.race([completionPromise, timeoutPromise]);
			//console.log(completion.data.choices[0].message.content);

			registerHoverProvider(completion.data.choices[0].message.content, selection);
			vscode.window.showInformationMessage('生成完毕！');
			busy = 0;
		} catch (error) {
			busy = 0;
			//超时处理
			if (error instanceof Error && error.message === 'Operation timed out.')
				vscode.window.showInformationMessage("选中文本为空！");

			//console.log(error.response.data.error);
			vscode.window.showInformationMessage('api返回报错:[' + error.response.data.error.type + ']'
				+ error.response.data.error.message + ", "
				+ "[code]:"
				+ error.response.data.error.code);

			if (error.response.data.error.code == "invalid_api_key") {
				vscode.window.showInformationMessage('是不是apikey输错了?');
			}
		}


	});

	//设置apiToken
	let set_apitoken = vscode.commands.registerCommand('TellMeCode.set-apitoken', async function () {
		var apiToken = await vscode.window.showInputBox({
			prompt: 'Input Your OWN OPANAI_Token',
		});
		context.globalState.update('apiToken', apiToken);
	})

	//设置orgCode
	let set_orgtoken = vscode.commands.registerCommand('TellMeCode.set-orgCode', async function () {
		var orgCode = await vscode.window.showInputBox({
			prompt: 'Input Your OWN OPANAI_ORG code',
		});
		context.globalState.update('orgCode', orgCode);
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(set_apitoken);
	context.subscriptions.push(set_orgtoken);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}


