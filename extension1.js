let disposable = vscode.commands.registerCommand('jiahuan-test.helloWorld', async function () {

    vscode.languages.registerHoverProvider('*', {
      provideHover(document, position, token) {
        const range = new vscode.Range(selection.start, selection.end);
        const text = completion.data.choices[0].message.content;

        return new vscode.Hover(text);
      }
    });

  }
});

context.subscriptions.push(disposable);
}