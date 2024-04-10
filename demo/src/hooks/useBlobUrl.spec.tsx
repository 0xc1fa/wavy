import { act, renderHook } from "@testing-library/react";
import { useBlobUrl } from "./useBlobUrl";

describe("useBlobUrl", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mockAudioUrl");
    global.URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("returns null without arguments", () => {
    const { result } = renderHook(() => useBlobUrl());
    expect(result.current[0]).toBeNull();
  });

  test("returns null for null input", () => {
    const { result } = renderHook(() => useBlobUrl(null));
    expect(result.current[0]).toBeNull();
  });

  test("returns a blob and URL for a blob input", () => {
    const dummyBlob = new Blob();
    const { result } = renderHook(() => useBlobUrl(dummyBlob));
    expect(result.current[0]).toEqual({ blob: dummyBlob, url: "mockAudioUrl" });
  });

  test("revokes URL and sets state to null for null setter input", () => {
    const dummyBlob: Blob | null = new Blob();
    const { result } = renderHook(() => useBlobUrl(dummyBlob));
    expect(result.current[0]).toEqual({ blob: dummyBlob, url: "mockAudioUrl" });
    act(() => result.current[1](null));
    expect(result.current[0]).toEqual(null);
  });

  test("updates blob and URL for new blob setter input", () => {
    const dummyBlob = new Blob();
    const { result } = renderHook(() => useBlobUrl());
    act(() => result.current[1](dummyBlob));
    expect(result.current[0]).toEqual({ blob: dummyBlob, url: "mockAudioUrl" });
  });
});
