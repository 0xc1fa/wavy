import { exportData } from './exportData';

describe('exportData', () => {
  let mockClick: jest.Mock;
  let mockHref: string;
  let mockDownload: string;

  beforeAll(() => {
    mockClick = jest.fn();
    mockHref = '';
    mockDownload = '';

    document.createElement = jest.fn().mockImplementation(() => ({
      set href(value: string) {
        mockHref = value;
      },
      get href() {
        return mockHref;
      },
      set download(value: string) {
        mockDownload = value;
      },
      get download() {
        return mockDownload;
      },
      click: mockClick
    }));
  });

  it('should trigger a download of the JSON-encoded data', () => {
    const testObject = { key: 'value' };
    const jsonString = JSON.stringify(testObject);
    const encodedString = encodeURIComponent(jsonString);

    exportData(testObject);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockHref).toBe(`data:text/json;chatset=utf-8,${encodedString}`);
    expect(mockDownload).toBe('data.pianoroll');
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
