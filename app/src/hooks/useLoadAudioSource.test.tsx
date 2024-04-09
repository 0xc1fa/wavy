import { useLoadAudioSource } from "./useLoadAudioSource";
import { useBlobUrl, type BlobWithUrl } from "./useBlobUrl";
import { renderHook } from "@testing-library/react";
import { RefObject } from "react";

describe("useLoadAudioSource", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mockAudioUrl");
  });
  it("does nothing if audio ref is null", () => {
    const audioRef = {
      current: null,
    };

    const blobWithUrl: BlobWithUrl = {
      blob: new Blob(["dummy content"], { type: "audio/mp3" }),
      url: "mockAudioUrl",
    };

    renderHook(() => useLoadAudioSource(audioRef, blobWithUrl));
    expect(audioRef.current).toBeNull();
  });

  it("sets audio source and loads new audio when provided", () => {
    const audioRef = {
      current: {
        paused: true,
        load: jest.fn(),
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
        src: "",
      },
    } as unknown as RefObject<HTMLAudioElement>;

    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const { result } = renderHook(() => useBlobUrl(dummyBlob));

    const blobWithUrl: BlobWithUrl | null = result.current[0];
    renderHook(() => useLoadAudioSource(audioRef, blobWithUrl));
    expect(audioRef.current?.src).toBe(blobWithUrl!.url);
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it("pauses, sets source, and reloads if audio is playing", () => {
    const audioRef = {
      current: {
        paused: false,
        load: jest.fn(),
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
        src: "",
      },
    } as unknown as RefObject<HTMLAudioElement>;
    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const { result } = renderHook(() => useBlobUrl(dummyBlob));

    const blobWithUrl: BlobWithUrl | null = result.current[0];
    renderHook(() => useLoadAudioSource(audioRef, blobWithUrl));
    expect(audioRef.current?.src).toBe(blobWithUrl!.url);
    expect(audioRef.current?.pause).toHaveBeenCalled();
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).toHaveBeenCalled();
    jest.resetAllMocks();
  });
});
