export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdownReport(config, dimensions, scores) {
  // TODO: implementovat s prvním testem
  return '# TODO: Markdown report';
}

export function generateHTMLReport(config, dimensions, scores) {
  // TODO: implementovat s prvním testem
  return '<html><body>TODO: HTML report</body></html>';
}
