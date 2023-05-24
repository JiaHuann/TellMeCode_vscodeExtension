"use strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
require('chatgpt').then(function (chatgpt) {
  var ChatGPTAPI = chatgpt.ChatGPTAPI;
  // rest of the code
});

// async function example() {
// 	const api = new ChatGPTAPI({
// 	  apiKey: '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'
// 	})

// 	const res = await api.sendMessage('Hello World!')
// 	console.log(res.text)
//   }

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
  var disposable = vscode.commands.registerCommand('jiahuan-test.helloWorld', function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    var editor = vscode.window.activeTextEditor;
    if (editor) {
      // 获取当前所选文本对象
      var selection = editor.selection;
      console.log(selection);
      // 获取所选文本的起始和结束位置
      var start = selection.start;
      var end = selection.end;

      // 提取所选文本并输出到控制台
      var selectedText = editor.document.getText(new vscode.Range(start, end));
      console.log(selectedText);
    }
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}
module.exports = {
  activate: activate,
  deactivate: deactivate
};
