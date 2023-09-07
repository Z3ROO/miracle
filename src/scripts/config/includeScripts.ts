export default function includeBundleIntoHTML(htmlFile: string) {
  const headTagIndex = htmlFile.match(/<\/head>/).index;

  const leftHalf = htmlFile.substring(0, headTagIndex);
  const rightHalf = htmlFile.substring(headTagIndex);

  const middle = `
    <script src="static/js/bundle.js" type="module"></script>
  `;

  return leftHalf+middle+rightHalf;
}
