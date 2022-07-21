export async function copyText(text: string | undefined): Promise<void> {
  const area = document.createElement('textarea');
  area.style.width = '0';
  area.style.height = '0';
  area.value = text || '';
  document.body.appendChild(area);
  area.select();
  // noinspection JSDeprecatedSymbols
  document.execCommand('Copy');
  area.remove();
}
