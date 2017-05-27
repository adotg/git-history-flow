# [git-history-flow][1]
Visualize the evolution of a file tracked by git

## Run existing examples
In order to run the examples, do the following steps
```
npm install
```
followed by
```
npm start
```
## Run your own example
1. Clone the git-history-flow repo
2. Copy the script file `./scripts/diff-script.sh`
3. Go to the project (tracked by git) root and paste the copied script file
4. Run the command from the project root `./diff-script.sh package.json output.json`. This command will diff `package.json` and save the output to `output.json` file. You can optionally pass the output file name. If not passed, the output stream is redirected to terminal / console (standard output)
5. Feed the generated content (either from console / file) it to the `git-history-flow/dev/index-dev.html` file. 
6. Once done follow the steps mentioned in *Run existing examples* section.


## Known issues

 - Not performance optimized in terms of memory usage, nodes creation, memory leaks
 - If the dataset is large, it freezes the browser
 - Performance is significantly slower in firefox.

[1]: https://akash-goswami.github.io/git-history-flow/
