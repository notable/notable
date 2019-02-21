# Contributing

Please note that this project is released with a [Code of Conduct](https://github.com/fabiospampinato/notable/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How can I contribute?

### Submit an issue

Submitting an issue, be it a bug report or a feature request, is one of the best ways to contribute to this project. Checking if everything works in your system and if the [latest commits](https://github.com/fabiospampinato/notable/commits/master) work properly for you are both good ways to find bugs.

Please search existing issues to avoid creating duplicates, we'd rather work on improving Notable than deal with duplicates.

### Improve issues

Some issues are created with missing information ([`needs more info`](https://github.com/fabiospampinato/notable/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+label%3A%22needs+more+info%22)), are not reproducible, or are plain duplicates. Help us finding reproducible steps and closing duplicates.

### Comment on issues

We are always looking for more opinions, leaving a comment in the issue tracker is a good opportunity to influence the future direction of Notable.

We also consider the number of ":+1:" an issue has when deciding if we are going to work on it in the [Next milestone](https://github.com/fabiospampinato/notable/milestone/1) or not, so be sure to add your ":+1:" to the issues you're most interested in.

### Join the subreddit

We have a [subreddit](https://www.reddit.com/r/notable). Feel free to join us there, discussions not strictly related to the issue tracker are done there.

### Join the Patreon

At least until Notable becomes self-sustaining I plan to maintain a [Patreon page](https://www.patreon.com/fabiospampinato), feel free to support me there.

### Submit a pull request

Pull requests are especially welcome for issues labeled as [`bug`](https://github.com/fabiospampinato/notable/issues?q=is%3Aissue+is%3Aopen+label%3Abug) or [`help wanted`](https://github.com/fabiospampinato/notable/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Pull requests for other issues can be considered too but before working on them you should let us know that you'd like to submit one, so that we can tell you if a pull request can be considered for that particular issue, what the pull request should actually implement and how.

Follow these steps in order to get Notable ready for development:

```bash
git clone https://github.com/fabiospampinato/notable.git
cd notable
npm install
npm run svelto:dev
npm run iconfont
npm run tutorial
npm run dev # Terminal 1
npm run svelto:dev:watch # Terminal 2
```
