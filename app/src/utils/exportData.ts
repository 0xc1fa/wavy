export function exportData<T>(data: T) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "data.pianoroll";
  link.click();
}
