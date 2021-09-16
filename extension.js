const axios = require('axios');
const xmlParser = require('fast-xml-parser');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
  const url = 'https://catalins.tech/rss.xml';
  const res = await axios.get(url);
  const posts = xmlParser.parse(res.data).rss.channel.item.map((post) => {
    const { title, description, link, cover_image } = post;
    return {
      label: title,
      detail: description,
      link: link,
      image: cover_image,
    };
  });

  let disposable = vscode.commands.registerCommand(
    'tech-with-catalin-search.searchTWCBlog',
    async function () {
      const articles = await vscode.window.showQuickPick(posts, {
        matchOnDetail: true,
        title: 'Select a title',
        placeHolder: 'Typing blog post title here...',
      });
      if (articles == null) {
        vscode.window.showInformationMessage(
          'Oooops, did you forget to select a post 😳'
        );
      } else {
        vscode.env.openExternal(articles.link);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
